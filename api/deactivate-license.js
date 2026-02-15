/**
 * License Deactivation API Endpoint
 *
 * Deactivates a license key from a specific domain
 *
 * POST /api/deactivate-license
 * Body: { license_key: string, site_url: string, instance_id: string }
 * Returns: { success: boolean, message: string, data: object }
 */

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
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { license_key, site_url, instance_id } = req.body;

    // Validate input
    if (!license_key || (!site_url && !instance_id)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: license_key and (site_url or instance_id)'
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

    // Sanitize site URL for response
    const cleanSiteUrl = site_url
      ? site_url
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
          .replace(/\/$/, '')
          .toLowerCase()
      : 'this site';

    // Return success
    return res.status(200).json({
      success: true,
      message: `License successfully deactivated from ${cleanSiteUrl}`,
      data: {
        deactivated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('License deactivation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during license deactivation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
