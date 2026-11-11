/**
 * Shop-card hover swaps should stay as clean product angles —
 * closed / back / side / camera — not open-screen marketing frames
 * that read like screenshots of wallpaper or UI.
 */

/** Paths / kinds that look like lit-screen marketing or kit flat-lays on hover.
 * Keep this specific — a bare `colours` match falsely blocked Mac paths under
 * `Products_and_Colours`, which made every Air/Pro fall back to one shared hero.
 */
const BLOCK =
  /display_hero|design_top|hero_startframe|hero_endframe|\/witb|witb-|in[_-]?the[_-]?box|\/colours\/|colour[_-]?overviews?|\/swatch|pencil-|\/pencil|keyboard|ipados|macos|unselect-gallery|modal\/|pv_display|welcome_/i;

export function isSleekCardHover(src: string | null | undefined, primarySrc?: string): boolean {
  if (!src) return false;
  if (primarySrc && src === primarySrc) return false;
  if (BLOCK.test(src)) return false;
  return true;
}

export function firstSleekHover(
  candidates: Array<string | null | undefined>,
  primarySrc: string,
): string {
  for (const src of candidates) {
    if (src && isSleekCardHover(src, primarySrc)) return src;
  }
  return "";
}
