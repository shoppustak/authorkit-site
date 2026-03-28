#!/bin/bash
set -e

echo "Testing LIVE site performance: https://authorkit.pro"
echo "===================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create output directory with timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_DIR=".lighthouse/live-${TIMESTAMP}"
mkdir -p "$OUTPUT_DIR"

# Function to run Lighthouse on live site
run_lighthouse_live() {
    local url=$1
    local name=$2
    echo ""
    echo -e "${BLUE}Testing $name...${NC}"
    echo "------------------------"

    # Run Lighthouse with mobile settings (most restrictive)
    npx lighthouse "$url" \
        --output=json,html \
        --output-path="${OUTPUT_DIR}/${name}" \
        --form-factor=mobile \
        --throttling.rttMs=150 \
        --throttling.throughputKbps=1638 \
        --throttling.cpuSlowdownMultiplier=4 \
        --screenEmulation.mobile=true \
        --screenEmulation.width=360 \
        --screenEmulation.height=640 \
        --quiet

    # Extract scores from JSON using node
    local perf=$(node -p "Math.round(require('./${OUTPUT_DIR}/${name}.report.json').categories.performance.score * 100)")
    local a11y=$(node -p "Math.round(require('./${OUTPUT_DIR}/${name}.report.json').categories.accessibility.score * 100)")
    local bp=$(node -p "Math.round(require('./${OUTPUT_DIR}/${name}.report.json').categories['best-practices'].score * 100)")
    local seo=$(node -p "Math.round(require('./${OUTPUT_DIR}/${name}.report.json').categories.seo.score * 100)")

    # Extract key metrics
    local fcp=$(node -p "require('./${OUTPUT_DIR}/${name}.report.json').audits['first-contentful-paint'].numericValue")
    local lcp=$(node -p "require('./${OUTPUT_DIR}/${name}.report.json').audits['largest-contentful-paint'].numericValue")
    local tbt=$(node -p "require('./${OUTPUT_DIR}/${name}.report.json').audits['total-blocking-time'].numericValue")
    local cls=$(node -p "require('./${OUTPUT_DIR}/${name}.report.json').audits['cumulative-layout-shift'].numericValue")
    local si=$(node -p "require('./${OUTPUT_DIR}/${name}.report.json').audits['speed-index'].numericValue")

    # Convert ms to seconds for display
    fcp_s=$(node -p "($fcp / 1000).toFixed(2)")
    lcp_s=$(node -p "($lcp / 1000).toFixed(2)")
    si_s=$(node -p "($si / 1000).toFixed(2)")
    tbt_ms=$(node -p "Math.round($tbt)")
    cls_fmt=$(node -p "$cls.toFixed(3)")

    # Display results with color coding
    echo "Lighthouse Scores:"
    [[ $perf -ge 95 ]] && echo -e "  ${GREEN}Performance: ${perf}/100${NC}" || echo -e "  ${RED}Performance: ${perf}/100 (target: 95+)${NC}"
    [[ $a11y -ge 100 ]] && echo -e "  ${GREEN}Accessibility: ${a11y}/100${NC}" || echo -e "  ${YELLOW}Accessibility: ${a11y}/100 (target: 100)${NC}"
    [[ $bp -ge 95 ]] && echo -e "  ${GREEN}Best Practices: ${bp}/100${NC}" || echo -e "  ${YELLOW}Best Practices: ${bp}/100 (target: 95+)${NC}"
    [[ $seo -ge 95 ]] && echo -e "  ${GREEN}SEO: ${seo}/100${NC}" || echo -e "  ${YELLOW}SEO: ${seo}/100 (target: 95+)${NC}"

    echo ""
    echo "Core Web Vitals:"
    [[ $(node -p "$fcp <= 1800 ? 1 : 0") -eq 1 ]] && echo -e "  ${GREEN}FCP: ${fcp_s}s (target: <1.8s)${NC}" || echo -e "  ${YELLOW}FCP: ${fcp_s}s (target: <1.8s)${NC}"
    [[ $(node -p "$lcp <= 2500 ? 1 : 0") -eq 1 ]] && echo -e "  ${GREEN}LCP: ${lcp_s}s (target: <2.5s)${NC}" || echo -e "  ${RED}LCP: ${lcp_s}s (target: <2.5s)${NC}"
    [[ $(node -p "$tbt <= 200 ? 1 : 0") -eq 1 ]] && echo -e "  ${GREEN}TBT: ${tbt_ms}ms (target: <200ms)${NC}" || echo -e "  ${YELLOW}TBT: ${tbt_ms}ms (target: <200ms)${NC}"
    [[ $(node -p "$cls <= 0.1 ? 1 : 0") -eq 1 ]] && echo -e "  ${GREEN}CLS: ${cls_fmt} (target: <0.1)${NC}" || echo -e "  ${YELLOW}CLS: ${cls_fmt} (target: <0.1)${NC}"
    echo -e "  ${BLUE}Speed Index: ${si_s}s${NC}"

    # Store for summary
    echo "$name,$perf,$a11y,$bp,$seo,$fcp_s,$lcp_s,$tbt_ms,$cls_fmt,$si_s" >> "${OUTPUT_DIR}/summary.csv"
}

# Initialize summary file
echo "Page,Performance,Accessibility,Best Practices,SEO,FCP(s),LCP(s),TBT(ms),CLS,SI(s)" > "${OUTPUT_DIR}/summary.csv"

# Test key pages on live site
run_lighthouse_live "https://authorkit.pro/" "homepage"
run_lighthouse_live "https://authorkit.pro/features.html" "features"
run_lighthouse_live "https://authorkit.pro/pricing.html" "pricing"
run_lighthouse_live "https://authorkit.pro/docs.html" "docs"

echo ""
echo "===================================================="
echo "Performance Test Summary - Live Site"
echo "===================================================="
cat "${OUTPUT_DIR}/summary.csv" | column -t -s ','

echo ""
echo "Full reports saved in: ${OUTPUT_DIR}/"
echo "   View HTML reports: open ${OUTPUT_DIR}/*.html"

# Check if all targets met
echo ""
PASS_COUNT=$(grep -v "Page," "${OUTPUT_DIR}/summary.csv" | awk -F',' '{if($2 >= 95) count++} END {print count+0}')
TOTAL_COUNT=$(grep -v "Page," "${OUTPUT_DIR}/summary.csv" | wc -l | tr -d ' ')

if [ "$PASS_COUNT" = "$TOTAL_COUNT" ]; then
    echo -e "${GREEN}All $TOTAL_COUNT pages passed performance targets (95+)!${NC}"
    exit 0
else
    FAIL_COUNT=$((TOTAL_COUNT - PASS_COUNT))
    echo -e "${YELLOW}$PASS_COUNT/$TOTAL_COUNT pages passed. $FAIL_COUNT page(s) need improvement.${NC}"
    exit 1
fi
