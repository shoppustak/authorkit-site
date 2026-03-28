# Phase 1 Performance Test Results

**Test Date**: March 28, 2026
**Deployment**: Git commit 9fa3291 pushed to origin/master
**Test Time**: 30 seconds after push

---

## Results Summary

| Page | Before | After | Change | Status |
|------|--------|-------|--------|--------|
| Homepage | 58/100 | 67/100 | **+9** | ✅ Improved |
| Features | 81/100 | 63/100 | **-18** | ❌ Regressed |
| Pricing | 68/100 | 65/100 | **-3** | ❌ Slight regression |
| Docs | 34/100 | 36/100 | **+2** | ➡️ Minimal change |
| **Average** | **60/100** | **58/100** | **-2** | ❌ Slightly worse |

---

## Detailed Metrics Comparison

### Homepage
| Metric | Before | After | Change | Status |
|--------|--------|-------|--------|--------|
| Performance | 58 | 67 | **+9** | ✅ |
| FCP | 4.08s | 3.03s | **-1.05s** | ✅ Major improvement |
| LCP | 4.08s | 3.03s | **-1.05s** | ✅ Major improvement |
| TBT | 0ms | 0ms | 0 | ➡️ |
| CLS | 0.395 | 0.507 | **+0.112** | ❌ Worse |
| Accessibility | 94 | 89 | -5 | ❌ |

**Analysis**: Homepage showed significant improvement in render times (FCP/LCP) but CLS increased substantially.

### Features Page
| Metric | Before | After | Change | Status |
|--------|--------|-------|--------|--------|
| Performance | 81 | 63 | **-18** | ❌ Significant regression |
| FCP | 2.80s | 3.76s | **+0.96s** | ❌ Slower |
| LCP | 2.80s | 3.76s | **+0.96s** | ❌ Slower |
| TBT | 0ms | 0ms | 0 | ➡️ |
| CLS | 0.205 | 0.358 | **+0.153** | ❌ Worse |
| Accessibility | 94 | 89 | -5 | ❌ |

**Analysis**: Features page showed unexpected regression across all metrics. This is concerning and needs investigation.

### Pricing Page
| Metric | Before | After | Change | Status |
|--------|--------|-------|--------|--------|
| Performance | 68 | 65 | **-3** | ❌ |
| FCP | 3.47s | 2.54s | **-0.93s** | ✅ Improved |
| LCP | 3.62s | 3.77s | **+0.15s** | ❌ Slightly slower |
| TBT | 0ms | 0ms | 0 | ➡️ |
| CLS | 0.278 | 0.494 | **+0.216** | ❌ Much worse |
| Accessibility | 82 | 82 | 0 | ➡️ |

**Analysis**: Mixed results - FCP improved but LCP and CLS worsened.

### Docs Page
| Metric | Before | After | Change | Status |
|--------|--------|-------|--------|--------|
| Performance | 34 | 36 | **+2** | ➡️ Minimal change |
| FCP | 6.32s | 5.82s | **-0.50s** | ✅ Slight improvement |
| LCP | 8.67s | 8.37s | **-0.30s** | ✅ Slight improvement |
| TBT | 1508ms | 1397ms | **-111ms** | ✅ Slight improvement |
| CLS | 0.002 | 0.002 | 0 | ✅ Already good |

**Analysis**: Minimal improvements suggest the new lightweight docs.html may not be deployed yet or is cached.

---

## Key Findings

### ✅ Positive Changes
1. **Homepage LCP/FCP**: Improved by ~1 second each
2. **Pricing FCP**: Improved by ~1 second
3. **Docs TBT**: Reduced by 111ms
4. **TBT**: All pages maintain 0ms blocking time (excellent)

### ❌ Concerning Issues

1. **CLS Increased Across All Pages** (Major Issue)
   - Homepage: 0.395 → 0.507 (+28%)
   - Features: 0.205 → 0.358 (+75%)
   - Pricing: 0.278 → 0.494 (+78%)

   **This should not happen** - our changes (minified CSS, consolidated fonts) should not increase layout shift.

2. **Features Page Severe Regression**
   - Performance score dropped 18 points
   - LCP/FCP increased by ~1 second
   - Worst performing page after changes

3. **Inconsistent Results**
   - Homepage improved while features regressed
   - Changes were global, should affect all pages similarly

