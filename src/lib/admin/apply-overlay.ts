/**
 * Merge catalog overlay onto product commerce fields for storefront SSR.
 */
import type { Product, ProductColor, ProductStorage } from "../products";
import type { CatalogOverlayEntry, CatalogOverlayMap } from "./overlay";
import { getOverlayMap } from "./overlay";

export function mergeStoragesWithOverlay(
  storages: ProductStorage[],
  entry?: CatalogOverlayEntry | null,
): ProductStorage[] {
  if (!entry?.storages) return storages;
  return storages.map((s) => {
    const o = entry.storages?.[s.id];
    if (!o) return s;
    return {
      ...s,
      priceKes: typeof o.priceKes === "number" ? o.priceKes : s.priceKes,
      exUkKes: typeof o.exUkKes === "number" ? o.exUkKes : s.exUkKes,
    };
  });
}

export function mergeColorsWithOverlay(
  colors: ProductColor[],
  entry?: CatalogOverlayEntry | null,
): ProductColor[] {
  if (!entry?.coloursInStock?.length) return colors;
  const allowed = new Set(entry.coloursInStock);
  return colors.filter((c) => allowed.has(c.id));
}

export function applyOverlayToProduct(
  product: Product,
  overlay: CatalogOverlayMap,
): Product & { inStock: boolean; overlayConfirmed: boolean } {
  const entry = overlay[product.id];
  const storages = mergeStoragesWithOverlay(product.storages, entry);
  const colors = mergeColorsWithOverlay(product.colors, entry);
  const inStock = entry?.inStock != null ? entry.inStock : true;
  return {
    ...product,
    storages,
    colors: colors.length ? colors : product.colors,
    inStock,
    overlayConfirmed: Boolean(entry?.confirmed),
  };
}

export async function loadProductWithOverlay(product: Product) {
  const overlay = await getOverlayMap();
  return applyOverlayToProduct(product, overlay);
}

export async function loadOverlayMap() {
  return getOverlayMap();
}
