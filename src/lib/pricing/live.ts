/**
 * Live storefront prices.
 * Repo price sheets are the defaults, corrected by price-baseline.json;
 * admin "Prices & stock" overlays win.
 * Product pages, feeds and checkout all read prices through here.
 */
import { products } from "../products";
import { listSeoModels, seoIdToShopProductId } from "../iphone/seo";
import { macModels } from "../mac";
import { ipadModels } from "../ipad";
import { watchModels } from "../watch";
import { airpodsModels } from "../airpods";
import { tvHomeModels } from "../tv-home";
import { accessories } from "../accessories/models";
import { getOverlayMap, type CatalogOverlayMap } from "../admin/overlay";
import { applyOverlay } from "./overlay-apply";
import priceBaseline from "./price-baseline.json";
import { sheetRowsForProduct, storageIdFromLabel } from "./iphone-sheet";
import { macSheetForModel, macConfigStorageId, macConfigStorageLabel } from "./mac-sheet";
import { ipadSheetForModel, ipadConfigStorageId, ipadConfigStorageLabel } from "./ipad-sheet";
import { listedIpadPrice, isListedIpadModel, enforceListedIpad } from "./ipad-listed";
import { availableColours, textOnlyColours } from "../iphone/images";
import { watchSheetForModel, watchConfigStorageId, watchConfigStorageLabel } from "./watch-sheet";
import { tvHomeSheetForModel, tvHomeConfigStorageId, tvHomeConfigStorageLabel } from "./tv-home-sheet";

export { applyOverlay };

export type PriceVariant = {
  key: string;
  label: string;
  priceKes: number;
  exUkKes?: number;
  inStock: boolean;
  exUkInStock?: boolean;
  showOnWebsite?: boolean;
  exUkShowOnWebsite?: boolean;
};

export type PricedProduct = {
  id: string;
  name: string;
  group: string;
  href: string;
  /** Lowest in-stock variant price, or the single price when there are no variants. */
  priceKes: number;
  exUkKes?: number;
  basePriceKes: number;
  inStock: boolean;
  exUkInStock?: boolean;
  showOnWebsite: boolean;
  showNewOnWebsite?: boolean;
  exUkShowOnWebsite?: boolean;
  variants: PriceVariant[];
  /** Catalogue finishes for admin stock ticks. Empty means “all colours”. */
  colours?: string[];
  coloursInStock?: string[];
  exUkColoursInStock?: string[];
  /** True when nothing has been saved in admin for this product. */
  sample: boolean;
  updatedAt?: string;
};

function product(
  id: string,
  name: string,
  group: string,
  href: string,
  basePriceKes: number,
  variants: PriceVariant[] = [],
  inStock = true,
  colours: string[] = [],
): PricedProduct {
  const base = (priceBaseline.products as Record<string, Record<string, { priceKes?: number; exUkKes?: number }>>)[id];
  if (base) {
    variants = variants.map((v) => {
      const b = base[v.key];
      return b ? { ...v, priceKes: b.priceKes ?? v.priceKes, exUkKes: b.exUkKes ?? v.exUkKes } : v;
    });
  }
  const shown = variants.filter((v) => v.showOnWebsite !== false);
  const priceKes = shown.length
    ? Math.min(...shown.map((v) => v.priceKes))
    : variants.length
      ? Math.min(...variants.map((v) => v.priceKes))
      : basePriceKes;
  return {
    id,
    name,
    group,
    href,
    priceKes,
    basePriceKes: priceKes,
    inStock,
    showOnWebsite: true,
    variants,
    colours: colours.length ? [...new Set(colours)] : undefined,
    sample: true,
  };
}

/** Last row wins when a sheet repeats a key (matches how admin overlays were seeded). */
function dedupe(variants: PriceVariant[]): PriceVariant[] {
  const map = new Map<string, PriceVariant>();
  for (const v of variants) map.set(v.key, v);
  return [...map.values()];
}

function iphoneVariants(name: string): PriceVariant[] {
  return sheetRowsForProduct(name).map((r) => ({
    key: storageIdFromLabel(r.storage),
    label: r.storage,
    priceKes: r.newKes,
    exUkKes: r.exUkKes,
    inStock: true,
  }));
}

