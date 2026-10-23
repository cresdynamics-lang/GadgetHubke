/**
 * Meta catalogue matching helpers.
 * Pixel content_ids MUST equal the `id` column in /feeds/meta-catalog.csv
 * (iPhone sheet IDs like IP-074, or model ids like macbook-air-13-m2).
 */
import { getSeoModel } from "../iphone/seo";

/** Catalogue retailer ids for an iPhone SEO model page (all storage SKUs). */
export function iphoneCatalogIds(seoId: string): string[] {
  const seo = getSeoModel(seoId);
  if (!seo) return [];
  return seo.variants.map((v) => v.sheetId).filter(Boolean);
}

/** Resolve a single catalogue id from a bag / checkout line. */
export function catalogIdFromLine(line: {
  id?: string;
  catalogId?: string;
  sheetId?: string;
  storage?: string;
  href?: string;
}): string {
  if (line.catalogId) return String(line.catalogId);
  if (line.sheetId) return String(line.sheetId);
  // iPhone bag ids look like "iphone-16-128GB" — map via SEO sheet when possible
  const href = line.href || "";
  const m = href.match(/\/iphone\/([^/?#]+)/);
  if (m) {
    const seo = getSeoModel(m[1]);
    if (seo && line.storage) {
      const hit = seo.variants.find(
        (v) => v.storage.toLowerCase() === String(line.storage).toLowerCase(),
      );
      if (hit?.sheetId) return hit.sheetId;
    }
    if (seo?.variants[0]?.sheetId) return seo.variants[0].sheetId;
  }
  return String(line.id || "");
}
