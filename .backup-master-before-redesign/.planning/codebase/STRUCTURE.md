# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
authorkit-site/
├── api/                          # Vercel serverless functions
│   ├── _lib/                    # Shared utilities for API endpoints
│   │   ├── security.js          # CORS, rate limiting, validation, security headers
│   │   ├── supabase.js          # Supabase client singleton
│   │   ├── logger.js            # Structured logging
│   │   ├── errors.js            # Error factory and handling
│   │   └── env-validator.js     # Environment variable validation
│   ├── _middleware.js           # Edge middleware for multi-domain routing
│   ├── bookshelf/               # Bookshelf discovery API endpoints
│   │   ├── books.js             # GET /api/bookshelf/books - list with filtering
│   │   ├── register.js          # POST - register book in bookshelf
│   │   ├── deregister.js        # DELETE - remove book from bookshelf
│   │   ├── sync.js              # POST - sync book data
│   │   ├── keepalive.js         # GET - scheduled health check
│   │   └── remove.js            # DELETE - delete book
│   ├── webhooks/                # Webhook handlers
│   │   └── lemon-squeezy.js     # Lemon Squeezy payment notifications
│   ├── activate-license.js      # POST /api/activate-license
│   ├── deactivate-license.js    # POST /api/deactivate-license
│   ├── validate-license.js      # POST /api/validate-license
│   ├── check-update.js          # GET /api/check-update - version info
│   └── email-capture.js         # POST /api/email-capture - newsletter signup
├── css/                          # Stylesheets
│   ├── input.css                # Tailwind source with @tailwind directives
│   ├── styles.css               # Generated Tailwind output (DO NOT EDIT)
│   ├── style.css                # Custom brand colors and overrides
│   └── bookshelf.css            # Bookshelf-specific styles
├── js/                           # JavaScript modules
│   ├── main.js                  # Core interactivity (menu, smooth scroll, fade-in)
│   ├── main.min.js              # Minified version (generated)
│   ├── bookshelf.js             # Bookshelf book card rendering and utilities
│   ├── bookshelf.min.js         # Minified version (generated)
│   ├── bookshelf-browse.js      # Advanced book browsing with filters
│   ├── bookshelf-browse.min.js  # Minified version (generated)
│   ├── header-loader.js         # Dynamically loads and injects header HTML
│   └── footer-loader.js         # Dynamically loads and injects footer HTML
├── includes/                     # Reusable HTML fragments
│   ├── header.html              # Navigation header (loaded dynamically)
│   └── footer.html              # Footer with links (loaded dynamically)
├── images/                       # Static image assets
│   ├── logo-authorkit.svg       # Main logo (orange/navy)
│   ├── logo-authorkit-white.svg # White logo variant
│   ├── favicon.svg              # Browser favicon
│   ├── favicon.ico              # Fallback favicon
│   └── team/                    # Team member photos
├── database/                     # Database schema and migrations
│   ├── SETUP.md                 # Database setup instructions
│   ├── PLANETSCALE-SETUP.md     # PlanetScale-specific setup
│   ├── migrations/              # Migration files
│   ├── supabase-schema.sql      # Supabase PostgreSQL schema
│   └── planetscale-schema.sql   # PlanetScale MySQL schema
├── index.html                   # Homepage - hero, features, CTA
├── features.html                # Product features detail page
├── pricing.html                 # Pricing page with plan options
├── blog.html                    # Blog listing or redirect
├── download.html                # Free download page and form
├── account.html                 # User account/dashboard page
├── bookshelf-index.html         # Bookshelf homepage
├── bookshelf-browse.html        # Advanced book browser
├── bookshelf.html               # Legacy/redirect to bookshelf-index
├── checkout.html                # Payment checkout page
├── about.html                   # About the project/team
├── changelog.html               # Version changelog
├── docs.html                    # Docs landing (redirect or local)
├── support.html                 # Support/contact page
├── privacy-policy.html          # Privacy policy (legal)
├── terms-of-use.html            # Terms of use (legal)
├── refund-policy.html           # Refund policy (legal)
├── package.json                 # NPM dependencies and build scripts
├── package-lock.json            # Locked dependency versions
├── tailwind.config.js           # Tailwind CSS configuration
├── vercel.json                  # Vercel deployment config
├── .env.example                 # Example environment variables
├── .gitignore                   # Git ignore patterns
├── .vscode/                     # VS Code workspace settings
├── .planning/                   # GSD planning documents
│   └── codebase/               # Codebase analysis docs
├── README.md                    # Project overview
├── API_DOCUMENTATION.md         # API endpoint reference
├── SECURITY.md                  # Security practices
├── DEPLOYMENT.md                # Deployment process
├── BRANDING.md                  # Brand guidelines
├── BRAND-GUIDE.md               # Brand color and style guide
└── COLOR-USAGE.md               # Detailed color usage patterns
```

## Directory Purposes

**api/**
- Purpose: Vercel serverless functions for backend logic
- Contains: Express-like request handlers (req, res)
- Key files: Each `.js` file is a separate API endpoint

**api/_lib/**
- Purpose: Shared utilities imported by all API endpoints
- Contains: Security utilities, database client, error handling, logging
- Key files: `security.js` (most imported), `supabase.js` (database access)

**api/bookshelf/**
- Purpose: Dedicated endpoints for Bookshelf discovery platform
- Contains: Book listing, registration, synchronization logic
- Key files: `books.js` (main listing endpoint with filtering)

**api/webhooks/**
- Purpose: Incoming webhook handlers from third-party services
- Contains: Payment processor callbacks (Lemon Squeezy)
- Key files: `lemon-squeezy.js` (e-commerce webhook)

**css/**
- Purpose: All stylesheets for the site
- Contains: Tailwind CSS compilation, custom styles, brand colors
- Key files: `input.css` (source), `styles.css` (generated - DO NOT EDIT), `style.css` (overrides)

**js/**
- Purpose: Client-side JavaScript for interactivity
- Contains: Vanilla JavaScript, no frameworks
- Key files: `main.js` (core functionality), `bookshelf.js` (component library), loader scripts

**includes/**
- Purpose: Reusable HTML fragments
- Contains: Navigation and footer HTML
- Key files: `header.html` (top navigation), `footer.html` (bottom footer)
- Note: Loaded dynamically by `header-loader.js` and `footer-loader.js`

**images/**
- Purpose: Static image and SVG assets
- Contains: Logos, favicons, team photos
- Key files: `logo-authorkit.svg`, `logo-authorkit-white.svg`
- Note: Aggressively cached (1 year) by Vercel

**database/**
- Purpose: Database schema definitions and migrations
- Contains: SQL files for Supabase or PlanetScale setup
- Key files: `supabase-schema.sql` (PostgreSQL), `planetscale-schema.sql` (MySQL)

## Key File Locations

**Entry Points:**
- `index.html`: Main homepage - first impression, hero section, features overview
- `api/_middleware.js`: Vercel edge middleware - routes based on hostname (bookshelf.authorkit.pro vs authorkit.pro)

**Configuration:**
- `package.json`: NPM dependencies (Tailwind, Terser, Supabase client)
- `tailwind.config.js`: Tailwind theme config with custom brand colors
- `vercel.json`: Deployment config - caching, function memory, rewrites, CRON jobs
- `.env.example`: Template for required environment variables

**Core Logic:**
- `api/_lib/security.js`: Rate limiting, CORS, validation, security headers
- `api/_lib/supabase.js`: Database client singleton with error formatting
- `js/main.js`: Mobile menu, smooth scroll, fade-in animations
- `js/bookshelf.js`: Book card rendering, utilities for book display
- `js/header-loader.js`: Dynamic header injection and navigation activation

**API Endpoints:**
- `api/activate-license.js`: WordPress plugin license activation (POST)
- `api/validate-license.js`: Check license status (POST)
- `api/bookshelf/books.js`: List books with filters/pagination (GET)
- `api/check-update.js`: Version check for plugin updates (GET)

**Testing & Documentation:**
- `API_DOCUMENTATION.md`: Reference for all API endpoints
- `SECURITY.md`: Security practices and vulnerability handling
- `DEPLOYMENT.md`: How to deploy to Vercel
- `README.md`: Project overview and quick start

## Naming Conventions

**Files:**
- HTML pages: kebab-case (index.html, features.html, about.html)
- JavaScript: kebab-case for files (main.js, bookshelf.js, header-loader.js)
- CSS: kebab-case for files (input.css, bookshelf.css, style.css)
- API endpoints: kebab-case routes, camelCase function names (activate-license.js exports handler)
- Directories: lowercase, singular or plural as appropriate (api, css, js, includes, images)

**Functions (JavaScript):**
- camelCase: `createBookCard()`, `loadHeader()`, `formatGenreName()`, `getStarRating()`
- Event handlers: `handleClick()`, `toggleMenu()`
- Async functions: `async function handler()`, `async function loadHeader()`

**Variables:**
- camelCase: `mobileMenuButton`, `bookCard`, `currentPage`, `rateLimitResult`
- Constants: UPPER_SNAKE_CASE: `ALLOWED_ORIGINS`, `AMAZON_AFFILIATE_TAG`
- CSS custom properties: kebab-case: `--authorkit-orange`, `--authorkit-navy`

**Types/Classes:**
- Not used (no TypeScript or class-based code)
- Component-like patterns use IIFE or standard functions

## Where to Add New Code

**New Marketing Page:**
1. Create HTML file in root: `newpage.html`
2. Include header via `<div id="header-placeholder"></div>` at top
3. Include footer via `<div id="footer-placeholder"></div>` at bottom
4. Add script tag: `<script src="js/header-loader.js"></script>` and `<script src="js/footer-loader.js"></script>`
5. Link styles: `<link rel="stylesheet" href="css/styles.css">` + `<link rel="stylesheet" href="css/style.css">`
6. Add navigation link to `includes/header.html` (both desktop and mobile menus)
7. Add `data-page="newpage"` attribute to nav links for active state highlighting

**New API Endpoint:**
1. Create file: `api/newfeature.js` or `api/group/newfeature.js` for grouped endpoints
2. Import utilities: `import { setCorsHeaders, setSecurityHeaders, rateLimit, validateInput } from './_lib/security.js';`
3. Export default handler: `export default async function handler(req, res)`
4. Check method: `if (req.method !== 'POST') return res.status(405).json(...)`
5. Set security headers first: `setSecurityHeaders(res); setCorsHeaders(req, res);`
6. Validate input using `validateInput()` function
7. Use Supabase client: `import supabase from './_lib/supabase.js';`
8. Return standardized response: `{ success: boolean, message: string, data: object }`

**New Component/Module:**
- Reusable components in `js/` as functions returning HTMLElement (e.g., `createBookCard()`)
- Import into pages via script tag or module syntax
- Update `tailwind.config.js` content if adding new HTML files to scan

**Utilities/Helpers:**
- Frontend: Add to `js/main.js` or create new file in `js/`
- Backend: Add to `api/_lib/` as separate module or extend existing (e.g., add to `security.js`)
- Both: Avoid duplication by having single source of truth (backend > client when possible)

**Styles:**
- Add custom components to `css/style.css` (custom overrides) or `css/input.css` (if Tailwind component)
- Do NOT edit `css/styles.css` (generated by Tailwind)
- Brand colors: Use CSS custom properties defined at top of `css/style.css` (--authorkit-orange, etc.)
- Tailwind utilities: Extend in `tailwind.config.js` if custom utilities needed

**Database Changes:**
1. Create migration file in `database/migrations/` with timestamp: `YYYYMMDDHHMMSS_description.sql`
2. Update schema files: `database/supabase-schema.sql` and/or `database/planetscale-schema.sql`
3. Document in `database/SETUP.md`
4. Test migration on local/dev database before merging

## Special Directories

**database/migrations/**
- Purpose: Version-controlled database schema changes
- Generated: No (manually created)
- Committed: Yes (part of version control)
- Note: Following database migration pattern for schema evolution

**.planning/codebase/**
- Purpose: GSD (Getting Stuff Done) codebase analysis documents
- Generated: Yes (created by GSD commands)
- Committed: Yes (planning documentation)
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md

**.vscode/**
- Purpose: VS Code workspace configuration
- Generated: No (manually configured)
- Committed: Yes (team settings)
- Contains: Workspace settings, extensions recommendations, debug configs

**images/**
- Purpose: Static assets served with long cache TTL
- Generated: No (manually added)
- Committed: Yes (PNG, SVG, ICO files)
- Note: Vercel caches for 1 year - don't commit frequently-changing images

---

*Structure analysis: 2026-03-18*
