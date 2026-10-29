import assert from "node:assert/strict";
import test from "node:test";

import { applyOverlay } from "./overlay-apply.ts";

function product() {
  return {
    id: "iphone-16",
    name: "iPhone 16",
    group: "iPhone catalog",
    href: "/iphone/iphone-16",
    priceKes: 93000,
    basePriceKes: 93000,
    inStock: true,
    showOnWebsite: true,
    sample: true,
    variants: [
      { key: "128", label: "128GB", priceKes: 93000, exUkKes: 70000, inStock: true },
      { key: "256", label: "256GB", priceKes: 108000, exUkKes: 80000, inStock: true },
      { key: "512", label: "512GB", priceKes: 128000, exUkKes: 95000, inStock: true },
    ],
  };
}

test("ex-uk-only overlay does not keep sheet new as the live new price", () => {
  const priced = applyOverlay(product(), {
    showOnWebsite: true,
    showNewOnWebsite: false,
    exUkShowOnWebsite: true,
    updatedAt: "2026-10-29T00:00:00.000Z",
    storages: {
      "128": { showOnWebsite: true, exUkShowOnWebsite: true, exUkKes: 80000, exUkInStock: true },
      "256": { showOnWebsite: true, exUkShowOnWebsite: true, exUkKes: 87000, exUkInStock: true },
    },
  });
  assert.equal(priced.showNewOnWebsite, false);
  assert.equal(priced.exUkShowOnWebsite, true);
  assert.equal(priced.showOnWebsite, true);
  assert.equal(priced.priceKes, 0);
  assert.equal(priced.exUkKes, 80000);
  assert.equal(priced.variants.find((v) => v.key === "128")?.showOnWebsite, false);
  assert.equal(priced.variants.find((v) => v.key === "128")?.exUkKes, 80000);
  assert.equal(priced.variants.find((v) => v.key === "512")?.showOnWebsite, false);
  assert.equal(priced.variants.find((v) => v.key === "512")?.exUkShowOnWebsite, false);
});

test("new overlay price stays on new and ex-uk stays on ex-uk", () => {
  const priced = applyOverlay(product(), {
    showOnWebsite: true,
    showNewOnWebsite: true,
    exUkShowOnWebsite: true,
    updatedAt: "2026-10-29T00:00:00.000Z",
    storages: {
      "128": { showOnWebsite: true, priceKes: 99000, exUkShowOnWebsite: true, exUkKes: 80000 },
      "256": { showOnWebsite: true, priceKes: 110000, exUkShowOnWebsite: true, exUkKes: 87000 },
    },
  });
  assert.equal(priced.priceKes, 99000);
  assert.equal(priced.exUkKes, 80000);
  assert.equal(priced.variants.find((v) => v.key === "128")?.showOnWebsite, true);
});
