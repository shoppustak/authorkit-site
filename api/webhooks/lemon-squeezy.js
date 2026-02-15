/**
 * Lemon Squeezy Webhook Handler
 *
 * Receives and processes webhooks from Lemon Squeezy
 *
 * POST /api/webhooks/lemon-squeezy
 * Headers: X-Signature (webhook signature for verification)
 * Body: Lemon Squeezy event payload
 */

import crypto from 'crypto';
import { setSecurityHeaders, logSecurityEvent } from '../_lib/security.js';

// Vercel configuration to get raw body for signature verification
export const config = {
  api: {
    bodyParser: false // Disable body parsing to get raw body
  }
};

/**
 * Parse raw body from request
 */
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';

  try {
    // Get webhook signature from headers
    const signature = req.headers['x-signature'];
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      logSecurityEvent('webhook_config_error', { ip: clientIp });
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    // Get raw body for signature verification
    const rawBody = await getRawBody(req);

    // Verify webhook signature
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        logSecurityEvent('webhook_invalid_signature', {
          ip: clientIp,
          signature: signature.substring(0, 10) + '...'
        });
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } else {
      // Signature missing - reject in production
      if (process.env.NODE_ENV === 'production') {
        logSecurityEvent('webhook_missing_signature', { ip: clientIp });
        return res.status(401).json({ error: 'Missing signature' });
      }
    }

    // Parse body after verification
    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const eventData = event.data;

    console.log(`[Webhook] Received event: ${eventName}`);

    // Process event based on type
    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(eventData);
        break;

      case 'order_refunded':
        await handleOrderRefunded(eventData);
        break;

      case 'subscription_created':
        await handleSubscriptionCreated(eventData);
        break;

      case 'subscription_updated':
        await handleSubscriptionUpdated(eventData);
        break;

      case 'subscription_cancelled':
        await handleSubscriptionCancelled(eventData);
        break;

      case 'subscription_resumed':
        await handleSubscriptionResumed(eventData);
        break;

      case 'subscription_expired':
        await handleSubscriptionExpired(eventData);
        break;

      case 'subscription_payment_success':
        await handleSubscriptionPaymentSuccess(eventData);
        break;

      case 'subscription_payment_failed':
        await handleSubscriptionPaymentFailed(eventData);
        break;

      case 'license_key_created':
        await handleLicenseKeyCreated(eventData);
        break;

      case 'license_key_updated':
        await handleLicenseKeyUpdated(eventData);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${eventName}`);
    }

    // Return 200 to acknowledge receipt
    return res.status(200).json({
      received: true,
      event: eventName
    });

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);

    logSecurityEvent('webhook_processing_error', {
      ip: clientIp,
      error: error.message
    });

    const isDev = process.env.NODE_ENV === 'development';

    return res.status(500).json({
      error: 'Webhook processing failed',
      ...(isDev && { message: error.message })
    });
  }
}

// Event Handlers

async function handleOrderCreated(data) {
  console.log('[Webhook] New order created:', {
    order_id: data.id,
    customer_email: data.attributes.user_email,
    product: data.attributes.first_order_item?.product_name,
    total: data.attributes.total_formatted
  });

  // TODO: Send welcome email with setup instructions
  // TODO: Log order in database
  // TODO: Trigger analytics event
}

async function handleOrderRefunded(data) {
  console.log('[Webhook] Order refunded:', {
    order_id: data.id,
    customer_email: data.attributes.user_email
  });

  // TODO: Deactivate license keys associated with this order
  // TODO: Send refund confirmation email
  // TODO: Update analytics
}

async function handleSubscriptionCreated(data) {
  console.log('[Webhook] Subscription created:', {
    subscription_id: data.id,
    customer_email: data.attributes.user_email,
    product: data.attributes.product_name,
    status: data.attributes.status
  });

  // TODO: Send welcome email
  // TODO: Log subscription in database
}

async function handleSubscriptionUpdated(data) {
  console.log('[Webhook] Subscription updated:', {
    subscription_id: data.id,
    status: data.attributes.status,
    ends_at: data.attributes.ends_at
  });

  // TODO: Update subscription status in database
  // TODO: If downgraded, adjust license limits
}

async function handleSubscriptionCancelled(data) {
  console.log('[Webhook] Subscription cancelled:', {
    subscription_id: data.id,
    customer_email: data.attributes.user_email,
    ends_at: data.attributes.ends_at
  });

  // TODO: Send cancellation confirmation
  // TODO: Schedule license deactivation for end date
  // TODO: Trigger feedback survey
}

async function handleSubscriptionResumed(data) {
  console.log('[Webhook] Subscription resumed:', {
    subscription_id: data.id,
    customer_email: data.attributes.user_email
  });

  // TODO: Reactivate license
  // TODO: Send welcome back email
}

async function handleSubscriptionExpired(data) {
  console.log('[Webhook] Subscription expired:', {
    subscription_id: data.id,
    customer_email: data.attributes.user_email
  });

  // TODO: Deactivate all associated licenses
  // TODO: Send renewal reminder
  // TODO: Update license status to 'expired'
}

async function handleSubscriptionPaymentSuccess(data) {
  console.log('[Webhook] Subscription payment successful:', {
    subscription_id: data.id,
    customer_email: data.attributes.user_email,
    amount: data.attributes.total_formatted
  });

  // TODO: Extend license expiration date
  // TODO: Send receipt
  // TODO: Update subscription billing date
}

async function handleSubscriptionPaymentFailed(data) {
  console.log('[Webhook] Subscription payment failed:', {
    subscription_id: data.id,
    customer_email: data.attributes.user_email
  });

  // TODO: Send payment failed notification
  // TODO: Start grace period (7 days)
  // TODO: Schedule license deactivation if not resolved
}

async function handleLicenseKeyCreated(data) {
  console.log('[Webhook] License key created:', {
    license_key_id: data.id,
    key: data.attributes.key,
    status: data.attributes.status
  });

  // TODO: Log license creation
  // TODO: Initialize activation tracking
}

async function handleLicenseKeyUpdated(data) {
  console.log('[Webhook] License key updated:', {
    license_key_id: data.id,
    status: data.attributes.status,
    activation_limit: data.attributes.activation_limit,
    activations_count: data.attributes.activations_count
  });

  // TODO: Update license status in database
  // TODO: If status changed to 'disabled', deactivate on all sites
}

// Helper function to send emails (implement with your email service)
async function sendEmail(to, subject, body) {
  console.log(`[Email] Would send email to ${to}:`, subject);
  // TODO: Implement with SendGrid, Mailgun, or your email service
  // Example:
  // await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{
  //       to: [{ email: to }],
  //       subject: subject
  //     }],
  //     from: { email: 'noreply@authorkit.pro', name: 'AuthorKit' },
  //     content: [{ type: 'text/html', value: body }]
  //   })
  // });
}
