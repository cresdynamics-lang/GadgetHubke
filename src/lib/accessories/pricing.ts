import { accessoriesConfig } from "./config";
import type { Accessory } from "./models";

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function accessoryConfigurePrice(
  product: Accessory,
  opts: { addonsKes?: number } = {},
): { kes: number } {
  let kes = product.basePriceKes;
  if (opts.addonsKes) kes += opts.addonsKes;
  return { kes };
}

export function lipaMonthly(
  priceKes: number,
  depositPct = accessoriesConfig.lipa.depositDefaultPct,
  months = accessoriesConfig.lipa.monthsDefault,
): { monthlyKes: number; depositKes: number; months: number } {
  const depositKes = Math.round((priceKes * depositPct) / 100);
  const financed = priceKes - depositKes;
  const monthlyKes = Math.round(financed / months);
  return { monthlyKes, depositKes, months };
}

export function monthlyFromPrice(priceKes: number, depositPct?: number, months?: number): number {
  return lipaMonthly(priceKes, depositPct, months).monthlyKes;
}

export function lipaBreakdown(
  priceKes: number,
  depositPct = accessoriesConfig.lipa.depositDefaultPct,
  months = accessoriesConfig.lipa.monthsDefault,
) {
  const { monthlyKes, depositKes } = lipaMonthly(priceKes, depositPct, months);
  return {
    priceKes,
    depositPct,
    depositKes,
    months,
    monthlyKes,
    totalKes: depositKes + monthlyKes * months,
    note: accessoriesConfig.lipa.note,
  };
}
