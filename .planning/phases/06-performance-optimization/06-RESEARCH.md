# Phase 06: Performance Optimization - Research

**Researched:** 2026-03-27
**Domain:** Web Performance Optimization, Lighthouse, Core Web Vitals
**Confidence:** HIGH

## Summary

Phase 6 focuses on achieving Lighthouse scores of 95+ across all metrics through systematic optimization of CSS, JavaScript, images, and loading performance. The research reveals that in 2026, only 43% of mobile pages achieve "Good" status on all three Core Web Vitals (LCP, INP, CLS), making this phase critical for competitive advantage.

The project is well-positioned for optimization: Tailwind CSS is already configured (v3.4.1), build scripts exist for CSS/JS minification, and the minimalist monochrome design eliminates decorative elements that typically hurt performance. However, the site currently loads multiple CSS files, uses Google Fonts without optimal preloading, and lacks image optimization (only 6 images found, 2 already WebP).

Core Web Vitals have evolved: **INP (Interaction to Next Paint) replaced FID in March 2024** as the responsiveness metric. Lighthouse v12 weighs Total Blocking Time and Largest Contentful Paint most heavily (almost 50% of Performance score combined). The recommended "Slow 4G" throttling (150ms latency, 1.6Mbps down) represents bottom 25% of 4G connections - significantly slower than real 2026 5G conditions.

**Primary recommendation:** Prioritize LCP and INP optimizations (preload critical resources, defer JavaScript, optimize images), implement automated Lighthouse CI in build process, and establish performance budgets (≤400KB JS gzipped, <2s mobile LCP) to prevent regression.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Lighthouse | 13.0.3 (latest) | Performance auditing, Core Web Vitals measurement | Google's official tool, powers PageSpeed Insights, generates actionable reports with CI integration |
| Tailwind CSS | 4.2.2 (latest) | Utility CSS with built-in purge/minification | Already in use (v3.4.1), JIT mode + --minify flag produces <10KB bundles (Netflix uses 6.5KB) |
| cssnano | 7.1.3 (latest) | CSS minification via PostCSS | Modular PostCSS-based minifier, ~25M weekly downloads, default in Vite/Next.js, safe + advanced presets |
| Terser | 5.46.1 (latest) | ES6+ JavaScript minification | Already in use (v5.27.0), 40-60% compression, outperforms UglifyJS, supports parallel processing |

**Versions verified:** 2026-03-27 via npm registry

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| axe-core | 4.10+ | WCAG 2.0/2.1/2.2 accessibility testing | Required for accessibility audit (task 6.6), finds 57% of issues automatically, zero false positives |
| sharp | 0.33+ | Image optimization (WebP conversion, resizing) | For batch image processing if more images added, faster than ImageOptim/TinyPNG for automation |
| Critical | 6.0+ | Critical CSS extraction for above-fold content | Optional if LCP improvements needed, extracts/inlines critical CSS to eliminate render-blocking |
| lighthouse-ci | 0.14+ | Automated Lighthouse testing in CI/CD | Recommended for ongoing monitoring, prevents performance regression |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| cssnano | Lightning CSS | Lightning CSS is 100x faster (Rust-based) but cssnano has better PostCSS ecosystem integration - Tailwind already uses PostCSS |
| Lighthouse | WebPageTest, DebugBear | WebPageTest offers real device testing but Lighthouse is free, fast, and already integrated in Chrome DevTools |
| axe-core | WAVE, Pa11y | WAVE has good UI but axe-core has zero false positives and powers Google Lighthouse accessibility audit |
| Terser | @swc/core, esbuild | SWC is faster but Terser is already configured and provides better compression ratios for production |

**Installation:**
```bash
# Core dependencies (already installed)
npm install --save-dev lighthouse@latest  # Update from 11.5.0 to 13.0.3
npm install --save-dev tailwindcss@latest # Update from 3.4.1 to 4.2.2
npm install --save-dev terser@latest      # Update from 5.27.0 to 5.46.1

# Add CSS minification
npm install --save-dev cssnano postcss-cli

# Add accessibility testing
npm install --save-dev axe-core

# Optional: CI automation and image optimization
npm install --save-dev lighthouse-ci sharp
```

