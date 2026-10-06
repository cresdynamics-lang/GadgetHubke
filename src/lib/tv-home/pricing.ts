import { tvHomeConfig } from "./config";
import type { TvHomeModel } from "./models";

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function tvHomeConfigurePrice(
  model: TvHomeModel,
  opts: {
    ethernet?: boolean;
    stereoPair?: boolean;
    addonsKes?: number;
  } = {},
): { kes: number; units: number } {
  let unit = model.basePriceKes;
  if (opts.ethernet && model.storageOptions.some((s) => s.includes("Ethernet"))) {
    if (model.id === "apple-tv-4k-3") unit += tvHomeConfig.ethernetStorageStepKes;
  }
  const units = opts.stereoPair && model.stereoPairCapable ? 2 : 1;
  let kes = unit * units;
  if (opts.addonsKes) kes += opts.addonsKes;
  return { kes, units };
}

export function lipaMonthly(
  priceKes: number,
  depositPct = tvHomeConfig.lipa.depositDefaultPct,
  months = tvHomeConfig.lipa.monthsDefault,
): { monthlyKes: number; depositKes: number; months: number } {
  const depositKes = Math.round((priceKes * depositPct) / 100);
  const financed = priceKes - depositKes;
  const monthlyKes = Math.round(financed / months);
  return { monthlyKes, depositKes, months };
}

export function tradeInEstimate(
  baseKes: number,
  condition: keyof typeof tvHomeConfig.tradeIn.conditionPct,
): number {
  const pct = tvHomeConfig.tradeIn.conditionPct[condition];
  const raw = (baseKes * pct) / 100;
  return Math.round(raw / 500) * 500;
}
