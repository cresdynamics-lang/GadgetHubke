/**
 * Buy-side stock channel: New (sealed) vs EX-UK (ex-UK import).
 * Toggles sample price only - not refurbished grades.
 */

export type StockChannel = "new" | "ex-uk";

/** Derive EX-UK sample from New - ~12% under, xxx999 style. */
export function exUkFromNew(newKes: number): number {
  const raw = newKes * 0.88;
  return Math.max(999, Math.round(raw / 1000) * 1000 - 1);
}

export function priceForChannel(
  newKes: number,
  channel: StockChannel,
  exUkKes?: number,
): number {
  if (channel === "ex-uk") return exUkKes ?? exUkFromNew(newKes);
  return newKes;
}

export const STOCK_CHANNEL_LABEL: Record<StockChannel, string> = {
  new: "New",
  "ex-uk": "EX-UK",
};

export const STOCK_CHANNEL_HINT =
  "New = sealed unit. EX-UK = ex-UK import. Sample prices - confirm on WhatsApp.";
