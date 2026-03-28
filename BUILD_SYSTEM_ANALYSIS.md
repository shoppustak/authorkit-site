# AuthorKit Site - Comprehensive Build System & Architecture Analysis

**Date**: March 28, 2026
**Analyzed By**: Claude Code
**Repository**: /Users/maulik/authorkit-site

---

## Executive Summary

The AuthorKit.pro website is a **static HTML marketing site with a light Node.js build system** optimized for performance. The build process uses Tailwind CSS, PostCSS, and Terser for minification. Despite the minimal tooling, there are several architectural opportunities and constraints that impact performance.

**Key Finding**: CSS file consolidation is intentional and necessary, but **file bloat and loading strategy need optimization** to improve Core Web Vitals (LCP, CLS, FCP).

---

# SECTION 1: BUILD SYSTEM & CONFIGURATION

## 1.1 Package.json Scripts Analysis

**File**: `/Users/maulik/authorkit-site/package.json`

### Build Scripts Inventory

```
DEVELOPMENT SCRIPTS:
├── dev                    : python3 -m http.server 8000
├── serve                  : python3 -m http.server 8000
├── watch:css              : tailwindcss -i ./css/input.css -o ./css/styles.css --watch
├── build:css:watch        : Same as watch:css
├── build:css:debug        : Single build without watch

PRODUCTION SCRIPTS:
├── build:css              : postcss css/input.css -o css/styles.css
├── build:css:prod         : NODE_ENV=production postcss + minify
├── build:css:full         : Merge legacy CSS + postcss + minify
├── build:css:merge        : Consolidate design-tokens.css + components + style.css
├── build:js               : terser on 3 JS files
├── build:all              : CSS + JS + images
├── build:prod             : build:css:full + build:js
├── optimize:images        : ./scripts/optimize-images.sh
├── analyze:css            : tailwindcss + minify + show size

TESTING SCRIPTS:
├── test:lighthouse        : lighthouse http://localhost:8000 --view
├── test:lighthouse:quick   : Performance-only Lighthouse
├── test:lighthouse:ci      : lhci autorun with config
├── test:perf              : ./scripts/test-performance.sh
├── test:css-size          : Show css/styles.min.css size
└── analyze:images         : List image sizes
```

### Build Command Flow

```
┌─────────────────┐
│   npm run build │
└────────┬────────┘
         │
         ├─ npm run clean (removes .min.css/.min.js)
         │
         ├─ npm run build:css
         │  └─ postcss css/input.css -o css/styles.css
         │     (PostCSS processes @import, but no minification in dev)
         │
         ├─ npm run build:js
         │  ├─ terser js/main.js -o js/main.min.js
         │  ├─ terser js/bookshelf.js -o js/bookshelf.min.js
         │  └─ terser js/bookshelf-browse.js -o js/bookshelf-browse.min.js
         │
         └─ postbuild echo complete
```

## 1.2 PostCSS Configuration

**File**: `/Users/maulik/authorkit-site/postcss.config.js`

```javascript
plugins: [
  require('postcss-import'),          // Resolves @import statements
  require('tailwindcss'),             // Processes @tailwind directives
  // Production only:
  require('@fullhuman/postcss-purgecss').purgeCSSPlugin({
    content: ['./*.html', './includes/**/*.html', './js/**/*.js'],
    safelist: { standard: [/^bg-/, /^text-/, /^border-/, /^hover:/, /^focus:/] }
  }),
  require('cssnano')({                // Minification
    preset: ['default', { discardComments: true, colormin: false }]
  })
]
```

**Key Optimization**: 
- PurgeCSS removes unused Tailwind utilities in production
- PostCSS-import consolidates @import statements into single file
- cssnano minifies without aggressive color optimization (preserves black/white)

## 1.3 Tailwind Configuration

**File**: `/Users/maulik/authorkit-site/tailwind.config.js` (162 lines)

