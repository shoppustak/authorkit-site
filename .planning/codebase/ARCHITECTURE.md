# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Hybrid Static + Serverless API Architecture

The authorkit-site is a **static HTML marketing website with embedded serverless API functions** deployed on Vercel. It combines:
- Static HTML pages served with CDN caching
- Client-side JavaScript for interactivity and component loading
- Edge-deployed serverless functions (Vercel Functions) for business logic
- Supabase PostgreSQL backend for persistent data

**Key Characteristics:**
- Zero server maintenance - purely static + serverless
- Content delivery optimized with aggressive caching (1 year for assets, 1 hour for HTML)
- Multi-domain support via middleware (bookshelf.authorkit.pro routing)
- Licensed plugin validation via API with rate limiting
- Bookshelf discovery platform with filtering and pagination

## Layers

**Presentation (Client):**
- Purpose: Render pages and handle user interactions
- Location: `*.html` files in root + `includes/` directory
- Contains: HTML templates, embedded styles, structured data (schema.org)
- Depends on: CSS (`css/` directory), JavaScript (`js/` directory), API responses
- Used by: Browser clients, Vercel CDN

**Content Components (Includes):**
- Purpose: Reusable HTML fragments loaded dynamically
- Location: `includes/header.html`, `includes/footer.html`
- Contains: Navigation structure, footer links, branding
- Depends on: `js/header-loader.js` for dynamic loading and state
- Used by: All HTML pages via fetch + DOM injection

**Styling (Client):**
- Purpose: Visual design and responsive layout
- Location: `css/input.css` (source), `css/styles.css` (generated Tailwind), `css/style.css` (custom overrides), `css/bookshelf.css` (bookshelf-specific)
- Contains: Tailwind directives, custom animations, brand color system, component utilities
- Depends on: Tailwind CSS framework
- Used by: All HTML pages

**Interactivity (Client):**
- Purpose: DOM manipulation, event handling, component initialization
- Location: `js/main.js` (core), `js/bookshelf.js` (bookshelf logic), `js/bookshelf-browse.js` (browse page), `js/header-loader.js` (header injection), `js/footer-loader.js` (footer injection)
- Contains: Event listeners, fetch logic, DOM creation functions, state management
- Depends on: No external libraries (vanilla JS)
- Used by: HTML pages via script tags

**API Gateway & Middleware (Edge/Serverless):**
- Purpose: Route requests, set security headers, handle multi-domain logic
- Location: `api/_middleware.js`
- Contains: Hostname-based routing for bookshelf.authorkit.pro subdomain
- Depends on: Vercel middleware runtime
- Used by: All API requests

**API Layer (Serverless Functions):**
- Purpose: Handle business logic, database operations, third-party integrations
- Location: `api/` directory with individual endpoint files
- Contains: Request handlers, validation, security checks, database queries
- Depends on: `api/_lib/` utilities, Supabase client, external services
- Used by: Frontend JavaScript via fetch(), WordPress plugins

**Shared Utilities (Serverless):**
- Purpose: Reusable logic for all API endpoints
- Location: `api/_lib/` directory
- Contains: Security functions, error handling, logging, environment validation, Supabase client
- Depends on: @supabase/supabase-js library, Node.js built-ins
- Used by: All API endpoints

**Data Store (Backend):**
- Purpose: Persistent storage for books, licenses, user data
- Location: Database migrations in `database/migrations/`
- Contains: Supabase PostgreSQL schema (books, authors, genres, licenses, webhooks)
- Depends on: Supabase infrastructure
- Used by: API layer via Supabase client

## Data Flow

**Marketing Page Load:**

1. Browser requests `index.html` (cached 1 hour by Vercel)
2. HTML document loads with initial meta tags and structured data
3. Async script loads `js/header-loader.js`
4. Header loader fetches `includes/header.html` and injects into DOM
5. Main JavaScript (`js/main.js`) initializes:
   - Mobile menu toggle
   - Smooth scroll anchors
   - IntersectionObserver for fade-in animations
6. Tailwind CSS applies styles (`css/styles.css` - cached 1 year)
7. Page fully interactive

**License Activation Flow:**

1. WordPress plugin frontend sends POST to `/api/activate-license`
2. Middleware validates hostname (any WordPress site allowed)
3. API endpoint (`api/activate-license.js`):
   - Validates CORS/origin
   - Applies rate limiting (10 per hour per IP)
   - Validates input (license_key, site_url, site_name)
   - Queries Supabase for license validation
   - Updates license activation record
   - Returns success/error response
4. Plugin receives response and stores activation locally

**Bookshelf Discovery Flow:**

1. Browser navigates to `bookshelf.authorkit.pro/`
2. Middleware detects hostname and rewrites to `bookshelf-index.html`
3. Page loads with header/footer injected
4. JavaScript (`js/bookshelf.js`) initializes:
   - Calls `/api/bookshelf/books` with genre/search filters
   - API queries Supabase for matching books
   - Renders book cards dynamically via `createBookCard()` function
   - Handles pagination
   - Tracks stats (total books, authors)
