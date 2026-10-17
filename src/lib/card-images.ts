/**
 * Tiny WebP shop-card thumbs built by `npx tsx scripts/build-card-images.mjs`.
 */
import cardMap from "../../scripts/card-image-map.json";

const map = cardMap as Record<string, string>;

/** Card thumb if generated; otherwise the fallback product photo. */
export function cardImageSrc(productId: string, fallback: string): string {
  return map[productId] || fallback;
}

export function hasCardImage(productId: string): boolean {
  return Boolean(map[productId]);
}
