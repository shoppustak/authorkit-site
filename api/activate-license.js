/**
 * License Activation API Endpoint
 *
 * Activates a license key on a specific domain
 *
 * POST /api/activate-license
 * Body: { license_key: string, site_url: string, site_name: string }
 * Returns: { success: boolean, message: string, data: object }
 */

import {
  setCorsHeaders,
  setSecurityHeaders,
  rateLimit,
  validateInput,
  logSecurityEvent
} from './_lib/security.js';

export default async function handler(req, res) {
  // Set security headers
  setSecurityHeaders(res);
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  // Rate limiting - 10 activations per hour per IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
  const rateLimitResult = rateLimit(`activate:${clientIp}`, 10, 3600000);

  if (!rateLimitResult.allowed) {
    logSecurityEvent('rate_limit_exceeded', {
      ip: clientIp,
      endpoint: '/api/activate-license'
    });

    return res.status(429).json({
      success: false,
      message: 'Too many activation attempts. Please try again later.',
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
      site_url: {
        type: 'url',
        required: true
      },
      site_name: {
        type: 'string',
        required: false,
        maxLength: 255
      }
    });

    if (!validation.isValid) {
      logSecurityEvent('invalid_input', {
        ip: clientIp,
        errors: validation.errors
      });

      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: validation.errors
      });
    }

    const { license_key, site_url, site_name } = validation.data;

    const lsApiKey = process.env.LEMON_SQUEEZY_API_KEY;

    if (!lsApiKey) {
      return res.status(500).json({
        success: false,
        message: 'License service not configured'
      });
    }

    // First, validate the license
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
      return res.status(400).json({
        success: false,
        message: 'Invalid license key'
      });
    }

    const validateData = await validateResponse.json();
    const license = validateData.license_key;
    const meta = validateData.meta || {};

    // Check license status
    if (license.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Cannot activate. License is ${license.status}.`
      });
    }

    // Check expiry
    if (license.expires_at) {
      const expiryDate = new Date(license.expires_at);
      if (expiryDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'License has expired'
        });
      }
    }

    // Determine tier and max activations
    const variantName = meta.variant_name || '';
    let tier = 'pro';
    let maxActivations = 1;

    if (variantName.toLowerCase().includes('agency')) {
      tier = 'agency';
      maxActivations = 999999;
    }

    // Get current activations from license metadata
    // Note: In production, you'd store this in a database
    // For now, we'll use Lemon Squeezy's metadata feature
    const activeSites = license.meta?.active_sites || [];

    // Check if site is already activated
    const existingActivation = activeSites.find(site => {
      const cleanActiveSite = site.url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
        .toLowerCase();
      return cleanActiveSite === cleanSiteUrl;
    });

    if (existingActivation) {
      return res.status(200).json({
        success: true,
        message: `License already activated on ${cleanSiteUrl}`,
        data: {
          tier: tier,
          activated_at: existingActivation.activated_at,
          sites_remaining: tier === 'agency' ? 999999 : Math.max(0, maxActivations - activeSites.length)
        }
      });
    }

    // Check activation limit (for Pro tier)
    if (tier === 'pro' && activeSites.length >= maxActivations) {
      return res.status(400).json({
        success: false,
        message: `Activation limit reached. Pro licenses can only be activated on ${maxActivations} site(s). Please deactivate from another site first.`,
        data: {
          max_activations: maxActivations,
          active_sites: activeSites.map(s => s.url),
          upgrade_url: 'https://authorkit.pro/pricing'
        }
      });
    }

    // Add new activation
    const newActivation = {
      url: cleanSiteUrl,
      name: site_name || cleanSiteUrl,
      activated_at: new Date().toISOString(),
      last_checked: new Date().toISOString()
    };

    activeSites.push(newActivation);

    // Update license metadata via Lemon Squeezy API
    // Note: This is a simplified version. In production, you'd:
    // 1. Use a database to store activations
    // 2. Or use Lemon Squeezy's license activation endpoints
    // 3. Store activation metadata

    const activateResponse = await fetch(
      `https://api.lemonsqueezy.com/v1/licenses/activate`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lsApiKey}`
        },
        body: JSON.stringify({
          license_key: license_key,
          instance_name: site_name || cleanSiteUrl
        })
      }
    );

    if (!activateResponse.ok) {
      const errorData = await activateResponse.json();
      console.error('Lemon Squeezy activation error:', errorData);
      return res.status(500).json({
        success: false,
        message: 'Failed to activate license'
      });
    }

    const activateData = await activateResponse.json();

    // Return success
    return res.status(200).json({
      success: true,
      message: `License successfully activated on ${cleanSiteUrl}`,
      data: {
        tier: tier,
        activated_at: newActivation.activated_at,
        sites_remaining: tier === 'agency' ? 999999 : Math.max(0, maxActivations - activeSites.length),
        expires_at: license.expires_at,
        instance_id: activateData.instance?.id
      }
    });

  } catch (error) {
    console.error('License activation error:', error);

    logSecurityEvent('activation_error', {
      ip: clientIp,
      error: error.message
    });

    const isDev = process.env.NODE_ENV === 'development';

    return res.status(500).json({
      success: false,
      message: 'Internal server error during license activation',
      ...(isDev && { error: error.message })
    });
  }
}
