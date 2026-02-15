/**
 * License Validation API Endpoint
 *
 * Validates an AuthorKit license key against Lemon Squeezy
 *
 * POST /api/validate-license
 * Body: { license_key: string, site_url: string }
 * Returns: { valid: boolean, tier: string, message: string, data: object }
 */

import {
  setCorsHeaders,
  setSecurityHeaders,
  rateLimit,
  validateInput,
  hashSensitiveData,
  sanitizeError,
  logSecurityEvent
} from './_lib/security.js';

export default async function handler(req, res) {
  // Set security headers
  setSecurityHeaders(res);
  setCorsHeaders(req, res);

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      valid: false,
      message: 'Method not allowed'
    });
  }

  // Rate limiting - 20 requests per minute per IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
  const rateLimitResult = rateLimit(clientIp, 20, 60000);

  if (!rateLimitResult.allowed) {
    logSecurityEvent('rate_limit_exceeded', {
      ip: clientIp,
      endpoint: '/api/validate-license'
    });

    return res.status(429).json({
      valid: false,
      message: 'Too many requests. Please try again later.',
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
      }
    });

    if (!validation.isValid) {
      logSecurityEvent('invalid_input', {
        ip: clientIp,
        errors: validation.errors
      });

      return res.status(400).json({
        valid: false,
        message: 'Invalid input',
        errors: validation.errors
      });
    }

    const { license_key, site_url } = validation.data;

    // Fetch license from Lemon Squeezy API
    const lsApiKey = process.env.LEMON_SQUEEZY_API_KEY;

    if (!lsApiKey) {
      console.error('Lemon Squeezy API key not configured');
      return res.status(500).json({
        valid: false,
        message: 'License validation service not configured'
      });
    }

    // Query Lemon Squeezy API for license key
    const lsResponse = await fetch(
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

    if (!lsResponse.ok) {
      const errorData = await lsResponse.json();
      console.error('Lemon Squeezy API error:', errorData);
      return res.status(400).json({
        valid: false,
        message: 'Invalid license key'
      });
    }

    const lsData = await lsResponse.json();
    const license = lsData.license_key;
    const meta = lsData.meta || {};

    // Check license status
    if (license.status !== 'active') {
      return res.status(200).json({
        valid: false,
        message: `License is ${license.status}. Please renew your subscription.`,
        data: {
          status: license.status,
          expires_at: license.expires_at
        }
      });
    }

    // Check if license is expired
    if (license.expires_at) {
      const expiryDate = new Date(license.expires_at);
      const now = new Date();

      if (expiryDate < now) {
        return res.status(200).json({
          valid: false,
          message: 'License has expired. Please renew your subscription.',
          data: {
            status: 'expired',
            expires_at: license.expires_at
          }
        });
      }
    }

    // Determine tier from product variant
    const variantName = meta.variant_name || '';
    let tier = 'pro';
    let maxActivations = 1;

    if (variantName.toLowerCase().includes('agency')) {
      tier = 'agency';
      maxActivations = 999999; // Unlimited
    }

    // Get activated sites from license metadata
    // Note: You'll need to update this via update API when sites activate/deactivate
    const activeSites = license.meta?.active_sites || [];
    const isSiteActivated = activeSites.some(site => {
      const cleanActiveSite = site
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
        .toLowerCase();
      return cleanActiveSite === cleanSiteUrl;
    });

    // Check activation limit (for Pro tier)
    const sitesRemaining = tier === 'agency'
      ? 999999
      : Math.max(0, maxActivations - activeSites.length);

    // License is valid
    return res.status(200).json({
      valid: true,
      message: 'License is valid',
      data: {
        tier: tier,
        status: license.status,
        expires_at: license.expires_at,
        max_activations: maxActivations,
        active_sites: activeSites,
        sites_remaining: sitesRemaining,
        is_site_activated: isSiteActivated,
        customer_name: meta.customer_name || '',
        customer_email: meta.customer_email || ''
      }
    });

  } catch (error) {
    console.error('License validation error:', error);

    logSecurityEvent('validation_error', {
      ip: clientIp,
      error: error.message
    });

    const isDev = process.env.NODE_ENV === 'development';

    return res.status(500).json({
      valid: false,
      message: 'Internal server error during license validation',
      ...(isDev && { error: error.message })
    });
  }
}