4. **Minimal Docs Improvement**
   - Expected: 34 → 95+ (new minimal page)
   - Actual: 34 → 36 (barely changed)
   - Suggests: Old version may still be cached/served

5. **Accessibility Dropped**
   - Homepage & Features: 94 → 89 (both pages, -5 points)
   - This is unexpected from our changes

---

## Possible Explanations

### 1. Deployment / Caching Issues
- **Most Likely**: Changes haven't fully propagated to CDN/live site
- Old CSS/HTML may still be cached
- Need to verify what's actually being served

### 2. Test Variance
- Lighthouse mobile tests can vary ±5-10 points
- Network conditions affect results
- Should run multiple tests to confirm

### 3. Incomplete Deployment
- GitHub repo updated but live site (authorkit.pro) may not auto-deploy
- May need manual deployment step (rsync, FTP, etc.)
- Docs page minimal version not reflected in results

### 4. Font Loading Timing Change
- Consolidating fonts may have changed load order
- Could cause increased CLS if fonts load differently
- But should not worsen by this much

### 5. CSS Size Reduction Side Effect
- Smaller CSS (18 KB vs 39 KB) loads faster
- Faster CSS = fonts may not be ready when text renders
- Could increase FOUT (Flash of Unstyled Text) → CLS
- But TBT stayed at 0ms, so this is unlikely

---

## Recommendations

### Immediate Actions

1. **Verify Deployment**
   ```bash
   # Check if minified CSS is being served
   curl -s -I https://authorkit.pro/css/styles.min.css

   # Check if docs page is new version
   curl -s https://authorkit.pro/docs.html | wc -c  # Should be ~2 KB not 30+ KB
   ```

2. **Manual Deployment** (if needed)
   - Changes may be in GitHub but not deployed to authorkit.pro
   - Need to push to actual web server
   - Check deployment process/CI-CD

3. **Run Additional Tests**
   ```bash
   # Test again after 5 minutes (cache cleared)
   sleep 300 && ./scripts/test-live-performance.sh
   ```

4. **Check What's Actually Served**
   - Open browser DevTools → Network tab
   - Load https://authorkit.pro/
   - Verify styles.min.css is loaded (not styles.css)
   - Verify single Google Fonts request

### Investigation Needed

1. **CLS Increase Root Cause**
   - Why did layout shift increase on all pages?
   - Check if font loading changed
   - Inspect Lighthouse trace for shift sources

2. **Features Page Regression**
   - Why did this one page regress so badly?
   - Check if there's something unique about features.html
   - Compare network waterfall before/after

3. **Docs Page No Improvement**
   - Confirm new minimal docs.html is deployed
   - Check HTTP headers for cache control
   - Verify redirect is instant

### Next Steps

**Option A - Wait and Retest**
- Wait 5-10 minutes for caches to clear
- Run test again to see if results improve
- May just be deployment propagation delay

**Option B - Manual Deployment**
- Manually deploy files to authorkit.pro server
- Clear CDN cache if using CDN
- Test immediately after

**Option C - Investigate First**
- Open browser and manually check what's loaded
- Compare network requests before/after
- Verify changes are actually live

**Option D - Rollback**
- If results are consistently worse
- Git revert to previous version
- Investigate offline why changes caused regression

---

## Test Environment

- Lighthouse version: 13.0.3
- Test device: Mobile (360×640px)
- Network throttling: 150ms RTT, 1638 Kbps, 4× CPU slowdown
- Test URL: https://authorkit.pro/
- Test run: Single pass per page (not averaged)

---

## Files Changed in Phase 1

- 19 HTML files: `styles.css` → `styles.min.css`
- All HTML files: 2 font requests → 1 consolidated
- docs.html: Full page → minimal redirect (< 2 KB)
- css/styles.min.css: Rebuilt (18 KB)

---

## Next Report

After verifying deployment and retesting:
- PHASE1-RETEST.md (if running another test)
- PHASE1-INVESTIGATION.md (if digging into issues)
- PHASE2-PLAN.md (if results are good and proceeding)

---

**Conclusion**: Results are inconsistent with expectations. Homepage improved but features regressed significantly. CLS increased across all pages contrary to expectations. Strong evidence of either (1) test variance, (2) deployment not complete, or (3) unintended side effect of changes. Recommend verifying deployment and retesting before proceeding to Phase 2.