5. User can filter by genre, search, sort, navigate pages
6. Each book links to author's website (affiliate tracking for Amazon)

**State Management:**

- **Client state:** Minimal - DOM class lists for menu visibility, Intersection Observer state
- **URL state:** Query parameters for bookshelf filters (`?genre=fantasy&page=1&sort=latest`)
- **Backend state:** Supabase for all persistent data (books, licenses, webhooks)
- **No client-side database:** API always sources truth from Supabase

## Key Abstractions

**API Response Wrapper:**
- Purpose: Standardized success/error responses across all endpoints
- Examples: `api/activate-license.js`, `api/bookshelf/books.js`
- Pattern: All endpoints return `{ success: boolean, message: string, data: object }` or `{ success: false, error: string, code: string }`

**Supabase Client Singleton:**
- Purpose: Centralized database access with service role authentication
- Examples: `api/_lib/supabase.js` exported to all endpoints
- Pattern: Created once with environment variables, reused across all functions

**Security Middleware Stack:**
- Purpose: Consistent security headers and validation across endpoints
- Examples: `setCorsHeaders()`, `setSecurityHeaders()`, `rateLimit()`, `validateInput()`
- Pattern: Import utilities from `api/_lib/security.js` in each endpoint

**Book Card Component:**
- Purpose: Render individual book in UI
- Examples: `createBookCard()` in `js/bookshelf.js`
- Pattern: Accepts book object, returns HTMLElement, handles image fallback and lazy loading

**Page Loader Pattern:**
- Purpose: Fetch and inject reusable HTML fragments
- Examples: `header-loader.js`, `footer-loader.js`
- Pattern: IIFE that runs at document load, fetches fragment, injects into placeholder div, sets up event handlers

## Entry Points

**Marketing Website:**
- Location: `index.html`
- Triggers: User visits authorkit.pro domain
- Responsibilities: Showcase product features, pricing, call-to-action for download/signup

**Product Features Page:**
- Location: `features.html`
- Triggers: User clicks Features in navigation
- Responsibilities: Detail product capabilities and use cases

**Pricing Page:**
- Location: `pricing.html`
- Triggers: User clicks Pricing in navigation
- Responsibilities: Display plan options and purchasing details

**Bookshelf Discovery:**
- Location: `bookshelf-index.html` + `bookshelf-browse.html`
- Triggers: User visits bookshelf.authorkit.pro
- Responsibilities: Display books, enable filtering/search, track author engagement

**License Activation API:**
- Location: `api/activate-license.js`
- Triggers: WordPress plugin calls endpoint
- Responsibilities: Validate license, record activation, enable plugin features

**Bookshelf API:**
- Location: `api/bookshelf/books.js`
- Triggers: Bookshelf frontend calls on page load/filter
- Responsibilities: Query database, apply filters/pagination, return results

**Update Check API:**
- Location: `api/check-update.js`
- Triggers: WordPress plugin checks for updates on admin page
- Responsibilities: Compare installed version with latest, return update info

**License Validation API:**
- Location: `api/validate-license.js`
- Triggers: WordPress plugin validates on activation
- Responsibilities: Check license validity, return features/tier

## Error Handling

**Strategy:** Centralized error factory with logging

**Patterns:**

Client-side:
- Try-catch wraps fetch calls in `header-loader.js`, `js/bookshelf-browse.js`
- Errors logged to console, graceful UI fallback (show default content)
- No error boundaries, vanilla error handling

API-side:
- Structured error responses via `api/_lib/errors.js`
- All endpoints return standardized error format: `{ success: false, error: string, code: string }`
- HTTP status codes: 400 (validation), 401 (auth), 429 (rate limit), 500 (server)
- Errors logged via `api/_lib/logger.js` with context (IP, endpoint, error code)

Database:
- Supabase errors caught and formatted via `formatSupabaseError()` in `api/_lib/supabase.js`
- Query failures return 500 with descriptive error message
- No sensitive database details exposed to client

## Cross-Cutting Concerns

**Logging:**
- API: Structured logging in `api/_lib/logger.js` with timestamp, level, context
- Client: Browser console.error() for debugging
- Security events: Separate logging for rate limits, validation failures in `api/_lib/security.js`

**Validation:**
- Client: Basic HTML5 validation on forms
- API: Input validation in every endpoint via `validateInput()` from `api/_lib/security.js`
- Sanitization: String length limits, type checking, format validation

**Authentication:**
- License key validation: All WordPress-bound endpoints validate license in request body
- Service role access: API uses Supabase service role key (server-side only, never client-side)
- CORS: Permissive origin policy with fallback to license validation (for WordPress sites)

**Caching Strategy (Vercel):**
- Static assets (CSS, JS, images): 1 year immutable cache
- HTML pages: 1 hour cache with must-revalidate
- API responses: No cache (no-store, no-cache)
- Bookshelf data: Cached in Supabase queries, frontend can implement client-side caching

---

*Architecture analysis: 2026-03-18*
