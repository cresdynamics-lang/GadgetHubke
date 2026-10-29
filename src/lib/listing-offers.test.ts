import assert from "node:assert/strict";
import test from "node:test";

import { channelHref, colourKey, filterColours, listedVariantPrices, listingOffers, listingRows, type ListingOffer } from "./listing-offers.ts";
import type { PricedProduct } from "./pricing/live.ts";

function product(partial: Partial<PricedProduct> & Pick<PricedProduct, "id">): PricedProduct {
  return {
    name: partial.name ?? "iPhone 18 Pro",
    group: "iPhone catalog",
    href: `/iphone/${partial.id}`,
    priceKes: 189000,
    basePriceKes: 189000,
    inStock: true,
    showOnWebsite: true,
    variants: [
      { key: "256", label: "256GB", priceKes: 189000, exUkKes: 149000, inStock: true },
    ],
    sample: false,
    ...partial,
  };
}

test("colour keys match staff labels to catalog ids", () => {
  assert.equal(colourKey("Desert Titanium"), "desert-titanium");
  assert.equal(colourKey("black-titanium"), "black-titanium");
});

test("in-stock colours keep matching catalog keys and fall back when none match", () => {
  assert.deepEqual(filterColours(["black-titanium", "white-titanium", "desert-titanium"], ["Desert Titanium"]), [
    "desert-titanium",
  ]);
  assert.deepEqual(filterColours(["black-titanium", "white-titanium"], ["navy"]), ["black-titanium", "white-titanium"]);
  assert.deepEqual(filterColours(["black-titanium"], []), ["black-titanium"]);
});

test("new and ex-uk both listed become two offers with distinct hrefs", () => {
  const offers = listingOffers(product({ id: "iphone-18-pro" }), "/iphone/iphone-18-pro");
  assert.deepEqual(
    offers.map((row) => [row.channel, row.priceKes, row.href]),
    [
      ["new", 189000, "/iphone/iphone-18-pro"],
      ["ex-uk", 149000, "/iphone/iphone-18-pro?condition=ex-uk"],
    ],
  );
});

test("ex-uk-only listing hides the new card", () => {
  const offers = listingOffers(
    product({ id: "iphone-18-pro", showNewOnWebsite: false, exUkKes: 149000 }),
    "/iphone/iphone-18-pro",
  );
  assert.equal(offers.length, 1);
  assert.equal(offers[0]?.channel, "ex-uk");
  assert.equal(offers[0]?.priceKes, 149000);
});

test("hidden website products emit no cards", () => {
  assert.deepEqual(listingOffers(product({ id: "iphone-18-pro", showOnWebsite: false }), "/iphone/iphone-18-pro"), []);
});

test("new-only product stays a single New card", () => {
  const offers = listingOffers(
    product({
      id: "iphone-18-pro",
      variants: [{ key: "256", label: "256GB", priceKes: 189000, inStock: true }],
      exUkKes: undefined,
    }),
    "/iphone/iphone-18-pro",
  );
  assert.equal(offers.length, 1);
  assert.equal(offers[0]?.channel, "new");
});

test("unrecognized SKU with no priced row still shows a New fallback card", () => {
  const rows = listingRows([{ id: "unknown-sku" }], [], {
    href: (item) => `/iphone/${item.id}`,
    fallbackPrice: () => 1000,
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.offer.channel, "new");
  assert.equal(rows[0]?.offer.priceKes, 1000);
});

test("same phone listed as new and ex-uk becomes two rows with different prices", () => {
  const rows = listingRows([{ id: "iphone-16" }], [product({ id: "iphone-16", name: "iPhone 16" })], {
    href: (item) => `/iphone/${item.id}`,
    fallbackPrice: () => 0,
  });
  assert.deepEqual(
    rows.map((row) => [row.item.id, row.offer.channel, row.offer.priceKes]),
    [
      ["iphone-16", "new", 189000],
      ["iphone-16", "ex-uk", 149000],
    ],
  );
});

test("ex-uk-only leftover new sheet price is not a listed new figure", () => {
  const live = product({
    id: "iphone-16",
    name: "iPhone 16",
    showNewOnWebsite: false,
    exUkShowOnWebsite: true,
    priceKes: 93000,
    exUkKes: 80000,
    variants: [{ key: "128", label: "128GB", priceKes: 93000, exUkKes: 80000, inStock: true, showOnWebsite: true, exUkShowOnWebsite: true }],
  });
  const listed = listedVariantPrices(live, live.variants[0]);
  assert.equal(listed.showNew, false);
  assert.equal(listed.showEx, true);
  assert.equal(listed.newKes, 0);
  assert.equal(listed.exUkKes, 80000);
  assert.equal(listed.displayKes, 80000);
  const offers = listingOffers(live, "/iphone/iphone-16");
  assert.equal(offers.length, 1);
  assert.equal(offers[0]?.channel, "ex-uk");
  assert.equal(offers[0]?.priceKes, 80000);
});

test("channel href does not duplicate condition", () => {
  assert.equal(channelHref("/iphone/x?condition=ex-uk", "ex-uk"), "/iphone/x?condition=ex-uk");
});

test("ex-uk offer prefers ex-uk colour list", () => {
  const offers = listingOffers(
    product({
      id: "iphone-18-pro",
      coloursInStock: ["black-titanium"],
      exUkColoursInStock: ["desert-titanium"],
    }),
    "/iphone/iphone-18-pro",
  );
  const byChannel = Object.fromEntries(offers.map((offer: ListingOffer) => [offer.channel, offer.colours]));
  assert.deepEqual(byChannel.new, ["black-titanium"]);
  assert.deepEqual(byChannel["ex-uk"], ["desert-titanium"]);
});