/** Every sellable product with its default (repo) prices. */
export function defaultPricedCatalog(): PricedProduct[] {
  const rows: PricedProduct[] = [];
  const seen = new Set<string>();
  const push = (p: PricedProduct) => {
    if (seen.has(p.id)) return;
    seen.add(p.id);
    rows.push(p);
  };

  for (const p of products) {
    const variants = p.storages.map((s) => ({
      key: s.id,
      label: s.label,
      priceKes: s.priceKes,
      exUkKes: s.exUkKes,
      inStock: true,
    }));
    push(product(p.id, p.name, "Shop iPhone", p.overviewHref, p.storages[0]?.priceKes ?? 0, variants, true, [...availableColours(p.id), ...textOnlyColours(p.id)]));
  }

  // iPhone models without a shop entry (11–17 Pro Max) — keyed by SEO page id.
  for (const m of listSeoModels()) {
    if (seoIdToShopProductId[m.id]) continue;
    const variants = iphoneVariants(m.name);
    push(product(m.id, m.name, "iPhone catalog", `/iphone/${m.id}`, m.fromKes, variants, true, [...availableColours(m.id), ...textOnlyColours(m.id)]));
  }

  for (const m of macModels) {
    const variants = dedupe(
      macSheetForModel(m.id).map((r) => ({
        key: macConfigStorageId(r.memoryGb, r.storage),
        label: macConfigStorageLabel(r.memoryGb, r.storage),
        priceKes: r.newKes,
        exUkKes: r.exUkKes,
        inStock: true,
      })),
    );
    push(product(m.id, m.name, "Mac", `/mac/${m.id}`, m.basePriceKes, variants, true, m.colours));
  }

  for (const m of ipadModels) {
    const listed = isListedIpadModel(m.id);
    const variants = dedupe(
      ipadSheetForModel(m.id).map((r) => {
        const key = ipadConfigStorageId(r.storage, r.cellular);
        const listedKes = listedIpadPrice(m.id, key);
        const on = listedKes != null;
        return {
          key,
          label: ipadConfigStorageLabel(r.storage, r.cellular),
          priceKes: listedKes ?? r.newKes,
          exUkKes: r.exUkKes,
          inStock: on,
          showOnWebsite: on,
        };
      }),
    );
    const row = product(m.id, m.name, "iPad", `/ipad/${m.id}`, m.basePriceKes, variants, listed, m.colours);
    if (!listed) {
      row.showOnWebsite = false;
      row.inStock = false;
    }
    push(row);
  }

  for (const m of watchModels) {
    const variants = dedupe(
      watchSheetForModel(m.id).map((r) => ({
        key: watchConfigStorageId(r),
        label: watchConfigStorageLabel(r),
        priceKes: r.newKes,
        exUkKes: r.exUkKes,
        inStock: true,
      })),
    );
    push(product(m.id, m.name, "Watch", `/watch/${m.id}`, m.basePriceKes, variants, true, m.colours));
  }

  for (const m of airpodsModels) {
    push(
      product(m.id, m.name, "AirPods", `/airpods/${m.id}`, m.basePriceKes, [
        { key: "base", label: "Standard", priceKes: m.basePriceKes, inStock: true },
      ], true, m.colours),
    );
  }

  for (const m of tvHomeModels) {
    const sheet = tvHomeSheetForModel(m.id);
    const variants = sheet.length
      ? dedupe(
          sheet.map((r) => ({
            key: tvHomeConfigStorageId(r),
            label: tvHomeConfigStorageLabel(r),
            priceKes: r.newKes,
            exUkKes: r.exUkKes,
            inStock: true,
          })),
        )
      : [];
    push(product(m.id, m.name, "TV & Home", `/tv-home/${m.id}`, m.basePriceKes, variants, !m.noImage, m.colours));
  }

  for (const a of accessories) {
    push(
      product(a.id, a.name, "Accessories", `/accessories/${a.id}`, a.basePriceKes, [
        { key: "base", label: "Standard", priceKes: a.basePriceKes, inStock: true },
      ]),
    );
  }

  return rows;
}

let cache: { at: number; overlay: CatalogOverlayMap } | null = null;

/** Overlay map with a short in-process cache so page renders stay cheap. */
export async function liveOverlay(maxAgeMs = 5000): Promise<CatalogOverlayMap> {
  if (cache && Date.now() - cache.at < maxAgeMs) return cache.overlay;
  const overlay = await getOverlayMap();
  cache = { at: Date.now(), overlay };
  return overlay;
}

export function clearLiveCache() {
  cache = null;
}

export async function livePricedCatalog(): Promise<PricedProduct[]> {
  const overlay = await liveOverlay();
  return defaultPricedCatalog().map((p) => enforceListedIpad(applyOverlay(p, overlay[p.id])));
}

export async function livePricedProduct(id: string): Promise<PricedProduct | undefined> {
  const base = defaultPricedCatalog().find((p) => p.id === id);
  if (!base) return undefined;
  const overlay = await liveOverlay();
  return enforceListedIpad(applyOverlay(base, overlay[id]));
}

/** key → variant, for product page scripts. Hidden options are omitted. */
export function variantPriceMap(p: PricedProduct | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of p?.variants ?? []) {
    if (v.showOnWebsite === false) continue;
    out[v.key] = v.priceKes;
  }
  return out;
}

/** key → Ex-UK price (only options that have one). */
export function variantExUkMap(p: PricedProduct | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of p?.variants ?? []) {
    if (v.showOnWebsite === false || v.exUkShowOnWebsite === false) continue;
    if (typeof v.exUkKes === "number" && v.exUkKes > 0) out[v.key] = v.exUkKes;
  }
  return out;
}

/** True when the product sells Ex-UK on at least one option. */
export function hasExUk(p: PricedProduct | undefined): boolean {
  return Object.keys(variantExUkMap(p)).length > 0 || (typeof p?.exUkKes === "number" && p.exUkKes > 0);
}

/** Live "from" prices for comparisons: lowest New and lowest Ex-UK per product id. */
export async function liveFromPrices(): Promise<(id: string) => { newKes?: number; exUkKes?: number }> {
  const map = new Map((await livePricedCatalog()).map((p) => [p.id, p]));
  return (id) => {
    const p = map.get(id);
    if (!p) return {};
    const ex = Object.values(variantExUkMap(p));
    return { newKes: p.priceKes, exUkKes: ex.length ? Math.min(...ex) : p.exUkKes };
  };
}

/** The admin/live id an iPhone SEO page prices against. */
export function iphoneLiveId(seoId: string): string {
  return seoIdToShopProductId[seoId] ?? seoId;
}

export function isShownOnWebsite(p: PricedProduct) {
  return p.showOnWebsite !== false;
}

export async function websiteVisibleIdSet(): Promise<Set<string>> {
  return new Set((await livePricedCatalog()).filter(isShownOnWebsite).map((p) => p.id));
}

export function filterVisibleById<T extends { id: string }>(items: T[], visible: Set<string>) {
  if (!visible.size) return items;
  return items.filter((item) => visible.has(item.id));
}
