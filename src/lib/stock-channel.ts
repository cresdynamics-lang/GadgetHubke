/**
 * Buy-side stock channel: New (sealed) vs XUK (ex-UK import).
 * Toggles sample price only — not refurbished grades.
 */

export type StockChannel = "new" | "xuk";

/** Derive XUK sample from New — ~12% under, xxx999 style. */
export function xukFromNew(newKes: number): number {
  const raw = newKes * 0.88;
  return Math.max(999, Math.round(raw / 1000) * 1000 - 1);
}

export function priceForChannel(
  newKes: number,
  channel: StockChannel,
  xukKes?: number,
): number {
  if (channel === "xuk") return xukKes ?? xukFromNew(newKes);
  return newKes;
}

export const STOCK_CHANNEL_LABEL: Record<StockChannel, string> = {
  new: "New",
  xuk: "XUK",
};

export const STOCK_CHANNEL_HINT =
  "New = sealed unit. XUK = ex-UK import. Sample prices — confirm on WhatsApp.";
