#!/bin/bash

echo "📥 Downloading Playfair Display (WOFF2)..."
curl -s "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" \
  -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  > fonts/playfair-display.css

echo "📥 Downloading Source Serif 4 (WOFF2)..."
curl -s "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap" \
  -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  > fonts/source-serif-4.css

echo "📦 Extracting and downloading font files..."
cd fonts

# Download Playfair Display fonts
grep -o 'https://[^)]*\.woff2' playfair-display.css | while read url; do
  filename="playfair-display-$(echo $url | grep -o 'font-weight: [0-9]*' ../playfair-display.css | head -1 | awk '{print $2}').woff2"
  echo "  → $filename"
  curl -s "$url" -o "$filename"
done

# Download Source Serif 4 fonts  
grep -o 'https://[^)]*\.woff2' source-serif-4.css | while read url; do
  filename="source-serif-4-$(echo $url | grep -o 'font-weight: [0-9]*' ../source-serif-4.css | head -1 | awk '{print $2}').woff2"
  echo "  → $filename"
  curl -s "$url" -o "$filename"
done

cd ..
echo "✅ Downloaded $(ls fonts/*.woff2 2>/dev/null | wc -l | tr -d ' ') font files"
ls -lh fonts/*.woff2 2>/dev/null
