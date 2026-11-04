/**
 * Lipa Mdogo Mdogo: the one place the plan is worked out, for New and Ex-UK alike.
 * Pay a deposit, the balance is multiplied by the rate for the months chosen and
 * rounded to the nearest KES 100, then split into equal monthly payments.
 */
export const LIPA_RATES = { 1: 1.3, 2: 1.4, 3: 1.5, 4: 1.6, 5: 1.7, 6: 1.8 } as const;

export type LipaMonths = keyof typeof LIPA_RATES;

export const LIPA_MONTH_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
export const LIPA_DEFAULT_MONTHS: LipaMonths = 6;
export const LIPA_NOTE = "Pay 40% or more today, then the balance over 1 to 6 months. Shorter plans cost less.";

export type LipaPlan = {
  depositKes: number;
  /** Price less deposit, before the plan rate. */
  balanceKes: number;
  rate: number;
  /** What is still to pay after the deposit: balance × rate, to the nearest KES 100. */
  repayKes: number;
  monthlyKes: number;
  months: number;
  /** Deposit plus everything paid monthly. */
  totalKes: number;
};

export function lipaRate(months: number): number {
  return LIPA_RATES[months as LipaMonths] ?? LIPA_RATES[LIPA_DEFAULT_MONTHS];
}

export function lipaPlan(priceKes: number, depositPct = 40, months: number = LIPA_DEFAULT_MONTHS): LipaPlan {
  const plan = months in LIPA_RATES ? months : LIPA_DEFAULT_MONTHS;
  const price = Math.max(0, Math.round(priceKes));
  const depositKes = Math.round((price * depositPct) / 100);
  const balanceKes = price - depositKes;
  const rate = lipaRate(plan);
  // Work in whole percent so 94,800 × 1.8 stays exact.
  const repayKes = Math.round((balanceKes * Math.round(rate * 100)) / 10000) * 100;
  return {
    depositKes,
    balanceKes,
    rate,
    repayKes,
    monthlyKes: Math.round(repayKes / plan),
    months: plan,
    totalKes: depositKes + repayKes,
  };
}
