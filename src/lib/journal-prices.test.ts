import assert from "node:assert/strict";
import test from "node:test";

import { journalShopPrice, renderJournalBody, renderJournalMeta, type JournalCatalog } from "./journal-prices.ts";
import type { PricedProduct } from "./pricing/live.ts";

function phone(id: string, name: string, priceKes: number, exUkKes: number, partial: Partial<PricedProduct> = {}): PricedProduct {
  return {
    id,
    name,
    group: "iPhone catalog",
    href: `/iphone/${id}`,
    priceKes,
    basePriceKes: priceKes,
    exUkKes,
    inStock: true,
    showOnWebsite: true,
    variants: [{ key: "128", label: "128GB", priceKes, exUkKes, inStock: priceKes > 0 }],
    sample: false,
    ...partial,
  };
}

const catalog: JournalCatalog = {
  byId: new Map(
    [
      phone("iphone-17", "iPhone 17", 120000, 0),
      phone("iphone-16", "iPhone 16", 0, 80000),
      phone("iphone-15", "iPhone 15", 0, 63000),
      phone("iphone-16e", "iPhone 16e", 79000, 0, { showOnWebsite: false }),
    ].map((p) => [p.id, p]),
  ),
  liveId: (id) => id,
};

test("a phone not sold new shows its Ex-UK price, never KES 0 or an old New price", () => {
  assert.equal(renderJournalBody("The 16 is {{price:iphone-16}}.", catalog), "The 16 is KES 80,000 Ex-UK.");
  assert.equal(renderJournalBody("128GB is {{price:iphone-16:128}}.", catalog), "128GB is KES 80,000 Ex-UK.");
  assert.equal(journalShopPrice("iphone-16", catalog), "KES 80,000 Ex-UK");
  assert.equal(journalShopPrice("iphone-16e", catalog), undefined);
});

test("wording that promises sealed new stock goes when only Ex-UK is sold", () => {
  assert.equal(renderJournalBody("Hello. From {{price:iphone-16:128}} for sealed 128GB.", catalog), "Hello.");
  assert.equal(renderJournalBody("How much? From {{price:iphone-16}} sealed new. Ask us.", catalog), "Ask us.");
});

test("sentences about off-list products go, and lists lose only that item", () => {
  assert.equal(renderJournalBody("Buy [16e](/iphone/iphone-16e) from {{price:iphone-16e}} now. Ask us.", catalog), "Ask us.");
  assert.equal(renderJournalBody("The 16e is a smart phone. Ask us.", catalog), "Ask us.");
  assert.equal(
    renderJournalBody("Picks: [17](/iphone/iphone-17) from {{price:iphone-17}}, [16e](/iphone/iphone-16e) from {{price:iphone-16e}} and [15](/iphone/iphone-15) from {{price:iphone-15}}.", catalog),
    "Picks: [17](/iphone/iphone-17) from KES 120,000 and [15](/iphone/iphone-15) from KES 63,000 Ex-UK.",
  );
  assert.equal(renderJournalBody("The 15: Ex-UK from {{exuk:iphone-15}} (128GB), new from {{price:iphone-15}}.", catalog), "The 15: Ex-UK from KES 63,000 (128GB).");
  assert.equal(renderJournalBody("Ex-UK 17 from {{exuk:iphone-17}}.", catalog), "");
});

test("titles and descriptions lose only the unavailable price", () => {
  assert.equal(
    renderJournalMeta("iPhone 17 from {{price:iphone-17}}, iPhone 16e from {{price:iphone-16e}} and more in Nairobi.", catalog),
    "iPhone 17 from KES 120,000, iPhone 16e and more in Nairobi.",
  );
  assert.equal(
    renderJournalMeta("iPhone 15: new from {{price:iphone-15}}, Ex-UK from {{exuk:iphone-15}}. Nairobi.", catalog),
    "iPhone 15: Ex-UK from KES 63,000. Nairobi.",
  );
  assert.equal(renderJournalMeta("iPhone 15 from {{exuk:iphone-15}} Ex-UK and {{price:iphone-15}} new in Nairobi", catalog), "iPhone 15 from KES 63,000 Ex-UK in Nairobi");
});
