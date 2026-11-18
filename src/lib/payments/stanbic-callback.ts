/**
 * Reads a Stanbic STK result / payment notification. The bank's exact shape is not documented to us,
 * so this accepts flat fields and Safaricom-style nesting (Body.stkCallback, CallbackMetadata.Item).
 */

export type CallbackOutcome = "paid" | "failed" | "unknown";

export type StanbicCallback = {
  /** Our order id, when the bank echoes externalReference / orderId. Public, so it never proves a payment. */
  orderId: string;
  /** Payment references that only the bank and this server know (our dbsReferenceId, the bank's transaction id). */
  refs: string[];
  outcome: CallbackOutcome;
  message: string;
  amountKes?: number;
  /** Field names that arrived, for the log when a notice cannot be matched. Never values. */
  fields: string[];
};

const ORDER_KEYS = ["orderid", "externalreference"];
// thirdpartyref / ourtxnreference come from Stanbic's account notification ("Letter") format.
const REF_KEYS = ["dbsreferenceid", "reference", "transactionid", "checkoutrequestid", "merchantrequestid", "conversationid", "paymentref", "thirdpartyref", "ourtxnreference"];
const CODE_KEYS = ["resultcode", "responsecode", "statuscode", "txnstatuscode"];
const STATUS_KEYS = ["status", "result", "transactionstatus", "txnstatus", "paymentstatus"];
const MESSAGE_KEYS = ["resultdesc", "message", "description", "responsedescription", "statusdescription"];
const AMOUNT_KEYS = ["amount", "transamount", "transactionamount", "txnamount"];

const PAID_WORDS = new Set(["paid", "success", "successful", "completed", "complete", "approved"]);
const FAILED_WORDS = new Set([
  "failed", "failure", "fail", "cancelled", "canceled", "timeout", "timedout", "expired", "rejected", "declined", "unsuccessful", "error",
]);

/** Every scalar field in the body, keyed by lower-case name; the first one found wins. */
function flatten(body: unknown) {
  const out = new Map<string, string>();
  const visit = (value: unknown, depth: number) => {
    if (depth > 6 || value == null || typeof value !== "object") return;
    if (Array.isArray(value)) {
      for (const item of value) {
        // Safaricom metadata: [{ Name: "Amount", Value: 1 }, …]
        if (item && typeof item === "object" && "Name" in item && "Value" in item) {
          const key = String((item as { Name: unknown }).Name).toLowerCase();
          const raw = (item as { Value: unknown }).Value;
          if (raw != null && !out.has(key)) out.set(key, String(raw).trim());
        } else visit(item, depth + 1);
      }
      return;
    }
    for (const [name, raw] of Object.entries(value as Record<string, unknown>)) {
      if (raw != null && typeof raw === "object") visit(raw, depth + 1);
      else if (raw != null && String(raw).trim()) {
        const key = name.toLowerCase();
        if (!out.has(key)) out.set(key, String(raw).trim());
      }
    }
  };
  visit(body, 0);
  return out;
}

function first(fields: Map<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = fields.get(key);
    if (value) return value;
  }
  return "";
}

export function readStanbicCallback(body: unknown): StanbicCallback {
  const fields = flatten(body);
  const code = first(fields, CODE_KEYS);
  const word = first(fields, STATUS_KEYS).toLowerCase().replace(/[^a-z]/g, "");
  let outcome: CallbackOutcome = "unknown";
  // A numeric result code decides on its own: 0 is success, anything else (1032 cancelled, 2001 wrong PIN…) is not.
  if (/^\d+$/.test(code)) outcome = Number(code) === 0 ? "paid" : "failed";
  else if (PAID_WORDS.has(word)) outcome = "paid";
  else if (FAILED_WORDS.has(word)) outcome = "failed";

  // "KES 1,234.00" in Stanbic notifications.
  const amount = Number(first(fields, AMOUNT_KEYS).replace(/[^\d.]/g, ""));
  const refs = [...new Set(REF_KEYS.map((key) => fields.get(key) || "").filter(Boolean))];
  return {
    orderId: first(fields, ORDER_KEYS),
    refs,
    outcome,
    message: first(fields, MESSAGE_KEYS),
    amountKes: Number.isFinite(amount) && amount > 0 ? amount : undefined,
    fields: [...fields.keys()],
  };
}

/** True when the notice carries a payment reference stored on the order (never the public order id). */
export function callbackMatchesOrder(
  callback: StanbicCallback,
  order: { id: string; paymentRef?: string; stkReferences?: string[] },
): boolean {
  const known = new Set([order.paymentRef, ...(order.stkReferences ?? [])].filter((ref): ref is string => Boolean(ref) && ref !== order.id));
  return callback.refs.some((ref) => known.has(ref));
}