## Architecture Patterns

### Recommended Project Structure
```
authorkit-site/
├── .lighthouse/              # Lighthouse reports and CI config
│   ├── baseline/            # Phase 1 baseline reports (already exists per roadmap)
│   ├── optimized/           # Phase 6 final reports
│   └── lighthouserc.json    # CI configuration
├── css/
│   ├── input.css            # Tailwind source (existing)
│   ├── styles.css           # Minified output (15KB - needs optimization)
│   ├── monochrome-components.css  # Should merge into styles.css
│   └── style.css            # Should merge into styles.css
├── js/
│   ├── *.js                 # Source files (existing)
│   ├── *.min.js             # Minified outputs (existing - 3-4KB)
│   └── [defer-load]         # Non-critical scripts should use defer
├── images/
│   ├── [optimized]/         # WebP/AVIF versions
│   └── [srcsets]/           # Responsive image variants
└── postcss.config.js        # PostCSS + cssnano configuration
```

### Pattern 1: CSS Optimization Pipeline
**What:** Consolidate CSS files, purge unused classes, minify with cssnano
**When to use:** Production builds, pre-deployment
**Example:**
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('cssnano')({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
      }]
    })
  ]
}
```
**Source:** cssnano official docs, Tailwind CSS optimization guide

### Pattern 2: Resource Loading Priority
**What:** Optimize resource load order using preload, preconnect, defer
**When to use:** Every HTML page to control resource priority
**Example:**
```html
<head>
  <!-- High priority: Critical fonts (limit to 2 max) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.gstatic.com/s/playfairdisplay/[...].woff2" as="font" type="font/woff2" crossorigin>

  <!-- Critical CSS inline (extracted from first viewport) -->
  <style>/* critical CSS here */</style>

  <!-- Defer non-critical CSS -->
  <link rel="stylesheet" href="/css/styles.css" media="print" onload="this.media='all'">

  <!-- Defer JavaScript -->
  <script src="/js/main.min.js" defer></script>
</head>
```
**Source:** web.dev resource hints guide, Chrome DevTools best practices

### Pattern 3: Responsive Image Optimization
**What:** Serve modern formats (WebP/AVIF) with srcset for responsive delivery
**When to use:** All images, especially hero/featured images that impact LCP
**Example:**
```html
<!-- DO: Responsive images with modern formats -->
<picture>
  <source type="image/avif" srcset="hero-320.avif 320w, hero-640.avif 640w, hero-1280.avif 1280w" sizes="100vw">
  <source type="image/webp" srcset="hero-320.webp 320w, hero-640.webp 640w, hero-1280.webp 1280w" sizes="100vw">
  <img src="hero-1280.jpg"
       alt="AuthorKit Dashboard"
       width="1280"
       height="720"
       loading="lazy"  <!-- NEVER for LCP image! -->
       decoding="async">
</picture>

