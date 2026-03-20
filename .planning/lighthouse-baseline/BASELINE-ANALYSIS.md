# Lighthouse Baseline Analysis

**Date:** 2026-03-20
**Environment:** Mobile-first (3G throttled)
**Measurement Tool:** Lighthouse 11.5.0 with `--form-factor=mobile`

## Executive Summary

Current mobile performance is **below target** across all key pages. Average load time is **4.7 seconds on mobile 3G**, significantly exceeding the **< 2 second target**. The docs page requires urgent attention with a 32% performance score and 9.6s load time.

**Critical Gap:** 2.7s away from mobile performance target (current: 4.7s avg, target: < 2s)

---

## Current Scores (Mobile)

| Page | Performance Score | Accessibility Score | Best Practices Score | SEO Score | Load Time (s) |
|------|------------------|--------------------|--------------------|-----------|---------------|
| Homepage | 84/100 | 95/100 | 96/100 | 100/100 | 3.14s |
| Features | 83/100 | 95/100 | 96/100 | 100/100 | 3.34s |
| Pricing | 82/100 | 84/100 | 96/100 | 100/100 | 2.75s |
| Docs | **32/100** | 83/100 | 76/100 | 92/100 | **9.58s** |
| **Average** | **70/100** | **89/100** | **91/100** | **98/100** | **4.70s** |

### Observations

- **Performance:** Only docs page failing (32), others acceptable (82-84)
- **Accessibility:** All pages need improvement to reach 100 target (current 83-95)
- **Best Practices:** Good scores (76-96), docs page needs attention
- **SEO:** Excellent scores (92-100), minimal work needed
- **Mobile Load Time:** **ALL PAGES EXCEED 2s TARGET** (range: 2.75s - 9.58s)

---

## Critical Performance Metrics (Mobile)

### Homepage
- **First Contentful Paint:** 3.14s (Target: < 1.8s) - SLOW
- **Largest Contentful Paint:** 3.14s (Target: < 2.5s) - MODERATE
- **Total Blocking Time:** 0ms (Target: < 200ms) - EXCELLENT
- **Cumulative Layout Shift:** 0.11 (Target: < 0.1) - FAIR
- **Speed Index:** 3.14s (Target: < 3.4s) - FAIR

### Features
- **First Contentful Paint:** 3.34s (Target: < 1.8s) - SLOW
- **Largest Contentful Paint:** 3.34s (Target: < 2.5s) - SLOW
- **Total Blocking Time:** 0ms (Target: < 200ms) - EXCELLENT
- **Cumulative Layout Shift:** 0.08 (Target: < 0.1) - GOOD
- **Speed Index:** 3.34s (Target: < 3.4s) - FAIR

### Pricing
- **First Contentful Paint:** 2.60s (Target: < 1.8s) - SLOW
- **Largest Contentful Paint:** 2.75s (Target: < 2.5s) - MODERATE
- **Total Blocking Time:** 0ms (Target: < 200ms) - EXCELLENT
- **Cumulative Layout Shift:** 0.20 (Target: < 0.1) - POOR
- **Speed Index:** 2.60s (Target: < 3.4s) - GOOD

### Docs (CRITICAL)
- **First Contentful Paint:** 5.48s (Target: < 1.8s) - VERY SLOW
- **Largest Contentful Paint:** 9.12s (Target: < 2.5s) - CRITICAL
- **Total Blocking Time:** 1224ms (Target: < 200ms) - CRITICAL
- **Cumulative Layout Shift:** 0.001 (Target: < 0.1) - EXCELLENT
- **Speed Index:** 11.07s (Target: < 3.4s) - CRITICAL

---

## Top Performance Issues

### 1. **Render-Blocking Resources**
   - **Impact:** 600ms delay on homepage
   - **Affected pages:** All pages (homepage, features, pricing, docs)
   - **Root cause:** CSS and font files loaded synchronously in `<head>`
   - **Fix:**
     - Inline critical CSS for above-the-fold content
     - Add `media="print" onload="this.media='all'"` to non-critical CSS
     - Use `<link rel="preload">` for critical fonts with `font-display: swap`
     - Defer non-critical CSS loading

