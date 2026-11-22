import { test } from "node:test";
import assert from "node:assert/strict";
import { colourSku, modelGroupCode } from "./feed-ids.ts";

test("feed ids: base id, then EXUK, then colour", () => {
  assert.equal(colourSku("IP-099", "glacier", false), "IP-099-GLACIER");
  assert.equal(colourSku("IP-090", "black", true), "IP-090-EXUK-BLACK");
  assert.equal(colourSku("IP-104", null, false), "IP-104");
});

test("group codes are short and distinct per model", () => {
  assert.equal(modelGroupCode("iphone-18-pro-max"), "IP18PM");
  assert.equal(modelGroupCode("iphone-18-pro"), "IP18P");
  assert.equal(modelGroupCode("iphone-16-plus"), "IP16PL");
  assert.equal(modelGroupCode("iphone-12-mini"), "IP12MINI");
  assert.equal(modelGroupCode("iphone-air"), "IPAIR");
  assert.equal(modelGroupCode("iphone-duo"), "IPDUO");
});
