import { test } from "node:test";
import assert from "node:assert/strict";
import { feedItemId } from "./feed-item-id.ts";

test("cart lines map to the feed's colour ids", () => {
  assert.equal(feedItemId({ catalogId: "IP-089", colour: "Deep Blue" }), "IP-089-DEEPBLUE");
  assert.equal(feedItemId({ catalogId: "IP-090-EXUK", colour: "Cosmic Orange" }), "IP-090-EXUK-COSMICORANGE");
  assert.equal(feedItemId({ catalogId: "IP-104", colour: "Overview" }), "IP-104");
  assert.equal(feedItemId({ catalogId: "IP-050-USED", colour: "Black" }), "IP-050-USED");
  assert.equal(feedItemId({ catalogId: "macbook-air-13-m5", colour: "Sky Blue" }, ["macbook-air-13-m5"]), "macbook-air-13-m5-SKY-BLUE");
  assert.equal(feedItemId({ catalogId: "macbook-neo-13", colour: "Silver" }, ["macbook-air-13-m5"]), "macbook-neo-13");
});
