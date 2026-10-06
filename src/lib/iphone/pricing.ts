import { iphoneConfig } from "./config";

/** Storage option with computed sample KES price */
export function storagePrices(baseKes: number, sizes: string[]): { label: string; kes: number }[] {
  return sizes.map((label, i) => ({
    label,
    kes: baseKes + (iphoneConfig.storageStepsKes[i] ?? iphoneConfig.storageStepsKes[iphoneConfig.storageStepsKes.length - 1]),
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
