import assert from "node:assert/strict";
import test from "node:test";
import { storageCopy, storageGb, storagePath, storageSlug, toneName, type StorageOption } from "./variant-pages.ts";

const opt = (storage: string, newKes: number, exUkKes = 0, inStock = true): StorageOption => ({
  storage,
  slug: storageSlug(storage),
  sheetId: `IP18PM-${storage}`,
  newKes,
  exUkKes,
  inStock,
});

const options = [opt("512GB", 245000), opt("256GB", 218000), opt("1TB", 320000)];
const colours = [
  { key: "burgundy", label: "Burgundy", hex: "#5E2230", inStock: null },
  { key: "black", label: "Black", hex: "#1C1C1E", inStock: null },
  { key: "glacier", label: "Glacier", hex: "#AFC6E0", inStock: null },
  { key: "silver", label: "Silver", hex: "#E3E4E5", inStock: null },
];
const base = {
  modelName: "iPhone 18 Pro Max",
  modelId: "iphone-18-pro-max",
  options,
  colours,
  specs: [
    { label: "Chip", value: "A20 Pro" },
    { label: "Storage", value: "256GB, 512GB, 1TB, 2TB" },
  ],
  exUkLabel: "Ex-UK",
  exUkWarranty: "Ex-UK units are UK-used stock.",
  store: {
    line: "Norwich Union House, Suite 15, 4th Floor, opposite the Hilton Hotel, Nairobi CBD",
    phone: "0729 585 471",
    hours: "Mon-Sat 8am-8pm · Sun 10am-8pm",
    warrantyYears: 1,
    returnDays: 7,
    deliveryFromKes: 1500,
    checkedOn: "10 November 2026",
  },
};

test("storage paths and sizes", () => {
  assert.equal(storageSlug("1TB"), "1tb");
  assert.equal(storagePath("iphone-18-pro-max", "256GB"), "/iphone/iphone-18-pro-max/256gb");
  assert.equal(storageGb("1TB"), 1024);
  assert.equal(storageGb("512GB"), 512);
});

test("swatch colours are described from their hex", () => {
  assert.equal(toneName("#5E2230"), "deep red");
  assert.equal(toneName("#AFC6E0"), "pale blue");
  assert.equal(toneName("#1C1C1E"), "black");
  assert.equal(toneName("#E3E4E5"), "very light grey");
});

test("iPhone 18 Pro Max 256GB is its own phone with its own price and plan", () => {
  const copy = storageCopy({ ...base, option: options[1] });
  assert.equal(copy.h1, "iPhone 18 Pro Max 256GB");
  assert.equal(copy.title, "iPhone 18 Pro Max 256GB Price in Kenya, KES 218,000 | Gadget Hub");
  assert.match(copy.metaDescription, /sealed new, KES 218,000 in Nairobi\. Burgundy, Black, Glacier or Silver\./);
  const text = copy.sections.flatMap((s) => [...s.paragraphs, ...(s.list ?? [])]).join(" ");
  assert.match(text, /smallest storage we sell for the iPhone 18 Pro Max/);
  assert.match(text, /Moving up to 512GB costs KES 27,000 more \(KES 245,000\) and gives you twice the space/);
  assert.match(text, /Burgundy: a deep red finish\./);
  assert.match(text, /Storage: 256GB/);
  assert.doesNotMatch(text, /Storage: 256GB, 512GB/);
  // 40% of 218,000 = 87,200; 130,800 × 1.8 = 235,440 → 235,400; ÷ 6 = 39,233.
  assert.match(text, /KES 87,200 deposit \(40%\) today .* KES 39,233 a month for 6 months, KES 322,600 in total/);
  assert.ok(copy.faq.some((f) => f.question === "How much is the iPhone 18 Pro Max 256GB in Kenya?"));
  assert.ok(copy.faq.some((f) => f.question === "Should I buy the iPhone 18 Pro Max 256GB or 512GB?"));
});

test("the largest size says so and points back down", () => {
  const copy = storageCopy({ ...base, option: options[2] });
  const text = copy.sections.flatMap((s) => s.paragraphs).join(" ");
  assert.match(text, /1TB is the largest storage we sell for the iPhone 18 Pro Max/);
  assert.match(text, /the 512GB version is KES 245,000, which saves you KES 75,000/);
  assert.match(text, /ProRes/);
});

test("Ex-UK only storage is priced and labelled as Ex-UK", () => {
  const only = opt("128GB", 0, 61000);
  const copy = storageCopy({ ...base, modelName: "iPhone 13", option: only, options: [only] });
  assert.match(copy.title, /KES 61,000/);
  assert.match(copy.metaDescription, /iPhone 13 128GB, Ex-UK, KES 61,000/);
  assert.doesNotMatch(copy.sections.map((s) => s.paragraphs.join(" ")).join(" "), /ProRes|sealed new/);
});

test("out of stock storage says so", () => {
  const copy = storageCopy({ ...base, option: opt("512GB", 245000, 0, false) });
  assert.match(copy.sections[0].paragraphs.join(" "), /out of stock right now/);
});

test("a model with no colours or spec sheet makes no claims about them", () => {
  const only = opt("256GB", 350000);
  const copy = storageCopy({ ...base, modelName: "iPhone Duo", option: only, options: [only], colours: [], specs: [{ label: "Storage", value: "256GB" }] });
  const text = copy.sections.flatMap((s) => s.paragraphs).join(" ");
  assert.doesNotMatch(text, /your colour|same display, chip and cameras/);
  assert.match(text, /reserve one/);
  assert.ok(!copy.sections.some((s) => s.id === "colours"));
});

test("at a glance and buying questions carry the shop's real facts", () => {
  const copy = storageCopy({ ...base, option: opt("256GB", 158000, 130000) , options: [opt("256GB", 158000, 130000)], modelName: "iPhone 17 Pro" });
  const glance = Object.fromEntries(copy.glance.map((g) => [g.label, g.value]));
  assert.equal(glance["Price, sealed new"], "KES 158,000");
  assert.equal(glance["Price, Ex-UK"], "KES 130,000");
  assert.equal(glance["Price checked"], "10 November 2026");
  assert.match(glance["Order"], /0729 585 471/);
  const q = copy.faq.map((f) => f.question);
  assert.ok(q.includes("Is the iPhone 17 Pro 256GB at Gadget Hub original?"));
  assert.ok(q.includes("Do you deliver the iPhone 17 Pro 256GB outside Nairobi?"));
  assert.ok(q.includes("Should I buy the iPhone 17 Pro 256GB new or Ex-UK?"));
  assert.match(copy.faq.find((f) => f.question.includes("new or Ex-UK"))!.answer, /saving KES 28,000/);
});