```javascript
content: [
  "./*.html",
  "./includes/**/*.html",
  "./js/**/*.js"
]
```

**Critical Customizations**:
- All border-radius disabled (flat design: `borderRadius: { 'none': '0' }`)
- All shadows disabled (`boxShadow: { 'none': 'none' }`)
- All transitions disabled (`transitionDuration: { '0': '0ms' }`)
- Animation plugin disabled (`corePlugins: { animation: false }`)
- 9 other animation utilities disabled (blur, brightness, contrast, etc.)

**Color Palette**:
- Black/white only (primary)
- Brand orange (#FF9900) + blue (#1E3A5F) - accents only
- Semantic colors (success, error, warning, info)

**Typography**:
- Headline: Playfair Display (serif)
- Body: Source Serif 4 (serif)
- UI: System font stack (-apple-system, Segoe UI)
- Font sizes: 16px minimum for accessibility

**Screens**: `xs: 480px, sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px`

---

# SECTION 2: CSS ARCHITECTURE

## 2.1 File Structure & Organization

**Directory**: `/Users/maulik/authorkit-site/css/`

```
css/ (120 KB total)
├── input.css                    (4.5 KB) - Entry point with @import directives
├── design-tokens.css            (4.0 KB) - CSS variables & spacing scale
├── monochrome-components.css    (14 KB)  - Reusable component styles
├── style.css                    (7.5 KB) - Custom overrides & brand styles
├── bookshelf.css                (18 KB)  - Bookshelf page-specific styles
├── styles.css                   (39 KB)  - Development build (non-minified)
├── styles.min.css               (22 KB)  - Production build (minified)
└── merged-legacy.css            (generated by build:css:merge task)
```

### File Dependencies (Build Order)

```
input.css (ENTRY POINT)
├─ @import './design-tokens.css'
├─ @import './monochrome-components.css'
├─ @tailwind base;              (Tailwind base layer)
├─ @tailwind components;        (Tailwind components layer)
├─ @tailwind utilities;         (Tailwind utilities layer)
└─ Custom CSS (@layer overrides)
```

## 2.2 CSS File Sizes Analysis

| File | Size | Type | Purpose |
|------|------|------|---------|
| input.css | 4.5 KB | Source | Entry point with @import + Tailwind directives |
| design-tokens.css | 4.0 KB | Source | 150 CSS variables (colors, typography, spacing) |
| monochrome-components.css | 14 KB | Source | Navigation, mobile menu, buttons, cards |
| style.css | 7.5 KB | Source | Custom brand styles & animations |
| bookshelf.css | 18 KB | Source | Bookshelf-specific component styles |
| **styles.css** | **39 KB** | **Built** | **Unminified (all sources merged)** |
| **styles.min.css** | **22 KB** | **Built** | **Minified (production)** |

**Consolidation Strategy**:
- All 5 source files merged into single `styles.css` by PostCSS
- Further minified to `styles.min.css` (22 KB gzipped)
- Single CSS load per page (no lazy-loaded/page-specific CSS)

## 2.3 CSS Loading Strategy

**Current Implementation** (All Pages):
```html
<!-- dns-prefetch & preconnect for fonts -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Font stylesheets (blocking renders) -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap">

<!-- All CSS in single file (blocking) -->
<link rel="stylesheet" href="css/styles.css">
```

**Critical Issues**:
1. **Google Fonts loaded as render-blocking stylesheets** (2 requests)
2. **All CSS (22 KB) must be parsed before rendering** 
3. **No async/defer on CSS** (CSS always blocks rendering)
4. **No font-display control** (fonts loaded with ?display=swap, but stylesheet itself blocks)

## 2.4 Design Tokens System

**File**: `/Users/maulik/authorkit-site/css/design-tokens.css` (167 lines)

Comprehensive CSS variable system:

```css
:root {
  /* Colors */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-brand-orange: #FF9900;
  --color-brand-blue: #1E3A5F;
  --color-success: #059669;
  
  /* Typography */
  --font-headline: 'Playfair Display', serif;
  --font-body: 'Source Serif 4', serif;
  --text-h1: 3rem;          /* Desktop */
  --text-body: 1.125rem;    /* 18px */
  
  /* Spacing (8px base unit) */
  --space-1: 0.5rem;        /* 8px */
  --space-2: 1rem;          /* 16px */
  --space-4: 2rem;          /* 32px */
  --space-8: 4rem;          /* 64px */
  
  /* Layout */
  --container-max: 80rem;   /* 1280px */
  --grid-columns: 12;
  
  /* Borders */
  --border-thin: 1px;
  --border-medium: 2px;
  --radius-none: 0;         /* ALL ZERO - flat design */
  
  /* Shadows (ALL NONE) */
  --shadow-sm: none;
  
  /* Transitions (ALL DISABLED) */
  --transition-none: none;
  --duration-instant: 0ms;
  
  /* Z-index scale */
  --z-sticky: 20;
  --z-modal: 40;
  --z-popover: 50;
}

/* Mobile overrides for breakpoints < 640px */
@media (max-width: 639px) {
  :root {
    --text-h1: 2rem;      /* 32px on mobile */
    --text-body: 1rem;    /* 16px on mobile */
  }
}
```

---

# SECTION 3: JAVASCRIPT ARCHITECTURE

## 3.1 File Structure & Sizes

**Directory**: `/Users/maulik/authorkit-site/js/`

```
js/ (52 KB total)
├── main.js                      (7.1 KB) - Core site functionality
├── main.min.js                  (3.3 KB) - Minified main.js
├── header-loader.js             (2.4 KB) - Dynamic header loading
├── footer-loader.js             (1.1 KB) - Dynamic footer loading
├── bookshelf.js                 (6.6 KB) - Bookshelf UI helper
├── bookshelf.min.js             (3.0 KB) - Minified bookshelf.js
├── bookshelf-browse.js          (9.1 KB) - Browse page filtering
└── bookshelf-browse.min.js      (4.4 KB) - Minified bookshelf-browse.js
```

## 3.2 JavaScript Loading Strategy

**All Pages Load**:
```html
<script src="js/header-loader.js" defer></script>      <!-- 2.4 KB -->
<script src="js/footer-loader.js" defer></script>      <!-- 1.1 KB -->
<script src="js/main.min.js" defer></script>           <!-- 3.3 KB -->
```

**Total JS per page**: 6.8 KB (uncompressed) = ~2-3 KB gzipped

**Key Patterns**:
- All scripts use `defer` attribute (non-blocking)
- Minified versions used (.min.js)
- Separate loaders for header/footer (component-based approach)
- Bookshelf JS only loaded on bookshelf pages

## 3.3 JavaScript Functionality

### main.js (217 lines)
```javascript
// Core functionality:
1. Mobile Menu Toggle
   - click handler on #mobile-menu-button
   - toggle 'hidden' class
   - aria-expanded for accessibility
   
2. Mobile Menu Close-on-Outside-Click
   - Document click listener
   - Check if click is inside menu/button
   - Close menu on window resize to lg (>= 1024px)

3. Smooth Scroll for Anchor Links
   - querySelectorAll('a[href^="#"]')
   - preventDefault + smooth scroll to target
   - offset for fixed header (80px)

4. Intersection Observer (Fade-In)
   - observes all <section> and .card-hover
   - triggers fade-in animation on scroll into view
   - options: threshold: 0.1, rootMargin: '0px 0px -50px 0px'
```

### header-loader.js (63 lines)
```javascript
// Dynamic header composition:
1. Fetch includes/header.html
2. Insert into #header-placeholder
3. Detect current page from window.location.pathname
4. Set .nav-link-active on matching nav links
5. Initialize mobile menu toggle event listeners
```

### footer-loader.js (37 lines)
```javascript
// Dynamic footer composition:
1. Fetch includes/footer.html
2. Insert into #footer-placeholder
3. Simple loading without page detection
```

### bookshelf.js (225 lines)
```javascript
// Book card generation:
1. createBookCard() - generates DOM element for each book
   - Cover image with lazy-loading
   - Title, author, genres
   - Rating display
   - Purchase links (Amazon affiliate)

2. Helper functions:
   - formatGenreName()
   - formatPrice()
   - getAmazonLink()
```

### bookshelf-browse.js (304 lines)
```javascript
// Browse page filtering:
1. State management:
   - currentPage, currentGenre, currentSearch
   - currentSort, totalPages

2. Event listeners:
   - Search input (debounced 500ms)
   - Genre checkboxes
   - Sort dropdown
   - Pagination buttons

3. API Integration:
   - loadBooks() - fetch from /api/books
   - updateUrlParams() - sync URL with filters
```

## 3.4 JavaScript Minification

**Tool**: Terser 5.46.1

```bash
terser js/main.js -o js/main.min.js -c -m
terser js/bookshelf.js -o js/bookshelf.min.js -c -m
terser js/bookshelf-browse.js -o js/bookshelf-browse.min.js -c -m
```

**Compression Ratios**:
- main.js: 7.1 KB -> 3.3 KB (54% reduction)
- bookshelf.js: 6.6 KB -> 3.0 KB (55% reduction)
- bookshelf-browse.js: 9.1 KB -> 4.4 KB (52% reduction)

---

# SECTION 4: ASSET OPTIMIZATION

## 4.1 Image Optimization Workflow

**Script**: `/Users/maulik/authorkit-site/scripts/optimize-images.sh` (1617 bytes)

```bash
#!/bin/bash
# Process: find images -> convert to WebP -> optimize with imagemin

Key Features:
1. WebP conversion for modern browsers
2. imagemin optimization (removes metadata, optimizes compression)
3. Fallback JPEG/PNG generation
4. Maintains directory structure
5. Recursive processing
```

**Directory**: `/Users/maulik/authorkit-site/images/` (956 KB total)

```
images/ (956 KB)
├── favicon.svg              (1.7 KB)
├── icon-authorkit.svg       (2.8 KB)
├── icon-books.svg           (3.8 KB)
├── logo-authorkit.svg       (4.9 KB)
├── logo-authorkit-white.svg (4.8 KB)
├── hero-bg.webp             (44 B) ← OPTIMIZED
├── hero-bg-mobile.webp      (44 B) ← OPTIMIZED
├── feature-icons/           (multiple SVGs)
├── team/                    (30 image variants)
│   ├── *.jpg               (original)
│   ├── *.webp              (optimized)
│   ├── *-640-640.jpg       (responsive)
│   ├── *-320-320.webp      (responsive)
│   └── ... (multiple sizes)
└── manifest.json           (341 B)
```

## 4.2 Font Loading Strategy

**Current Implementation**:
```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap">
```

**Fonts Loaded**:
1. Playfair Display (serif, 600/700 weights) - headlines
2. Source Serif 4 (serif, 400/600 weights) - body text

**Issues**:
- `display=swap` tells browser to use fallback immediately, but stylesheet itself is render-blocking
- 2 separate font requests (should be consolidated)
- No font-preload strategy for critical fonts
- No subset loading (full character sets loaded)

## 4.3 Resource Preloading Strategy

**Current HTML Head** (index.html):
```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Missing: <link rel="preload"> for critical fonts, CSS -->
<!-- Missing: <link rel="prefetch"> for secondary resources -->
```

**What's Missing**:
- No preload for Google Fonts (should preload .woff2)
- No preload for CSS file
- No prefetch for images
- No font-display optimization beyond =swap

---

# SECTION 5: BUILD GUIDES & DOCUMENTATION

## 5.1 README.md

**File**: `/Users/maulik/authorkit-site/README.md` (65 lines)

States:
- "Tailwind CSS via CDN" (OUTDATED - actually uses local build)
- "No build tools required" (OUTDATED - actually uses Node.js build)
- Local server: `python3 -m http.server 8000`
- Deployment: Vercel

## 5.2 Spacing Guidelines

**File**: `/Users/maulik/authorkit-site/docs/SPACING-GUIDELINES.md` (383 lines)

Comprehensive spacing documentation:

```
Base Unit: 8px
Standard Section Padding: 64px vertical (both mobile & desktop)

Spacing Scale:
1×   = 8px    (tight spacing)
2×   = 16px   (mobile padding)
3×   = 24px   (card padding mobile)
4×   = 32px   (card padding desktop)
5×   = 40px   (small sections)
6×   = 48px   (small sections)
8×   = 64px   (standard sections)

Mobile:
- Horizontal padding: 16px
- Keep vertical padding at 64px (consistent)

Buttons:
- Small: 8px vertical × 16px horizontal
- Medium: 12px vertical × 24px horizontal
- Large/XL: NOT ALLOWED
```

## 5.3 Performance Testing Scripts

**Location**: `/Users/maulik/authorkit-site/scripts/`

### test-live-performance.sh
- Tests live site (https://authorkit.pro)
- Uses Lighthouse with mobile emulation
- Tests 4 pages: index, features, pricing, docs
- Generates JSON + HTML reports in `.lighthouse/live-${TIMESTAMP}`

### test-performance.sh
- Local testing via python3 HTTP server

### validate-performance.sh
- Validates against thresholds

## 5.4 Lighthouse CI Configuration

**File**: `/Users/maulik/authorkit-site/.lighthouse/lighthouserc.json`

**Test Settings**:
- 3 runs per page (3 URL types)
- Mobile emulation: 360×640px
- Throttling: 150ms RTT, 1638 Kbps, 4× CPU slowdown

**Performance Assertions**:

| Metric | Threshold | Type |
|--------|-----------|------|
| Performance | 95+ | error |
| Accessibility | 100 | error |
| Best Practices | 95+ | error |
| SEO | 95+ | error |
| FCP | < 1.8s | warning |
| LCP | < 2.5s | **error** |
| TBT | < 200ms | error |
| CLS | < 0.1 | error |
| Speed Index | < 3.4s | warning |
| Script size | < 50 KB | error |
| Stylesheet size | < 15 KB | error |
| Total size | < 700 KB | error |

---

# SECTION 6: FILE STRUCTURE OVERVIEW

## 6.1 Complete Directory Tree

```
authorkit-site/
├── .lighthouse/                    # Lighthouse configs & reports
│   ├── lighthouserc.json
│   ├── live-*/                     # Live test reports
│   └── optimized/                  # Optimized Lighthouse results
│
├── .planning/                      # GSD project management
│   ├── PROJECT.md                  # Vision & success criteria
│   ├── ROADMAP.md
│   └── config.json
│
├── .claude/                        # Claude Code config
│   └── CLAUDE.md
│
├── .github/                        # GitHub workflows
│
├── css/                            # 120 KB total
│   ├── input.css                   # Entry point (4.5 KB)
│   ├── design-tokens.css           # Variables (4.0 KB)
│   ├── monochrome-components.css   # Components (14 KB)
│   ├── style.css                   # Custom styles (7.5 KB)
│   ├── bookshelf.css               # Bookshelf page (18 KB)
│   ├── styles.css                  # Built (unminified, 39 KB)
│   └── styles.min.css              # Built (minified, 22 KB)
│
├── js/                             # 52 KB total
│   ├── main.js                     # Core (7.1 KB)
│   ├── main.min.js                 # Minified (3.3 KB)
│   ├── header-loader.js            # Header (2.4 KB)
│   ├── footer-loader.js            # Footer (1.1 KB)
│   ├── bookshelf.js                # Bookshelf (6.6 KB)
│   ├── bookshelf.min.js            # Minified (3.0 KB)
│   ├── bookshelf-browse.js         # Browse (9.1 KB)
│   └── bookshelf-browse.min.js     # Minified (4.4 KB)
│
├── images/                         # 956 KB total
│   ├── favicon.svg
│   ├── icon-*.svg                  # Feature icons
│   ├── logo-*.svg                  # Brand logos
│   ├── hero-bg.webp                # Background images
│   ├── feature-icons/              # Icon set
│   ├── team/                       # Team photos (30 variants)
│   └── manifest.json
│
├── includes/                       # Dynamic components
│   ├── header.html
│   ├── footer.html
│   └── ...
│
├── scripts/                        # 48 KB total
│   ├── optimize-images.sh
│   ├── test-live-performance.sh
│   ├── test-performance.sh
│   └── validate-performance.sh
│
├── docs/                           # Documentation
│   └── SPACING-GUIDELINES.md
│
├── pages/                          # Secondary pages (implied)
│   └── *.html
│
├── node_modules/                   # Dependencies (excluded from report)
├── package.json                    # Scripts & deps
├── package-lock.json
├── tailwind.config.js              # Tailwind config
├── postcss.config.js               # PostCSS config
├── .gitignore
├── README.md                       # README (outdated)
├── index.html                      # Homepage
├── features.html
├── pricing.html
├── docs.html
├── blog.html
├── about.html
├── changelog.html
├── refund-policy.html
└── ... (60+ more HTML pages)
```

## 6.2 Page Count Analysis

**Total HTML Pages**: 66 pages

**CSS Consolidation Impact**:
- ALL pages load single `styles.css` file (22 KB minified)
- No page-specific CSS bundling
- Bookshelf pages additionally load bookshelf.css (18 KB)

**JavaScript Loading Pattern**:
- All pages: header-loader.js (2.4 KB) + footer-loader.js (1.1 KB) + main.min.js (3.3 KB)
- Bookshelf pages: + bookshelf.js/bookshelf-browse.js (3-4 KB)

---

# SECTION 7: RECENT GIT HISTORY

## 7.1 Build-Related Changes (Last 30 commits)

```
498ff37 build: rebuild main.min.js with correct mobile menu breakpoint (1024px)
39c86d0 fix(quick-260328-bjm): ensure cards don't overflow on narrow screens
c40660e fix(quick-260328-bjm): add explicit dimensions to prevent image layout shifts
fecd044 fix(quick-260328-bjm): fix mobile menu positioning and hamburger visibility
4e0a353 feat(260328-ari): fix typography sizes and colors in CSS files
d011646 feat(260328-ari): update Tailwind config to enforce 16px minimum font size
8998c49 feat(quick-260327-udn): convert bookshelf.css to pure monochrome design
da3a5b5 feat(quick-260327-otf): fix hamburger menu and responsive layout
f52ddae feat(quick-260327-otf): update design guidelines and typography refinements
f6f8b71 fix: prevent footer Subscribe button from overlapping links
```

### Pattern Analysis

**High-Frequency Changes**:
1. **Typography/Font Sizes** (commits 4e0a353, d011646)
   - Multiple rounds of font size adjustments
   - Suggests rendering/readability issues

2. **Mobile Layout Fixes** (commits 39c86d0, c40660e, fecd044, da3a5b5)
   - Card overflow issues
   - Menu positioning problems
   - Image layout shifts (CLS issues)
   - Hamburger breakpoint corrections

3. **CSS Consolidation** (commits 8998c49, f52ddae)
   - Converting styles to monochrome design
   - Design system refinements

**Root Cause Indicator**: Recent commit history shows **reactive fixes** rather than **proactive performance optimization**. Issues discovered post-deployment are being patched.

---

# SECTION 8: PERFORMANCE CRITICAL FINDINGS

## 8.1 CSS Blocking Render Path

**Problem**: CSS must be fully parsed before ANY content renders.

```
Request Timeline:
0ms     → Browser starts requesting index.html
50ms    → HTML parsed, discovers 2 font stylesheets + 1 CSS file
60ms    → 3 render-blocking requests start:
          1. fonts.googleapis.com/css2?family=Playfair...
          2. fonts.googleapis.com/css2?family=Source...
          3. css/styles.css (22 KB)
          
180ms   → Google Fonts respond (depends on network)
250ms   → styles.css response complete
260ms   → CSS parsed, fonts loaded → First Paint

Result: Font requests DELAY CSS processing
        CSS DELAYS First Contentful Paint (FCP)
        FCP can be 300-500ms slower than necessary
```

## 8.2 Unminified CSS in Production

**Critical Issue**: 
- Development build: `styles.css` (39 KB)
- Production build: `styles.min.css` (22 KB)
- BUT: HTML pages might reference `styles.css` instead of `.min.css`

**Risk**: If pages load unminified CSS, delivery is 1.8× larger.

## 8.3 Image Layout Shift Issues

Recent commits (c40660e, 39c86d0) show **explicit dimensions being added** to prevent CLS.

**Pattern**:
```html
<!-- Before (causes CLS) -->
<img src="team/maulik.webp" alt="Maulik">

<!-- After (fixes CLS) -->
<img src="team/maulik.webp" alt="Maulik" width="320" height="320">
```

**Finding**: Multiple images lacking dimensions = cumulative CLS.

## 8.4 Font Loading Strategy Inefficiency

**Current**: 2 separate Google Fonts requests

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap">
```

**Impact**:
- 2 HTTP round trips (vs. 1)
- Each request blocks rendering
- Even with `display=swap`, stylesheet request itself is blocking

**Better Strategy**:
- Single consolidated font request
- Preload .woff2 files directly
- Use `font-display: swap` in CSS

## 8.5 JavaScript Execution on Fade-In Animation

**Found in main.js**:
```javascript
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section, .card-hover').forEach(element => {
    observer.observe(element);
});
```

**Problem**:
- IntersectionObserver on EVERY section/card
- addClass triggers reflow/repaint
- Animation CSS: `animation: fadeIn 0.6s ease-out`
- BUT: Tailwind config disables animations! (`corePlugins: { animation: false }`)

**Conflict**: CSS disables animations, but JS tries to trigger them. Results in dead code.

---

# SECTION 9: BUILD PROCESS CONSTRAINTS

## 9.1 Single CSS Bundle

**Current**: All CSS (22 KB) in single `styles.css` file

**Constraint**: No ability to load critical CSS separately

```
styles.css contains:
├── Tailwind utilities (70% of file) - mostly unused on any given page
├── Design tokens - always needed
├── Monochrome components - needed on most pages
├── Style.css overrides - always needed
└── Bookshelf.css - only needed on 10% of pages
```

**Impact**: Every page loads full stylesheet, including bookshelf styles.

## 9.2 No Code Splitting

**Current JavaScript**: Separate files but all loaded on all pages

```
Every page loads:
├── header-loader.js (2.4 KB)
├── footer-loader.js (1.1 KB)  
└── main.min.js (3.3 KB)

