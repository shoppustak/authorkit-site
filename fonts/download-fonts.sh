#!/bin/bash
# Download Google Fonts in WOFF2 format

echo "Downloading Playfair Display..."
curl -s "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  > playfair-display.css

echo "Downloading Source Serif 4..."
curl -s "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  > source-serif-4.css

echo "Extracting font URLs..."
grep -o 'https://[^)]*\.woff2' playfair-display.css | while read url; do
  filename=$(basename "$url" | sed 's/[^a-zA-Z0-9._-]/_/g')
  echo "  Downloading $filename..."
  curl -s "$url" -o "$filename"
done

grep -o 'https://[^)]*\.woff2' source-serif-4.css | while read url; do
  filename=$(basename "$url" | sed 's/[^a-zA-Z0-9._-]/_/g')
  echo "  Downloading $filename..."
  curl -s "$url" -o "$filename"
done

echo "✓ Fonts downloaded successfully"
ls -lh *.woff2 2>/dev/null | wc -l | xargs echo "Total font files:"
