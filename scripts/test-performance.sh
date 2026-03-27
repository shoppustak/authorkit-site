#!/bin/bash
set -e

echo "Starting performance test..."

# Start local server
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 2

# Run Lighthouse on homepage
echo "Testing homepage..."
npx lighthouse http://localhost:8000/ \
  --only-categories=performance,accessibility \
  --output=json \
  --output-path=.lighthouse/optimized/quick-test.json \
  --quiet

# Extract and display scores
PERF=$(jq '.categories.performance.score * 100' .lighthouse/optimized/quick-test.json)
A11Y=$(jq '.categories.accessibility.score * 100' .lighthouse/optimized/quick-test.json)

echo "Performance Score: $PERF/100"
echo "Accessibility Score: $A11Y/100"

# Kill server
kill $SERVER_PID

# Check if meets targets
if (( $(echo "$PERF >= 95" | bc -l) )); then
  echo "Performance target met!"
else
  echo "Performance needs improvement (target: 95+)"
fi
