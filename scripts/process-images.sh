#!/usr/bin/env bash
# Process staged product images → public/product-media (JPEG + WebP via macOS sips).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGING="$ROOT/public/_image-staging"
OUT="$ROOT/public/product-media"

if ! command -v sips >/dev/null 2>&1; then
  echo "sips not found (macOS only). Install nothing; copy files manually to public/product-media."
  exit 1
fi

mkdir -p "$OUT"

shopt -s nullglob
count=0
for category in hero iphone mac ipad watch airpods accessories; do
  mkdir -p "$OUT/$category"
  for src in "$STAGING/$category"/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}; do
    [ -f "$src" ] || continue
    base="$(basename "$src")"
    name="${base%.*}"
    dest_jpg="$OUT/$category/${name}.jpg"
    dest_webp="$OUT/$category/${name}.webp"

    # Normalize to JPEG for consistent stages
    sips -s format jpeg "$src" --out "$dest_jpg" >/dev/null
    # Cap long edge for 4G-friendly payloads
    sips -Z 1600 "$dest_jpg" >/dev/null

    if sips -s format webp "$dest_jpg" --out "$dest_webp" >/dev/null 2>&1; then
      :
    else
      # Older macOS may lack WebP write; leave JPEG only
      rm -f "$dest_webp"
    fi

    echo "ok  $category/$name"
    count=$((count + 1))
  done
done

echo "Processed $count file(s) → public/product-media/"
echo "Wire new paths in src/lib/images.ts when ready."