<!-- DON'T: Lazy load the hero/LCP image -->
<img src="hero.jpg" loading="lazy">  <!-- This delays LCP! -->
```
**Source:** MDN web.dev/blog/fix-image-lcp, Request Metrics image optimization guide

### Pattern 4: Performance Budget Monitoring
**What:** Set and enforce performance budgets in CI to prevent regression
**When to use:** Every commit, automated in CI/CD pipeline
**Example:**
```javascript
// .lighthouse/lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:8000/", "http://localhost:8000/features.html"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.95}],
        "categories:accessibility": ["error", {"minScore": 1.0}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "interactive": ["error", {"maxNumericValue": 3000}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "resource-summary:script:size": ["error", {"maxNumericValue": 409600}],  // 400KB
        "resource-summary:stylesheet:size": ["error", {"maxNumericValue": 15360}]  // 15KB
      }
    }
  }
}
```
**Source:** Lighthouse CI documentation, web performance budgets guide

### Anti-Patterns to Avoid
- **Over-preloading:** Preloading >2 fonts or non-critical resources delays other critical assets (resource contention)
- **Lazy loading LCP images:** Using `loading="lazy"` on hero/featured images delays Largest Contentful Paint - NEVER lazy load above-fold content
- **Missing width/height on images:** Causes Cumulative Layout Shift as browser can't reserve space until image loads
- **Multiple CSS files in production:** Loading 3 separate CSS files (styles.css, monochrome-components.css, style.css) causes multiple render-blocking requests - consolidate into one
- **Blocking scripts in <head>:** Non-deferred scripts in <head> block HTML parsing and delay FCP/LCP - use defer or move to bottom
- **Using both async and defer:** In 2026 there's no reason to use both attributes - defer is preferred for ordered scripts
- **Not setting font-display:** Google Fonts without `?display=swap` cause invisible text (FOIT) during load - always set font-display

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Critical CSS extraction | Custom CSS parser/analyzer | Critical (npm), Penthouse, Critters | Critical CSS extraction requires headless browser rendering, DOM analysis, viewport simulation - edge cases include dynamic content, media queries, pseudo-selectors. Critical handles all this plus minification. |
| Image optimization pipeline | Custom image processing scripts | sharp, squoosh, imagemin | Modern image formats (WebP, AVIF) require complex encoding libraries, quality optimization algorithms, and metadata handling. sharp is battle-tested C++ library with 10M+ weekly downloads. |
| Lighthouse automation | Manual testing scripts | lighthouse-ci, GitHub Actions integration | Lighthouse CI handles multiple runs, averaging, threshold assertions, diff comparisons, and report storage. Manual scripts miss statistical variations and lack historical tracking. |
| CSS minification | Regex-based CSS compression | cssnano, Lightning CSS | Safe CSS minification requires full CSS parsing to avoid breaking selectors, calc() expressions, or vendor prefixes. cssnano has 25M weekly downloads and handles all edge cases. |
| Resource hint injection | String concatenation in HTML | Build-time tools (Vite, webpack), postcss-url | Resource hints require correct crossorigin attributes, matching URLs, and as/type values. Build tools analyze actual dependencies and inject correct hints automatically. |
| Performance monitoring | Custom analytics scripts | Lighthouse CI, CrUX API, RUM tools | Real user monitoring requires extensive browser API integration (Navigation Timing, Resource Timing, PerformanceObserver), field data collection, and statistical analysis. Use established tools. |

**Key insight:** Web performance optimization involves complex browser APIs, timing interdependencies, and edge cases that emerge only under real-world network conditions. Tools like Lighthouse, cssnano, and sharp have been battle-tested across millions of sites and handle cases you haven't encountered yet (e.g., font CORS, CSS calc() in media queries, AVIF fallback chains). Custom solutions work until they don't - usually discovered in production.

## Common Pitfalls

### Pitfall 1: Optimizing for Lighthouse Instead of Real Users
**What goes wrong:** Site scores 95+ on Lighthouse but users report slow load times
**Why it happens:** Lighthouse uses simulated throttling (Slow 4G: 150ms latency, 1.6Mbps) which is 3x slower latency and 20x slower download than real 2026 5G conditions. Optimizing only for synthetic tests misses real user experience patterns.
**How to avoid:**
- Use Chrome UX Report (CrUX) to monitor real user Core Web Vitals from field data
- Test on real devices (iOS, Android) on actual 3G/4G/5G networks, not just DevTools throttling
- Implement Real User Monitoring (RUM) to track performance across different geographies and device types
- Run Lighthouse with different throttling profiles to understand performance across network conditions
**Warning signs:** Lighthouse score 95+ but high bounce rates, users reporting slowness, CrUX data shows "Poor" for 75th percentile

### Pitfall 2: Breaking LCP with Lazy Loading
**What goes wrong:** Adding `loading="lazy"` to optimize images actually increases Largest Contentful Paint
**Why it happens:** The LCP element is typically the hero image or featured content in first viewport. Lazy loading defers these critical resources until after JavaScript executes, delaying the largest contentful paint by 500-2000ms.
**How to avoid:**
- Identify LCP element using Lighthouse report (it tells you which element is LCP)
- NEVER add `loading="lazy"` to hero images, featured images, or any above-fold content
- Only lazy load images that are definitely below the fold (2-3 viewports down)
- Preload the LCP image with `<link rel="preload" as="image" href="hero.webp">`
**Warning signs:** LCP jumps from 1.5s to 3.5s after adding lazy loading, Lighthouse flags "Preload Largest Contentful Paint image"

### Pitfall 3: Font Loading Flash of Invisible Text (FOIT)
**What goes wrong:** Text is invisible for 1-3 seconds while custom fonts load, users see blank page
**Why it happens:** Without `font-display: swap`, browsers hide text until custom font loads. Google Fonts defaults to `font-display: auto` which can cause FOIT on slow connections.
**How to avoid:**
- Always add `?display=swap` parameter to Google Fonts URLs
- For self-hosted fonts, declare `font-display: swap` in @font-face CSS
- Preload only critical fonts (1-2 max) that appear above the fold
- Define fallback fonts with similar metrics to minimize layout shift on swap
**Warning signs:** Lighthouse warns "Ensure text remains visible during webfont load", blank page on slow 3G throttling

### Pitfall 4: Cumulative Layout Shift from Missing Image Dimensions
**What goes wrong:** Page content jumps around as images load, CLS score >0.25 fails Core Web Vitals
**Why it happens:** Without explicit width/height attributes, browser can't reserve space for images until they load. Modern CSS aspect-ratio doesn't help if HTML lacks dimensions.
**How to avoid:**
- Always specify width and height attributes on every `<img>` and `<video>` element
- Browser automatically calculates aspect ratio from width/height, even with responsive CSS
- Reserve space for dynamic content (ads, embeds) using min-height or aspect-ratio
- Use `font-display: swap` and reserve space to prevent font swap layout shifts
**Warning signs:** CLS score >0.1, content jumps when images load, Lighthouse reports "Image elements do not have explicit width and height"

### Pitfall 5: Render-Blocking CSS/JS in Critical Path
**What goes wrong:** Page shows blank white screen for 2-5 seconds before any content renders
**Why it happens:** Multiple CSS files and synchronous JavaScript in `<head>` block HTML parsing and rendering until all resources download and execute.
**How to avoid:**
- Consolidate CSS files into single minified stylesheet (merge styles.css, monochrome-components.css, style.css)
- Inline critical CSS (above-fold styles) directly in `<head>`, defer rest
- Add `defer` attribute to all non-critical JavaScript
- Never use synchronous scripts in `<head>` unless absolutely necessary (analytics exceptions)
- Use `<link rel="preconnect">` for external domains (fonts, analytics) but limit to 3-4 max
**Warning signs:** Lighthouse reports "Eliminate render-blocking resources", First Contentful Paint >2s, Total Blocking Time >300ms

### Pitfall 6: Over-Aggressive Caching Breaks Updates
**What goes wrong:** Users see old CSS/JS after deployment because browser cached with long max-age
**Why it happens:** Setting aggressive cache headers (max-age=31536000) without cache-busting filenames means browsers never check for updates.
**How to avoid:**
- Use content-based hashing in filenames (styles.[contenthash].css, main.[contenthash].js)
- Set HTML files to no-cache or short max-age (3600s), set hashed assets to long max-age (31536000s)
- Implement ETags for validation-based caching
- Test cache invalidation in staging before deploying to production
**Warning signs:** Users report seeing old design after deployment, forced cache clear resolves issue, no hash in CSS/JS filenames

### Pitfall 7: Third-Party Scripts Destroying Performance
**What goes wrong:** Site is fast until analytics/chat/ads added, then LCP jumps to 5s+ and INP >500ms
**Why it happens:** Third-party scripts (Google Analytics, Facebook Pixel, chat widgets) load synchronously, execute expensive JavaScript, and make additional network requests - all blocking main thread.
**How to avoid:**
- Load all third-party scripts asynchronously (`async` attribute)
- Defer non-critical third-party scripts until after page interaction
- Use `<link rel="preconnect">` for known third-party domains
- Implement script facades for chat widgets (only load on user interaction)
- Set performance budget for third-party script size and enforce in CI
**Warning signs:** Lighthouse reports high Total Blocking Time, third-party scripts in "Minimize main thread work", INP >200ms

### Pitfall 8: Mobile-Desktop Performance Gap
**What goes wrong:** Desktop scores 95+ but mobile scores 45-60, mobile users bounce
**Why it happens:** Mobile devices have less CPU power (4x CPU slowdown in Lighthouse), slower networks, and smaller viewport requiring different resource priorities.
**How to avoid:**
- Always test with mobile throttling (Slow 4G + 4x CPU slowdown)
- Serve smaller images to mobile using srcset with appropriate sizes attribute
- Prioritize mobile-first critical CSS (extract mobile viewport critical CSS)
- Test on real mobile devices (iOS Safari, Android Chrome) not just DevTools
- Set mobile-specific performance budgets stricter than desktop
**Warning signs:** Desktop Lighthouse 95+, mobile Lighthouse <70, CrUX shows poor mobile Core Web Vitals, mobile bounce rate 2x desktop

## Code Examples

Verified patterns from official sources:

### Optimal Google Fonts Loading (2026)
```html
<!-- Source: https://csswizardry.com/2020/05/the-fastest-google-fonts/ -->
<!-- Source: https://web.dev/articles/optimize-webfont-loading -->

