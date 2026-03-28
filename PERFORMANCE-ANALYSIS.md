# AuthorKit.pro Performance Analysis & Fix Plan
**Date**: March 28, 2026
**Test Results**: Live site Lighthouse scores

---

## Executive Summary

**Current Status**: 0/4 pages meet 95+ performance target
**Average Score**: 60/100 (35 points short of target)
**Critical Finding**: Site is loading **UNMINIFIED CSS** (39 KB instead of 22 KB)

### Performance Regression Alert 🚨

Recent tests show significant regression vs. March 27 baseline:
- **Homepage**: 58/100 (was ~70, down 12 points)
- **Pricing**: 68/100 (was 83, down 15 points)
- **LCP regression**: Homepage 4.08s (was 2.55s) - **63% slower**

**Root Cause Identified**: Multiple configuration issues in production deployment.

---

## Test Results Comparison

| Page | Perf Score | FCP | LCP | TBT | CLS | Status |
|------|-----------|-----|-----|-----|-----|--------|
| **Homepage** | 58/100 | 4.08s | 4.08s | 0ms | 0.395 | FAILED |
| **Features** | 81/100 | 2.80s | 2.80s | 0ms | 0.205 | FAILED |
| **Pricing** | 68/100 | 3.47s | 3.62s | 0ms | 0.278 | FAILED |
| **Docs** | 34/100 | 6.32s | 8.67s | 1508ms | 0.002 | FAILED |
| **Target** | **95+** | **<1.8s** | **<2.5s** | **<200ms** | **<0.1** | — |

### Key Metrics Analysis

**LCP (Largest Contentful Paint)** - All pages fail:
- Homepage: 4.08s (63% over limit)
- Features: 2.80s (12% over limit)
- Pricing: 3.62s (45% over limit)
- Docs: 8.67s (247% over limit)

**CLS (Cumulative Layout Shift)** - 3/4 pages fail:
- Homepage: 0.395 (295% over limit)
- Features: 0.205 (105% over limit)
- Pricing: 0.278 (178% over limit)
- Docs: 0.002 ✅ PASS

**FCP (First Contentful Paint)** - All pages fail:
- All pages exceed 1.8s target
- Homepage worst at 4.08s

---

## Critical Issues Found

### 1. HTML Files Loading Unminified CSS (CRITICAL) 🔴

**Issue**: All HTML files reference `css/styles.css` (39 KB) instead of `css/styles.min.css` (22 KB)

```html
<!-- Current (WRONG) -->
<link rel="stylesheet" href="css/styles.css">

<!-- Should be (CORRECT) -->
<link rel="stylesheet" href="css/styles.min.css">
```

**Impact**:
- +17 KB unnecessary CSS per page (77% larger)
- +200-300ms additional parsing time
- Directly causes FCP/LCP delays

**Affected Files**: All 66 HTML pages in the site

**Fix Priority**: IMMEDIATE - This single fix will improve all metrics

---

### 2. Google Fonts Blocking Render (CRITICAL) 🔴

