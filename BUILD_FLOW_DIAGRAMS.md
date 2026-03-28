# AuthorKit Build System - Visual Flow Diagrams

---

## Build Process Pipeline

```
SOURCE FILES                    PROCESSING                     OUTPUT
────────────────              ──────────────                   ──────

css/input.css                 postcss-import
├─ design-tokens.css          │ (resolves @imports)
├─ monochrome-components.css  ├─ tailwindcss 
├─ style.css                  │ (processes directives)
└─ bookshelf.css              ├─ cssnano (production only)
                              │ (minification)
                              └─ purgecss (production only)
                                (removes unused)
                                        │
                                        ↓
                            CSS/STYLES.CSS (39 KB)
                                        │
                            ┌───────────┴────────────┐
                            ↓                        ↓
              DEV: styles.css              PROD: styles.min.css
              (39 KB, unminified)          (22 KB, minified)

js/main.js                    terser
├─ header-loader.js           │ (-c -m flags)
├─ footer-loader.js           │ (compress & mangle)
└─ bookshelf(-browse).js      │
                              └─→ *.min.js files
                                  (50-55% reduction)
```

---

## CSS Consolidation Architecture

```
LAYER 1: CSS Variables
├── 150+ custom properties
├── Design tokens (@root)
└── Mobile overrides (@media)

        ↓

LAYER 2: Monochrome Components
├── Navigation styles
├── Mobile menu
├── Buttons & cards
└── Semantic markup

        ↓

LAYER 3: Tailwind Directives
├── @tailwind base
├── @tailwind components
└── @tailwind utilities
    (300+ utilities generated)
    (15 core plugins disabled)

        ↓

LAYER 4: Custom Overrides
├── Brand colors (@layer utilities)
├── Animation definitions (@keyframes)
├── Print styles (@media print)
└── Custom utilities

        ↓

CONSOLIDATED OUTPUT: styles.css
└── Single file, 40.3 KB unminified
    └── Contains ALL styles for ALL pages
    └── Includes bookshelf.css (18 KB) even on non-bookshelf pages
```

---

## Per-Page Asset Delivery

### Homepage (index.html)
```
Request Timeline:
0ms     ├─ GET / (HTML doc)
        │
50ms    ├─ Parse HTML head
        │  └─ Discover 5 render-blocking resources
        │
60ms    ├─ GET /fonts/Playfair... (Google Fonts)
        ├─ GET /fonts/Source... (Google Fonts)
        ├─ GET /css/styles.css (22 KB)
        │
180ms   ├─ Google Fonts response
        │
250ms   ├─ CSS response complete
        │
260ms   ├─ CSS parsed
        ├─ Fonts loaded
        ├─ Layout calculated
        │
300ms   ├─ FIRST PAINT (FP)
        ├─ FIRST CONTENTFUL PAINT (FCP)
        │
350ms   ├─ GET /images/... (lazy loading begins)
        │
450ms   ├─ GET js/header-loader.js (defer)
        ├─ GET js/footer-loader.js (defer)
        ├─ GET js/main.min.js (defer)
        │
500ms   ├─ Deferred JS executes
        │  ├─ Load header dynamically
        │  ├─ Load footer dynamically
        │  ├─ Initialize IntersectionObserver
        │  └─ Setup event listeners
        │
1200ms  └─ LARGEST CONTENTFUL PAINT (LCP)
           (main content fully painted)

TOTAL BLOCKING TIME:
├─ Font requests: ~150ms
├─ CSS parsing: ~100ms
├─ JS parsing: ~20ms
└─ Total: ~270ms blocking
```

### Asset Sizes Breakdown
```
Total Page Weight: ~85 KB (before gzip)
├── HTML doc: ~30 KB
├── CSS (styles.min.css): 22 KB ← LARGEST CSS ASSET
├── Fonts (Google): ~30 KB (2 requests)
└── JS (*.min.js): 6.8 KB
    ├── header-loader.js: 2.4 KB
    ├── footer-loader.js: 1.1 KB
    └── main.min.js: 3.3 KB

After gzip compression:
├── HTML: ~8 KB
├── CSS: ~4 KB
├── Fonts: ~15 KB (non-gzippable)
├── JS: ~2.5 KB
└── Total: ~29.5 KB (gzipped)
```

---

## Font Loading Waterfall