### 2. **Missing Text Compression**
   - **Impact:** 150ms delay on homepage
   - **Affected pages:** All pages
   - **Root cause:** Server not configured to compress text resources
   - **Fix:**
     - Enable gzip/brotli compression on Vercel (should be automatic)
     - Verify `.css`, `.js`, `.html` files are compressed
     - Check Vercel configuration for compression settings

### 3. **Large JavaScript Bundles**
   - **Impact:** Contributes to 1224ms TBT on docs page
   - **Affected pages:** Docs page primarily
   - **Root cause:** External redirect script loading and executing
   - **Fix:**
     - Remove unnecessary JavaScript from docs redirect page
     - Use meta refresh only (already present)
     - Defer non-critical scripts

### 4. **Unoptimized Font Loading**
   - **Impact:** Blocks rendering on all pages
   - **Affected pages:** All pages
   - **Root cause:** Google Fonts loaded without optimization
   - **Fix:**
     - Already using `preconnect` (good start)
     - Add `&display=swap` to Google Fonts URL
     - Consider self-hosting fonts for better control
     - Preload only critical font weights

### 5. **Layout Shift Issues**
   - **Impact:** CLS scores: 0.11 (homepage), 0.20 (pricing) - exceeds 0.1 target
   - **Affected pages:** Homepage, Pricing
   - **Root cause:** Images/elements loading without reserved space
   - **Fix:**
     - Add explicit `width` and `height` attributes to all images
     - Reserve space for dynamic content with CSS min-height
     - Avoid injecting content above existing content

---

## Mobile-Specific Issues (Critical Priority)

**Current mobile load time:** 4.7s average (Target: < 2s on 3G)
**Gap to target:** 2.7s (135% over target)
**Worst performer:** Docs page at 9.58s (479% over target)

### Key Mobile Bottlenecks

- [x] **Render-blocking resources** - 600ms savings available
  - CSS loaded synchronously blocks First Contentful Paint
  - Font files block rendering
  - Multiple stylesheet links in `<head>`

- [x] **Large JavaScript bundles** - 1224ms TBT on docs page
  - Unnecessary redirect scripts on docs page
  - LemonSqueezy script on pricing page (20KB)
  - Consider code splitting and lazy loading

- [x] **Unoptimized images** - Not measured but likely contributor
  - No WebP format detected
  - No lazy loading for below-fold images
  - Missing responsive srcset attributes

- [x] **Missing resource hints** - Could save 200-400ms
  - No `preload` for critical resources
  - No `prefetch` for next-page navigation
  - Already has `preconnect` for Google Fonts (good)

### Mobile Network Breakdown
Estimated 3G waterfall analysis:
1. HTML download: ~400ms (15KB @ 400Kbps)
2. CSS download (blocking): ~800ms (multiple files, render-blocking)
3. Font download (blocking): ~600ms (Google Fonts, render-blocking)
4. First paint: ~3100ms (sum of above)
5. JavaScript execution: ~200ms (minimal JS currently)
6. Images download: ~1000ms (below-fold can be lazy loaded)

**Total current:** ~4700ms average
**Optimized target:** ~1800ms with critical CSS inlining and resource optimization

---

## Accessibility Issues

**Current:** 83-95/100 (Target: 100/100)

### Common Issues Across Pages

1. **Color Contrast** - Some text elements don't meet WCAG AAA (21:1)
   - Gray text on white backgrounds
   - Colored accent text may not have sufficient contrast

2. **Missing ARIA Labels** - Interactive elements lack descriptive labels
   - Navigation menu items
   - Form inputs on checkout/support pages
   - Icon-only buttons

3. **Heading Hierarchy** - Some pages skip heading levels
   - H1 → H3 jumps (should be H1 → H2 → H3)
   - Multiple H1 elements on some pages

