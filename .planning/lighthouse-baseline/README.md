# Lighthouse Baseline Measurement Methodology

This directory contains baseline Lighthouse performance measurements for the AuthorKit.pro marketing site taken before the Phase 1 redesign optimization work.

## Measurement Settings

### Desktop settings:
- Preset: `--preset=desktop`
- Throttling: `--throttling-method=provided`

### Mobile settings:
- Preset: `--preset=mobile`
- Throttling: `--throttling=mobileSlow4G`
- **Primary focus**: Mobile performance is critical priority per PROJECT.md requirements
- **Target**: < 2s page load on 3G, < 1s on 4G

### Output format:
- Format: JSON for programmatic analysis
- Path: `.planning/lighthouse-baseline/{page-name}.json`

## Pages to Measure

Core pages that drive user conversion and engagement:
1. `index.html` - Homepage (homepage.json)
2. `features.html` - Features page (features.json)
3. `pricing.html` - Pricing page (pricing.json)
4. `docs.html` - Documentation page (docs.json)

## Measurement Commands

### Mobile measurements (critical priority)

```bash
# Homepage
lighthouse http://localhost:8000/index.html \
  --output=json \
  --output-path=.planning/lighthouse-baseline/homepage.json \
  --preset=mobile \
  --throttling=mobileSlow4G \
  --chrome-flags="--headless"

# Features
lighthouse http://localhost:8000/features.html \
  --output=json \
  --output-path=.planning/lighthouse-baseline/features.json \
  --preset=mobile \
  --throttling=mobileSlow4G \
  --chrome-flags="--headless"

# Pricing
lighthouse http://localhost:8000/pricing.html \
  --output=json \
  --output-path=.planning/lighthouse-baseline/pricing.json \
  --preset=mobile \
  --throttling=mobileSlow4G \
  --chrome-flags="--headless"

# Documentation
lighthouse http://localhost:8000/docs.html \
  --output=json \
  --output-path=.planning/lighthouse-baseline/docs.json \
  --preset=mobile \
  --throttling=mobileSlow4G \
  --chrome-flags="--headless"
```

### Desktop measurements (reference only)

```bash
# Homepage
lighthouse http://localhost:8000/index.html \
  --output=json \
  --output-path=.planning/lighthouse-baseline/homepage-desktop.json \
  --preset=desktop \
  --throttling-method=provided \
  --chrome-flags="--headless"

# Features
lighthouse http://localhost:8000/features.html \
  --output=json \
  --output-path=.planning/lighthouse-baseline/features-desktop.json \
  --preset=desktop \
  --throttling-method=provided \
  --chrome-flags="--headless"

# Pricing
lighthouse http://localhost:8000/pricing.html \
  --output=json \
  --output-path=.planning/lighthouse-baseline/pricing-desktop.json \
  --preset=desktop \
  --throttling-method=provided \
  --chrome-flags="--headless"

# Documentation
lighthouse http://localhost:8000/docs.html \
  --output=json \
  --output-path=.planning/lighthouse-baseline/docs-desktop.json \
  --preset=desktop \
  --throttling-method=provided \
  --chrome-flags="--headless"
```

## Analysis

After measurements are complete, analyze results in `BASELINE-ANALYSIS.md`:
- Extract all category scores (Performance, Accessibility, Best Practices, SEO)
- Extract Core Web Vitals metrics (LCP, FID, CLS, FCP, TBT, Speed Index)
- Identify top performance bottlenecks
- Document mobile-specific issues
- Create optimization roadmap with prioritized fixes
- Set target scores for post-optimization (95+ performance, 100 accessibility)

## Running the Server

Start local development server before running Lighthouse:

```bash
cd /Users/maulik/authorkit-site
python3 -m http.server 8000
```

Verify server is running:
```bash
curl http://localhost:8000 | head -20
```

## Notes

- Mobile measurements are **critical priority** - this is our primary optimization target
- Desktop measurements are for reference only
- All measurements use headless Chrome for consistency
- Measurements should be run with no other apps/browsers consuming resources
- Run measurements multiple times and average if results vary significantly
