/** Merchant Center ids, shared by the feed and the product pages' JSON-LD. No imports, so anything can use it. */

/** "iphone-18-pro-max" → "IP18PM", "iphone-16-plus" → "IP16PL", "iphone-air" → "IPAIR". */
export function modelGroupCode(seoId: string): string {
  const words: Record<string, string> = { pro: "P", max: "M", plus: "PL", mini: "MINI" };
  return "IP" + seoId.replace(/^iphone-?/, "").split("-").map((w) => words[w] ?? w.toUpperCase()).join("");
}

/** Feed id: IP-099-GLACIER (New), IP-090-EXUK-BLACK (Ex-UK). Same id in the page's JSON-LD. */
export function colourSku(sheetId: string, colourKey: string | null | undefined, exUk: boolean): string {
  return [sheetId, exUk ? "EXUK" : "", colourKey ? colourKey.toUpperCase() : ""].filter(Boolean).join("-");
}
