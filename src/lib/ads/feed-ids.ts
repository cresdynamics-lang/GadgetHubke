/** Merchant Center ids, shared by the feed and the product pages' JSON-LD. No imports, so anything can use it. */

/** "iphone-18-pro-max" → "IP18PM", "iphone-16-plus" → "IP16PL", "iphone-air" → "IPAIR". */
export function modelGroupCode(seoId: string): string {
  const words: Record<string, string> = { pro: "P", max: "M", plus: "PL", mini: "MINI" };
  return "IP" + seoId.replace(/^iphone-?/, "").split("-").map((w) => words[w] ?? w.toUpperCase()).join("");
}

/** Condition part of a feed id: "" (New), "EXUK" or "USED" (Slightly used). `true` means Ex-UK. */
export type FeedCondition = boolean | "new" | "ex-uk" | "used";

function conditionCode(c: FeedCondition): string {
  if (c === true || c === "ex-uk") return "EXUK";
  if (c === "used") return "USED";
  return "";
}

/** Feed id: IP-099-GLACIER (New), IP-090-EXUK-BLACK (Ex-UK), IP-090-USED-BLACK (Slightly used). Same id in the page's JSON-LD. */
export function colourSku(sheetId: string, colourKey: string | null | undefined, condition: FeedCondition): string {
  return [sheetId, conditionCode(condition), colourKey ? colourKey.toUpperCase() : ""].filter(Boolean).join("-");
}
