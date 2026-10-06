import { watchConfig } from "./config";
import type { WatchModel } from "./models";

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function watchConfigurePrice(
  model: WatchModel,
  opts: {
    material?: keyof typeof watchConfig.materialStepKes;
    cellular?: boolean;
    bandKes?: number;
  } = {},
): { kes: number } {
  const material = opts.material || model.materials[0] || "aluminum";
  let kes = model.basePriceKes + (watchConfig.materialStepKes[material] || 0);
  if (opts.cellular && model.cellularAvailable) kes += watchConfig.cellularStepKes;
  if (opts.bandKes) kes += opts.bandKes;
  return { kes };
}

export function lipaMonthly(
  priceKes: number,
  depositPct = watchConfig.lipa.depositDefaultPct,
  months = watchConfig.lipa.monthsDefault,
): { monthlyKes: number; depositKes: number; months: number } {
  const depositKes = Math.round((priceKes * depositPct) / 100);
  const financed = priceKes - depositKes;
  const monthlyKes = Math.round(financed / months);
  return { monthlyKes, depositKes, months };
}

export function tradeInEstimate(
  baseKes: number,
  condition: keyof typeof watchConfig.tradeIn.conditionPct,
): number {
  const pct = watchConfig.tradeIn.conditionPct[condition];
  const raw = (baseKes * pct) / 100;
  return Math.round(raw / 500) * 500;
}
