/**
 * Current iPad stock list (Oct 2026). Anything not here stays in admin/data
 * but is hidden on the public iPad shop.
 */
export const LISTED_IPAD_PRICES: Record<string, Record<string, number>> = {
  "ipad-pro-11-m5": {
    "256gb": 165_000,
    "256gb-cell": 188_000,
    "512gb-cell": 218_000,
  },
  "ipad-pro-13-m5": {
    "256gb": 185_000,
    "256gb-cell": 195_000,
    "512gb-cell": 223_000,
    "1tb-cell": 258_000,
  },
  "ipad-air-13-m4": {
    "128gb": 130_000,
    "128gb-cell": 138_000,
    "256gb": 145_000,
    "256gb-cell": 165_000,
  },
  "ipad-air-11-m4": {
    "128gb": 105_000,
    "128gb-cell": 121_000,
    "256gb": 128_000,
    "256gb-cell": 152_000,
  },
  "ipad-a16": {
    "128gb": 64_000,
    "128gb-cell": 80_000,
    "256gb": 83_000,
    "256gb-cell": 130_000,
  },
  "ipad-mini-a17-pro": {
    "128gb": 88_000,
    "128gb-cell": 107_000,
    "256gb-cell": 138_000,
  },
};

export function listedIpadPrice(modelId: string, variantKey: string): number | undefined {
  return LISTED_IPAD_PRICES[modelId]?.[variantKey];
}

export function isListedIpadModel(modelId: string): boolean {
  return Boolean(LISTED_IPAD_PRICES[modelId]);
}

export function listedIpadKeys(modelId: string): string[] {
  return Object.keys(LISTED_IPAD_PRICES[modelId] || {});
}

/** Hide unlisted iPads / configs after the admin overlay so old stock cannot reappear. */
export function enforceListedIpad<T extends {
  id: string;
  group: string;
  priceKes: number;
  inStock: boolean;
  showOnWebsite: boolean;
  variants: Array<{ key: string; priceKes: number; inStock: boolean; showOnWebsite?: boolean }>;
}>(p: T): T {
  const isIpad = p.group === "iPad" || p.id.startsWith("ipad-");
  if (!isIpad) return p;
  if (!isListedIpadModel(p.id)) {
    return { ...p, showOnWebsite: false, inStock: false };
  }
  const variants = p.variants.map((v) => {
    const kes = listedIpadPrice(p.id, v.key);
    if (kes == null) return { ...v, showOnWebsite: false, inStock: false };
    return {
      ...v,
      priceKes: kes,
      showOnWebsite: true,
      inStock: v.inStock !== false,
    };
  });
  const shown = variants.filter((v) => v.showOnWebsite !== false);
  const priceKes = shown.length ? Math.min(...shown.map((v) => v.priceKes)) : p.priceKes;
  return {
    ...p,
    variants,
    priceKes,
    showOnWebsite: shown.length > 0,
    inStock: shown.some((v) => v.inStock),
  };
}
