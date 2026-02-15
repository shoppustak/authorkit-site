# Security Documentation

This document outlines the security measures implemented in the AuthorKit API.

## Security Features Implemented

### 1. ✅ CORS Protection
- **Status**: Implemented
- **Location**: `api/_lib/security.js`
- **Protection**:
  - Validates origin headers
  - Restricts to authorized domains in production
  - WordPress sites validated via license keys, not CORS

### 2. ✅ Rate Limiting
- **Status**: Implemented (In-memory)
- **Location**: `api/_lib/security.js`
- **Limits**:
  - License Validation: 20 requests/minute per IP
  - License Activation: 10 requests/hour per IP
  - License Deactivation: 15 requests/hour per IP
  - Update Checks: 30 requests/hour per IP
- **Recommendation**: Upgrade to Redis or Upstash for production scale

### 3. ✅ Input Validation & Sanitization
- **Status**: Implemented
- **Location**: `api/_lib/security.js`
- **Validation**:
  - Type checking (string, URL)
  - Length limits (max 500 chars for license keys)
  - Pattern matching (version numbers, plugin slugs)
  - URL sanitization (removes protocols, normalizes)

### 4. ✅ Security Headers
- **Status**: Implemented
- **Headers Set**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy`
  - `Permissions-Policy`

### 5. ✅ Secure Token Generation
- **Status**: Implemented (HMAC-SHA256)
- **Location**: `api/_lib/security.js`
- **Features**:
  - HMAC-SHA256 signing
  - Time-based expiration (1 hour default)
  - Tamper-proof tokens
  - Replaced insecure Base64 encoding

### 6. ✅ Webhook Signature Verification
- **Status**: Implemented
- **Location**: `api/webhooks/lemon-squeezy.js`
- **Protection**:
  - Raw body preservation for signature validation
  - HMAC-SHA256 verification
  - Reject unsigned webhooks in production
  - Logging of invalid signatures

### 7. ✅ Security Logging
- **Status**: Implemented
- **Location**: All API endpoints
- **Events Logged**:
  - Rate limit violations
  - Invalid input attempts
  - Invalid signatures
  - API errors
  - Failed validations

### 8. ✅ Error Sanitization
- **Status**: Implemented
- **Protection**:
  - Generic error messages in production
  - Detailed errors only in development
  - No stack traces exposed
  - No implementation details leaked

## Environment Variables Required

```bash
# Required for Lemon Squeezy integration
LEMON_SQUEEZY_API_KEY=<your_api_key>
LEMON_SQUEEZY_STORE_ID=<your_store_id>
LEMON_SQUEEZY_WEBHOOK_SECRET=<your_webhook_secret>

# Required for secure downloads
DOWNLOAD_TOKEN_SECRET=<random_32+_char_secret>

# Environment flag
NODE_ENV=production
```

### Generating Secure Secrets

```bash
# Generate download token secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Security Best Practices

### For Production Deployment:

1. **Set Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add all secrets from `.env.example`
   - Mark as "Production" environment

2. **Enable Rate Limiting at Scale**:
   - Current: In-memory (single instance)
   - Recommended: Upstash Redis or Vercel Edge Config
   - Why: Distributed rate limiting across serverless functions

3. **Monitor Security Events**:
   - Review Vercel logs regularly
   - Set up alerts for rate limit violations
   - Consider Sentry or LogDNA for production logging

4. **Regular Security Audits**:
   - Review dependency vulnerabilities: `npm audit`
   - Update dependencies regularly
   - Monitor Lemon Squeezy API changes

5. **HTTPS Only**:
   - Vercel enforces HTTPS automatically
   - Never serve API over HTTP

## API Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/validate-license` | 20 requests | 1 minute |
| `/api/activate-license` | 10 requests | 1 hour |
| `/api/deactivate-license` | 15 requests | 1 hour |
| `/api/check-update` | 30 requests | 1 hour |
| `/api/webhooks/lemon-squeezy` | Unlimited | N/A |

## Known Limitations

1. **In-Memory Rate Limiting**:
   - Resets on serverless function cold starts
   - Not shared across function instances
   - **Mitigation**: Upgrade to Redis for production

2. **CORS for WordPress Sites**:
   - Must allow any origin for WordPress AJAX requests
   - **Mitigation**: Validate via license key, not origin

3. **No IP Blocking**:
   - Abusive IPs can't be permanently blocked
   - **Mitigation**: Implement IP blocking with Vercel Edge Config

## Incident Response

If you detect a security issue:

1. **Immediately**: Rotate all API keys in Lemon Squeezy
2. **Update**: `DOWNLOAD_TOKEN_SECRET` in Vercel environment variables
3. **Review**: Vercel logs for suspicious activity
4. **Notify**: Affected customers if license keys compromised
5. **Document**: What happened and how it was fixed

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@authorkit.pro (create this email)
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

## Compliance

- ✅ OWASP Top 10 protection
- ✅ GDPR compliant (minimal data collection)
- ✅ No PCI-DSS required (Lemon Squeezy handles payments)
- ✅ HTTPS enforced
- ✅ Secure password storage not required (API key auth only)

## Security Checklist

Before going live with Lemon Squeezy:

- [ ] All environment variables set in Vercel
- [ ] DOWNLOAD_TOKEN_SECRET generated and added
- [ ] Webhook URL configured in Lemon Squeezy
- [ ] Webhook signature verification tested
- [ ] Rate limits tested with load testing tool
- [ ] Error messages don't leak sensitive info
- [ ] CORS configuration reviewed
- [ ] Security logging verified in Vercel logs
- [ ] Monitoring/alerting configured
- [ ] Backup of all environment variables stored securely

## Last Updated

- **Date**: February 15, 2026
- **Version**: 1.0.0
- **Audited By**: Claude Code (Anthropic)