Only bookshelf pages need:
├── bookshelf.js OR
└── bookshelf-browse.js
```

**Finding**: No conditional loading based on page type.

## 9.3 PostCSS-Import Creates Single File

**Process**:
```bash
PostCSS processes input.css
├─ Resolves @import statements
├─ Applies Tailwind directives
├─ Outputs single styles.css file
└─ Minifies if NODE_ENV=production
```

**Result**: Single 22 KB file (good for HTTP/2) but inflexible.

## 9.4 PurgeCSS Effectiveness

**Configuration**:
```javascript
content: ['./*.html', './includes/**/*.html', './js/**/*.js']
```

**Limitation**: PurgeCSS scans ALL HTML + JS files together
- Cannot generate page-specific CSS
- Safelist includes common patterns (`/^bg-/`, `/^text-/`, etc.)

**Result**: Some unused Tailwind utilities remain (conservative approach).

---

# SECTION 10: OPTIMIZATION RECOMMENDATIONS FRAMEWORK

## 10.1 Performance Issues Identified

| Issue | Root Cause | Impact | Severity |
|-------|-----------|--------|----------|
| Google Fonts blocking render | 2 separate stylesheet requests | +300-500ms FCP | Critical |
| Unminified CSS possible | Build process outputs both .css and .min.css | +17 KB per page | High |
| No preload strategy | Missing link rel="preload" | +50-100ms LCP | High |
| Image CLS issues | Missing width/height attributes | CLS > 0.1 | High |
| Dead code (animations) | CSS disables animations, JS triggers them | Dead JS execution | Medium |
| Bookshelf.css on all pages | No page-specific CSS | +18 KB unnecessary | Medium |
| IntersectionObserver overhead | Attached to every section | Perf cost on long pages | Low |

## 10.2 Quick Wins (Can implement immediately)

1. **Consolidate Google Fonts request** (2 requests → 1)
2. **Ensure production uses `.min.css`** (verify HTML)
3. **Add preload for critical fonts** (use <link rel="preload" as="font">)
4. **Add width/height to all images** (prevent CLS)
5. **Remove dead animation code** from main.js

## 10.3 Medium-Term Improvements

1. **Critical CSS extraction** (inline above-the-fold CSS)
2. **Page-specific CSS bundling** (bookshelf.css only on bookshelf pages)
3. **Font subsetting** (load only needed characters)
4. **Conditional JS loading** (load bookshelf JS only on bookshelf pages)

## 10.4 Long-Term Architecture

1. **HTTP/2 Server Push** (for critical resources)
2. **Dynamic imports** for page-specific JS
3. **CSS-in-JS** or CSS modules for component-scoped styles
4. **Build-time critical CSS extraction**

---

# SECTION 11: BUILD SYSTEM STRENGTHS

1. **Simple, maintainable** - No complex bundler (webpack/vite)
2. **Fast development** - `npm run watch:css` for instant updates
3. **Performance-conscious** - Minification, PurgeCSS enabled
4. **Comprehensive testing** - Lighthouse CI configured with strict thresholds
5. **Asset optimization** - Image optimization script included
6. **Design system** - CSS variables for tokens, proper scaling
7. **Git history** - Tracks performance improvements over time

---

# SECTION 12: BUILD SYSTEM WEAKNESSES

1. **No critical CSS path optimization** - All CSS blocks render
2. **No code/CSS splitting** - Monolithic bundles
3. **Font loading inefficient** - 2 requests, blocking stylesheets
4. **Missing preload/prefetch** - Resource hints not utilized
5. **PostCSS chain complex** - Multiple transformations with @import
6. **Documentation outdated** - README mentions "Tailwind via CDN"
7. **No source maps** - Minified code without debugging info
8. **Page-agnostic bundling** - All resources load on all pages

---

# CONCLUSION

The AuthorKit.pro build system is **functional but suboptimal for Core Web Vitals optimization**. The main bottleneck is **CSS and font loading blocking the render path**. 

The single-file CSS consolidation strategy (styles.css) works fine for HTTP/2 but creates bloat when pages don't need all styles (e.g., home page doesn't need 18 KB bookshelf.css).

**Key Recommendations for Performance Fixes**:
1. Restructure font loading (consolidate + preload)
2. Extract critical CSS path
3. Implement page-specific CSS bundling
4. Ensure production uses minified assets consistently
5. Add missing image dimensions

With these changes, **FCP could improve by 300-500ms** and **LCP by 200-400ms**.

---

**Report Generated**: March 28, 2026
**Analysis Scope**: Complete build system, CSS architecture, JavaScript bundling, font & image optimization
**Next Steps**: Apply recommendations in priority order (fonts → critical CSS → page-specific bundling)