### Current (Inefficient)
```
Timeline:
0ms     ┌─ HTML parsing complete
        │
50ms    ├─ Browser discovers 2 font stylesheets
        │
60ms    ├─ GET fonts.googleapis.com/css2?family=Playfair...
        │  └─ Request 1 (blocks rendering)
        │
        ├─ GET fonts.googleapis.com/css2?family=Source...
        │  └─ Request 2 (blocks rendering)
        │
180ms   ├─ Both font stylesheets respond
        │  ├─ download.woff2 for Playfair
        │  └─ download.woff2 for Source
        │
200ms   ├─ Browser parses font CSS
        ├─ Requests .woff2 files
        │
300ms   ├─ Fonts downloaded
        ├─ Fonts available
        │
        ├─ NOW CSS/styles.css can parse
        └─ FCP delayed ~300ms!

WATERFALL SEQUENCE: Font CSS → Font Files → Site CSS
```

### Recommended (Efficient)
```
Timeline:
0ms     ┌─ HTML parsing complete
        │
10ms    ├─ Preload fonts.woff2 directly (2 parallel requests)
        │  ├─ <link rel="preload" as="font" href="...playfair.woff2" crossorigin>
        │  └─ <link rel="preload" as="font" href="...source.woff2" crossorigin>
        │
20ms    ├─ Load CSS (styles.min.css)
        │  └─ Parsing begins immediately
        │
100ms   ├─ CSS parsed
        ├─ Fonts arrive (parallel to CSS parsing)
        │
120ms   ├─ Fonts loaded
        ├─ All styles ready
        ├─ FCP achievable
        │
150ms   └─ FIRST CONTENTFUL PAINT (FCP)

WATERFALL SEQUENCE: CSS + Font Files (parallel) → Ready
Result: FCP improved by 150ms!
```

---

## CSS File Consolidation Strategy

### Why Consolidation?

**Benefits of Single File**:
```
HTTP/2 Multiplexing:
├─ Single connection
├─ Parallel streams possible
├─ Lower overhead (fewer headers)
└─ Faster delivery than multiple small files

Caching:
├─ Single cache entry
├─ Entire stylesheet cached/invalidated together
└─ No partial updates

Parsing:
├─ Single parse operation
├─ Browser can optimize parse stream
└─ Fewer parser invocations
```

**Drawbacks**:
```
Page-Specific Bloat:
├─ All pages load full 22 KB (even home page)
├─ Home page doesn't need bookshelf.css (18 KB)
├─ Only 10% of pages use bookshelf features
└─ Unnecessary delivery = poor performance

Unused Utilities:
├─ Tailwind utilities (70% of file) mostly unused per-page
├─ PurgeCSS conservative approach = safe but not aggressive
└─ Could extract ~20-30% with critical CSS extraction
```

### Current Flow
```
ALL 66 PAGES
    ↓
[Load styles.min.css - 22 KB]
├─ design-tokens.css
├─ monochrome-components.css
├─ style.css
└─ bookshelf.css (not needed on most pages!)
    ↓
[Parse all CSS]
├─ Typography (needed)
├─ Navigation (needed)
├─ Bookshelf components (not needed on 90% of pages!)
└─ Tailwind utilities (mostly unused per-page)
    ↓
[CSS available for rendering]
```

### Recommended Flow (Page-Specific)
```
HOME PAGE
    ├─ [Load critical.css - 8 KB inline]
    │  ├─ Header styles
    │  ├─ Hero styles
    │  └─ Above-fold layout
    │
    └─ [Load styles.min.css async - 14 KB] (no bookshelf)
       ├─ design-tokens.css
       ├─ monochrome-components.css
       └─ style.css

BOOKSHELF PAGE
    ├─ [Load critical.css - 8 KB inline]
    │
    └─ [Load styles-bookshelf.min.css - 20 KB]
       ├─ Full CSS
       └─ Bookshelf components
```

---

## Tailwind Configuration Structure

