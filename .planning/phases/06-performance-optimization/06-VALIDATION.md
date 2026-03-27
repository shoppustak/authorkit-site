---
phase: 06
slug: performance-optimization
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-27
updated: 2026-03-27
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Lighthouse 13.0.3 + axe-core 4.10+ |
| **Config file** | `.lighthouse/lighthouserc.json` |
| **Quick run command** | `npx lighthouse http://localhost:8000 --only-categories=performance --view` |
| **Full suite command** | `./scripts/validate-performance.sh` |
| **Estimated runtime** | ~60 seconds (4 pages × 15s each) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build:css:prod && ls -lh css/styles.min.css` (verify CSS < 15KB)
- **After every plan wave:** Run `npx lighthouse http://localhost:8000 --only-categories=performance --quiet`
- **Before `/gsd:verify-work`:** Full suite must be green via `./scripts/validate-performance.sh`
- **Max feedback latency:** 15 seconds (quick check), 60 seconds (full suite)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | PERF-01 | unit | `test -f postcss.config.js && grep cssnano postcss.config.js` | ✅ Created | ⬜ pending |
| 06-01-02 | 01 | 1 | PERF-01 | unit | `npm run build:css:prod && ls -lh css/styles.min.css` | ✅ Script exists | ⬜ pending |
| 06-01-03 | 01 | 1 | PERF-02 | unit | `test -f .lighthouse/lighthouserc.json && grep minScore .lighthouse/lighthouserc.json` | ✅ Created | ⬜ pending |
| 06-02-01 | 02 | 2 | PERF-03 | unit | `grep -c 'defer' index.html && grep -c 'preconnect' index.html` | ✅ HTML exists | ⬜ pending |
| 06-02-02 | 02 | 2 | PERF-04 | unit | `grep -c 'display=swap' index.html features.html pricing.html` | ✅ HTML exists | ⬜ pending |
| 06-03-01 | 03 | 2 | PERF-05 | unit | `test -f scripts/optimize-images.sh && ./scripts/optimize-images.sh --dry-run` | ✅ Created | ⬜ pending |
| 06-03-02 | 03 | 2 | PERF-06 | unit | `grep -c 'loading="lazy"' index.html && grep -c 'srcset' index.html` | ✅ HTML exists | ⬜ pending |
| 06-04-01 | 04 | 3 | PERF-07 | lighthouse | `./scripts/validate-performance.sh` | ✅ Created | ⬜ pending |
| 06-04-02 | 04 | 3 | PERF-07 | lighthouse | `test -f .lighthouse/optimized/homepage.json && jq '.categories.performance.score' .lighthouse/optimized/homepage.json` | ❌ After run | ⬜ pending |
| 06-04-03 | 04 | 3 | PERF-08 | manual | Checkpoint - human verification of performance | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `.lighthouse/lighthouserc.json` — Lighthouse CI config with thresholds (Plan 01, Task 3)
- [x] `.lighthouse/baseline/` — Baseline reports directory (exists from Phase 1)
- [x] `.lighthouse/optimized/` — Optimized reports directory (Plan 04, Task 1)
- [x] `scripts/validate-performance.sh` — Performance validation script (Plan 04, Task 1)
- [x] Update package.json scripts:
  - `"test:lighthouse": "lighthouse http://localhost:8000 --view"`
  - `"test:lighthouse:quick": "lighthouse http://localhost:8000 --only-categories=performance --view"`
  - `"test:perf": "./scripts/validate-performance.sh"`
- [x] Install/update dependencies:
  - `npm install --save-dev lighthouse@latest` (11.5.0 → 13.0.3)
  - `npm install --save-dev @axe-core/cli` (for accessibility testing)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real device mobile performance | PERF-08 | Physical device testing | Load site on iOS/Android, verify < 2s load time on 3G |
| Font display perception | PERF-04 | Visual perception check | Verify no flash of invisible text during font load |
| Image loading experience | PERF-06 | Visual progression check | Verify images load progressively without layout shift |

*Note: Most behaviors have automated verification via Lighthouse metrics.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify commands defined
- [x] Sampling continuity: Quick perf check after each plan wave
- [x] Wave 0 covers all tool installations and config setup
- [x] No watch-mode flags in test commands
- [x] Feedback latency < 60s for full suite
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** Approved 2026-03-27

---

## Performance Requirement Mapping

| Requirement | Description | Target | Verification |
|-------------|-------------|--------|--------------|
| PERF-01 | CSS optimization pipeline | < 15KB bundle | `ls -lh css/styles.min.css` |
| PERF-02 | Performance monitoring setup | CI config | `.lighthouse/lighthouserc.json` exists |
| PERF-03 | Eliminate render-blocking | No blocking | Lighthouse audit |
| PERF-04 | Font optimization | display=swap | `grep 'display=swap' *.html` |
| PERF-05 | Image optimization | WebP format | Image file check |
| PERF-06 | Lazy loading | loading="lazy" | HTML attribute check |
| PERF-07 | Lighthouse targets | 95+ scores | Lighthouse reports |
| PERF-08 | Mobile performance | < 2s load | Lighthouse mobile test |