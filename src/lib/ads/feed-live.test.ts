import assert from "node:assert/strict";
import test from "node:test";

import { applyLivePricesToRows } from "./feed-live.ts";

const live = new Map([
  [
    "iphone-pro",
    {
      showOnWebsite: true,
      showNewOnWebsite: true,
      exUkShowOnWebsite: false,
      inStock: true,
      priceKes: 185000,
      variants: [
        { key: "256", priceKes: 185000, inStock: true, showOnWebsite: true, exUkShowOnWebsite: false },
        { key: "512", priceKes: 230000, inStock: true, showOnWebsite: true, exUkShowOnWebsite: false },
        { key: "128", priceKes: 185000, inStock: false, showOnWebsite: false, exUkShowOnWebsite: false },
      ],
    },
  ],
  [
    "iphone-11",
    {
      showOnWebsite: true,
      showNewOnWebsite: false,
      exUkShowOnWebsite: true,
      inStock: false,
      exUkInStock: true,
      exUkKes: 24000,
      variants: [
        { key: "64", priceKes: 36000, exUkKes: 24000, inStock: false, exUkInStock: true, showOnWebsite: true, exUkShowOnWebsite: true },
        { key: "256", priceKes: 40000, exUkKes: 30000, inStock: false, exUkInStock: true, showOnWebsite: false, exUkShowOnWebsite: false },
      ],
    },
  ],
  [
    "macbook-air-13-m5",
    { showOnWebsite: true, showNewOnWebsite: true, inStock: true, priceKes: 188000, variants: [] },
  ],
  [
    "macbook-air-13-m4",
    { showOnWebsite: false, showNewOnWebsite: false, inStock: false, priceKes: 148000, variants: [] },
  ],
]);

const bySheet = new Map([
  ["IP-200", { id: "iphone-pro", key: "256" }],
  ["IP-201", { id: "iphone-pro", key: "512" }],
  ["IP-202", { id: "iphone-pro", key: "128" }],
  ["IP-010", { id: "iphone-11", key: "64" }],
  ["IP-011", { id: "iphone-11", key: "256" }],
]);

function row(id: string, price = "1.00 KES") {
  return { id, price, availability: "in_stock" };
}

test("ads feeds keep listed iPhone storages and drop hidden ones", () => {
  const rows = applyLivePricesToRows(
    [row("IP-200"), row("IP-201"), row("IP-202"), row("IP-010"), row("IP-010-EXUK"), row("IP-011-EXUK")],
    live,
    bySheet,
  );
  assert.deepEqual(
    rows.map((item) => [item.id, item.price]),
    [
      ["IP-200", "185000.00 KES"],
      ["IP-201", "230000.00 KES"],
      ["IP-010-EXUK", "24000.00 KES"],
    ],
  );
});

test("ads feeds drop unlisted Macs and keep listed ones", () => {
  const rows = applyLivePricesToRows([row("macbook-air-13-m5"), row("macbook-air-13-m4"), row("apple-tv-4k-3")], live, bySheet);
  assert.deepEqual(
    rows.map((item) => item.id),
    ["macbook-air-13-m5"],
  );
});
