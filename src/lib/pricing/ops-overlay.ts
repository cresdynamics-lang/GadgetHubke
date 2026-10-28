import type { CatalogOverlayEntry, CatalogOverlayMap } from "../admin/overlay";
import { colourKey } from "../listing-offers.ts";

type CatalogProduct = {
  id: string;
  group: string;
  variants: { key: string }[];
};

export type OpsCatalogVariant = {
  key: string;
  priceKes: number;
  inStock: boolean;
  showOnWebsite: boolean;
  condition?: "NEW" | "EX_UK";
  colour?: string | null;
  available?: number;
};

export type OpsCatalogItem = {
  id: string;
  group?: string;
  showOnWebsite: boolean;
  inStock: boolean;
  priceKes: number;
  variants: OpsCatalogVariant[];
};

export type OpsCatalog = {
  source: string;
  generatedAt: string;
  managedGroups: string[];
  managedAccessoryPrefixes?: string[];
  items: OpsCatalogItem[];
};

function uniqueColours(variants: OpsCatalogVariant[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const variant of variants) {
    const colour = variant.colour?.trim();
    if (!colour) continue;
    const key = colourKey(colour);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

function isManaged(product: CatalogProduct, ops: OpsCatalog) {
  if (ops.managedGroups.includes(product.group)) return true;
  const prefixes = ops.managedAccessoryPrefixes || [];
  return product.group === "Accessories" && prefixes.some((prefix) => product.id.startsWith(prefix));
}

/** Merge operations-system prices/visibility onto the local overlay. Local overlay is kept for unmanaged groups. */
export function mergeOpsCatalog(local: CatalogOverlayMap, ops: OpsCatalog, catalog: CatalogProduct[]): CatalogOverlayMap {
  const byId = new Map(ops.items.map((item) => [item.id, item]));
  const now = ops.generatedAt || new Date().toISOString();
  const next: CatalogOverlayMap = { ...local };

  const listedItems = ops.items.filter((item) => item.showOnWebsite);
  const listedGroups = new Set(listedItems.map((item) => item.group).filter((group): group is string => Boolean(group)));

  for (const product of catalog) {
    if (!isManaged(product, ops)) continue;
    if (!listedItems.length) continue;
    if (listedGroups.size && !listedGroups.has(product.group)) continue;
    const item = byId.get(product.id);
    const prev = next[product.id];
    const storages: Record<string, CatalogOverlayVariant> = { ...(prev?.storages || {}) };

    if (!item || !item.showOnWebsite) {
      for (const variant of product.variants) {
        storages[variant.key] = { ...storages[variant.key], inStock: false, showOnWebsite: false };
      }
      next[product.id] = {
        ...prev,
        showOnWebsite: false,
        inStock: false,
        storages,
        updatedAt: now,
      };
      continue;
    }

    const listed = item.variants.filter((variant) => variant.showOnWebsite);
    const newListed = listed.filter((variant) => (variant.condition || "NEW") === "NEW");
    const exListed = listed.filter((variant) => variant.condition === "EX_UK");
    const newByKey = new Map(newListed.map((variant) => [variant.key, variant]));
    const exByKey = new Map(exListed.map((variant) => [variant.key, variant]));

    for (const variant of product.variants) {
      const newVar = newByKey.get(variant.key);
      const exVar = exByKey.get(variant.key);
      const prevStorage = storages[variant.key] || {};
      if (!newVar && !exVar) {
        storages[variant.key] = { ...prevStorage, inStock: false, showOnWebsite: false, exUkShowOnWebsite: false };
        continue;
      }
      storages[variant.key] = {
        ...prevStorage,
        ...(newVar
          ? { priceKes: newVar.priceKes, inStock: newVar.inStock, showOnWebsite: true }
          : { showOnWebsite: false, inStock: false }),
        ...(exVar
          ? { exUkKes: exVar.priceKes, exUkInStock: exVar.inStock, exUkShowOnWebsite: true }
          : { exUkShowOnWebsite: false, exUkInStock: false }),
      };
    }
    for (const opsVariant of listed) {
      const prevStorage = storages[opsVariant.key] || {};
      if ((opsVariant.condition || "NEW") === "NEW" && !prevStorage.showOnWebsite) {
        storages[opsVariant.key] = { ...prevStorage, priceKes: opsVariant.priceKes, inStock: opsVariant.inStock, showOnWebsite: true };
      }
      if (opsVariant.condition === "EX_UK" && !prevStorage.exUkShowOnWebsite) {
        storages[opsVariant.key] = {
          ...(storages[opsVariant.key] || prevStorage),
          exUkKes: opsVariant.priceKes,
          exUkInStock: opsVariant.inStock,
          exUkShowOnWebsite: true,
        };
      }
    }

    const newColours = uniqueColours(newListed.filter((variant) => variant.inStock));
    const exColours = uniqueColours(exListed.filter((variant) => variant.inStock));
    const exPrices = exListed.map((variant) => variant.priceKes).filter((n) => n > 0);

    next[product.id] = {
      ...prev,
      priceKes: item.priceKes,
      inStock: item.inStock,
      showOnWebsite: true,
      showNewOnWebsite: newListed.length > 0,
      exUkShowOnWebsite: exListed.length > 0,
      ...(exPrices.length ? { exUkKes: Math.min(...exPrices), exUkInStock: exListed.some((variant) => variant.inStock) } : {}),
      ...(newColours.length ? { coloursInStock: newColours } : {}),
      ...(exColours.length ? { exUkColoursInStock: exColours } : {}),
      storages,
      updatedAt: now,
    };
  }

  return next;
}

export function overlayShowsOnWebsite(entry?: CatalogOverlayEntry | null) {
  if (!entry) return true;
  if (entry.showOnWebsite === false) return false;
  if (entry.storages && Object.keys(entry.storages).length) {
    return Object.values(entry.storages).some((variant) => variant.showOnWebsite !== false);
  }
  return true;
}
