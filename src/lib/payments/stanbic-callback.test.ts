import assert from "node:assert/strict";
import test from "node:test";

import { callbackMatchesOrder, readStanbicCallback } from "./stanbic-callback.ts";

const order = { id: "GH-ABC-1234", paymentRef: "BANKTXN123", stkReferences: ["K7QX2M9PZTR4A"] };

test("result code 0 is paid and any other code is not", () => {
  assert.equal(readStanbicCallback({ resultCode: "0" }).outcome, "paid");
  assert.equal(readStanbicCallback({ resultCode: 1032, status: "success" }).outcome, "failed");
  assert.equal(readStanbicCallback({ resultCode: "2001" }).outcome, "failed");
  assert.equal(readStanbicCallback({ resultCode: "10" }).outcome, "failed");
});

test("status words match whole words, so unsuccessful is not success", () => {
  assert.equal(readStanbicCallback({ status: "SUCCESSFUL" }).outcome, "paid");
  assert.equal(readStanbicCallback({ status: "unsuccessful" }).outcome, "failed");
  assert.equal(readStanbicCallback({ status: "Cancelled" }).outcome, "failed");
  assert.equal(readStanbicCallback({ status: "pending" }).outcome, "unknown");
  assert.equal(readStanbicCallback({ status: "processing 0 errors" }).outcome, "unknown");
});

test("Safaricom-style nested callbacks are read", () => {
  const cb = readStanbicCallback({
    Body: {
      stkCallback: {
        MerchantRequestID: "m-1",
        CheckoutRequestID: "BANKTXN123",
        ResultCode: 0,
        ResultDesc: "The service request is processed successfully.",
        CallbackMetadata: { Item: [{ Name: "Amount", Value: 1500 }, { Name: "MpesaReceiptNumber", Value: "SFK1" }] },
      },
    },
  });
  assert.equal(cb.outcome, "paid");
  assert.equal(cb.amountKes, 1500);
  assert.ok(cb.refs.includes("BANKTXN123"));
  assert.equal(callbackMatchesOrder(cb, order), true);
});

test("only a stored payment reference proves the notice, never the public order id", () => {
  assert.equal(callbackMatchesOrder(readStanbicCallback({ orderId: order.id, status: "paid" }), order), false);
  assert.equal(callbackMatchesOrder(readStanbicCallback({ externalReference: order.id, reference: order.id }), order), false);
  assert.equal(callbackMatchesOrder(readStanbicCallback({ dbsReferenceId: "K7QX2M9PZTR4A", status: "paid" }), order), true);
  assert.equal(callbackMatchesOrder(readStanbicCallback({ dbsReferenceId: "WRONGREF", status: "paid" }), order), false);
});

test("Stanbic account notifications (Letter format) give their amount and references", () => {
  const cb = readStanbicCallback({ Letter: { TxnAmount: "KES 1,234.00", ThirdPartyRef: "K7QX2M9PZTR4A", OurTxnReference: "FT20070YCTF8999", ActionType: "CREDIT" } });
  assert.equal(cb.amountKes, 1234);
  assert.ok(cb.refs.includes("K7QX2M9PZTR4A"));
  assert.equal(callbackMatchesOrder(cb, order), true);
});
