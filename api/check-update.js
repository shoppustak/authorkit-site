/**
 * Plugin Update Check API Endpoint
 *
 * Checks for available plugin updates (only for licensed users)
 *
 * POST /api/check-update
 * Body: { license_key: string, plugin_slug: string, current_version: string, site_url: string }
 * Returns: { update_available: boolean, new_version: string, package: string, changelog: string }
 */

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
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const { license_key, plugin_slug, current_version, site_url } = req.body;

    // Validate input
    if (!license_key || !plugin_slug || !current_version || !site_url) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

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

    // Generate secure download URL with temporary token
    const downloadToken = generateDownloadToken(license_key, plugin_slug);
    const secureDownloadUrl = `${latestVersion.download_url}?token=${downloadToken}&license=${encodeURIComponent(license_key)}`;

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
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to check for updates'
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

/**
 * Generate a secure download token
 * In production, use JWT or a proper signing mechanism
 */
function generateDownloadToken(licenseKey, pluginSlug) {
  const timestamp = Date.now();
  const payload = `${licenseKey}:${pluginSlug}:${timestamp}`;

  // Simple base64 encoding (in production, use proper JWT)
  return Buffer.from(payload).toString('base64');
}
