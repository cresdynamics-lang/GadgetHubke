import { iphoneConfig } from "../iphone/config";
import type { CheckoutOrder, LipaTerms, OrderIntent } from "./types";

export function parseIntent(raw: unknown): OrderIntent {
  return String(raw || "").toLowerCase() === "lipa" ? "lipa" : "purchase";
}

export function isLipa(order: Pick<CheckoutOrder, "intent">): boolean {
  return order.intent === "lipa";
}

export function catalogAmount(order: CheckoutOrder): number {
  return Math.max(0, Math.round(order.catalogKes ?? order.lipa?.catalogKes ?? order.subtotalKes));
}

export function dueTodayAmount(order: CheckoutOrder): number {
  return Math.max(0, Math.round(order.subtotalKes));
}

export function buildLipaTerms(
  catalogKes: number,
  depositPct?: number,
  months?: number,
): LipaTerms {
  const cfg = iphoneConfig.lipa;
  const catalog = Math.max(0, Math.round(catalogKes));
  const pctRaw = Number(depositPct);
  const stepped = Number.isFinite(pctRaw)
    ? Math.round(pctRaw / cfg.depositStepPct) * cfg.depositStepPct
    : cfg.depositDefaultPct;
  const pct = Math.min(cfg.depositMaxPct, Math.max(cfg.depositMinPct, stepped));
  const monthsRaw = Number(months);
  const planMonths = (cfg.monthOptions as readonly number[]).includes(monthsRaw)
    ? monthsRaw
    : cfg.monthsDefault;
  const depositKes = Math.min(catalog, Math.max(catalog > 0 ? 1 : 0, Math.round(catalog * (pct / 100))));
  return {
    depositPct: pct,
    months: planMonths,
    catalogKes: catalog,
    depositKes,
    remainingKes: Math.max(0, catalog - depositKes),
  };
}

export function nairobiDay(iso?: string, plusDays = 0): string {
  const base = iso ? new Date(iso) : new Date();
  const d = new Date(base.getTime() + plusDays * 86_400_000);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(d);
}
