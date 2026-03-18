# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**Payment & License Management:**
- Lemon Squeezy - Payment processor and license key distribution
  - SDK/Client: None (direct link in HTML)
  - Auth: `LEMON_SQUEEZY_API_KEY`, `LEMON_SQUEEZY_STORE_ID`, `LEMON_SQUEEZY_WEBHOOK_SECRET`
  - Integration: JavaScript embed from `https://app.lemonsqueezy.com/js/lemon.js` (checkout page)
  - API Access: Used in `/api/activate-license.js`, `/api/deactivate-license.js`, `/api/validate-license.js`, `/api/check-update.js`

**Amazon Affiliate Program:**
- Amazon Associates affiliate tag: `authorkit-20`
- Used for book purchase links in bookshelf pages
- Integration: Constructed in `js/bookshelf.js` for affiliate revenue tracking

**WordPress.org:**
- Plugin repository integration
- Used for free plugin distribution
- Integration: Links in download page and marketing materials

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Connection: `SUPABASE_URL` environment variable
  - Client: `@supabase/supabase-js` 2.39.0 (production dependency)
  - Server-side ORM: Native Supabase client (no additional ORM)
  - Authentication: Service role key (`SUPABASE_SERVICE_KEY`) for API endpoints

**Tables:**
- `bookshelf_sites` - Registered author sites in bookshelf program
- `bookshelf_books` - Books synced from WordPress sites
- `bookshelf_book_genres` - Junction table for book-genre relationships
- `bookshelf_genre_requests` - Genre requests from authors
- `email_subscribers` - Email subscription list (used by `/api/email-capture.js`)

**File Storage:**
- Local filesystem only (images served from `/images/` directory)
- Book cover images: thumbnails, medium, large, full sizes stored as URLs in database

**Caching:**
- None detected (static HTML with server-side generated content via API)

## Authentication & Identity

**Auth Provider:**
- Custom implementation (no third-party auth)
- License key validation via Lemon Squeezy API for plugin users
- Implementation: `/api/activate-license.js`, `/api/validate-license.js`, `/api/deactivate-license.js`

**API Authentication:**
- Request validation: License key in request body for WordPress plugin calls
- Webhook verification: HMAC-SHA256 signature verification for Lemon Squeezy webhooks
- Implementation: `api/_lib/security.js` provides `validateInput()`, webhook signature verification in `/api/webhooks/lemon-squeezy.js`

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Rollbar, etc.)

**Logging:**
- Custom logger in `api/_lib/logger.js`
- Environment-aware logging (verbose in development, errors-only in production)
- Security events logged separately
- Webhook events logged for debugging

**Vercel Integration:**
- Deployment logs available in Vercel dashboard
- Cron job configured: `/api/bookshelf/keepalive` runs every 6 hours

## CI/CD & Deployment

**Hosting:**
- Vercel (serverless deployment)
- Project name: `authorkit-pro`
- Static files: HTML, CSS, JS, images
- Serverless functions: `/api/**/*.js`

**Build Configuration:**
- Build command: `npm run build` (CSS + JS minification)
- Output directory: `.` (root)
- Functions configuration: 1024MB memory, 10 second max duration

**Deployment Features:**
- Vercel rewrites for domain-based routing (bookshelf subdomain)
- Cache headers configured in `vercel.json`:
  - Static assets (CSS, JS, images): 31536000 seconds (1 year, immutable)
  - HTML pages: 3600 seconds (1 hour, must revalidate)
  - API endpoints: no-cache, no-store
- Security headers applied to HTML responses
- CORS configured for WordPress AJAX calls

**Cron Jobs:**
- `/api/bookshelf/keepalive` - Scheduled every 6 hours (`0 0 */6 * *`)

## Environment Configuration

**Required env vars (from `.env.example`):**
- `LEMON_SQUEEZY_API_KEY` - Payment processor API access
- `LEMON_SQUEEZY_STORE_ID` - Payment store identifier
- `LEMON_SQUEEZY_WEBHOOK_SECRET` - Webhook signature verification
- `SUPABASE_URL` - Database URL
- `SUPABASE_ANON_KEY` - Client-side database key (for public reads)
- `SUPABASE_SERVICE_KEY` - Server-side full database access (API only)
- `DOWNLOAD_TOKEN_SECRET` - Min 32 characters, used for secure token generation
- `NODE_ENV` - Environment mode (development/production)

**Secrets location:**
- Vercel platform environment variables (not committed to repo)
- Never stored in `.env` files in repository

**Environment-Specific:**
- Development: Localhost allowed in CORS, all logging enabled, validation on load optional
- Production: Restricted CORS, error logging only, security headers enforced

## Webhooks & Callbacks

**Incoming Webhooks:**
- Lemon Squeezy webhooks: `/api/webhooks/lemon-squeezy.js`
  - Events: License activation, subscription updates, refunds (handler at `api/webhooks/lemon-squeezy.js`)
  - Signature verification: HMAC-SHA256 using `LEMON_SQUEEZY_WEBHOOK_SECRET`
  - Processing: Raw body handling required for signature verification
  - Error handling: 401 for invalid signatures, 500 for configuration errors

**Outgoing Webhooks:**
- Bookshelf sync: WordPress plugin calls `/api/bookshelf/sync.js` to sync books
- Email notifications: TODO in `api/email-capture.js` (not yet implemented)
- License events: WordPress plugin receives activation/deactivation responses

**Webhook Processing:**
- All webhooks secured with signature verification
- Raw body parsing required (Vercel `bodyParser: false`)
- Security logging for invalid signatures

## Third-Party Integrations Summary

| Service | Type | Purpose | Status |
|---------|------|---------|--------|
| Lemon Squeezy | Payment | License sales & distribution | Production |
| Supabase | Database | Book catalog & bookshelf data | Production |
| Vercel | Hosting | Deployment & serverless functions | Production |
| Amazon Associates | Affiliate | Book purchase tracking | Production |
| WordPress.org | Distribution | Free plugin repository | Production |

---

*Integration audit: 2026-03-18*
