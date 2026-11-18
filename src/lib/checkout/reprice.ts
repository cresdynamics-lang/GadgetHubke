/**
 * Server-side price check for cart lines.
 * The browser sends a price per line; checkout never charges less than the
 * live admin price for that product/option, and charges it exactly when the
 * line is a plain configuration with no add-ons. A line that is not on the live
 * list, or has no listed price for its channel, cannot be bought online at all.
 */
import type { BagItem } from "./types";
import { isListedForSale, listedVariantPrices } from "../listing-offers";
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

/** Hidden KES 2 line for testing real M-Pesa payments. Works only while CHECKOUT_TEST_ITEM=1 on the server. */
export const TEST_ITEM_ID = "gh-payment-test";
export const TEST_ITEM_KES = 2;

export function testItemEnabled() {
  return process.env.CHECKOUT_TEST_ITEM === "1";
}

/** A cart line checkout will not price: off the live list, unknown, or no listed price for its channel. */
export class UnpriceableItemError extends Error {}

function notForSale(item: BagItem) {
  return new UnpriceableItemError(`${item.name || "This item"} can't be bought online right now. Ask us on WhatsApp.`);
}

/** Lowest listed price on one channel; 0 when that channel is not listed. */
function listedFloor(product: PricedProduct, exUk: boolean): number {
  const prices = product.variants.length
    ? product.variants.map((variant) => {
        const listed = listedVariantPrices(product, variant);
        return exUk ? listed.exUkKes : listed.newKes;
      })
    : [exUk ? listedVariantPrices(product).showEx ? product.exUkKes ?? 0 : 0 : listedVariantPrices(product).showNew ? product.priceKes : 0];
  const shown = prices.filter((n) => n > 0);
  return shown.length ? Math.min(...shown) : 0;
}

export async function repriceBagItems(items: BagItem[]): Promise<BagItem[]> {
  const catalog = new Map((await livePricedCatalog()).map((p) => [p.id, p]));
  return items.map((item) => {
    if (item.id === TEST_ITEM_ID) {
      if (!testItemEnabled()) throw notForSale(item);
      return { ...item, name: "Payment test", kes: TEST_ITEM_KES, qty: 1 };
    }
    const hit = resolve(item, catalog);
    if (!hit || !isListedForSale(hit.product)) throw notForSale(item);
    const { product, variant, exUk } = hit;
    const listed = variant ? listedVariantPrices(product, variant) : undefined;
    const exact = listed ? (exUk ? listed.exUkKes : listed.newKes) : 0;
    if (exact > 0 && !hasAddOns(item)) return { ...item, kes: exact };
    // Unknown option or add-ons on top: never below the lowest listed price on that channel.
    const floor = exact || listedFloor(product, exUk);
    if (!floor) throw notForSale(item);
    return item.kes < floor ? { ...item, kes: floor } : item;
  });
}
