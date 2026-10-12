import { iphoneConfig } from "./config";
import { sheetRowsForProduct } from "../pricing/iphone-sheet";

export type StoragePrice = {
  label: string;
  kes: number;
  sheetId?: string;
  exUkKes?: number;
};

/**
 * Storage prices for a model. Prefer the official sheet by model name;
 * fall back to base + steps only when the sheet has no rows.
 */
export function storagePrices(
  baseKes: number,
  sizes: string[],
  modelName?: string,
): StoragePrice[] {
  if (modelName) {
    const rows = sheetRowsForProduct(modelName);
    if (rows.length) {
      return rows.map((r) => ({
        label: r.storage,
        kes: r.newKes,
        sheetId: r.id,
        exUkKes: r.exUkKes,
      }));
    }
  }
  return sizes.map((label, i) => ({
    label,
    kes:
      baseKes +
      (iphoneConfig.storageStepsKes[i] ??
        iphoneConfig.storageStepsKes[iphoneConfig.storageStepsKes.length - 1]),
  }));
}

export function formatKes(kes: number): string {
  return `KES ${Math.round(kes).toLocaleString("en-KE")}`;
}

export function lipaMonthly(
  priceKes: number,
  depositPct = iphoneConfig.lipa.depositDefaultPct,
  months = iphoneConfig.lipa.monthsDefault,
): { depositKes: number; monthlyKes: number; months: number } {
  const depositKes = Math.round((priceKes * depositPct) / 100);
  const remainder = priceKes - depositKes;
  const monthlyKes = Math.round(remainder / months);
  return { depositKes, monthlyKes, months };
}

export function tradeInEstimate(
  baseKes: number,
  condition: keyof typeof iphoneConfig.tradeIn.conditionPct,
): number {
  const pct = iphoneConfig.tradeIn.conditionPct[condition];
  const raw = (baseKes * pct) / 100;
  return Math.round(raw / 500) * 500;
}
