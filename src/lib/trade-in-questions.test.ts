import assert from "node:assert/strict";
import test from "node:test";
import { cleanAnswers, cleanBattery, cleanIdNumber } from "./trade-in-questions.ts";

test("answers keep known options and put the battery after the screen", () => {
  assert.deepEqual(cleanAnswers({ screen: "Yes", battery: "87", extras: "Box only", cameras: "No" }), [
    { question: "Is the screen cracked?", answer: "Yes" },
    { question: "Battery health", answer: "87%" },
    { question: "Do you have the box and receipt?", answer: "Box only" },
  ]);
});

test("a battery figure must be a percentage", () => {
  assert.equal(cleanBattery("100"), 100);
  for (const bad of ["", "0", "101", "87.5", "abc", null]) assert.equal(cleanBattery(bad), null);
  assert.equal(cleanAnswers({ screen: "No" })[1].answer, "Not given");
});

test("an ID or passport number is tidied and checked", () => {
  assert.equal(cleanIdNumber(" 1234 5678 "), "12345678");
  assert.equal(cleanIdNumber("a1234567"), "A1234567");
  for (const bad of ["", "123", "12-34-5678", "1234567890123"]) assert.equal(cleanIdNumber(bad), null);
});