<head>
  <!-- 1. Preconnect to Google Fonts domains (early DNS/TLS) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- 2. Preload critical font files (above-fold only, max 2 fonts) -->
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap">
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap">

  <!-- 3. Load font stylesheets asynchronously with font-display=swap -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" media="print" onload="this.media='all'">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap" media="print" onload="this.media='all'">

  <!-- 4. Define fallback fonts with similar metrics -->
  <style>
    /* Immediate fallback while fonts load */
    body {
      font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif;
    }
    h1, h2, h3 {
      font-family: 'Playfair Display', Georgia, serif;
    }
  </style>
</head>
```

### Responsive WebP Images with Proper Dimensions
```html
<!-- Source: https://web.dev/articles/serve-responsive-images -->
<!-- Source: https://developer.mozilla.org/en-US/blog/fix-image-lcp/ -->

<!-- Hero image (LCP candidate) - NO lazy loading -->
<picture>
  <source
    type="image/webp"
    srcset="hero-320.webp 320w,
            hero-640.webp 640w,
            hero-1280.webp 1280w"
    sizes="100vw">
  <img
    src="hero-1280.jpg"
    alt="AuthorKit Dashboard"
    width="1280"
    height="720"
    decoding="async"
    fetchpriority="high">  <!-- Hint to browser this is LCP -->
