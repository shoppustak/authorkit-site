#!/bin/bash
set -e

echo "🖼️  Optimizing images..."

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "Installing webp tools..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install webp
    else
        sudo apt-get update && sudo apt-get install -y webp
    fi
fi

# Convert JPG/PNG images to WebP
for img in images/*.{jpg,jpeg,png} images/**/*.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        output="${img%.*}.webp"
        echo "Converting $img to $output..."
        cwebp -q 85 "$img" -o "$output"

        # Create smaller variants for responsive images
        base="${img%.*}"
        ext="${img##*.}"

        # Create 320w variant
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sips -Z 320 "$img" --out "${base}-320.${ext}" 2>/dev/null || true
            [ -f "${base}-320.${ext}" ] && cwebp -q 85 "${base}-320.${ext}" -o "${base}-320.webp" 2>/dev/null || true
        fi

        # Create 640w variant
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sips -Z 640 "$img" --out "${base}-640.${ext}" 2>/dev/null || true
            [ -f "${base}-640.${ext}" ] && cwebp -q 85 "${base}-640.${ext}" -o "${base}-640.webp" 2>/dev/null || true
        fi
    fi
done

# Report results
echo ""
echo "📊 Image optimization complete:"
echo ""
echo "Original images:"
ls -lh images/*.{jpg,jpeg,png} images/**/*.{jpg,jpeg,png} 2>/dev/null | grep -v "^d" || echo "No original images found"
echo ""
echo "WebP images:"
ls -lh images/*.webp images/**/*.webp 2>/dev/null | grep -v "^d" || echo "No WebP images created yet"
echo ""
echo "✅ Done!"