**Issue**: Two separate Google Fonts requests block rendering

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap">
```

**Impact**:
- 2 DNS lookups + 2 HTTP requests
- +300-500ms blocking time
- Cannot render until fonts loaded

**Solutions**:
1. **Consolidate**: Combine into single request
2. **Preload**: Add `<link rel="preload">` for critical fonts
3. **Self-host**: Consider hosting fonts locally (future)

---

### 3. Docs Page Immediate Redirect (CRITICAL) 🔴

**Issue**: docs.html loads full page + assets, then immediately redirects

```html
<meta http-equiv="refresh" content="0; url=https://authorkit.gitbook.io/authorkit-documentation">
<script>window.location.replace("https://authorkit.gitbook.io/authorkit-documentation");</script>
```

**Impact**:
- Loads 39 KB CSS + fonts + JS unnecessarily
- LCP: 8.67s (worst on site)
- TBT: 1508ms (7.5x over limit)
- Performance: 34/100

**Fix**: Create minimal redirect-only page without assets

---

### 4. Missing Resource Preload Hints (HIGH) 🟡

**Issue**: No `<link rel="preload">` for critical resources

**Impact**:
- Browser discovers resources late
- +50-100ms LCP delay
- Suboptimal resource prioritization

**Should preload**:
- Critical CSS
- Font files (WOFF2)
- Hero images

---

### 5. CLS from Multiple Sources (HIGH) 🟡

**Issue**: Image dimension fix (task 260328-bjm) only reduced CLS by 10%

**Remaining CLS sources**:
1. **Web fonts loading** (FOUT/FOIT)
   - Playfair Display headings shift layout
   - Source Serif 4 body text shifts

2. **Dynamic header/footer injection**
   - header-loader.js fetches includes/header.html
   - footer-loader.js fetches includes/footer.html
   - Space not reserved during load

3. **Alternating background sections**
   - Recent UI changes added #f4f2ea backgrounds
   - May cause repaint/reflow

**Solutions**:
- Add `font-display: optional` or preload fonts
- Reserve space for header/footer with min-height
- Ensure background colors in initial render

---

### 6. Dead Animation Code (MEDIUM) 🟢

**Issue**: CSS disables animations, but JS still initializes observers

From `js/main.js`:
```javascript
// IntersectionObserver for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-active');
        }
    });
}, observerOptions);
```

But CSS sets:
```css
--transition-none: none;
/* All transitions disabled */
```

**Impact**:
- ~5-10ms wasted execution per page
- Unnecessary DOM observation overhead

**Fix**: Remove animation observers or conditionally load

---

## Build System Analysis Summary

### Current Architecture

**CSS Pipeline**:
```
5 source files → PostCSS/Tailwind → 1 bundle
├── input.css (4.5 KB)
├── design-tokens.css (4.0 KB)
├── monochrome-components.css (14 KB)
├── style.css (7.5 KB)
└── bookshelf.css (18 KB)
         ↓
    styles.css (39 KB) ← UNMINIFIED (being used)
         ↓
    styles.min.css (22 KB) ← MINIFIED (should use)
```

**JavaScript**:
- 3 files always loaded: header-loader.js + footer-loader.js + main.min.js = 6.8 KB
- 2 files conditionally loaded: bookshelf.js + bookshelf-browse.js
- All JS properly minified ✅

**Build Commands**:
```bash
npm run build:css       # Builds unminified (DEV)
npm run build:css:prod  # Builds minified (PROD)
npm run build:js        # Minifies JS ✅
npm run build:prod      # Full production build
```

### Configuration Issues

1. **Wrong CSS reference**: HTML uses dev file instead of prod file
2. **No build automation**: Manual step to use prod CSS
3. **Missing preload hints**: Not generated during build
4. **No critical CSS extraction**: Everything render-blocking

---

## Performance Fix Plan

### Phase 1: Immediate Fixes (Today) - Expected +15-20 points

#### Fix 1.1: Update All HTML to Use Minified CSS
**Impact**: -17 KB CSS, -200-300ms parse time

```bash
# Find all HTML files and update CSS reference
find . -name "*.html" -type f -exec sed -i '' 's|css/styles\.css|css/styles.min.css|g' {} +
```

**Verify**:
```bash
grep -r "css/styles.css" *.html  # Should return nothing
grep -r "css/styles.min.css" *.html  # Should show all files
```

**Expected improvement**:
- FCP: -250ms
- LCP: -200ms
- Performance score: +8-10 points

---

#### Fix 1.2: Consolidate Google Fonts
**Impact**: -1 HTTP request, -150-200ms blocking

**Current** (2 requests):
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap">
```