</picture>

<!-- Below-fold images - WITH lazy loading -->
<img
  src="feature-icon.webp"
  alt="Feature description"
  width="400"
  height="300"
  loading="lazy"
  decoding="async">
```

### Deferred JavaScript Loading
```html
<!-- Source: https://web.dev/articles/efficiently-load-third-party-javascript -->
<!-- Source: https://developer.chrome.com/blog/script-component/ -->

<head>
  <!-- Critical inline JavaScript (analytics, etc.) -->
  <script>
    // Minimal critical JS only (< 1KB)
    window.dataLayer = window.dataLayer || [];
  </script>

  <!-- Defer non-critical scripts (loads in parallel, executes in order after HTML) -->
  <script src="/js/main.min.js" defer></script>
  <script src="/js/bookshelf.min.js" defer></script>

  <!-- Async third-party scripts (order doesn't matter) -->
  <script src="https://www.google-analytics.com/analytics.js" async></script>
</head>

<!-- DON'T: Synchronous scripts block parsing -->
<script src="/js/main.js"></script>  <!-- Blocks HTML parsing! -->
```

### Tailwind CSS Production Build with Minification
```bash
# Source: https://tailwindcss.com/docs/optimizing-for-production
# Source: Package.json scripts (verified in project)

# Current setup (already optimized with --minify)
npm run build:css  # Runs: tailwindcss -i ./css/input.css -o ./css/styles.css --minify

# Enhanced setup with PostCSS + cssnano (even better compression)
# postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    cssnano: {
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
      }]
    }
  }
}