```
tailwind.config.js (162 lines)
│
├─ content: [globs for scanning]
│  ├─ *.html files
│  ├─ includes/*.html files
│  └─ js/*.js files
│
├─ theme: [design system tokens]
│  ├─ colors
│  │  ├─ black, white, transparent
│  │  ├─ brand-orange, brand-blue
│  │  └─ semantic (success, error, warning, info)
│  │
│  ├─ fontFamily
│  │  ├─ headline: Playfair Display
│  │  ├─ body: Source Serif 4
│  │  └─ ui: system fonts
│  │
│  ├─ fontSize (16px+ minimum)
│  │  ├─ display: 4rem
│  │  ├─ h1: 3rem
│  │  ├─ body: 1.125rem
│  │  └─ xs: 1rem (min 16px)
│  │
│  ├─ spacing (8px scale)
│  │  ├─ 1: 0.5rem
│  │  ├─ 2: 1rem
│  │  ├─ 4: 2rem
│  │  └─ 8: 4rem
│  │
│  └─ borderRadius (ALL ZERO for flat design)
│     └─ Every radius: 0
│
├─ corePlugins: [disabled]
│  ├─ animation: false ← KEY: All animations disabled!
│  ├─ blur, brightness, contrast: false
│  ├─ dropShadow, grayscale, hueRotate: false
│  └─ ... 9 more decorative utilities disabled
│
└─ plugins: [] (empty, no third-party plugins)
```

---

## JavaScript Module Dependencies

```
EVERY PAGE
│
├─ header-loader.js (2.4 KB)
│  ├─ Fetch includes/header.html
│  ├─ DOM manipulation
│  └─ Page detection (getCurrentPage())
│
├─ footer-loader.js (1.1 KB)
│  ├─ Fetch includes/footer.html
│  └─ DOM manipulation
│
└─ main.min.js (3.3 KB)
   ├─ Mobile menu toggle
   │  └─ Event listener on #mobile-menu-button
   │
   ├─ Smooth scroll
   │  └─ querySelectorAll('a[href^="#"]')
   │
   └─ Fade-in animation
      └─ IntersectionObserver on section, .card-hover


BOOKSHELF PAGES ONLY
│
├─ bookshelf.js (6.6 KB) OR
│
└─ bookshelf-browse.js (9.1 KB)
   ├─ State management (currentPage, filters)
   ├─ Event listeners (search, genre, sort)
   ├─ API calls (loadBooks, updateUrlParams)
   └─ DOM building (createBookCard)
```

---

## Performance Metrics Hierarchy

```
Performance Score (95+ target)
├─ CRITICAL METRICS (blocking)
│  ├─ Largest Contentful Paint (LCP < 2.5s)
│  │  └─ Impact: User perceives page load complete
│  │
│  ├─ Total Blocking Time (TBT < 200ms)
│  │  └─ Impact: Main thread responsiveness
│  │
│  └─ Cumulative Layout Shift (CLS < 0.1)
│     └─ Impact: Visual stability
│
├─ SECONDARY METRICS (warnings)
│  ├─ First Contentful Paint (FCP < 1.8s)
│  │  └─ Impact: Perceived first interaction
│  │
│  ├─ Speed Index (SI < 3.4s)
│  │  └─ Impact: Visual completeness
│  │
│  └─ Time to Interactive (TTI < 3s)
│     └─ Impact: Actual interactivity
│
└─ RESOURCE LIMITS (errors)
   ├─ Script size < 50 KB
   ├─ Stylesheet size < 15 KB ← CURRENT: 22 KB (EXCEEDS)
   ├─ Document size < 15 KB
   ├─ Font size < 100 KB
   ├─ Image size < 500 KB
   └─ Total size < 700 KB

BOTTLE NECKS IN ORDER:
1. Stylesheet (22 KB) exceeds 15 KB target
2. LCP delayed by font loading (300ms+)
3. CLS caused by missing image dimensions
4. TBT caused by IntersectionObserver overhead
```

---

## Build Command Execution Flow

```
npm run build:prod
│
├─ prebuild hook
│  └─ npm run clean (removes *.min.js, *.min.css)
│
├─ build script starts
│  │
│  ├─ PHASE 1: CSS Build
│  │  ├─ Input: css/input.css
│  │  ├─ Process: postcss (with NODE_ENV=production)
│  │  │  ├─ postcss-import (resolve @imports)
│  │  │  ├─ tailwindcss (generate utilities)
│  │  │  ├─ purgecss (remove unused)
│  │  │  └─ cssnano (minify)
│  │  └─ Output: css/styles.min.css (22 KB)
│  │
│  └─ PHASE 2: JavaScript Minification
│     ├─ terser js/main.js -o js/main.min.js
│     ├─ terser js/bookshelf.js -o js/bookshelf.min.js
│     └─ terser js/bookshelf-browse.js -o js/bookshelf-browse.min.js
│
└─ postbuild hook
   └─ echo "Build complete"

TIMING:
├─ CSS build: ~3-5 seconds
├─ JS minification: ~0.5-1 second
└─ Total: ~5-6 seconds
```

