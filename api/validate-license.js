/**
 * License Validation API Endpoint
 *
 * Validates an AuthorKit license key against Lemon Squeezy
 *
 * POST /api/validate-license
 * Body: { license_key: string, site_url: string }
 * Returns: { valid: boolean, tier: string, message: string, data: object }
 */

export default async function handler(req, res) {
  // CORS headers for WordPress AJAX requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

  try {
    const { license_key, site_url } = req.body;

    // Validate input
    if (!license_key || !site_url) {
      return res.status(400).json({
        valid: false,
        message: 'Missing required fields: license_key and site_url'
      });
    }

    // Sanitize site URL (remove protocol, www, trailing slash)
    const cleanSiteUrl = site_url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .toLowerCase();

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
    return res.status(500).json({
      valid: false,
      message: 'Internal server error during license validation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
