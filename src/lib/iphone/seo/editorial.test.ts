import { test } from "node:test";
import assert from "node:assert/strict";
import { getEditorial, mergeStorageFaq, type EditorialCtx } from "./editorial.ts";

const ctx: EditorialCtx = {
  price: (s) => ({ "256GB": 203000, "512GB": 234000, "1TB": 292000 })[s] ?? 0,
  exUk: (s) => ({ "128GB": 93000, "256GB": 142000, "512GB": 155000 })[s] ?? 0,
  storages: ["256GB", "512GB", "1TB"],
  other: (id) => (id === "iphone-17-pro-max" ? { newKes: 167000, exUkKes: 142000 } : { newKes: 0, exUkKes: 0 }),
};

test("copy quotes live prices and drops prices that are not listed", () => {
  const ed = getEditorial("iphone-18-pro-max")!;
  assert.match(ed.intro(ctx), /KES 203,000 for 256GB, KES 234,000 for 512GB and KES 292,000 for 1TB/);
  assert.match(ed.metaDescription(ctx), /^iPhone 18 Pro Max from KES 203,000\./);
  const faq = ed.faq(ctx);
  assert.match(faq.find((f) => /17 Pro Max/.test(f.question))!.answer, /KES 167,000 new or KES 142,000 Ex-UK/);
  // 18 Pro not listed: no price quoted for it.
  assert.doesNotMatch(faq.find((f) => /worth it over/.test(f.question))!.answer, /costs from/);
  assert.match(ed.storages["256GB"].faq(ctx)[1].answer, /KES 81,200 deposit, then KES 36,533 a month/);
});

test("meta descriptions and titles stay within limits", () => {
  for (const id of ["iphone-18-pro-max", "iphone-18-pro", "iphone-duo", "iphone-17", "iphone-17-pro", "iphone-17-pro-max", "iphone-16", "iphone-16-pro", "iphone-16-pro-max"]) {
    const ed = getEditorial(id)!;
    assert.ok(ed.seoTitle.length <= 60, ed.seoTitle);
    assert.ok(ed.metaDescription(ctx).length <= 155, ed.metaDescription(ctx));
    const words = ed.intro(ctx).split(/\s+/).length;
    assert.ok(words >= 55 && words <= 95, `${id} intro ${words} words`);
    const body = ed.sections(ctx).flatMap((s) => [...s.paragraphs, ...(s.list ?? [])]).join(" ").split(/\s+/).length;
    assert.ok(body >= 400 && body <= 900, `${id} description ${body} words`);
    for (const s of Object.values(ed.storages)) {
      assert.ok(s.title.length <= 60, s.title);
      assert.ok(s.metaDescription(ctx).length <= 155, s.metaDescription(ctx));
      if (s.feedExUkTitle) {
        assert.ok(s.feedExUkTitle.length >= 80 && s.feedExUkTitle.length <= 150, s.feedExUkTitle);
        assert.ok(s.feedExUkDescription!.length >= 800 && s.feedExUkDescription!.length <= 1500, s.feedExUkTitle);
      }
      assert.ok(s.feedTitle.length >= 80 && s.feedTitle.length <= 150, s.feedTitle);
      assert.ok(s.feedDescription.length >= 800 && s.feedDescription.length <= 1500, s.feedTitle);
    }
  }
});

test("storage FAQs replace matching generated questions and append the rest", () => {
  const merged = mergeStorageFaq(
    [
      { question: "How much is the X 256GB in Kenya?", answer: "old" },
      { question: "Where can I buy the X 256GB in Nairobi?", answer: "keep" },
    ],
    [
      { question: "Price?", answer: "new", replaces: /^How much is/ },
      { question: "Extra?", answer: "extra" },
    ],
  );
  assert.deepEqual(merged.map((f) => f.answer), ["new", "keep", "extra"]);
});

test("iPhone 17 copy quotes New and Ex-UK prices side by side", () => {
  const ed = getEditorial("iphone-17-pro-max")!;
  assert.match(ed.intro(ctx), /KES 203,000 new or KES 142,000 Ex-UK for 256GB/);
  assert.match(ed.storages["256GB"].faq(ctx)[1].answer, /Ex-UK: a KES 56,800 deposit/);
  assert.match(ed.storages["256GB"].feedExUkDescription!, /Ex-UK \(UK-used\)/);
  assert.doesNotMatch(ed.storages["256GB"].feedExUkDescription!, /sealed|1-year warranty/);
});

test("iPhone 16 copy is Ex-UK only: no sealed or 1-year warranty claims", () => {
  for (const id of ["iphone-16", "iphone-16-pro", "iphone-16-pro-max"]) {
    const ed = getEditorial(id)!;
    const all = [
      ed.intro(ctx), ed.metaDescription(ctx),
      ...ed.sections(ctx).flatMap((s) => [...s.paragraphs, ...(s.list ?? [])]),
      ...ed.faq(ctx).map((f) => f.answer),
      ...Object.values(ed.storages).flatMap((s) => [s.intro(ctx), s.metaDescription(ctx), s.feedDescription, ...s.faq(ctx).map((f) => f.answer)]),
    ].join(" ");
    assert.doesNotMatch(all, /sealed|1-year warranty/, id);
    assert.match(all, /Ex-UK/);
  }
});