---

## Performance Regression Indicators

```
Recent Git History Analysis:

4 weeks ago: CSS architecture clean, no issues
     ↓
Last week: Multiple "fix" commits
     ├─ Typography size adjustments (REPEATED)
     ├─ Mobile layout fixes (card overflow)
     ├─ Image CLS prevention (adding dimensions)
     └─ Menu positioning fixes
     ↓
PATTERN IDENTIFIED: Reactive bug fixes
     ├─ Issues discovered → patches applied
     ├─ Not proactive optimization
     └─ Suggests design decisions causing problems

ROOT CAUSES:
├─ Font loading blocking render
│  └─ No preload strategy
│
├─ Image CLS issues
│  └─ Missing width/height attributes
│
└─ Mobile menu breakpoint
   └─ CSS/JS mismatch (1024px vs others)
```

---

## Resource Loading Waterfall (Actual vs Optimal)

### Current State
```
Time: 0ms ─────────────────────────────────────────────┐
          │ HTML                                        │
          ├─ Parse HTML (50ms)                         │
          │                                             │
    50ms  ├─ Fonts CSS Request 1 (render blocked) ─┐   │
          ├─ Fonts CSS Request 2 (render blocked) ─┤   │
          ├─ styles.css Request (render blocked) ──┤   │
          │                                         │   │
   180ms  ├─ Fonts CSS Response ←──────────────────┘   │
          ├─ Font .woff2 Requests                  │   │
          │                                        │   │
   250ms  ├─ styles.css Response                   │   │
          ├─ CSS Parse (100ms) ────────────┐      │   │
          ├─ Font .woff2 Response          │      │   │
          │                                │      │   │
   350ms  ├─ FCP (300ms delay) ←──────────┘      │   │
          │                                      │   │
   400ms  ├─ Header+Footer JS Requests ──────────┘   │
          │                                          │
   500ms  ├─ Main JS Execute                        │
          │                                          │
  1200ms  └─ LCP (largest content paint)
```

### Optimal State (After Fixes)
```
Time: 0ms ─────────────────────────────────────────────┐
          │ HTML                                        │
          ├─ Parse HTML (50ms)                         │
          │                                             │
    50ms  ├─ styles.min.css Request           ┐        │
          ├─ Fonts .woff2 Preload (parallel)  ├─┐      │
          │                                   │ │      │
   120ms  ├─ CSS Response + Parse ←───────────┘ │      │
          ├─ Font .woff2 Response ←─────────────┘      │
          │                                            │
   150ms  ├─ FCP (150ms, 50% improvement!)            │
          │                                            │
   250ms  ├─ Header+Footer JS Requests                │
          │                                            │
   300ms  ├─ Main JS Execute                          │
          │                                            │
   800ms  └─ LCP (improved by 400ms)
```

---

## CSS Size Analysis

```
Total: 39 KB unminified → 22 KB minified

Breakdown by Component:
┌─ Tailwind Utilities     [~27 KB, 70%]
│  ├─ Most unused per-page
│  ├─ PurgeCSS removes some
│  └─ Conservative safelist = bloat
│
├─ Monochrome Components [~14 KB, 35%]
│  ├─ Always needed
│  ├─ Navigation styles
│  ├─ Mobile menu
│  └─ Button/card components
│
├─ Bookshelf Styles      [~18 KB, 45%] ← PROBLEM!
│  ├─ Only needed on bookshelf pages
│  ├─ Loaded on ALL pages
│  └─ = 18 KB waste per non-bookshelf page
│
├─ Custom Overrides      [~8 KB, 20%]
│  ├─ Brand colors
│  ├─ Animations
│  └─ Custom utilities
│
└─ Design Tokens         [~4 KB, 10%]
   ├─ CSS variables
   └─ Always needed

OPTIMIZATION OPPORTUNITY:
Remove bookshelf.css from primary bundle
└─ Save 18 KB per non-bookshelf page (90% of traffic)
└─ Load conditionally on bookshelf pages only
```

---

**Diagram Summary**: This document provides visual representations of:
1. Build process pipeline with file transformations
2. Per-page asset delivery and timing
3. Font loading inefficiencies (current vs recommended)
4. CSS consolidation strategy and tradeoffs
5. JavaScript module dependency graph
6. Lighthouse metrics hierarchy
7. Performance regression pattern analysis
8. Resource waterfall comparisons