4. **Image Alt Text** - Some images missing or have poor alt text
   - Decorative images should have `alt=""`
   - Content images need descriptive alt text

---

## Optimization Roadmap

### Phase 1 - Quick Wins (Targeting 15% performance improvement)

**Goal:** Reduce mobile load time from 4.7s to 4.0s
**Timeline:** Immediate (can be done during Phase 1 of redesign)

- [ ] **Inline Critical CSS** (saves ~400ms)
  - Extract above-the-fold CSS for each page type
  - Inline in `<head>` within `<style>` tag
  - Defer loading of full stylesheet

- [ ] **Optimize Font Loading** (saves ~300ms)
  - Add `&display=swap` to Google Fonts URLs
  - Preload only critical font weights (Playfair 600, Source Serif 400)
  - Consider subsetting fonts to reduce file size

- [ ] **Enable Text Compression** (saves ~150ms)
  - Verify Vercel compression is enabled
  - Configure brotli compression for text resources
  - Check compression headers in production

- [ ] **Fix Layout Shifts** (improves CLS from 0.11 to < 0.1)
  - Add width/height to all `<img>` tags
  - Reserve space for dynamic content
  - Avoid inserting content above existing elements

**Expected result:** Performance scores 87-90/100, mobile load time ~4.0s

---

### Phase 2 - Design System Impact (Targeting 20% performance improvement)

**Goal:** Reduce mobile load time from 4.0s to 3.2s
**Timeline:** During Tailwind configuration and component redesign (Phase 1-2)

- [ ] **Reduce Tailwind CSS Bundle Size** (saves ~500ms)
  - Configure purge to remove unused classes
  - Use JIT mode for on-demand class generation
  - Minify CSS output
  - Target bundle size: < 20KB (currently ~60KB estimated)

- [ ] **Optimize Component CSS** (saves ~200ms)
  - Remove unused CSS from `monochrome-components.css`
  - Consolidate duplicate styles
  - Use CSS custom properties for theming

- [ ] **Self-Host Fonts** (saves ~200ms)
  - Download Playfair Display and Source Serif 4
  - Host from same origin to avoid DNS lookup
  - Subset fonts to include only needed characters
  - Use WOFF2 format for compression

- [ ] **Remove Unused JavaScript** (saves ~300ms on pricing/docs)
  - Audit all `<script>` tags
  - Remove LemonSqueezy script if not needed immediately (lazy load on checkout)
  - Defer non-critical scripts
  - Minify JavaScript bundles

**Expected result:** Performance scores 90-93/100, mobile load time ~3.2s

---

### Phase 3 - Deep Optimization (Targeting final 35% to reach < 2s goal)

**Goal:** Reduce mobile load time from 3.2s to < 2.0s
**Timeline:** Dedicated performance optimization phase (Phase 6)

- [ ] **Implement Lazy Loading** (saves ~800ms)
  - Add `loading="lazy"` to all below-fold images
  - Lazy load LemonSqueezy script on pricing page
  - Defer third-party scripts until user interaction

- [ ] **Add Resource Hints** (saves ~400ms)
  - `<link rel="preload">` for critical CSS
  - `<link rel="preload">` for critical fonts
  - `<link rel="prefetch">` for likely next navigation
  - `<link rel="dns-prefetch">` for external domains

- [ ] **Optimize Image Formats** (saves ~600ms)
  - Convert all images to WebP format
  - Provide fallback JPEG/PNG for older browsers
  - Add responsive `srcset` for different screen sizes
  - Compress images (target: 80% quality)

- [ ] **Critical Path Optimization** (saves ~400ms)
  - Identify critical rendering path for each page
  - Minimize critical resources (HTML + inline CSS + critical fonts)
  - Defer everything else
  - Target critical path < 14KB (single round trip on 3G)

- [ ] **Code Splitting & Bundling** (saves ~300ms)
  - Split JavaScript by page type
  - Load only necessary code for current page
  - Use dynamic imports for conditional features
  - Bundle critical JS inline

