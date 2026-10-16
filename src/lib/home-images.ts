/**
 * Prefer compressed homepage WebP thumbs when optimize-home-images.mjs has run.
 */
import optMap from "../../scripts/home-image-opt-map.json";

const map = optMap as Record<string, string>;

export function homeOpt(src: string | undefined | null): string {
  if (!src) return "";
  return map[src] || src;
}
