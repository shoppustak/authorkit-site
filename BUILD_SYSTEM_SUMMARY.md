# AuthorKit Build System - Executive Summary

**Created**: March 28, 2026
**Repository**: authorkit-site
**Status**: Static HTML + Node.js build pipeline

---

## Quick Reference

### Build Architecture
```
Source Files (5) → PostCSS/Tailwind → Single Bundle → Minify
├── input.css (4.5 KB)
├── design-tokens.css (4.0 KB)
├── monochrome-components.css (14 KB)
├── style.css (7.5 KB)
└── bookshelf.css (18 KB)
         ↓
    styles.css (39 KB)
         ↓
    styles.min.css (22 KB)
```

### File Sizes at a Glance

| Asset Type | Unminified | Minified | Notes |
|-----------|-----------|----------|-------|
| CSS | 39 KB | 22 KB | Single bundle, 43% reduction |
| JS (All) | 32 KB | 15 KB | 3 files (.min.js used) |
| Images | 956 KB | — | WebP optimized, 30 variants |
| Fonts | Bundled | — | Google Fonts (2 requests) |

### Per-Page Delivery

**All Pages**:
- CSS: 22 KB (styles.min.css)
- JS: 6.8 KB (header + footer + main)
- Fonts: ~30 KB (Google Fonts, 2 requests)
- **Total**: ~59 KB before gzip

**Bookshelf Pages (+)**: 
- CSS: +18 KB (bookshelf.css)
- JS: +3-4 KB (bookshelf utilities)

---

## Build Scripts (npm)

### Development
```bash
npm run dev              # Start local server (port 8000)
npm run watch:css       # Watch CSS changes + rebuild
```

### Production
```bash
npm run build           # Build unminified CSS + minify JS
npm run build:prod      # Build + minify CSS + minify JS
npm run build:all       # Build + optimize images
```

### Testing
```bash
npm run test:lighthouse # Run Lighthouse on local site
npm run test:perf       # Performance validation script
npm run test:lighthouse:ci  # CI pipeline test (3 runs)
```

---

## CSS Organization

### Layer Architecture
```css
input.css (entry point)
  ├─ @import design-tokens.css     (150 CSS variables)
  ├─ @import monochrome-components (nav, menu, buttons, cards)
  ├─ @tailwind base                (Tailwind reset + base)
  ├─ @tailwind components          (Tailwind components)
  ├─ @tailwind utilities           (Tailwind utilities)
  └─ Custom overrides              (@layer utilities)
```

### Tailwind Customizations
- **Colors**: Black/white primary, orange/blue accents only
- **Spacing**: 8px base unit (1x, 2x, 4x, 8x scale)
- **Typography**: Playfair Display + Source Serif 4
- **Disabled**: All animations, shadows, border-radius

### Design Token Highlights
```css
--color-black: #000000;             /* Primary */
--color-white: #FFFFFF;             /* Primary */
--color-brand-orange: #FF9900;      /* Accent only */
--space-8: 4rem;                    /* 64px section padding */
--radius-none: 0;                   /* Flat design (all zero) */
--transition-none: none;            /* Instant interactions */
```

---

## JavaScript Functions

### Loaded on All Pages
```javascript
header-loader.js (2.4 KB)
├─ Fetch includes/header.html
├─ Detect current page
└─ Set active navigation link

footer-loader.js (1.1 KB)
└─ Fetch includes/footer.html

main.js (7.1 KB → 3.3 KB minified)
├─ Mobile menu toggle
├─ Smooth scroll for anchors
└─ Fade-in on scroll (IntersectionObserver)
```

### Bookshelf Pages Only
```javascript
bookshelf.js (6.6 KB → 3.0 KB)
├─ generateBookCard() DOM builder
├─ formatGenreName() helper
└─ Amazon affiliate link generation

bookshelf-browse.js (9.1 KB → 4.4 KB)
├─ Search/filter state management
├─ API integration (loadBooks)
└─ URL parameter sync
```

---

## Performance Configuration

### Lighthouse CI Targets
| Metric | Target | Status |
|--------|--------|--------|
| Performance Score | 95+ | Pending |
| Accessibility Score | 100 | Pending |
| Best Practices | 95+ | Pending |
| SEO Score | 95+ | Pending |
| LCP (Largest Contentful Paint) | < 2.5s | CRITICAL |
| CLS (Cumulative Layout Shift) | < 0.1 | High priority |
| TBT (Total Blocking Time) | < 200ms | Error |
| CSS Bundle | < 15 KB | Current: 22 KB |
| JS Bundle | < 50 KB | Current: 15 KB |

### Test Configuration
- **Runs**: 3 per page (averaged)
- **Device**: Mobile (360×640px)
- **Throttling**: 150ms RTT, 1638 Kbps, 4× CPU slowdown
- **Pages Tested**: index, features, pricing, docs

---

## Performance Bottlenecks (Ranked)

### Critical Issues
1. **Google Fonts blocking render** (2 separate stylesheet requests)
   - Impact: +300-500ms FCP
   - Solution: Consolidate to 1 request + preload

2. **CSS render-blocking** (22 KB must parse before paint)
   - Impact: +200-400ms FCP
   - Solution: Extract critical CSS inline

