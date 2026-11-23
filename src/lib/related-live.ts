/**
 * "Compare with" cards on product pages: keep only products on sale and show their
 * live from-price (the same number as the menu), never the repo base price.
 */
import { listedFromKes, isListedForSale } from "./listing-offers";
import { livePricedCatalog } from "./pricing/live";

export async function relatedAtLivePrices<T extends { id: string; basePriceKes: number }>(
  items: T[],
  liveId: (id: string) => string = (id) => id,
): Promise<T[]> {
  const catalog = new Map((await livePricedCatalog()).map((p) => [p.id, p]));
  return items.flatMap((item) => {
    const live = catalog.get(liveId(item.id));
    if (live && !isListedForSale(live)) return [];
    const kes = (live && listedFromKes(live)) || item.basePriceKes;
    return kes > 0 ? [{ ...item, basePriceKes: kes }] : [];
  });
}
