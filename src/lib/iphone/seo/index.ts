import { iphoneSeoCatalog } from "./catalog";
import type { IphoneSeoModel } from "./types";

export type { IphoneSeoModel, SeoVariant, SeoFaq, SeoSpec } from "./types";
export { sharedProductFaq, buyingBlock } from "./shared";
export { buildIphoneProductJsonLd, buildSeriesHubJsonLd } from "./jsonld";
export { variantsFromSheet } from "./prices";
export { iphoneSeoCatalog } from "./catalog";
export { seoModelGallery, type SeoGalleryImage } from "./gallery";
export {
  listSeriesHubs,
  getSeriesHub,
  seriesHubForModel,
  seriesSlug,
  type IphoneSeriesHub,
} from "./series";
export {
  SHOW_EX_UK,
  EX_UK_WARRANTY,
  EX_UK_CONDITION_LABEL,
  assertExUkWarrantyConfigured,
} from "./flags";

export function getSeoModel(id: string): IphoneSeoModel | undefined {
  return iphoneSeoCatalog.find((m) => m.id === id || m.slug === id);
}

export function getSeoModelByName(name: string): IphoneSeoModel | undefined {
  return iphoneSeoCatalog.find((m) => m.name === name);
}

export function listSeoModels(): IphoneSeoModel[] {
  return iphoneSeoCatalog;
}

/** Shop product ids that differ from SEO slugs (18 Pro lives as iphone-pro). */
export const seoIdToShopProductId: Record<string, string> = {
  "iphone-18-pro": "iphone-pro",
  "iphone-18-pro-max": "iphone-pro-max",
  "iphone-17": "iphone-17",
  "iphone-17e": "iphone-17e",
  "iphone-air": "iphone-air",
  "iphone-duo": "iphone-duo",
  "iphone-16": "iphone-16",
};

export function formatKesSeo(kes: number): string {
  return `KES ${Math.round(kes).toLocaleString("en-KE")}`;
}

/** Normalize a query for alias matching. */
export function normalizeAliasQuery(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\bi\s*phone\b/g, "iphone")
    .replace(/iphone(\d)/g, "iphone $1")
    .replace(/(\d)pro\b/g, "$1 pro")
    .replace(/promax\b/g, "pro max")
    .replace(/(\d)plus\b/g, "$1 plus")
    .replace(/(\d)mini\b/g, "$1 mini")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolve a search query to an SEO model via aliases / name.
 * Prefers exact alias, then compact form, then token containment.
 */
export function resolveSeoModelFromQuery(raw: string): IphoneSeoModel | undefined {
  const q = normalizeAliasQuery(raw);
  if (!q) return undefined;
  const compact = q.replace(/\s+/g, "");

  for (const m of iphoneSeoCatalog) {
    for (const a of m.aliases) {
      const na = normalizeAliasQuery(a);
      if (na === q || na.replace(/\s+/g, "") === compact) return m;
    }
    if (normalizeAliasQuery(m.name) === q) return m;
  }

  // "iphone 12 pro max 256" / "256gb" → strip storage tokens (not gen numbers like 12)
  const withoutStorage = q
    .replace(/\b\d+\s*gb\b/g, "")
    .replace(/\b\d+\s*tb\b/g, "")
    .replace(/\b(64|128|256|512|1024)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (withoutStorage !== q) {
    return resolveSeoModelFromQuery(withoutStorage);
  }

  return undefined;
}
