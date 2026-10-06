import { macConfig } from "./config";
import type { MacModel } from "./models";

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function macConfigurePrice(
  model: MacModel,
  memoryGb: number,
  storageLabel: string,
): { kes: number; memoryTier: number; storageTier: number } {
  const memIdx = Math.max(0, model.memoryOptionsGb.indexOf(memoryGb));
  const storIdx = Math.max(0, model.storageOptions.indexOf(storageLabel));
  const kes =
    model.basePriceKes +
    memIdx * macConfig.memoryStepKes +
    storIdx * macConfig.storageStepKes;
  return { kes, memoryTier: memIdx, storageTier: storIdx };
}

export function lipaMonthly(
  priceKes: number,
  depositPct = macConfig.lipa.depositDefaultPct,
  months = macConfig.lipa.monthsDefault,
): { monthlyKes: number; depositKes: number; months: number } {
  const depositKes = Math.round((priceKes * depositPct) / 100);
  const financed = priceKes - depositKes;
  const monthlyKes = Math.round(financed / months);
  return { monthlyKes, depositKes, months };
}

export function tradeInEstimate(baseKes: number, condition: keyof typeof macConfig.tradeIn.conditionPct): number {
  const pct = macConfig.tradeIn.conditionPct[condition];
  const raw = (baseKes * pct) / 100;
  return Math.round(raw / 500) * 500;
}
