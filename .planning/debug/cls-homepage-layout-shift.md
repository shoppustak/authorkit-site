---
status: awaiting_human_verify
trigger: "cls-homepage-layout-shift"
created: 2026-03-28T16:45:00Z
updated: 2026-03-28T17:15:00Z
---

## Current Focus

hypothesis: CONFIRMED - Double font loading (Google Fonts CDN + self-hosted) causing race condition and multiple layout shifts
test: Remove Google Fonts @import from styles.css, change font-display to optional
expecting: Eliminating double font load and using optional will prevent text reflow, reducing CLS to <0.1
next_action: Remove @import line from css/styles.css source, rebuild, and verify

## Symptoms

expected: CLS < 0.1 (Lighthouse 95+ score) - Homepage should have minimal layout shift, meeting Google's Core Web Vitals threshold

actual: CLS = 0.395 on homepage (almost 4x over target). Current Lighthouse performance score is 62/100 (target: 95+)

errors: No JavaScript errors. Lighthouse audit shows "Cumulative Layout Shift" score of 27% (failing). Unsized images audit previously showed logo without dimensions (now fixed).

reproduction:
1. Run Lighthouse test on https://authorkit.pro/
2. Observe Performance score of 62/100
3. CLS metric shows 0.395 (red, failing)
4. Layout shifts occur during: font loading, initial page load, and after JavaScript execution

started: Issue discovered during Phase 6 performance optimization. Added width/height to logo: CLS improved from 0.445 → 0.395 (11% improvement, still failing). Self-hosted fonts with font-display:swap applied.

## Eliminated

## Evidence

- timestamp: 2026-03-28T16:50:00Z
  checked: Lighthouse report homepage.report.json
  found: CLS = 0.395, score 26%, unsized-images audit PASSES (all images have explicit dimensions)
  implication: Images are not the problem - logo fix worked. Issue is elsewhere.

- timestamp: 2026-03-28T16:52:00Z
  checked: css/fonts.css font loading strategy
  found: All 4 fonts use font-display:swap (Playfair Display 600/700, Source Serif 4 400/600)
  implication: font-display:swap causes text to render with fallback font, then swap to custom font when loaded = VISIBLE LAYOUT SHIFT

- timestamp: 2026-03-28T16:53:00Z
  checked: index.html inline styles and structure
  found: Body font is Source Serif 4 (serif), headings use Playfair Display (serif). Both have different metrics than fallback serif. No space reserved for font-height differences.
  implication: When fonts swap in, text height/spacing changes causing all subsequent content to shift down

- timestamp: 2026-03-28T16:55:00Z
  checked: Header/footer loading (js/header-loader.js, js/footer-loader.js)
  found: Both use deferred JavaScript with fetch(), inserted via innerHTML after DOMContentLoaded. Scripts are deferred but still inject DOM content late.
  implication: Header/footer injection happens after initial render, potentially causing layout shift. BUT header has fixed height (h-16 = 4rem) which should reserve space.

- timestamp: 2026-03-28T16:57:00Z
  checked: css/styles.css line 2 - conflicting font import
  found: CRITICAL - Line 2 has Google Fonts CDN import still present: @import url('https://fonts.googleapis.com/css2?family=Playfair+Display...')
  implication: BOTH Google Fonts CDN AND self-hosted fonts are loading! Double font downloads, conflicting sources, likely causing font loading race condition and extra layout shift

## Resolution

root_cause: Double font loading causing CLS. Both Google Fonts CDN (@import in css/input.css line 2) AND self-hosted fonts (fonts.css) were loading simultaneously with font-display:swap. This creates: (1) Race condition between two font sources, (2) Text renders with fallback serif, (3) First font load swaps text (layout shift #1), (4) Second font load swaps again (layout shift #2), (5) Different font metrics between fallback and custom fonts cause text height changes. Total CLS impact: ~0.395.

fix:
1. ✅ Removed Google Fonts @import from css/input.css (source file)
2. ✅ Changed font-display from "swap" to "optional" in css/fonts.css (prevents FOUT/visible text reflow)
3. ✅ Rebuilt both css/styles.css and css/styles.min.css
4. ✅ Verified Google Fonts CDN completely removed (0 occurrences in both files)

verification: Ready for deployment and Lighthouse retest. Expected CLS reduction from 0.395 to <0.1 (eliminating double font load and preventing font swap reflow).

files_changed:
- css/input.css (removed Google Fonts CDN @import)
- css/fonts.css (changed font-display: swap → optional)
- css/styles.css (rebuilt from input.css)
- css/styles.min.css (rebuilt from input.css)
