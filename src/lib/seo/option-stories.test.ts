import assert from "node:assert/strict";
import test from "node:test";
import { optionStories } from "./option-stories.ts";

test("each Mac configuration gets its own price, step up and Lipa plan", () => {
  const rows = [
    { label: "16GB / 256GB", priceKes: 165000, exUkKes: 120000, inStock: true },
    { label: "16GB / 512GB", priceKes: 195000, inStock: true },
    { label: "24GB / 1TB", priceKes: 245000, inStock: false },
  ];
  const stories = optionStories("MacBook Air 13 M5", rows);
  assert.equal(stories.length, 3);
  assert.equal(stories[0].id, "16gb-256gb");
  assert.equal(stories[0].title, "MacBook Air 13 M5 16GB / 256GB");
  const first = stories[0].paragraphs.join(" ");
  assert.match(first, /KES 165,000 sealed new/);
  assert.match(first, /Ex-UK \(UK-used\) it is KES 120,000, KES 45,000 less/);
  assert.match(first, /lowest-priced MacBook Air 13 M5 configuration/);
  assert.match(first, /The next step up, 16GB \/ 512GB, is KES 30,000 more/);
  // 40% of 165,000 = 66,000; 99,000 × 1.8 = 178,200; ÷ 6 = 29,700.
  assert.match(first, /KES 66,000 deposit, then KES 29,700 a month for 6 months/);
  assert.match(stories[2].paragraphs.join(" "), /highest MacBook Air 13 M5 configuration.*Ask on WhatsApp for stock/);
});

test("a single-option product has no configuration stories", () => {
  assert.deepEqual(optionStories("AirPods 4", [{ label: "Standard", priceKes: 25000, inStock: true }]), []);
});
