/**
 * Apply live admin prices to an iPhone SEO model: variant prices, stock,
 * cash price, and the KES figure inside its copy and FAQ.
 * New and Ex-UK stay on separate rows with their own figures — never copy one into the other.
 */
import type { IphoneSeoModel } from "./types.ts";
import type { PricedProduct } from "../../pricing/live.ts";
import { storageIdFromLabel } from "../../pricing/iphone-sheet.ts";
import { listedVariantPrices } from "../../listing-offers.ts";

const kes = (n: number) => `KES ${Math.round(n).toLocaleString("en-KE")}`;

export function withLiveSeoPrices(model: IphoneSeoModel, live: PricedProduct | undefined): IphoneSeoModel {
  if (!live) return model;
  const byKey = new Map(live.variants.map((v) => [v.key, v]));
  const variants = model.variants.flatMap((v) => {
    const l = byKey.get(storageIdFromLabel(v.storage));
    if (!l) {
      const flags = listedVariantPrices(live);
      return flags.showNew ? [v] : [];
    }
    const listed = listedVariantPrices(live, l);
    if (!listed.showNew && !listed.showEx) return [];
    return [
      {
        ...v,
        newKes: listed.newKes,
        exUkKes: listed.exUkKes,
        stockStatus: (listed.showNew ? l.inStock : l.exUkInStock !== false) ? ("in_stock" as const) : ("out_of_stock" as const),
      },
    ];
  });
  if (!variants.length) return { ...model, variants: [], fromKes: 0 };
  const listedPrices = variants.flatMap((v) => [v.newKes, v.exUkKes].filter((n) => n > 0));
  const fromKes = listedPrices.length ? Math.min(...listedPrices) : 0;
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