**Replace with** (1 request):
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@400;600&display=swap">
```

**Expected improvement**:
- FCP: -150ms
- LCP: -100ms
- Performance score: +5-7 points

---

#### Fix 1.3: Create Minimal Docs Redirect Page
**Impact**: Docs page from 34 → 95+ score

Create new lightweight docs.html:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=https://authorkit.gitbook.io/authorkit-documentation">
    <title>Redirecting to Documentation...</title>
    <script>window.location.replace("https://authorkit.gitbook.io/authorkit-documentation");</script>
    <style>
        body {
            font-family: system-ui;
            text-align: center;
            padding: 2rem;
        }
    </style>
</head>
<body>
    <h1>Redirecting to Documentation...</h1>
    <p>If you are not redirected, <a href="https://authorkit.gitbook.io/authorkit-documentation">click here</a>.</p>
</body>
</html>
```

**Expected improvement**:
- Docs performance: 34 → 95+
- LCP: 8.67s → <1s
- TBT: 1508ms → 0ms

---

### Phase 2: Resource Hints (1 hour) - Expected +5-8 points

#### Fix 2.1: Add Preload for Critical CSS

```html
<head>
    <!-- Preload critical CSS before discovery -->
    <link rel="preload" href="css/styles.min.css" as="style">
    <link rel="stylesheet" href="css/styles.min.css">

    <!-- Existing font preconnect -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
```

**Expected improvement**:
- LCP: -50ms
- FCP: -30ms

---

#### Fix 2.2: Preload Font Files Directly

After consolidating fonts, preload WOFF2 files:
```html
<link rel="preload" href="https://fonts.gstatic.com/s/playfairdisplay/..." as="font" type="font/woff2" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/sourceserif4/..." as="font" type="font/woff2" crossorigin>
```

**Expected improvement**:
- LCP: -100ms
- CLS: Reduces font swap shifts

---

### Phase 3: CLS Fixes (2 hours) - Expected +3-5 points

#### Fix 3.1: Reserve Space for Header/Footer

```css
/* Add to styles.min.css or inline in head */
header { min-height: 80px; }
footer { min-height: 200px; }
```

#### Fix 3.2: Add Size Adjust for Fallback Fonts

```css
@font-face {
  font-family: 'Playfair Display Fallback';
  src: local('Georgia');
  size-adjust: 105%;
  ascent-override: 95%;
  descent-override: 35%;
}

@font-face {
  font-family: 'Source Serif 4 Fallback';
  src: local('Georgia');
  size-adjust: 108%;
}

body {
  font-family: 'Source Serif 4', 'Source Serif 4 Fallback', serif;
}

h1, h2, h3 {
  font-family: 'Playfair Display', 'Playfair Display Fallback', serif;
}
```

**Expected CLS improvement**:
- Homepage: 0.395 → 0.08
- Features: 0.205 → 0.06
- Pricing: 0.278 → 0.07

---

### Phase 4: Code Cleanup (1 hour) - Expected +2-3 points

#### Fix 4.1: Remove Dead Animation Code

Edit `js/main.js` and remove:
```javascript
// Remove this entire section (lines ~40-70)
const observer = new IntersectionObserver(...);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
```

#### Fix 4.2: Conditional Bookshelf CSS

Split CSS bundle:
- `styles.min.css` (22 KB) - base styles
- `bookshelf.min.css` (18 KB) - bookshelf-specific

Load bookshelf CSS only on bookshelf pages:
```html
<!-- On bookshelf pages only -->
<link rel="stylesheet" href="css/bookshelf.min.css">
```

**Impact**:
- -18 KB on 90% of pages
- Faster parse on non-bookshelf pages

---

## Expected Results After All Fixes

### Performance Score Projections

| Page | Current | After Phase 1 | After Phase 2-4 | Target |
|------|---------|---------------|-----------------|--------|
| Homepage | 58 | 73-78 | 92-96 | 95+ |
| Features | 81 | 88-91 | 95-98 | 95+ |
| Pricing | 68 | 81-86 | 93-97 | 95+ |
| Docs | 34 | 95+ | 95+ | 95+ |
| **Average** | **60** | **84** | **94-97** | **95+** |

