import assert from "node:assert/strict";
import test from "node:test";
import { deviceOptions, resolveDevice } from "./device-options.ts";
import type { PricedProduct } from "./pricing/live.ts";

const phone = {
  id: "iphone-17-pro",
  name: "iPhone 17 Pro",
  group: "iPhone catalog",
  href: "/iphone/iphone-17-pro",
  priceKes: 158000,
  basePriceKes: 158000,
  inStock: true,
  showOnWebsite: true,
  sample: false,
  colours: ["cosmic-orange", "silver"],
  coloursInStock: ["silver"],
  variants: [
    { key: "256", label: "256GB", priceKes: 158000, exUkKes: 130000, inStock: true },
    { key: "512", label: "512GB", priceKes: 185000, exUkKes: 145000, inStock: false },
    { key: "1tb", label: "1TB", priceKes: 0, inStock: false },
  ],
} as PricedProduct;

test("only priced, in-stock options and colours can be picked", () => {
  const [option] = deviceOptions([phone]);
  assert.equal(option.group, "iPhone");
  assert.deepEqual(option.colours, ["Silver"]);
  assert.deepEqual(option.variants.map((v) => v.key), ["256", "512"]);
  assert.equal(option.variants[1].newKes, 0);
  assert.equal(option.variants[1].exUkKes, 145000);
});

test("a hidden group is left out", () => {
  assert.deepEqual(deviceOptions([phone], ["iPhone"]), []);
});

test("the price comes from the list, for New and for Ex-UK", () => {
  const options = deviceOptions([phone]);
  const chosen = resolveDevice(options, { productId: "iphone-17-pro", variantKey: "256", channel: "ex-uk", colour: "Silver" });
  assert.equal(chosen?.priceKes, 130000);
  assert.equal(chosen?.summary, "iPhone 17 Pro · 256GB · Silver · Ex-UK");
  assert.equal(resolveDevice(options, { productId: "iphone-17-pro", variantKey: "256" })?.priceKes, 158000);
});

test("an option that is not on sale is refused", () => {
  const options = deviceOptions([phone]);
  assert.equal(resolveDevice(options, { productId: "iphone-17-pro", variantKey: "512", channel: "new" }), null);
  assert.equal(resolveDevice(options, { productId: "nope", variantKey: "256" }), null);
});