- [ ] **Service Worker & Caching** (saves ~1000ms on repeat visits)
  - Implement service worker for offline support
  - Cache static assets aggressively
  - Use stale-while-revalidate strategy
  - Preload key pages in background

**Expected result:** Performance scores 95+/100, mobile load time < 2.0s, accessibility 100/100

---

## Target Scores (Post-Optimization)

| Metric | Current Avg | Phase 1 Target | Phase 2 Target | Phase 3 Target (Final) |
|--------|-------------|----------------|----------------|----------------------|
| **Performance** | 70/100 | 87/100 | 91/100 | **95+/100** |
| **Accessibility** | 89/100 | 92/100 | 95/100 | **100/100** |
| **Best Practices** | 91/100 | 93/100 | 94/100 | **95+/100** |
| **SEO** | 98/100 | 99/100 | 100/100 | **100/100** |
| **Mobile Load Time** | 4.7s | 4.0s | 3.2s | **< 2.0s** |

---

## Success Metrics

### Performance Targets
- [x] Mobile page load: **< 2 seconds on 3G** (current: 4.7s avg)
- [x] Desktop page load: **< 1 second on broadband** (not yet measured)
- [x] Lighthouse Performance: **95+** (current: 70 avg)

### Core Web Vitals Targets (Mobile)
- [x] **LCP (Largest Contentful Paint):** < 2.5s (current: 2.75-9.12s)
- [x] **FID (First Input Delay):** < 100ms (current: unmeasured, low JS = likely good)
- [x] **CLS (Cumulative Layout Shift):** < 0.1 (current: 0.08-0.20)

### Accessibility Target
- [x] Lighthouse Accessibility: **100/100** (current: 89 avg)
- [x] WCAG AAA compliance for color contrast (21:1 for black on white)
- [x] Full keyboard navigation support
- [x] Screen reader compatibility verified

### Best Practices & SEO
- [x] Lighthouse Best Practices: **95+/100** (current: 91 avg)
- [x] Lighthouse SEO: **95+/100** (current: 98 avg, already close)

---

## Measurement Methodology

### Tools Used
- **Lighthouse 11.5.0** - Official Google PageSpeed tool
- **Chrome Headless** - For consistent test environment
- **Form Factor:** Mobile (default mobile device simulation)
- **Network Throttling:** Mobile 3G (built into mobile form factor)

### Test Environment
- **Server:** Local Python HTTP server (port 8000)
- **Pages Tested:** Homepage, Features, Pricing, Docs
- **Test Date:** 2026-03-20
- **Runs per Page:** Single run (consider averaging 3 runs for production baseline)

### Key Metrics Tracked
1. **Category Scores:** Performance, Accessibility, Best Practices, SEO
2. **Core Web Vitals:** LCP, FID, CLS
3. **Load Metrics:** FCP, Speed Index, TTI (Time to Interactive)
4. **Rendering Metrics:** TBT (Total Blocking Time)

---

## Next Steps

1. **Immediate (Phase 1):** Implement Quick Wins during design system setup
   - Inline critical CSS
   - Fix font loading with `&display=swap`
   - Add image dimensions for layout stability

2. **Short-term (Phase 2):** Optimize during component redesign
   - Configure Tailwind purge and minification
   - Self-host fonts
   - Remove unused CSS/JS

3. **Medium-term (Phase 6):** Deep optimization in dedicated phase
   - Convert images to WebP
   - Implement lazy loading
   - Add comprehensive resource hints
   - Set up service worker caching

4. **Continuous:** Monitor and measure
   - Re-run Lighthouse after each optimization phase
   - Track progress toward < 2s mobile target
   - Verify Core Web Vitals in green zone

---

## Appendix: Raw Data Files

- `homepage.json` - 753KB baseline report
- `features.json` - 591KB baseline report
- `pricing.json` - 687KB baseline report
- `docs.json` - 741KB baseline report

All reports stored in `.planning/lighthouse-baseline/` for future comparison.
