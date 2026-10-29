export type LiveLookup = {
  showOnWebsite?: boolean;
  showNewOnWebsite?: boolean;
  exUkShowOnWebsite?: boolean;
  inStock?: boolean;
  exUkInStock?: boolean;
  priceKes?: number;
  exUkKes?: number;
  variants?: {
    key: string;
    priceKes: number;
    exUkKes?: number;
    inStock: boolean;
    exUkInStock?: boolean;
    showOnWebsite?: boolean;
    exUkShowOnWebsite?: boolean;
  }[];
};

function priceKes(kes: number): string {
  return `${kes.toFixed(2)} KES`;
}

function listedOnWebsite(product: LiveLookup | undefined, variantKey: string | undefined, exUk: boolean) {
  if (!product || product.showOnWebsite === false) return false;
  const variant = variantKey ? product.variants?.find((row) => row.key === variantKey) : undefined;
  if (exUk) {
    if (product.exUkShowOnWebsite === false) return false;
    if (variant && variant.exUkShowOnWebsite === false) return false;
    const kes = variant ? variant.exUkKes : product.exUkKes;
    return typeof kes === "number" && kes > 0;
  }
  if (product.showNewOnWebsite === false) return false;
  if (variant && variant.showOnWebsite === false) return false;
  const kes = variant ? variant.priceKes : product.priceKes;
  return typeof kes === "number" && kes > 0;
}

/**
 * Keep only SKUs listed on the live shop, and stamp their overlay prices.
 * iPhone sheet ids (IP-081, IP-081-EXUK) resolve through `bySheet`.
 */
export function applyLivePricesToRows<T extends { id: string; price: string; availability: string }>(
  rows: T[],
  live: Map<string, LiveLookup>,
  bySheet: Map<string, { id: string; key: string }>,
): T[] {
  const out: T[] = [];
  for (const row of rows) {
    const exUk = row.id.endsWith("-EXUK");
    const sheetHit = bySheet.get(exUk ? row.id.slice(0, -5) : row.id);
    const product = live.get(sheetHit?.id ?? row.id);
    const variantKey = sheetHit?.key;
    if (!listedOnWebsite(product, variantKey, exUk)) continue;
    const variant = variantKey ? product?.variants?.find((item) => item.key === variantKey) : undefined;
    if (exUk) {
      const kes = variant?.exUkKes ?? product?.exUkKes;
      if (kes == null) continue;
      const inStock = variant ? variant.exUkInStock !== false : product?.exUkInStock !== false;
      out.push({ ...row, price: priceKes(kes), availability: inStock ? row.availability : "out_of_stock" });
      continue;
    }
    const kes = variant?.priceKes ?? product?.priceKes;
    if (kes == null) continue;
    const inStock = variant ? variant.inStock : product?.inStock !== false;
    out.push({ ...row, price: priceKes(kes), availability: inStock ? row.availability : "out_of_stock" });
  }
  return out;
}
