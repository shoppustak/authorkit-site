/**
 * Plugin Update Check API Endpoint
 *
 * Checks for available plugin updates (only for licensed users)
 *
 * POST /api/check-update
 * Body: { license_key: string, plugin_slug: string, current_version: string, site_url: string }
 * Returns: { update_available: boolean, new_version: string, package: string, changelog: string }
 */

import {
  setCorsHeaders,
  setSecurityHeaders,
  rateLimit,
  validateInput,
  generateSecureToken,
  logSecurityEvent
} from './_lib/security.js';

// Define available plugin versions
// In production, you'd store this in a database or config file
const PLUGIN_VERSIONS = {
  'authorkit-pro': {
    version: '1.0.0',
    tested_up_to: '6.4',
    requires_php: '7.0',
    changelog: `
### Version 1.0.0 - 2026-02-15

**New Features:**
- Launch Countdown Manager
- Landing Page Generator
- Series Tracker
- Event Manager
- Reader Magnets
- Book Links Hub
- Goodreads Integration

**Improvements:**
- Enhanced performance
- Better mobile responsiveness
- Improved admin UI

**Bug Fixes:**
- Fixed timezone handling in countdowns
- Resolved schema markup validation issues
`,
    download_url: 'https://authorkit.pro/downloads/authorkit-pro-1.0.0.zip'
  },
  'authorkit-agency': {
    version: '1.0.0',
    tested_up_to: '6.4',
    requires_php: '7.0',
    changelog: `
### Version 1.0.0 - 2026-02-15

**New Features:**
- All Pro features
- Unlimited site activations
- Priority support
- Advanced analytics
- White-label options

**Improvements:**
- Multi-site network support
- Enhanced performance
`,
    download_url: 'https://authorkit.pro/downloads/authorkit-agency-1.0.0.zip'
  }
};

export default async function handler(req, res) {
  // Set security headers
  setSecurityHeaders(res);
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  // Rate limiting - 30 update checks per hour per IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
  const rateLimitResult = rateLimit(`update:${clientIp}`, 30, 3600000);

  if (!rateLimitResult.allowed) {
    logSecurityEvent('rate_limit_exceeded', {
      ip: clientIp,
      endpoint: '/api/check-update'
    });

    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: rateLimitResult.retryAfter
    });
  }

  try {
    // Validate and sanitize input
    const validation = validateInput(req.body, {
      license_key: {
        type: 'string',
        required: true,
        maxLength: 500,
        minLength: 10
      },
      plugin_slug: {
        type: 'string',
        required: true,
        maxLength: 100,
        pattern: /^[a-z0-9-]+$/
      },
      current_version: {
        type: 'string',
        required: true,
        maxLength: 20,
        pattern: /^\d+\.\d+\.\d+$/
      },
      site_url: {
        type: 'url',
        required: true
      }
    });

    if (!validation.isValid) {
      logSecurityEvent('invalid_input', {
        ip: clientIp,
        errors: validation.errors
      });

      return res.status(400).json({
        error: 'Invalid input',
        errors: validation.errors
      });
    }

    const { license_key, plugin_slug, current_version, site_url } = validation.data;

    const lsApiKey = process.env.LEMON_SQUEEZY_API_KEY;

    if (!lsApiKey) {
      return res.status(500).json({
        error: 'Update service not configured'
      });
    }

    // Validate license first
    const validateResponse = await fetch(
      `https://api.lemonsqueezy.com/v1/licenses/validate`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lsApiKey}`
        },
        body: JSON.stringify({
          license_key: license_key
        })
      }
    );

    if (!validateResponse.ok) {
      return res.status(403).json({
        error: 'Invalid license',
        message: 'Your license is not valid. Updates are only available for active licenses.'
      });
    }

    const validateData = await validateResponse.json();
    const license = validateData.license_key;

    // Check license status and expiry
    if (license.status !== 'active') {
      return res.status(403).json({
        error: 'License inactive',
        message: `Your license is ${license.status}. Please renew to receive updates.`
      });
    }

    if (license.expires_at) {
      const expiryDate = new Date(license.expires_at);
      if (expiryDate < new Date()) {
        return res.status(403).json({
          error: 'License expired',
          message: 'Your license has expired. Please renew to receive updates.'
        });
      }
    }

    // Get latest version info for the plugin
    const latestVersion = PLUGIN_VERSIONS[plugin_slug];

    if (!latestVersion) {
      return res.status(404).json({
        error: 'Plugin not found',
        message: `No update information available for ${plugin_slug}`
      });
    }

    // Compare versions
    const isUpdateAvailable = compareVersions(current_version, latestVersion.version) < 0;

    if (!isUpdateAvailable) {
      // No update available
      return res.status(200).json({
        update_available: false,
        current_version: current_version,
        latest_version: latestVersion.version,
        message: 'You have the latest version'
      });
    }

    // Generate secure download URL with JWT-like token (1 hour expiry)
    const downloadToken = generateSecureToken({
      license_key: license_key.substring(0, 16), // Only store partial key
      plugin_slug: plugin_slug,
      site_url: site_url
    }, 3600); // 1 hour expiry

    const secureDownloadUrl = `${latestVersion.download_url}?token=${encodeURIComponent(downloadToken)}`;

    // Update available - return update info in WordPress format
    return res.status(200).json({
      update_available: true,
      id: plugin_slug,
      slug: plugin_slug,
      plugin: `${plugin_slug}/${plugin_slug}.php`,
      new_version: latestVersion.version,
      url: 'https://authorkit.pro',
      package: secureDownloadUrl,
      tested: latestVersion.tested_up_to,
      requires_php: latestVersion.requires_php,
      icons: {
        '1x': 'https://authorkit.pro/images/icon-128x128.png',
        '2x': 'https://authorkit.pro/images/icon-256x256.png'
      },
      banners: {
        '1x': 'https://authorkit.pro/images/banner-772x250.png',
        '2x': 'https://authorkit.pro/images/banner-1544x500.png'
      },
      sections: {
        description: 'Professional WordPress plugin suite for self-publishing authors.',
        changelog: latestVersion.changelog
      }
    });

  } catch (error) {
    console.error('Update check error:', error);

    logSecurityEvent('update_check_error', {
      ip: clientIp,
      error: error.message
    });

    const isDev = process.env.NODE_ENV === 'development';

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to check for updates',
      ...(isDev && { details: error.message })
    });
  }
}

/**
 * Compare two semantic versions
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }

  return 0;
}
