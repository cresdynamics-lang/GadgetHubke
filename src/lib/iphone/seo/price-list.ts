/**
 * The live iPhone price list: every listed model, newest first, with each storage
 * option's New and Ex-UK price, the Lipa Mdogo Mdogo plan and its own page.
 * Used by /iphone-prices-kenya and the Black Friday page. Pure: callers pass priced models.
 */
import { lipaPlan } from "../../pricing/lipa.ts";
import { storageGb, storagePath } from "./variant-pages.ts";
import type { IphoneSeoModel } from "./types.ts";

export type PriceListRow = {
  storage: string;
  href: string;
  newKes: number;
  exUkKes: number;
  inStock: boolean;
  /** Lipa Mdogo Mdogo on the lowest listed price of this storage: 40% deposit, 6 months. */
  depositKes: number;
  monthlyKes: number;
};

export type PriceListModel = {
  id: string;
  name: string;
  year: number;
  href: string;
  fromKes: number;
  rows: PriceListRow[];
};

const kes = (n: number) => `KES ${Math.round(n).toLocaleString("en-KE")}`;

export function buildPriceList(models: IphoneSeoModel[]): PriceListModel[] {
  return models
    .map((m) => {
      const rows = m.variants
        .filter((v) => v.newKes > 0 || v.exUkKes > 0)
        .sort((a, b) => storageGb(a.storage) - storageGb(b.storage))
        .map((v) => {
          const plan = lipaPlan(v.newKes || v.exUkKes, 40, 6);
          return {
            storage: v.storage,
            href: storagePath(m.id, v.storage),
            newKes: v.newKes,
            exUkKes: v.exUkKes,
            inStock: v.stockStatus !== "out_of_stock",
            depositKes: plan.depositKes,
            monthlyKes: plan.monthlyKes,
          };
        });
      const prices = rows.flatMap((r) => [r.newKes, r.exUkKes]).filter((n) => n > 0);
      return { id: m.id, name: m.name, year: m.year, href: `/iphone/${m.id}`, fromKes: prices.length ? Math.min(...prices) : 0, rows };
    })
    .filter((m) => m.rows.length)
    .sort((a, b) => b.year - a.year || b.fromKes - a.fromKes);
}

/** Questions people search about iPhone prices, answered from the list itself. */
export function priceListFaq(list: PriceListModel[], checkedOn: string) {
  if (!list.length) return [];
  const all = list.flatMap((m) => m.rows.map((r) => ({ m, r })));
  const newOnes = all.filter((x) => x.r.newKes > 0);
  const exOnes = all.filter((x) => x.r.exUkKes > 0);
  const cheapestNew = newOnes.sort((a, b) => a.r.newKes - b.r.newKes)[0];
  const cheapestEx = exOnes.sort((a, b) => a.r.exUkKes - b.r.exUkKes)[0];
  const latest = list[0];
  const faq: { question: string; answer: string }[] = [];
  faq.push({
    question: `What is the latest iPhone price in Kenya?`,
    answer: `The ${latest.name} starts at ${kes(latest.fromKes)} at Gadget Hub (prices checked ${checkedOn}).`,
  });
  if (cheapestNew)
    faq.push({
      question: "What is the cheapest new iPhone in Kenya?",
      answer: `The ${cheapestNew.m.name} ${cheapestNew.r.storage} at ${kes(cheapestNew.r.newKes)}, sealed new with a 1-year warranty.`,
    });
  if (cheapestEx)
    faq.push({
      question: "What is the cheapest Ex-UK iPhone in Kenya?",
      answer: `The ${cheapestEx.m.name} ${cheapestEx.r.storage} at ${kes(cheapestEx.r.exUkKes)} Ex-UK (UK-used).`,
    });
  faq.push({
    question: "Can I buy an iPhone in instalments in Kenya?",
    answer: "Yes. With Lipa Mdogo Mdogo you pay 40% today and take the phone home, then the balance over 1 to 6 months. The monthly amount for each iPhone is in the table.",
  });
  faq.push({
    question: "Are these iPhone prices up to date?",
    answer: `Yes. This list is read from the shop's live prices every time the page opens, last checked ${checkedOn}.`,
  });
  return faq;
}