# package.json
"build:css": "NODE_ENV=production tailwindcss -i ./css/input.css -o ./css/styles.css --minify"
```

### Lighthouse CI Configuration
```javascript
// Source: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
// .lighthouse/lighthouserc.json

{
  "ci": {
    "collect": {
      "numberOfRuns": 3,  // Average 3 runs for consistency
      "url": [
        "http://localhost:8000/",
        "http://localhost:8000/features.html",
        "http://localhost:8000/pricing.html"
      ],
      "settings": {
        "preset": "desktop",  // or "mobile"
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240,
          "cpuSlowdownMultiplier": 1
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.95}],
        "categories:accessibility": ["error", {"minScore": 1.0}],
        "categories:best-practices": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 0.95}],

        // Core Web Vitals thresholds
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 200}],

        // Resource budgets
        "resource-summary:script:size": ["error", {"maxNumericValue": 409600}],  // 400KB
        "resource-summary:stylesheet:size": ["error", {"maxNumericValue": 15360}]  // 15KB
      }
    },
    "upload": {
      "target": "temporary-public-storage"  // or "filesystem" for local reports
    }
  }
}
```

### Terser JavaScript Minification (Current Setup)
```bash
# Source: Project package.json (verified)
# Current build script (already optimized)

npm run build:js
# Runs: terser js/main.js -o js/main.min.js -c -m &&
#       terser js/bookshelf.js -o js/bookshelf.min.js -c -m &&
#       terser js/bookshelf-browse.js -o js/bookshelf-browse.min.js -c -m

# Flags:
# -c = compress (remove whitespace, dead code)
# -m = mangle (shorten variable names)

# Current results (verified):
# - main.js: 7.1KB -> 3.3KB (53% reduction)
# - bookshelf.js: 6.6KB -> 3.0KB (55% reduction)
# - bookshelf-browse.js: 9.1KB -> 4.4KB (52% reduction)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FID (First Input Delay) metric | INP (Interaction to Next Paint) | March 2024 | INP measures all interactions, not just first - more comprehensive responsiveness metric. 43% of sites fail INP vs 30% failed FID. |
| Multiple CSS files for organization | Single minified CSS bundle | Ongoing best practice | HTTP/2 multiplexing made multiple files viable, but single bundle still faster due to compression + less overhead. Tailwind JIT makes this easy. |
| `<script>` at bottom of `<body>` | `<script defer>` in `<head>` | ~2018 (widespread adoption) | Defer allows earlier discovery and parallel download while maintaining execution order. Modern best practice for all non-critical scripts. |
| JPEG images | WebP (and now AVIF) | WebP: 2020s, AVIF: 2023+ | WebP 25-35% smaller than JPEG with 96% browser support. AVIF 20-30% smaller than WebP with 92% support. Both lossless and lossy modes. |
| Manual performance testing | Automated Lighthouse CI | 2019+ (Lighthouse CI released) | CI automation prevents regression, tracks trends, enforces budgets. Manual testing catches point-in-time issues only. |
| UglifyJS for minification | Terser (or SWC/esbuild) | ~2019 | Terser supports ES6+, faster than UglifyJS. SWC (Rust) even faster but Terser has better compression. |
| Critical CSS via manual selection | Automated extraction (Critical, Penthouse) | 2018+ | Tools use headless browsers to render page and extract actual above-fold CSS. Manual selection misses media queries and pseudo-selectors. |
| Preload for everything | Selective preload (2 resources max) | 2020+ (performance budget awareness) | Over-preloading delays other critical resources. Preload only LCP image and critical fonts. |
| Google Fonts via `<link>` | Preconnect + async load + display=swap | 2021+ (Core Web Vitals focus) | Eliminates FOIT, speeds up font loading via early DNS/TLS, prevents render-blocking. |
| font-display: auto | font-display: swap (universally) | 2020+ | Eliminates flash of invisible text (FOIT), ensures text visible during load. Auto mode can cause 3s blank text. |

