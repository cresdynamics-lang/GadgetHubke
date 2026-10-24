/**
 * Unified product index for admin stock/price editing.
 * Defaults come from repo price sheets; overlays override commerce fields.
 */
import {
  defaultPricedCatalog,
  livePricedCatalog,
  type PricedProduct,
} from "../pricing/live";
import type { CatalogOverlayEntry } from "./overlay";

export type AdminCatalogItem = PricedProduct;

export function listCatalogDefaults(): AdminCatalogItem[] {
  return defaultPricedCatalog();
}

export async function listCatalogMerged(): Promise<AdminCatalogItem[]> {
  return livePricedCatalog();
}

export type OverlayPatch = CatalogOverlayEntry & { id: string };
