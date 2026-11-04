import assert from "node:assert/strict";
import test from "node:test";
import { LIPA_MONTH_OPTIONS, lipaPlan } from "./lipa.ts";

test("iPhone 17 Pro at KES 158,000 over 6 months", () => {
  const plan = lipaPlan(158000, 40, 6);
  assert.equal(plan.depositKes, 63200);
  assert.equal(plan.balanceKes, 94800);
  assert.equal(plan.rate, 1.8);
  assert.equal(plan.repayKes, 170600);
  assert.equal(plan.monthlyKes, 28433);
  assert.equal(plan.totalKes, 233800);
});

test("each month from 1 to 6 uses its own rate", () => {
  const repay = LIPA_MONTH_OPTIONS.map((months) => lipaPlan(158000, 40, months).repayKes);
  assert.deepEqual(repay, [123200, 132700, 142200, 151700, 161200, 170600]);
});

test("the same sum works for an Ex-UK price", () => {
  const plan = lipaPlan(130000, 40, 3);
  assert.equal(plan.depositKes, 52000);
  assert.equal(plan.balanceKes, 78000);
  assert.equal(plan.repayKes, 117000);
  assert.equal(plan.monthlyKes, 39000);
});

test("a higher deposit lowers what is left to pay", () => {
  assert.ok(lipaPlan(158000, 60, 6).repayKes < lipaPlan(158000, 40, 6).repayKes);
});

test("a month outside 1 to 6 falls back to 6", () => {
  assert.equal(lipaPlan(158000, 40, 12).months, 6);
});