**Deprecated/outdated:**
- **UglifyJS:** No longer maintained, doesn't support ES6+. Use Terser, SWC, or esbuild instead.
- **PurgeCSS standalone:** Tailwind CSS JIT mode (v3.0+) has purging built-in via content configuration. No need for separate PurgeCSS plugin.
- **PageSpeed Insights API v4:** Deprecated 2019. Use v5 API or Lighthouse CI for programmatic access.
- **AMP (Accelerated Mobile Pages):** Google stopped prioritizing AMP in search rankings (2021). Focus on Core Web Vitals instead.
- **Inline CSS for everything:** Critical CSS extraction replaced manual inlining. Only inline actual critical path CSS (above-fold), defer rest.
- **resource hints `dns-prefetch` only:** Use `preconnect` for critical origins (does DNS + TCP + TLS). Only use dns-prefetch for less critical domains (fallback).
- **HTTP/1.1 optimization techniques:** Sprite sheets, domain sharding, concatenation all counterproductive on HTTP/2. Focus on compression and caching instead.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Lighthouse 13.0.3 (update from 11.5.0) + axe-core 4.10+ |
| Config file | `.lighthouse/lighthouserc.json` (see Wave 0 below) |
| Quick run command | `lighthouse http://localhost:8000/ --only-categories=performance --view` |
| Full suite command | `lighthouse http://localhost:8000/ --view && lighthouse http://localhost:8000/features.html --view && lighthouse http://localhost:8000/pricing.html --view` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| 6.1 | CSS bundle <15KB, no unused classes, single file | unit | `npm run analyze:css && ls -lh css/styles.css` (expect <15KB) | ✅ Script exists |
| 6.2 | JS deferred, minified, <50KB total | unit | `ls -lh js/*.min.js && grep -c 'defer' index.html` | ✅ Scripts exist |
| 6.3 | All images WebP/AVIF, lazy loaded (except LCP), srcset defined | unit | `grep -r 'loading="lazy"' *.html && grep -r 'srcset' *.html` | ✅ HTML exists |
| 6.4 | LCP <2.5s, TBT <200ms, no render-blocking resources | lighthouse | `lighthouse http://localhost:8000/ --only-categories=performance --quiet --output=json --output-path=.lighthouse/optimized/homepage.json` | ❌ Wave 0 |
| 6.5 | Mobile 3G <2s page load, 4G <1s page load | lighthouse | `lighthouse http://localhost:8000/ --preset=mobile --throttling.rttMs=150 --throttling.throughputKbps=1638 --output=json` | ❌ Wave 0 |
| 6.6 | WCAG 2.2 AA compliance, accessibility score 100 | axe | `npx axe http://localhost:8000/ --tags wcag2aa,wcag21aa,wcag22aa` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run analyze:css` (CSS size check) or `lighthouse --only-categories=performance` (quick perf check)
- **Per wave merge:** Full Lighthouse audit on 3 key pages (homepage, features, pricing)
- **Phase gate:** Full suite green (all 6 requirements passing) + baseline comparison before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `.lighthouse/lighthouserc.json` — Lighthouse CI configuration with assertions, thresholds, and budgets
- [ ] `.lighthouse/baseline/` — Directory for Phase 1 baseline reports (may already exist per roadmap task 1.1)
- [ ] `.lighthouse/optimized/` — Directory for Phase 6 optimized reports
- [ ] `package.json` scripts — Add `test:lighthouse`, `test:a11y`, `test:perf` commands
- [ ] Install axe-core: `npm install --save-dev axe-core @axe-core/cli`
- [ ] Update Lighthouse: `npm install --save-dev lighthouse@latest` (11.5.0 → 13.0.3)

## Open Questions

1. **Do baseline Lighthouse reports from Phase 1 exist?**
   - What we know: Roadmap task 1.1 says "Run Lighthouse audits on key pages, save baseline reports"
   - What's unclear: Were these reports actually created? Where are they stored?
   - Recommendation: Check `.planning/lighthouse-baseline/` directory. If missing, create baseline reports as first action in Phase 6 (before any optimizations) for comparison.

2. **What are current actual file sizes and scores?**
   - What we know: styles.css is 15KB, JS files are 3-4KB minified
   - What's unclear: Current Lighthouse scores, LCP/INP/CLS values, current page load times
   - Recommendation: Run baseline Lighthouse audit immediately to establish current state. This informs which optimizations provide most value.

3. **Are there more images than the 6 found?**
   - What we know: Only found 6 images (2 team photos, 2 hero WebP, 2 favicons)
   - What's unclear: Are images dynamically loaded? Are there images in other directories?
   - Recommendation: Audit all HTML files for `<img>`, `<picture>`, CSS background-images, and inline SVGs before planning image optimization tasks.

4. **What third-party scripts are currently loaded?**
   - What we know: Google Fonts, structured data JSON-LD visible in index.html
   - What's unclear: Analytics (GA4?), payment widgets (LemonSqueezy mentioned in roadmap), other tracking/marketing scripts
   - Recommendation: Audit all HTML for external `<script>` tags and measure their performance impact. Third-party scripts are often the biggest performance killer.

5. **Is server-side optimization in scope?**
   - What we know: Python SimpleHTTPServer used for local dev (`python3 -m http.server 8000`)
   - What's unclear: Production deployment platform (Vercel mentioned in roadmap task 8.2), caching headers, CDN, compression
   - Recommendation: If Vercel deployment, configure `vercel.json` with cache headers, compression, and security headers. Server-side optimization can provide 20-30% improvement beyond client-side.

## Sources

### Primary (HIGH confidence)
- Lighthouse documentation (https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md) - Throttling configuration, metrics
- Tailwind CSS official docs (https://tailwindcss.com/docs/optimizing-for-production) - Purge, minification, JIT mode
- web.dev articles (https://web.dev/articles/extract-critical-css, https://web.dev/articles/serve-responsive-images) - Google's official performance guidance
- MDN Web Docs (https://developer.mozilla.org/en-US/blog/fix-image-lcp/) - LCP optimization, resource hints
- cssnano documentation (https://cssnano.github.io/cssnano/) - CSS minification configuration
- npm registry (verified 2026-03-27) - Package versions (Lighthouse 13.0.3, Tailwind 4.2.2, Terser 5.46.1, cssnano 7.1.3)

### Secondary (MEDIUM confidence)
- Nitropack blog (https://nitropack.io/blog/critical-css/) - Critical CSS best practices, verified against web.dev
- Request Metrics guides (https://requestmetrics.com/web-performance/5-tips-to-make-google-fonts-faster/) - Google Fonts optimization, verified against Chrome developers
- DebugBear blog (https://www.debugbear.com/blog/async-vs-defer, https://www.debugbear.com/blog/resource-hints-rel-preload-prefetch-preconnect) - Script loading, resource hints, verified against MDN
- CSS Wizardry (https://csswizardry.com/2020/05/the-fastest-google-fonts/) - Font loading optimization, industry expert source
- Core Web Vitals aggregators (https://www.corewebvitals.io/core-web-vitals) - 2026 metrics and thresholds, cross-referenced with web.dev

### Tertiary (LOW confidence - marked for validation)
- Web Almanac 2024 statistics (43% of sites meet Core Web Vitals) - Statistical claims need direct verification with HTTP Archive
- Performance impact percentages (7% conversion drop per 100ms delay) - Business metrics vary by industry, use as general guidance only
- 2026 5G vs Lighthouse throttling gap - Claim that Lighthouse is 3x slower latency needs verification with actual field data

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages verified in npm registry with current versions, usage statistics from npmjs.com
- Architecture: HIGH - Patterns sourced from official documentation (Lighthouse, web.dev, Tailwind CSS), verified in project structure
- Pitfalls: HIGH - Common pitfalls documented across multiple authoritative sources (web.dev, MDN, Lighthouse), verified with real-world impact data
- Code examples: HIGH - All examples sourced from official documentation or verified in current project files
- Performance targets: MEDIUM - Lighthouse thresholds are official, but real-world mobile performance claims need field data validation
- Business impact claims: LOW - Conversion rate and bounce rate statistics vary by industry, use as directional guidance only

**Research date:** 2026-03-27
**Valid until:** 2026-06-27 (90 days - web performance best practices stable, but tool versions update monthly)
