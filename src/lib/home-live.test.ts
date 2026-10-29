import assert from "node:assert/strict";
import test from "node:test";

import { liveDealItems, liveHomeCategoryRows, resolveLiveProduct } from "./home-live.ts";
import type { PricedProduct } from "./pricing/live.ts";
import type { DealItem } from "./home.ts";

function product(partial: Partial<PricedProduct> & Pick<PricedProduct, "id" | "name" | "group" | "href" | "priceKes">): PricedProduct {
  return {
    basePriceKes: partial.priceKes,
    inStock: true,
    showOnWebsite: true,
    variants: [],
    sample: false,
    ...partial,
  };
}

const catalog: PricedProduct[] = [
  product({ id: "iphone-duo", name: "iPhone Duo", group: "Shop iPhone", href: "/shop/iphone/iphone-duo", priceKes: 395000 }),
  product({ id: "iphone-pro", name: "iPhone 18 Pro", group: "Shop iPhone", href: "/shop/iphone/iphone-pro", priceKes: 185000 }),
  product({ id: "iphone-air", name: "iPhone Air", group: "Shop iPhone", href: "/shop/iphone/iphone-air", priceKes: 125000, showOnWebsite: false }),
  product({ id: "macbook-air-13-m4", name: "MacBook Air 13″ M4", group: "Mac", href: "/mac/macbook-air-13-m4", priceKes: 148000, showOnWebsite: false }),
  product({ id: "macbook-air-13-m5", name: "MacBook Air 13″ M5", group: "Mac", href: "/mac/macbook-air-13-m5", priceKes: 188000 }),
  product({ id: "ipad-pro", name: "iPad Pro", group: "iPad", href: "/shop/ipad/ipad-pro", priceKes: 159999, showOnWebsite: false }),
  product({ id: "ipad-pro-11-m5", name: "iPad Pro 11″ M5", group: "iPad", href: "/ipad/ipad-pro-11-m5", priceKes: 165000 }),
  product({ id: "ipad-pro-13-m5", name: "iPad Pro 13″ M5", group: "iPad", href: "/ipad/ipad-pro-13-m5", priceKes: 185000 }),
  product({ id: "watch-se3-40", name: "Apple Watch SE 40mm", group: "Watch", href: "/watch/watch-se3-40", priceKes: 38000 }),
  product({ id: "watch-s12-42", name: "Apple Watch Series 12 42mm", group: "Watch", href: "/watch/watch-s12-42", priceKes: 60000 }),
  product({ id: "airpods-pro-3", name: "AirPods Pro 3", group: "AirPods", href: "/airpods/airpods-pro-3", priceKes: 33000 }),
  product({ id: "airpods-5", name: "AirPods 5", group: "AirPods", href: "/airpods/airpods-5", priceKes: 24000, showOnWebsite: false }),
];

const homeNewIn: DealItem[] = [
  { id: "new-duo", name: "iPhone Duo", href: "/shop/iphone/iphone-duo", priceKes: 279999 },
  { id: "new-pro", name: "iPhone 18 Pro", href: "/shop/iphone/iphone-pro", priceKes: 185000 },
  { id: "new-mac-air", name: "MacBook Air 13″ M4", href: "/mac/macbook-air-13-m4", priceKes: 135000 },
  { id: "new-ipad-pro", name: "iPad Pro", href: "/shop/ipad/ipad-pro", priceKes: 154999 },
  { id: "new-watch", name: "Apple Watch", href: "/watch", priceKes: 54999 },
  { id: "new-airpods", name: "AirPods Pro", href: "/airpods", priceKes: 39999 },
];

test("homepage New In uses live Duo from-price and listed successors", () => {
  const live = liveDealItems(homeNewIn, catalog);
  assert.deepEqual(
    live.map((item) => [item.id, item.priceKes, item.name]),
    [
      ["iphone-duo", 395000, "iPhone Duo"],
      ["iphone-pro", 185000, "iPhone 18 Pro"],
      ["macbook-air-13-m5", 188000, "MacBook Air 13″ M5"],
      ["ipad-pro-11-m5", 165000, "iPad Pro"],
      ["watch-se3-40", 38000, "Apple Watch"],
      ["airpods-pro-3", 33000, "AirPods Pro"],
    ],
  );
});

test("unlisted merchandising is dropped instead of keeping a stale card", () => {
  const live = liveDealItems(
    [
      { id: "iphone-air", name: "iPhone Air", href: "/shop/iphone/iphone-air", priceKes: 154999 },
      { id: "ap-5", name: "AirPods 5", href: "/airpods/airpods-5", priceKes: 22000 },
    ],
    catalog,
  );
  assert.deepEqual(live, []);
});

test("empty category rows are removed", () => {
  const rows = liveHomeCategoryRows(
    [
      {
        id: "tv-home",
        title: "TV & Home",
        lede: "",
        href: "/tv-home",
        items: [{ id: "tv-4k", name: "Apple TV 4K", href: "/tv-home", priceKes: 24000 }],
      },
    ],
    catalog,
  );
  assert.equal(rows.length, 0);
});

test("chip successors prefer the next listed generation", () => {
  const live = resolveLiveProduct(
    { id: "mba-13-m4", name: "MacBook Air 13″ M4", href: "/mac/macbook-air-13-m4" },
    catalog,
  );
  assert.equal(live?.id, "macbook-air-13-m5");
  assert.equal(live?.priceKes, 188000);
});
