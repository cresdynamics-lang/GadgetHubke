/**
 * Server-side price check for cart lines.
 * The browser sends a price per line; checkout never charges less than the
 * live admin price for that product/option, and charges it exactly when the
 * line is a plain configuration with no add-ons.
 */
import type { BagItem } from "./types";
import { iphoneSheet, storageIdFromLabel } from "../pricing/iphone-sheet";
import { getSeoModelByName } from "../iphone/seo";
import { iphoneLiveId, livePricedCatalog, type PricedProduct, type PriceVariant } from "../pricing/live";

type Resolved = { product: PricedProduct; variant?: PriceVariant; exUk: boolean };

const compact = (s?: string | null) => (s || "").replace(/\s+/g, "").toLowerCase();

function isExUk(item: BagItem): boolean {
  return /ex-?uk|used/i.test(item.channel || "") || /-EXUK$/i.test(item.sheetId || item.catalogId || "");
}

function variantFor(p: PricedProduct, item: BagItem): PriceVariant | undefined {
  if (!p.variants.length) return undefined;
  const byKey = new Map(p.variants.map((v) => [v.key, v]));
  if (p.variants.length === 1 && p.variants[0].key === "base") return p.variants[0];
  const storage = compact(item.storage);
  const cellular = /cell/i.test(item.connectivity || "");
  switch (p.group) {
    case "iPad":
      return byKey.get(`${storage}${cellular ? "-cell" : ""}`);
    case "Watch":
      return byKey.get(`${compact(item.material) || "aluminum"}-${cellular ? "cell" : "gps"}`);
    case "Mac": {
      const mem = (item.memory || "").match(/\d+/)?.[0];
      return mem ? byKey.get(`${mem}gb-${storage}`) : undefined;
    }
    case "TV & Home":
      if (/ethernet/i.test(item.storage || "")) return byKey.get("128gb-ethernet");
      return byKey.get(storage) ?? byKey.get(`${storage}-wifi`);
    default:
      return item.storage ? byKey.get(storageIdFromLabel(item.storage)) : undefined;
  }
}

function hasAddOns(item: BagItem): boolean {
  const band = (item.band || "").trim();
  return Boolean(
    (item.extras || "").trim() ||
      (item.pair || "").trim() ||
      (band && !/in the pack/i.test(band)) ||
      /wireless|magsafe/i.test(item.caseOption || ""),
  );
}

function resolve(item: BagItem, catalog: Map<string, PricedProduct>): Resolved | undefined {
  const exUk = isExUk(item);
  const sheetId = (item.sheetId || item.catalogId || "").replace(/-EXUK$/i, "");
  const sheetRow = sheetId ? iphoneSheet.find((r) => r.id === sheetId) : undefined;
  if (sheetRow) {
    const seo = getSeoModelByName(sheetRow.name);
    const product = seo ? catalog.get(iphoneLiveId(seo.id)) : undefined;
    if (product) {
      const key = storageIdFromLabel(sheetRow.storage);
      return { product, variant: product.variants.find((v) => v.key === key), exUk };
    }
  }
  // Longest product id that matches the line id exactly or as a prefix ("iphone-17-pro-256GB").
  let product = catalog.get(item.id);
  if (!product) {
    let best = "";
    for (const id of catalog.keys()) {
      if (item.id.startsWith(`${id}-`) && id.length > best.length) best = id;
    }
    product = best ? catalog.get(best) : undefined;
  }
  if (!product) return undefined;
  return { product, variant: variantFor(product, item), exUk };
}

export async function repriceBagItems(items: BagItem[]): Promise<BagItem[]> {
  const catalog = new Map((await livePricedCatalog()).map((p) => [p.id, p]));
  return items.map((item) => {
    const hit = resolve(item, catalog);
    if (!hit) return item;
    const { product, variant, exUk } = hit;
    const exact = variant ? (exUk ? variant.exUkKes : variant.priceKes) : undefined;
    if (exact != null && !hasAddOns(item)) return { ...item, kes: exact };
    // Unknown option or add-ons on top: never below the live price.
    const floor = exact ?? (exUk ? undefined : product.priceKes);
    return floor != null && item.kes < floor ? { ...item, kes: floor } : item;
  });
}
