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
import { getOverlayMap, type CatalogOverlayEntry, type CatalogOverlayMap } from "../admin/overlay";
import { fetchOpsCatalog } from "./ops-catalog";
import { mergeOpsCatalog } from "./ops-overlay";
import priceBaseline from "./price-baseline.json";
import { sheetRowsForProduct, storageIdFromLabel } from "./iphone-sheet";
import { macSheetForModel, macConfigStorageId, macConfigStorageLabel } from "./mac-sheet";
import { ipadSheetForModel, ipadConfigStorageId, ipadConfigStorageLabel } from "./ipad-sheet";
import { watchSheetForModel, watchConfigStorageId, watchConfigStorageLabel } from "./watch-sheet";
import { tvHomeSheetForModel, tvHomeConfigStorageId, tvHomeConfigStorageLabel } from "./tv-home-sheet";

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
): PricedProduct {
  const base = (priceBaseline.products as Record<string, Record<string, { priceKes?: number; exUkKes?: number }>>)[id];
  if (base) {
    variants = variants.map((v) => {
      const b = base[v.key];
      return b ? { ...v, priceKes: b.priceKes ?? v.priceKes, exUkKes: b.exUkKes ?? v.exUkKes } : v;
    });
  }
  const priceKes = variants.length ? Math.min(...variants.map((v) => v.priceKes)) : basePriceKes;
  return { id, name, group, href, priceKes, basePriceKes: priceKes, inStock, showOnWebsite: true, variants, sample: true };
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
    push(product(p.id, p.name, "Shop iPhone", p.overviewHref, p.storages[0]?.priceKes ?? 0, variants));
  }

  // iPhone models without a shop entry (11–17 Pro Max) — keyed by SEO page id.
  for (const m of listSeoModels()) {
    if (seoIdToShopProductId[m.id]) continue;
    const variants = iphoneVariants(m.name);
    push(product(m.id, m.name, "iPhone catalog", `/iphone/${m.id}`, m.fromKes, variants));
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
    push(product(m.id, m.name, "Mac", `/mac/${m.id}`, m.basePriceKes, variants));
  }

  for (const m of ipadModels) {
    const variants = dedupe(
      ipadSheetForModel(m.id).map((r) => ({
        key: ipadConfigStorageId(r.storage, r.cellular),
        label: ipadConfigStorageLabel(r.storage, r.cellular),
        priceKes: r.newKes,
        exUkKes: r.exUkKes,
        inStock: true,
      })),
    );
    push(product(m.id, m.name, "iPad", `/ipad/${m.id}`, m.basePriceKes, variants));
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
    push(product(m.id, m.name, "Watch", `/watch/${m.id}`, m.basePriceKes, variants));
  }

  for (const m of airpodsModels) {
    push(
      product(m.id, m.name, "AirPods", `/airpods/${m.id}`, m.basePriceKes, [
        { key: "base", label: "Standard", priceKes: m.basePriceKes, inStock: true },
      ]),
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
    push(product(m.id, m.name, "TV & Home", `/tv-home/${m.id}`, m.basePriceKes, variants, !m.noImage));
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

export function applyOverlay(p: PricedProduct, entry?: CatalogOverlayEntry | null): PricedProduct {
  if (!entry) return p;
  const managedStorages = Boolean(entry.storages && Object.keys(entry.storages).length);
  const variants = p.variants.map((v) => {
    const o = entry.storages?.[v.key];
    if (!o) {
      if (managedStorages) {
        return { ...v, showOnWebsite: false, exUkShowOnWebsite: false, inStock: false, exUkInStock: false };
      }
      return {
        ...v,
        showOnWebsite: typeof entry.showOnWebsite === "boolean" ? entry.showOnWebsite : v.showOnWebsite !== false,
      };
    }
    return {
      ...v,
      priceKes: typeof o.priceKes === "number" ? o.priceKes : v.priceKes,
      exUkKes: typeof o.exUkKes === "number" ? o.exUkKes : v.exUkKes,
      inStock: typeof o.inStock === "boolean" ? o.inStock : v.inStock,
      exUkInStock: typeof o.exUkInStock === "boolean" ? o.exUkInStock : v.exUkInStock,
      showOnWebsite: typeof o.showOnWebsite === "boolean" ? o.showOnWebsite : entry.showOnWebsite !== false,
      exUkShowOnWebsite: typeof o.exUkShowOnWebsite === "boolean" ? o.exUkShowOnWebsite : entry.exUkShowOnWebsite,
    };
  });
  const shown = variants.filter((v) => v.showOnWebsite !== false);
  const inStockVariants = shown.filter((v) => v.inStock);
  const pool = inStockVariants.length ? inStockVariants : shown.length ? shown : variants;
  const priceKes = pool.length
    ? Math.min(...pool.map((v) => v.priceKes))
    : typeof entry.priceKes === "number"
      ? entry.priceKes
      : p.priceKes;
  const showOnWebsite = typeof entry.showOnWebsite === "boolean" ? entry.showOnWebsite : shown.length > 0;
  const exUkPrices = variants.map((v) => v.exUkKes).filter((n): n is number => typeof n === "number" && n > 0);
  return {
    ...p,
    variants,
    priceKes,
    exUkKes: typeof entry.exUkKes === "number" ? entry.exUkKes : exUkPrices.length ? Math.min(...exUkPrices) : p.exUkKes,
    inStock: typeof entry.inStock === "boolean" ? entry.inStock : p.inStock,
    exUkInStock: typeof entry.exUkInStock === "boolean" ? entry.exUkInStock : p.exUkInStock,
    showOnWebsite,
    showNewOnWebsite: typeof entry.showNewOnWebsite === "boolean" ? entry.showNewOnWebsite : p.showNewOnWebsite,
    exUkShowOnWebsite: typeof entry.exUkShowOnWebsite === "boolean" ? entry.exUkShowOnWebsite : p.exUkShowOnWebsite,
    coloursInStock: entry.coloursInStock ?? p.coloursInStock,
    exUkColoursInStock: entry.exUkColoursInStock ?? p.exUkColoursInStock,
    sample: false,
    updatedAt: entry.updatedAt,
  };
}

let cache: { at: number; overlay: CatalogOverlayMap } | null = null;

/** Overlay map with a short in-process cache so page renders stay cheap. */
export async function liveOverlay(maxAgeMs = 5000): Promise<CatalogOverlayMap> {
  if (cache && Date.now() - cache.at < maxAgeMs) return cache.overlay;
  const local = await getOverlayMap();
  const ops = await fetchOpsCatalog();
  const overlay = ops ? mergeOpsCatalog(local, ops, defaultPricedCatalog()) : local;
  cache = { at: Date.now(), overlay };
  return overlay;
}

export function clearLiveCache() {
  cache = null;
}

export async function livePricedCatalog(): Promise<PricedProduct[]> {
  const overlay = await liveOverlay();
  return defaultPricedCatalog().map((p) => applyOverlay(p, overlay[p.id]));
}

export async function livePricedProduct(id: string): Promise<PricedProduct | undefined> {
  const base = defaultPricedCatalog().find((p) => p.id === id);
  if (!base) return undefined;
  const overlay = await liveOverlay();
  return applyOverlay(base, overlay[id]);
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
