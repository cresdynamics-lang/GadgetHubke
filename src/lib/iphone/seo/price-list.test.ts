import assert from "node:assert/strict";
import test from "node:test";
import { buildPriceList, priceListFaq } from "./price-list.ts";
import type { IphoneSeoModel } from "./types.ts";

const model = (id: string, name: string, year: number, variants: [string, number, number][]) =>
  ({
    id,
    name,
    year,
    variants: variants.map(([storage, newKes, exUkKes]) => ({ sheetId: `${id}-${storage}`, storage, newKes, exUkKes, stockStatus: "in_stock" })),
  }) as unknown as IphoneSeoModel;

const list = buildPriceList([
  model("iphone-13", "iPhone 13", 2021, [["128GB", 0, 61000], ["256GB", 0, 0]]),
  model("iphone-18-pro-max", "iPhone 18 Pro Max", 2026, [["512GB", 245000, 0], ["256GB", 218000, 0]]),
  model("iphone-17-pro", "iPhone 17 Pro", 2025, [["256GB", 158000, 130000]]),
]);

test("newest first, storage smallest first, unlisted sizes dropped", () => {
  assert.deepEqual(list.map((m) => m.name), ["iPhone 18 Pro Max", "iPhone 17 Pro", "iPhone 13"]);
  assert.deepEqual(list[0].rows.map((r) => r.storage), ["256GB", "512GB"]);
  assert.equal(list[2].rows.length, 1);
  assert.equal(list[0].rows[0].href, "/iphone/iphone-18-pro-max/256gb");
});

test("Lipa plan per storage uses the shop's rates", () => {
  // 218,000: deposit 87,200; 130,800 × 1.8 = 235,440 → 235,400; ÷ 6 = 39,233.
  assert.equal(list[0].rows[0].depositKes, 87200);
  assert.equal(list[0].rows[0].monthlyKes, 39233);
  // Ex-UK only storage plans on its Ex-UK price.
  assert.equal(list[2].rows[0].depositKes, 24400);
});

test("questions answer from the list itself", () => {
  const faq = priceListFaq(list, "16 November 2026");
  const a = Object.fromEntries(faq.map((f) => [f.question, f.answer]));
  assert.match(a["What is the latest iPhone price in Kenya?"], /iPhone 18 Pro Max starts at KES 218,000/);
  assert.match(a["What is the cheapest new iPhone in Kenya?"], /iPhone 17 Pro 256GB at KES 158,000/);
  assert.match(a["What is the cheapest Ex-UK iPhone in Kenya?"], /iPhone 13 128GB at KES 61,000/);
});