3. **Missing preload/prefetch** (no resource hints)
   - Impact: +50-100ms LCP
   - Solution: Add link rel="preload" for fonts/CSS

### High Priority Issues
4. **Image layout shifts** (missing width/height attributes)
   - Impact: CLS > 0.1
   - Solution: Add explicit dimensions

5. **Bookshelf.css on all pages** (18 KB unnecessary on 90% of pages)
   - Impact: +18 KB per page delivery
   - Solution: Conditional loading

6. **Dead animation code** (CSS disables, JS triggers)
   - Impact: Wasted execution
   - Solution: Remove animation observers

---

## File Locations Quick Reference

```
Critical Files:
├── /css/input.css                  ← Edit here for CSS changes
├── /css/design-tokens.css          ← CSS variables
├── /css/tailwind.config.js         ← Tailwind customization
├── /js/main.js                     ← Core interactivity
├── /package.json                   ← Build scripts
├── /postcss.config.js              ← PostCSS pipeline
└── /.lighthouse/lighthouserc.json  ← Performance thresholds

Build Outputs:
├── /css/styles.css                 ← Development build
├── /css/styles.min.css             ← Production build
├── /js/*.min.js                    ← Minified JS

Documentation:
├── /docs/SPACING-GUIDELINES.md     ← Design system docs
├── /.planning/PROJECT.md           ← Project vision
└── /README.md                      ← (outdated)
```

---

## Key Insights

### What Works Well
✓ Simple, maintainable build process (no webpack complexity)
✓ Effective CSS optimization pipeline (PurgeCSS + cssnano)
✓ Comprehensive performance testing (Lighthouse CI)
✓ Proper Tailwind customization (15 core plugins disabled)
✓ Design tokens system (150+ CSS variables)
✓ Image optimization workflow (WebP + responsive variants)

### What Needs Improvement
✗ Font loading strategy (2 requests, blocking)
✗ No critical CSS path optimization
✗ No code/CSS splitting by page type
✗ Missing preload/prefetch resource hints
✗ HTML might reference unminified CSS
✗ Dead animation code (CSS disables, JS triggers)
✗ Documentation outdated (mentions "Tailwind via CDN")

---

## Recent Changes Pattern

Last 30 commits show **reactive bug fixes** rather than **proactive optimization**:

- Typography size adjustments (multiple commits)
- Mobile layout fixes (card overflow, menu positioning)
- Image CLS prevention (adding width/height)
- Hamburger breakpoint corrections

**Indicates**: Performance issues discovered post-deployment are being patched.

---

## Next Steps for Performance Improvement

### Immediate (Can do this week)
1. Consolidate Google Fonts request (2 → 1)
2. Add resource preload for fonts/CSS
3. Verify HTML uses `.min.css` in production
4. Add width/height to all images
5. Remove unused animation observers from main.js

### Short-term (2-4 weeks)
6. Extract critical CSS path (inline above-fold)
7. Implement page-specific CSS bundling
8. Add conditional JS loading for bookshelf pages
9. Font subsetting (load only needed characters)

### Long-term (1-3 months)
10. Implement CSS modules or CSS-in-JS for component scoping
11. Add source maps for production debugging
12. Evaluate dynamic imports for feature-specific code
13. Build-time critical CSS extraction pipeline

---

## Performance Impact Estimates

With recommended fixes:

| Change | FCP | LCP | CLS |
|--------|-----|-----|-----|
| Consolidate fonts | -300ms | -200ms | no change |
| Extract critical CSS | -150ms | -150ms | no change |
| Add preload hints | -50ms | -100ms | no change |
| Fix image CLS | no change | no change | -0.2 |
| Remove dead code | no change | -20ms | no change |
| **Total Improvement** | **-500ms** | **-450ms** | **Resolves** |

**Expected Result**: Performance score from pending → 95+, all Core Web Vitals green.

---

## Configuration Philosophy

The site follows a **Minimalist Monochrome Design System**:

```
Design Principles:
├─ Pure black (#000) and white (#FFF) primary colors
├─ Zero border-radius (flat design)
├─ No shadows or decorative effects
├─ Instant interactions (no transitions)
├─ Brand colors (orange, blue) used as accents ONLY
├─ Generous whitespace and typography-first layout
└─ 8px base spacing unit throughout

Technical Implementation:
├─ Tailwind CSS with heavy customization (15 plugins disabled)
├─ CSS custom properties for design tokens
├─ Semantic HTML with accessibility focus
├─ PostCSS pipeline for compilation
└─ Single consolidated CSS file per page
```

---

## Document References

- **Full Analysis**: See `/BUILD_SYSTEM_ANALYSIS.md` (934 lines)
- **Spacing Guide**: `/docs/SPACING-GUIDELINES.md` (design tokens)
- **Project Vision**: `/.planning/PROJECT.md` (business goals)
- **Lighthouse Config**: `/.lighthouse/lighthouserc.json` (performance targets)

---

**Quick Stats**:
- 66 total HTML pages
- 5 CSS source files → 1 consolidated bundle
- 4 JavaScript files (3 always loaded, 2 conditional)
- 956 KB images (WebP optimized)
- ~300 Tailwind utilities disabled for flat design
- Performance target: 95 Lighthouse score

