import { airpodsConfig } from "./config";
import type { AirpodsModel } from "./models";

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function airpodsConfigurePrice(
  model: AirpodsModel,
  opts: { wirelessCase?: boolean; addonsKes?: number } = {},
): { kes: number } {
  let kes = model.basePriceKes;
  if (opts.wirelessCase && model.caseOptions.includes("wireless")) {
    if (!model.id.includes("wireless")) kes += airpodsConfig.wirelessCaseStepKes;
  }
  if (opts.addonsKes) kes += opts.addonsKes;
  return { kes };
}

export function lipaMonthly(
  priceKes: number,
  depositPct = airpodsConfig.lipa.depositDefaultPct,
  months = airpodsConfig.lipa.monthsDefault,
): { monthlyKes: number; depositKes: number; months: number } {
  const depositKes = Math.round((priceKes * depositPct) / 100);
  const financed = priceKes - depositKes;
  const monthlyKes = Math.round(financed / months);
  return { monthlyKes, depositKes, months };
}

export function tradeInEstimate(
  baseKes: number,
  condition: keyof typeof airpodsConfig.tradeIn.conditionPct,
): number {
  const pct = airpodsConfig.tradeIn.conditionPct[condition];
  const raw = (baseKes * pct) / 100;
  return Math.round(raw / 500) * 500;
}
