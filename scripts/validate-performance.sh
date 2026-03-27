#!/bin/bash
set -e

echo "Starting comprehensive performance validation..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create output directory
mkdir -p .lighthouse/optimized

# Start local server
echo "Starting local server..."
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 3

# Function to run Lighthouse
run_lighthouse() {
    local page=$1
    local name=$2
    echo ""
    echo "Testing $name..."
    echo "------------------------"

    # Run Lighthouse with mobile settings (most restrictive)
    npx lighthouse "http://localhost:8000/$page" \
        --output=json,html \
        --output-path=".lighthouse/optimized/$name" \
        --form-factor=mobile \
        --throttling.rttMs=150 \
        --throttling.throughputKbps=1638 \
        --throttling.cpuSlowdownMultiplier=4 \
        --screenEmulation.mobile=true \
        --screenEmulation.width=360 \
        --screenEmulation.height=640 \
        --quiet

    # Extract scores from JSON using node
    local perf=$(node -p "Math.round(require('./.lighthouse/optimized/${name}.json').categories.performance.score * 100)")
    local a11y=$(node -p "Math.round(require('./.lighthouse/optimized/${name}.json').categories.accessibility.score * 100)")
    local bp=$(node -p "Math.round(require('./.lighthouse/optimized/${name}.json').categories['best-practices'].score * 100)")
    local seo=$(node -p "Math.round(require('./.lighthouse/optimized/${name}.json').categories.seo.score * 100)")

    # Extract key metrics
    local fcp=$(node -p "require('./.lighthouse/optimized/${name}.json').audits['first-contentful-paint'].numericValue")
    local lcp=$(node -p "require('./.lighthouse/optimized/${name}.json').audits['largest-contentful-paint'].numericValue")
    local tbt=$(node -p "require('./.lighthouse/optimized/${name}.json').audits['total-blocking-time'].numericValue")
    local cls=$(node -p "require('./.lighthouse/optimized/${name}.json').audits['cumulative-layout-shift'].numericValue")

    # Convert ms to seconds for display
    fcp_s=$(node -p "($fcp / 1000).toFixed(2)")
    lcp_s=$(node -p "($lcp / 1000).toFixed(2)")
    tbt_ms=$(node -p "Math.round($tbt)")

    # Display results with color coding
    echo "Lighthouse Scores:"
    [[ $perf -ge 95 ]] && echo -e "${GREEN}Performance: ${perf}${NC}" || echo -e "${RED}Performance: ${perf} (target: 95+)${NC}"
    [[ $a11y -ge 100 ]] && echo -e "${GREEN}Accessibility: ${a11y}${NC}" || echo -e "${YELLOW}Accessibility: ${a11y} (target: 100)${NC}"
    [[ $bp -ge 95 ]] && echo -e "${GREEN}Best Practices: ${bp}${NC}" || echo -e "${YELLOW}Best Practices: ${bp} (target: 95+)${NC}"
    [[ $seo -ge 95 ]] && echo -e "${GREEN}SEO: ${seo}${NC}" || echo -e "${YELLOW}SEO: ${seo} (target: 95+)${NC}"

    echo ""
    echo "Core Web Vitals:"
    [[ $(node -p "$fcp <= 1800 ? 1 : 0") -eq 1 ]] && echo -e "${GREEN}FCP: ${fcp_s}s${NC}" || echo -e "${YELLOW}FCP: ${fcp_s}s (target: <1.8s)${NC}"
    [[ $(node -p "$lcp <= 2500 ? 1 : 0") -eq 1 ]] && echo -e "${GREEN}LCP: ${lcp_s}s${NC}" || echo -e "${RED}LCP: ${lcp_s}s (target: <2.5s)${NC}"
    [[ $(node -p "$tbt <= 200 ? 1 : 0") -eq 1 ]] && echo -e "${GREEN}TBT: ${tbt_ms}ms${NC}" || echo -e "${YELLOW}TBT: ${tbt_ms}ms (target: <200ms)${NC}"
    [[ $(node -p "$cls <= 0.1 ? 1 : 0") -eq 1 ]] && echo -e "${GREEN}CLS: ${cls}${NC}" || echo -e "${YELLOW}CLS: ${cls} (target: <0.1)${NC}"

    # Store for summary
    echo "$name,$perf,$a11y,$bp,$seo,$lcp_s" >> .lighthouse/optimized/summary.csv
}

# Initialize summary file
echo "Page,Performance,Accessibility,Best Practices,SEO,LCP (s)" > .lighthouse/optimized/summary.csv

# Test key pages
run_lighthouse "index.html" "homepage"
run_lighthouse "features.html" "features"
run_lighthouse "pricing.html" "pricing"
run_lighthouse "docs.html" "docs"

# Kill server
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "================================================"
echo "Performance Validation Summary"
echo "================================================"
cat .lighthouse/optimized/summary.csv | column -t -s ','

echo ""
echo "Full reports saved in: .lighthouse/optimized/"
echo "   View HTML reports: open .lighthouse/optimized/*.html"

# Check if all targets met
if grep -v "Page," .lighthouse/optimized/summary.csv | awk -F',' '{if($2 < 95) exit 1}'; then
    echo -e "${GREEN}All performance targets achieved!${NC}"
    exit 0
else
    echo -e "${YELLOW}Some targets not yet met. Review reports for details.${NC}"
    exit 1
fi
