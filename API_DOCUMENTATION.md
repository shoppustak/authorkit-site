# AuthorKit API Documentation

This document describes the AuthorKit licensing and update API endpoints.

---

## Base URL

**Production**: `https://authorkit.pro/api`
**Local Development**: `http://localhost:3000/api`

---

## Authentication

All API endpoints require either:
- A valid license key (passed in request body)
- Lemon Squeezy webhook signature (for webhook endpoints)

---

## Endpoints

### 1. Validate License

Validates a license key and returns license information.

**Endpoint**: `POST /api/validate-license`

**Request Body**:
```json
{
  "license_key": "AKPRO-XXXX-XXXX-XXXX",
  "site_url": "https://example.com"
}
```

**Success Response** (200):
```json
{
  "valid": true,
  "message": "License is valid",
  "data": {
    "tier": "pro",
    "status": "active",
    "expires_at": "2027-02-15T00:00:00.000Z",
    "max_activations": 1,
    "active_sites": ["example.com"],
    "sites_remaining": 0,
    "is_site_activated": true,
    "customer_name": "John Doe",
    "customer_email": "john@example.com"
  }
}
```

**Error Response** (400):
```json
{
  "valid": false,
  "message": "License has expired. Please renew your subscription.",
  "data": {
    "status": "expired",
    "expires_at": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Activate License

Activates a license key on a specific domain.

**Endpoint**: `POST /api/activate-license`

**Request Body**:
```json
{
  "license_key": "AKPRO-XXXX-XXXX-XXXX",
  "site_url": "https://example.com",
  "site_name": "My Author Website"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "License successfully activated on example.com",
  "data": {
    "tier": "pro",
    "activated_at": "2026-02-15T12:00:00.000Z",
    "sites_remaining": 0,
    "expires_at": "2027-02-15T00:00:00.000Z",
    "instance_id": "inst_12345"
  }
}
```

**Error Response - Activation Limit Reached** (400):
```json
{
  "success": false,
  "message": "Activation limit reached. Pro licenses can only be activated on 1 site(s). Please deactivate from another site first.",
  "data": {
    "max_activations": 1,
    "active_sites": ["othersite.com"],
    "upgrade_url": "https://authorkit.pro/pricing"
  }
}
```

---

### 3. Deactivate License

Deactivates a license key from a specific domain.

**Endpoint**: `POST /api/deactivate-license`

**Request Body**:
```json
{
  "license_key": "AKPRO-XXXX-XXXX-XXXX",
  "site_url": "https://example.com",
  "instance_id": "inst_12345"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "License successfully deactivated from example.com",
  "data": {
    "deactivated_at": "2026-02-15T12:00:00.000Z"
  }
}
```

**Error Response - Not Found** (404):
```json
{
  "success": false,
  "message": "Activation not found for this site"
}
```

---

### 4. Check for Updates

Checks if a new plugin version is available (requires valid license).

**Endpoint**: `POST /api/check-update`

**Request Body**:
```json
{
  "license_key": "AKPRO-XXXX-XXXX-XXXX",
  "plugin_slug": "authorkit-pro",
  "current_version": "1.0.0",
  "site_url": "https://example.com"
}
```

**Success Response - Update Available** (200):
```json
{
  "update_available": true,
  "id": "authorkit-pro",
  "slug": "authorkit-pro",
  "plugin": "authorkit-pro/authorkit-pro.php",
  "new_version": "1.1.0",
  "url": "https://authorkit.pro",
  "package": "https://authorkit.pro/downloads/authorkit-pro-1.1.0.zip?token=...",
  "tested": "6.4",
  "requires_php": "7.0",
  "icons": {
    "1x": "https://authorkit.pro/images/icon-128x128.png",
    "2x": "https://authorkit.pro/images/icon-256x256.png"
  },
  "sections": {
    "description": "Professional WordPress plugin suite for self-publishing authors.",
    "changelog": "### Version 1.1.0..."
  }
}
```

**Success Response - No Update** (200):
```json
{
  "update_available": false,
  "current_version": "1.0.0",
  "latest_version": "1.0.0",
  "message": "You have the latest version"
}
```

**Error Response - Invalid License** (403):
```json
{
  "error": "Invalid license",
  "message": "Your license is not valid. Updates are only available for active licenses."
}
```

---

### 5. Webhook Handler

Receives and processes Lemon Squeezy webhooks.

**Endpoint**: `POST /api/webhooks/lemon-squeezy`

**Headers**:
```
X-Signature: <webhook_signature>
Content-Type: application/json
```

**Request Body**: Lemon Squeezy webhook payload (varies by event)

**Supported Events**:
- `order_created` - New purchase
- `order_refunded` - Order refunded
- `subscription_created` - New subscription
- `subscription_updated` - Subscription modified
- `subscription_cancelled` - Subscription cancelled
- `subscription_resumed` - Subscription resumed
- `subscription_expired` - Subscription expired
- `subscription_payment_success` - Renewal succeeded
- `subscription_payment_failed` - Renewal failed
- `license_key_created` - License key generated
- `license_key_updated` - License key modified

**Success Response** (200):
```json
{
  "received": true,
  "event": "order_created"
}
```

**Error Response - Invalid Signature** (401):
```json
{
  "error": "Invalid signature"
}
```

---

### 6. Email Capture

Captures email subscriptions from AuthorKit plugin users.

**Endpoint**: `POST /api/email-capture`

**Request Body**:
```json
{
  "email": "user@example.com",
  "site_url": "https://authorsite.com",
  "site_name": "Jane's Author Site",
  "user_login": "janeauthor",
  "user_role": "administrator",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "type": "free"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Email subscription recorded successfully",
  "subscriber_id": 123
}
```

**Success Response - Already Subscribed** (200):
```json
{
  "success": true,
  "message": "Email already subscribed",
  "already_subscribed": true
}
```

**Error Response - Invalid Email** (400):
```json
{
  "success": false,
  "error": "Invalid email address",
  "code": "VALIDATION_ERROR"
}
```

**Error Response - Missing Fields** (400):
```json
{
  "success": false,
  "error": "Missing required fields: email, site_url",
  "code": "VALIDATION_ERROR"
}
```

---

## Environment Variables

Required environment variables for Vercel deployment:

```env
# Lemon Squeezy API
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_STORE_ID=your_store_id_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here

