/**
 * License Deactivation API Endpoint
 *
 * Deactivates a license key from a specific domain
 *
 * POST /api/deactivate-license
 * Body: { license_key: string, site_url: string, instance_id: string }
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

  // Rate limiting - 15 deactivations per hour per IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
  const rateLimitResult = rateLimit(`deactivate:${clientIp}`, 15, 3600000);

  if (!rateLimitResult.allowed) {
    logSecurityEvent('rate_limit_exceeded', {
      ip: clientIp,
      endpoint: '/api/deactivate-license'
    });

    return res.status(429).json({
      success: false,
      message: 'Too many deactivation attempts. Please try again later.',
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
        required: false
      },
      instance_id: {
        type: 'string',
        required: false,
        maxLength: 100
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

    const { license_key, site_url, instance_id } = validation.data;

    // Require either site_url or instance_id
    if (!site_url && !instance_id) {
      return res.status(400).json({
        success: false,
        message: 'Either site_url or instance_id is required'
      });
    }

    const lsApiKey = process.env.LEMON_SQUEEZY_API_KEY;

    if (!lsApiKey) {
      return res.status(500).json({
        success: false,
        message: 'License service not configured'
      });
    }

    // Deactivate via Lemon Squeezy API
    const deactivateResponse = await fetch(
      `https://api.lemonsqueezy.com/v1/licenses/deactivate`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lsApiKey}`
        },
        body: JSON.stringify({
          license_key: license_key,
          instance_id: instance_id
        })
      }
    );

    if (!deactivateResponse.ok) {
      const errorData = await deactivateResponse.json();
      console.error('Lemon Squeezy deactivation error:', errorData);

      // Check if instance not found
      if (deactivateResponse.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'Activation not found for this site'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to deactivate license'
      });
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: `License successfully deactivated from ${site_url || 'site'}`,
      data: {
        deactivated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('License deactivation error:', error);

    logSecurityEvent('deactivation_error', {
      ip: clientIp,
      error: error.message
    });

    const isDev = process.env.NODE_ENV === 'development';

    return res.status(500).json({
      success: false,
      message: 'Internal server error during license deactivation',
      ...(isDev && { error: error.message })
    });
  }
}
