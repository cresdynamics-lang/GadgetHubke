import { lipaPlan } from "../pricing/lipa";
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
) {
  return lipaPlan(priceKes, depositPct, months);
}

export function monthlyFromPrice(priceKes: number, depositPct?: number, months?: number): number {
  return lipaMonthly(priceKes, depositPct, months).monthlyKes;
}

export function lipaBreakdown(
  priceKes: number,
  depositPct = accessoriesConfig.lipa.depositDefaultPct,
  months = accessoriesConfig.lipa.monthsDefault,
) {
  const { monthlyKes, depositKes, totalKes } = lipaMonthly(priceKes, depositPct, months);
  return {
    priceKes,
    depositPct,
    depositKes,
    months,
    monthlyKes,
    totalKes,
    note: accessoriesConfig.lipa.note,
  };
}
