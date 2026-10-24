/**
 * Apply live admin prices to an iPhone SEO model: variant prices, stock,
 * "from" price, and the "from KES …" figure inside its copy and FAQ.
 */
import type { IphoneSeoModel } from "./types";
import type { PricedProduct } from "../../pricing/live";
import { storageIdFromLabel } from "../../pricing/iphone-sheet";

const kes = (n: number) => `KES ${Math.round(n).toLocaleString("en-KE")}`;

export function withLiveSeoPrices(model: IphoneSeoModel, live: PricedProduct | undefined): IphoneSeoModel {
  if (!live) return model;
  const byKey = new Map(live.variants.map((v) => [v.key, v]));
  const variants = model.variants.map((v) => {
    const l = byKey.get(storageIdFromLabel(v.storage));
    return l
      ? {
          ...v,
          newKes: l.priceKes,
          exUkKes: l.exUkKes ?? v.exUkKes,
          stockStatus: l.inStock ? ("in_stock" as const) : ("out_of_stock" as const),
        }
      : v;
  });
  const fromKes = Math.min(...variants.map((v) => v.newKes));
  const oldFrom = kes(model.fromKes);
  const newFrom = kes(fromKes);
  const fix = (t: string) => (oldFrom === newFrom ? t : t.split(oldFrom).join(newFrom));
  return {
    ...model,
    variants,
    fromKes,
    metaDescription: fix(model.metaDescription),
    intro: fix(model.intro),
    faq: model.faq.map((f) => ({ ...f, answer: fix(f.answer) })),
  };
}
