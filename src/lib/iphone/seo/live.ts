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

/** The opening of every catalogue description: "Buy the X in Nairobi from KES n. 128GB, 256GB or 512GB. " */
const PRICE_AND_STORAGE = /^(Buy the .+? in Nairobi )from KES [\d,]+\. (?:\d+(?:GB|TB)(?:, | or )?)+\. /;

function storageList(storages: string[]) {
  return storages.length > 1 ? `${storages.slice(0, -1).join(", ")} or ${storages.at(-1)}` : storages[0] ?? "";
}

/** Rewrite the price and storage sizes from what is listed now, so feeds and search results never show stale ones. */
function liveDescription(text: string, fromKes: number, storages: string[]) {
  if (!fromKes || !storages.length) return text;
  return text.replace(PRICE_AND_STORAGE, (_, opening: string) => `${opening}from ${kes(fromKes)}. ${storageList(storages)}. `);
}

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
    metaDescription: liveDescription(
      fix(model.metaDescription),
      fromKes,
      variants.map((v) => v.storage),
    ),
    intro: fix(model.intro),
    faq: model.faq.map((f) => ({ ...f, answer: fix(f.answer) })),
  };
}
