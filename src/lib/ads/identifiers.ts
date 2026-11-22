/**
 * Barcodes (GTIN) and Apple part numbers (MPN) for feed rows and product JSON-LD.
 * Filled in by hand in product-identifiers.json, keyed by feed id (IP-099-GLACIER).
 * An empty or missing entry is left out of the feed: never guess one.
 */
import identifiers from "./product-identifiers.json";

export type Identifiers = { gtin?: string; mpn?: string };

const table = identifiers as Record<string, Identifiers>;

export function identifiersFor(id: string): Identifiers {
  const row = table[id];
  const gtin = row?.gtin?.replace(/\s+/g, "");
  const mpn = row?.mpn?.trim();
  return { gtin: gtin && /^\d{8,14}$/.test(gtin) ? gtin : undefined, mpn: mpn || undefined };
}
