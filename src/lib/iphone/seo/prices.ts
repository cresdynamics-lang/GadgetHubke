import { sheetRowsForProduct } from "../../pricing/iphone-sheet";
import type { SeoVariant } from "./types";

/** Map sheet rows → SEO variants. Prices are never invented here. */
export function variantsFromSheet(name: string): SeoVariant[] {
  return sheetRowsForProduct(name).map((r) => ({
    sheetId: r.id,
    storage: r.storage,
    newKes: r.newKes,
    exUkKes: r.exUkKes,
    stockStatus: "ask_whatsapp" as const,
  }));
}
