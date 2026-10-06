#!/usr/bin/env bash
# Resize iPhone pack images and write sibling .webp files.
# view1 / overview → max 760px · view2/view3 → max 900px (heuristic from filename).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIRS=(
  "$ROOT/public/Gadget_Hub_iPhone_11-13_Images"
  "$ROOT/public/Gadget_Hub_iPhone_14-16_Images"
)

if ! command -v sips >/dev/null 2>&1; then
  echo "sips not found (macOS only)."
  exit 1
fi

count=0
for dir in "${DIRS[@]}"; do
  [ -d "$dir" ] || continue
  while IFS= read -r -d '' src; do
    base="$(basename "$src")"
    name="${base%.*}"
    ext="${base##*.}"
    # Skip already-webp
    ext_lower="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"
    [ "$ext_lower" = "webp" ] && continue

    # Heuristic: camera / view2 / view3 → 900; else 760
    max=760
    lower="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]')"
    case "$lower" in
      *view2*|*view3*|*camera*|*close*) max=900 ;;
    esac

    dest_webp="$(dirname "$src")/${name}.webp"
    tmp="$(mktemp -t gh-iphone).jpg"
    sips -s format jpeg -Z "$max" "$src" --out "$tmp" >/dev/null 2>&1 || { rm -f "$tmp"; continue; }
    if sips -s format webp "$tmp" --out "$dest_webp" >/dev/null 2>&1; then
      echo "ok  ${dest_webp#$ROOT/}"
      count=$((count + 1))
    else
      rm -f "$dest_webp"
    fi
    rm -f "$tmp"
  done < <(find "$dir" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)
done

echo "Wrote $count WebP file(s). getImage() already points to sibling .webp paths."
