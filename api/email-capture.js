/**
 * POST /api/email-capture
 *
 * Captures email subscriptions from AuthorKit plugin users.
 * Stores subscriber emails in Supabase and can trigger email notifications.
 *
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "site_url": "https://authorsite.com",
 *   "site_name": "Jane's Author Site",
 *   "user_login": "janeauthor",
 *   "user_role": "administrator",
 *   "ip_address": "192.168.1.1",
 *   "user_agent": "Mozilla/5.0...",
 *   "type": "free" // or "pro"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Email subscription recorded successfully"
 * }
 */

import supabase, { formatSupabaseError, validatePayload } from './_lib/supabase.js';

export default async function handler(req, res) {
  // Allow CORS for WordPress sites
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const payload = req.body;

    // Validate required fields
    const validationError = validatePayload(payload, ['email', 'site_url', 'site_name']);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const {
      email,
      site_url,
      site_name,
      user_login,
      user_role,
      ip_address,
      user_agent,
      type = 'free'
    } = payload;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
        code: 'VALIDATION_ERROR'
      });
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('email_subscribers')
      .select('id, email')
      .eq('email', email)
      .eq('site_url', site_url)
      .single();

    if (existingSubscriber) {
      // Already subscribed - return success but don't duplicate
      return res.status(200).json({
        success: true,
        message: 'Email already subscribed',
        already_subscribed: true
      });
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert({
        email: email,
        site_url: site_url,
        site_name: site_name,
        user_login: user_login || null,
        user_role: user_role || null,
        ip_address: ip_address || null,
        user_agent: user_agent || null,
        type: type,
        subscribed_at: new Date().toISOString(),
        active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json(formatSupabaseError(error));
    }

    // TODO: Send email notification to support@authorkit.pro
    // This can be done via SendGrid, Mailgun, or other email service
    // For now, we just log it
    console.log(`[Email Capture] New subscriber: ${email} from ${site_name} (${site_url})`);

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Email subscription recorded successfully',
      subscriber_id: data.id
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