### Core Web Vitals Projections

| Metric | Current | Phase 1 | Final | Target | Status |
|--------|---------|---------|-------|--------|--------|
| **FCP** | 4.08s | 2.7s | 1.5s | <1.8s | ✅ |
| **LCP** | 4.08s | 2.9s | 2.1s | <2.5s | ✅ |
| **TBT** | 1508ms | 0ms | 0ms | <200ms | ✅ |
| **CLS** | 0.395 | 0.350 | 0.07 | <0.1 | ✅ |

---

## Implementation Timeline

### Today (2-3 hours):
- ✅ Phase 1.1: Update HTML CSS references (15 min)
- ✅ Phase 1.2: Consolidate Google Fonts (15 min)
- ✅ Phase 1.3: Fix docs.html redirect (10 min)
- ✅ Test and validate (30 min)
- ✅ Deploy to production (15 min)

### This Week:
- Phase 2: Add resource hints (1 hour)
- Phase 3: Fix CLS issues (2 hours)
- Phase 4: Code cleanup (1 hour)

**Total Effort**: ~6 hours
**Expected Outcome**: All pages 95+ performance score

---

## Validation Plan

After each phase:

```bash
# 1. Build production assets
npm run build:prod

# 2. Test locally first
npm run serve  # Start local server
npm run test:lighthouse:ci  # Run Lighthouse CI

# 3. Deploy to production
# (Your deployment process)

# 4. Test live site
./scripts/test-live-performance.sh

# 5. Compare results
cat .lighthouse/live-*/summary.csv | column -t -s ','
```

---

## Build Process Improvements (Future)

### Recommendation 1: Automate Prod CSS Reference

Create `scripts/prepare-deploy.sh`:
```bash
#!/bin/bash
# Prepare HTML for production deployment
echo "Updating HTML files to use minified CSS..."
find . -name "*.html" -type f -exec sed -i '' 's|css/styles\.css|css/styles.min.css|g' {} +
echo "✓ Production HTML prepared"
```

Add to package.json:
```json
"scripts": {
  "predeploy": "./scripts/prepare-deploy.sh",
  "deploy": "rsync -avz ... authorkit.pro"
}
```

### Recommendation 2: Extract Critical CSS

Add critical CSS extraction to build:
```bash
npm install --save-dev critical
```

Update build script to inline above-fold CSS.

### Recommendation 3: Add Build Verification

```json
"scripts": {
  "verify:prod": "grep -r 'styles\\.min\\.css' *.html && echo '✓ Using minified CSS' || (echo '✗ Not using minified CSS' && exit 1)"
}
```

---

## Root Cause Analysis

**Why did this happen?**

1. **Manual process**: No automated check for prod vs dev CSS
2. **Git tracked HTML**: HTML files in repo with hardcoded CSS paths
3. **Recent CSS rebuilds**: Ran `npm run build:css` (dev) instead of `npm run build:css:prod`
4. **No CI validation**: No automated check that deployed files use minified assets

**Prevention**:
- Add build verification scripts
- Use environment-based asset paths
- Add pre-commit hooks to verify asset references

---

## Files to Modify

### Immediate (Phase 1):
```
*.html (66 files) - Update CSS reference
includes/header.html - Update font loading
docs.html - Simplify to redirect-only
```

### Short-term (Phase 2-4):
```
css/design-tokens.css - Add font fallbacks
js/main.js - Remove animation code
css/input.css - Split bookshelf styles
package.json - Add build automation
```

---

## References

- Full build analysis: `BUILD_SYSTEM_ANALYSIS.md`
- Build flow diagrams: `BUILD_FLOW_DIAGRAMS.md`
- Test results: `.lighthouse/live-20260328-085314/`
- Spacing guidelines: `docs/SPACING-GUIDELINES.md`

---

**Next Step**: Review this analysis and confirm approach before implementing Phase 1 fixes.
