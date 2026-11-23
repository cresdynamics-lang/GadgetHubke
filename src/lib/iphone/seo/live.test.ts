import assert from "node:assert/strict";
import test from "node:test";

import { withLiveSeoPrices } from "./live.ts";
import type { IphoneSeoModel } from "./types.ts";
import type { PricedProduct } from "../../pricing/live.ts";

function seo(): IphoneSeoModel {
  return {
    id: "iphone-16",
    slug: "iphone-16",
    categorySlug: "iphone",
    name: "iPhone 16",
    family: 16,
    series: "iPhone 16",
    year: 2024,
    aliases: [],
    seoTitle: "iPhone 16",
    h1: "iPhone 16",
    metaDescription: "iPhone 16 from KES 93,000.",
    intro: "Buy iPhone 16 from KES 93,000.",
    bestFor: "Everyday",
    specs: [],
    colours: ["black"],
    variants: [
      { sheetId: "16-128", storage: "128GB", newKes: 93000, exUkKes: 70000, stockStatus: "in_stock" },
      { sheetId: "16-256", storage: "256GB", newKes: 108000, exUkKes: 80000, stockStatus: "in_stock" },
    ],
    fromKes: 93000,
    faq: [{ question: "Price?", answer: "From KES 93,000." }],
    compareWith: [],
    related: [],
    imageAlt: "iPhone 16",
    lastPriceUpdate: "2026-10-29",
  };
}

function live(partial: Partial<PricedProduct> = {}): PricedProduct {
  return {
    id: "iphone-16",
    name: "iPhone 16",
    group: "iPhone catalog",
    href: "/iphone/iphone-16",
    priceKes: 93000,
    basePriceKes: 93000,
    inStock: true,
    showOnWebsite: true,
    sample: false,
    variants: [
      { key: "128", label: "128GB", priceKes: 93000, exUkKes: 80000, inStock: true, showOnWebsite: true, exUkShowOnWebsite: true },
      { key: "256", label: "256GB", priceKes: 108000, exUkKes: 87000, inStock: true, showOnWebsite: true, exUkShowOnWebsite: true },
    ],
    ...partial,
  };
}

test("ex-uk-only seo keeps ex-uk prices off the new column", () => {
  const priced = withLiveSeoPrices(
    seo(),
    live({ showNewOnWebsite: false, exUkShowOnWebsite: true, priceKes: 0, exUkKes: 80000 }),
  );
  assert.deepEqual(
    priced.variants.map((v) => [v.storage, v.newKes, v.exUkKes]),
    [
      ["128GB", 0, 80000],
      ["256GB", 0, 87000],
    ],
  );
  assert.equal(priced.fromKes, 80000);
});

test("new and ex-uk listed keep different prices on the same phone", () => {
  const priced = withLiveSeoPrices(seo(), live({ showNewOnWebsite: true, exUkShowOnWebsite: true }));
  assert.deepEqual(
    priced.variants.map((v) => [v.storage, v.newKes, v.exUkKes]),
    [
      ["128GB", 93000, 80000],
      ["256GB", 108000, 87000],
    ],
  );
  assert.equal(priced.fromKes, 80000);
});

test("the description takes the listed price and storage sizes", () => {
  const model = { ...seo(), metaDescription: "Buy the iPhone 16 in Nairobi from KES 93,000. 128GB, 256GB or 2TB. Pay in full or with Lipa Mdogo Mdogo. Gadget Hub, Norwich Union House." };
  const priced = withLiveSeoPrices(model, live({ showNewOnWebsite: true, exUkShowOnWebsite: false }));
  assert.match(priced.metaDescription, /^Buy the iPhone 16 in Nairobi from KES [\d,]+\. 128GB or 256GB\. Pay in full/);
  assert.equal(priced.metaDescription.includes("2TB"), false);
  assert.equal(priced.metaDescription.includes(`from KES ${priced.fromKes.toLocaleString("en-KE")}.`), true);
});


test("copy names only listed storage sizes, and Ex-UK-only models are not called sealed new", () => {
  const model = {
    ...seo(),
    intro: "Shop the iPhone 16 at Gadget Hub in Nairobi. KES 93,000 sealed new, with storage options 128GB, 256GB, 512GB. Covered by the manufacturer's standard warranty.",
    faq: [{ question: "Price?", answer: "At Gadget Hub, iPhone 16 is KES 93,000 for sealed new stock. Storage options: 128GB, 256GB, 512GB." }],
    specs: [{ label: "Storage", value: "128GB, 256GB, 512GB" }],
  };
  const live = {
    id: "iphone-16", name: "iPhone 16", group: "", href: "", priceKes: 0, basePriceKes: 0, inStock: true,
    showOnWebsite: true, showNewOnWebsite: false, exUkShowOnWebsite: true, sample: false,
    variants: [
      { key: "128", label: "128GB", priceKes: 0, exUkKes: 78000, inStock: true, exUkInStock: true },
      { key: "256", label: "256GB", priceKes: 0, exUkKes: 87000, inStock: true, exUkInStock: true },
    ],
  } as unknown as PricedProduct;
  const out = withLiveSeoPrices(model, live);
  const text = [out.intro, ...out.faq.map((f) => f.answer), ...out.specs.map((r) => r.value)].join(" ");
  assert.doesNotMatch(text, /512GB/);
  assert.doesNotMatch(text, /sealed new|manufacturer's standard warranty/);
  assert.match(out.intro, /with storage options 128GB, 256GB\./);
});