# Supabase (for email capture and bookshelf)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Node Environment
NODE_ENV=production
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (invalid signature) |
| 403 | Forbidden (invalid/expired license) |
| 404 | Not Found (resource doesn't exist) |
| 405 | Method Not Allowed (wrong HTTP method) |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:

- License validation: 100 requests/minute per IP
- Update checks: 10 requests/hour per license key
- Webhooks: No limit (verified by signature)

---

## CORS

All API endpoints support CORS to allow requests from WordPress sites:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Testing

### Test with cURL

**Validate License**:
```bash
curl -X POST https://authorkit.pro/api/validate-license \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "AKPRO-XXXX-XXXX-XXXX",
    "site_url": "https://example.com"
  }'
```

**Activate License**:
```bash
curl -X POST https://authorkit.pro/api/activate-license \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "AKPRO-XXXX-XXXX-XXXX",
    "site_url": "https://example.com",
    "site_name": "My Site"
  }'
```

**Check for Updates**:
```bash
curl -X POST https://authorkit.pro/api/check-update \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "AKPRO-XXXX-XXXX-XXXX",
    "plugin_slug": "authorkit-pro",
    "current_version": "1.0.0",
    "site_url": "https://example.com"
  }'
```

**Capture Email Subscription**:
```bash
curl -X POST https://authorkit.pro/api/email-capture \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "site_url": "https://authorsite.com",
    "site_name": "My Author Site",
    "user_login": "authoruser",
    "user_role": "administrator",
    "type": "free"
  }'
```

---

## Security Considerations

1. **HTTPS Only**: All API requests must use HTTPS in production
2. **Webhook Verification**: Always verify webhook signatures
3. **Input Validation**: All inputs are sanitized and validated
4. **Download Tokens**: Download URLs include time-limited tokens
5. **License Verification**: Update checks require valid, active licenses
6. **Environment Variables**: Sensitive keys stored in Vercel environment variables

---

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd authorkit-site
   vercel
   ```

3. Set environment variables:
   ```bash
   vercel env add LEMON_SQUEEZY_API_KEY
   vercel env add LEMON_SQUEEZY_STORE_ID
   vercel env add LEMON_SQUEEZY_WEBHOOK_SECRET
   ```

4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## Support

For API support, contact: support@authorkit.pro
