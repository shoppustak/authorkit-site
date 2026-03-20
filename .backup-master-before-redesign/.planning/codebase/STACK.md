# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**
- HTML5 - Markup language for 19 static pages
- JavaScript (vanilla) - Client-side interactivity and API calls
- CSS3 (with Tailwind) - Styling and responsive design

**Secondary:**
- Node.js JavaScript - Server-side API endpoints and build tooling

## Runtime

**Environment:**
- Node.js - For build scripts and Vercel serverless functions
- Browser runtime - Client-side execution (no framework dependencies)

**Package Manager:**
- npm - Node package manager
- Lockfile: `package-lock.json` present (v3 lockfile format)

## Frameworks

**Core:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework for styling
- No JavaScript framework (vanilla JS only)

**Build/Dev:**
- Terser 5.27.0 - JavaScript minification for production
- Tailwindcss 3.4.1 - CSS build and watch tooling

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.39.0 - PostgreSQL database client for bookshelf data (production dependency)

**Build/Development:**
- tailwindcss 3.4.1 - CSS compilation and minification
- terser 5.27.0 - JavaScript minification

## Configuration

**Environment:**
- `.env.example` present with sample configuration
- Environment variables stored in Vercel platform (not committed)
- Configuration includes:
  - `LEMON_SQUEEZY_API_KEY` - Payment/license API
  - `LEMON_SQUEEZY_STORE_ID` - Payment store identifier
  - `LEMON_SQUEEZY_WEBHOOK_SECRET` - Webhook signature verification
  - `SUPABASE_URL` - Database connection
  - `SUPABASE_SERVICE_KEY` - Server-side database access
  - `DOWNLOAD_TOKEN_SECRET` - Secure token generation (min 32 chars)
  - `NODE_ENV` - Environment (development/production)

**Build:**
- `vercel.json` - Deployment and routing configuration
- `tailwind.config.js` - Tailwind theme customization
- `package.json` - Build and development scripts

**Build Scripts:**
```bash
npm run dev              # Python3 HTTP server on port 8000
npm run serve           # Python3 HTTP server on port 8000
npm run build:css       # Tailwind CSS compilation with minification
npm run watch:css       # Tailwind CSS watch mode
npm run build:js        # Terser minification for 3 JS files
npm run build           # Full build (CSS + JS)
```

## Platform Requirements

**Development:**
- Node.js (any recent version, no .nvmrc specified)
- npm (bundled with Node.js)
- Python 3 (for local development server)
- Modern browser with ES6+ support (no polyfills needed)

**Production:**
- Vercel deployment platform
- Node.js runtime on Vercel (for API functions)
- Supabase PostgreSQL database (external)
- Lemon Squeezy SaaS (external payment processor)

## Database

**Primary:**
- PostgreSQL via Supabase
- Connection: `SUPABASE_URL` environment variable
- Authentication: Service role key for API endpoints
- Tables: `bookshelf_sites`, `bookshelf_books`, `bookshelf_book_genres`, `bookshelf_genre_requests`, `email_subscribers`

## API & Serverless Functions

**Hosting:**
- Vercel serverless functions
- Memory: 1024MB per function
- Max duration: 10 seconds per request
- Location: `/api/**/*.js`

**Build Command:**
```
npm run build
```

---

*Stack analysis: 2026-03-18*
