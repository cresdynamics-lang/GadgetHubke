import assert from "node:assert/strict";
import test from "node:test";

import { mergeOpsCatalog } from "./ops-overlay.ts";

const catalog = [
  { id: "ipad-pro-11-m5", group: "iPad", variants: [{ key: "256gb" }, { key: "256gb-cell" }, { key: "512gb-cell" }] },
  { id: "ipad-pro-11-m4", group: "iPad", variants: [{ key: "256gb" }] },
  { id: "iphone-17", group: "Shop iPhone", variants: [{ key: "256" }] },
];

test("empty ops catalog leaves local Mac and iPad overlays in place", () => {
  const merged = mergeOpsCatalog(
    { "macbook-air-13-m5": { showOnWebsite: true, priceKes: 155000 } },
    {
      source: "gadgetmgmt",
      generatedAt: "2026-10-28T00:00:00.000Z",
      managedGroups: ["iPad", "Mac", "AirPods", "Watch"],
      items: [],
    },
    catalog,
  );
  assert.equal(merged["macbook-air-13-m5"]?.showOnWebsite, true);
  assert.equal(merged["macbook-air-13-m5"]?.priceKes, 155000);
  assert.equal(merged["ipad-pro-11-m4"], undefined);
});

test("ops catalog hides unlisted iPads and keeps iPhones untouched", () => {
  const merged = mergeOpsCatalog(
    {},
    {
      source: "gadgetmgmt",
      generatedAt: "2026-10-28T00:00:00.000Z",
      managedGroups: ["iPad", "Mac", "AirPods", "Watch"],
      managedAccessoryPrefixes: ["pencil-", "keyboard-", "mouse-"],
      items: [
        {
          id: "ipad-pro-11-m5",
          showOnWebsite: true,
          inStock: true,
          priceKes: 165000,
          variants: [
            { key: "256gb", priceKes: 165000, inStock: true, showOnWebsite: true },
            { key: "256gb-cell", priceKes: 188000, inStock: true, showOnWebsite: true },
          ],
        },
      ],
    },
    catalog,
  );

  assert.equal(merged["ipad-pro-11-m5"]?.showOnWebsite, true);
  assert.equal(merged["ipad-pro-11-m5"]?.storages?.["256gb-cell"]?.priceKes, 188000);
  assert.equal(merged["ipad-pro-11-m5"]?.storages?.["512gb-cell"]?.showOnWebsite, false);
  assert.equal(merged["ipad-pro-11-m4"]?.showOnWebsite, false);
  assert.equal(merged["iphone-17"], undefined);
});

test("ops catalog splits new and ex-uk and only keeps in-stock colours", () => {
  const merged = mergeOpsCatalog(
    {},
    {
      source: "gadgetmgmt",
      generatedAt: "2026-10-28T00:00:00.000Z",
      managedGroups: ["iPad", "Mac", "AirPods", "Watch"],
      items: [
        {
          id: "ipad-pro-11-m5",
          showOnWebsite: true,
          inStock: true,
          priceKes: 165000,
          variants: [
            { key: "256gb", priceKes: 165000, inStock: true, showOnWebsite: true, condition: "NEW", colour: "Silver" },
            { key: "256gb", priceKes: 138000, inStock: true, showOnWebsite: true, condition: "EX_UK", colour: "Space Gray" },
            { key: "256gb-cell", priceKes: 188000, inStock: false, showOnWebsite: true, condition: "NEW", colour: "Space Gray" },
          ],
        },
      ],
    },
    catalog,
  );

  assert.equal(merged["ipad-pro-11-m5"]?.showNewOnWebsite, true);
  assert.equal(merged["ipad-pro-11-m5"]?.exUkShowOnWebsite, true);
  assert.equal(merged["ipad-pro-11-m5"]?.exUkKes, 138000);
  assert.deepEqual(merged["ipad-pro-11-m5"]?.coloursInStock, ["silver"]);
  assert.deepEqual(merged["ipad-pro-11-m5"]?.exUkColoursInStock, ["space-gray"]);
  assert.equal(merged["ipad-pro-11-m5"]?.storages?.["256gb"]?.priceKes, 165000);
  assert.equal(merged["ipad-pro-11-m5"]?.storages?.["256gb"]?.exUkKes, 138000);
});
