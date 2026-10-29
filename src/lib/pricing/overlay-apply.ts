/**
 * Merge an admin overlay onto a priced product.
 * New and Ex-UK stay separate: an Ex-UK-only listing does not keep leftover sheet New prices.
 */

type OverlayVariant = {
  priceKes?: number;
  exUkKes?: number;
  inStock?: boolean;
  exUkInStock?: boolean;
  showOnWebsite?: boolean;
  exUkShowOnWebsite?: boolean;
};

type OverlayEntry = {
  priceKes?: number;
  exUkKes?: number;
  inStock?: boolean;
  exUkInStock?: boolean;
  showOnWebsite?: boolean;
  showNewOnWebsite?: boolean;
  exUkShowOnWebsite?: boolean;
  storages?: Record<string, OverlayVariant>;
  coloursInStock?: string[];
  exUkColoursInStock?: string[];
  updatedAt: string;
};

type OverlayProduct = {
  priceKes: number;
  exUkKes?: number;
  inStock: boolean;
  exUkInStock?: boolean;
  showOnWebsite: boolean;
  showNewOnWebsite?: boolean;
  exUkShowOnWebsite?: boolean;
  variants: Array<{
    key: string;
    priceKes: number;
    exUkKes?: number;
    inStock: boolean;
    exUkInStock?: boolean;
    showOnWebsite?: boolean;
    exUkShowOnWebsite?: boolean;
  }>;
  coloursInStock?: string[];
  exUkColoursInStock?: string[];
  sample: boolean;
  updatedAt?: string;
};

export function applyOverlay<T extends OverlayProduct>(p: T, entry?: OverlayEntry | null): T {
  if (!entry) return p;
  const managedStorages = Boolean(entry.storages && Object.keys(entry.storages).length);
  const newListed = entry.showNewOnWebsite !== false;
  const exListed = entry.exUkShowOnWebsite !== false;
  const variants = p.variants.map((v) => {
    const o = entry.storages?.[v.key];
    if (!o) {
      if (managedStorages) {
        return { ...v, showOnWebsite: false, exUkShowOnWebsite: false, inStock: false, exUkInStock: false };
      }
      return {
        ...v,
        showOnWebsite: newListed && (typeof entry.showOnWebsite === "boolean" ? entry.showOnWebsite : v.showOnWebsite !== false),
        exUkShowOnWebsite: exListed && v.exUkShowOnWebsite !== false,
      };
    }
    return {
      ...v,
      priceKes: typeof o.priceKes === "number" ? o.priceKes : v.priceKes,
      exUkKes: typeof o.exUkKes === "number" ? o.exUkKes : v.exUkKes,
      inStock: typeof o.inStock === "boolean" ? o.inStock : v.inStock,
      exUkInStock: typeof o.exUkInStock === "boolean" ? o.exUkInStock : v.exUkInStock,
      showOnWebsite: newListed && (typeof o.showOnWebsite === "boolean" ? o.showOnWebsite : entry.showOnWebsite !== false),
      exUkShowOnWebsite:
        exListed && (typeof o.exUkShowOnWebsite === "boolean" ? o.exUkShowOnWebsite : entry.exUkShowOnWebsite !== false),
    };
  });
  const listedNew = variants.filter((v) => v.showOnWebsite !== false);
  const inStockNew = listedNew.filter((v) => v.inStock);
  const newPool = inStockNew.length ? inStockNew : listedNew;
  const priceKes = newPool.length
    ? Math.min(...newPool.map((v) => v.priceKes))
    : typeof entry.priceKes === "number"
      ? entry.priceKes
      : 0;
  const listedEx = variants.filter(
    (v) => v.exUkShowOnWebsite !== false && typeof v.exUkKes === "number" && v.exUkKes > 0,
  );
  const exUkPrices = listedEx.map((v) => v.exUkKes).filter((n): n is number => typeof n === "number" && n > 0);
  const showOnWebsite =
    typeof entry.showOnWebsite === "boolean" ? entry.showOnWebsite : listedNew.length > 0 || listedEx.length > 0;
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
