import { ipadConfig } from "./config";
import type { IpadModel } from "./models";

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function ipadConfigurePrice(
  model: IpadModel,
  storageLabel: string,
  opts: { cellular?: boolean; nanoTexture?: boolean } = {},
): { kes: number; storageTier: number } {
  const storIdx = Math.max(0, model.storageOptions.indexOf(storageLabel));
  let kes = model.basePriceKes + storIdx * ipadConfig.storageStepKes;
  if (opts.cellular) kes += ipadConfig.cellularStepKes;
  if (opts.nanoTexture && model.display.nanoTextureOptional) {
    const high = /1 TB|2 TB/i.test(storageLabel);
    if (high) kes += ipadConfig.nanoTextureStepKes;
  }
  return { kes, storageTier: storIdx };
}

export function lipaMonthly(
  priceKes: number,
  depositPct = ipadConfig.lipa.depositDefaultPct,
  months = ipadConfig.lipa.monthsDefault,
): { monthlyKes: number; depositKes: number; months: number } {
  const depositKes = Math.round((priceKes * depositPct) / 100);
  const financed = priceKes - depositKes;
  const monthlyKes = Math.round(financed / months);
  return { monthlyKes, depositKes, months };
}

export function tradeInEstimate(
  baseKes: number,
  condition: keyof typeof ipadConfig.tradeIn.conditionPct,
): number {
  const pct = ipadConfig.tradeIn.conditionPct[condition];
  const raw = (baseKes * pct) / 100;
  return Math.round(raw / 500) * 500;
}
