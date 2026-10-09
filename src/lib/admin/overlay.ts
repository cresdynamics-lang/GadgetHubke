import { kvGetJson, kvSetJson } from "./kv";

const KEY = "gh:catalog-overlay:v1";

export type CatalogOverlayEntry = {
  priceKes?: number;
  inStock?: boolean;
  updatedAt: string;
};

export type CatalogOverlayMap = Record<string, CatalogOverlayEntry>;

export async function getOverlayMap(): Promise<CatalogOverlayMap> {
  return kvGetJson<CatalogOverlayMap>(KEY, {});
}

export async function saveOverlayMap(map: CatalogOverlayMap) {
  await kvSetJson(KEY, map);
}

export async function upsertOverlay(
  id: string,
  patch: { priceKes?: number | null; inStock?: boolean | null },
) {
  const map = await getOverlayMap();
  const prev = map[id] || { updatedAt: new Date().toISOString() };
  const next: CatalogOverlayEntry = {
    ...prev,
    updatedAt: new Date().toISOString(),
  };
  if (patch.priceKes === null) delete next.priceKes;
  else if (typeof patch.priceKes === "number" && Number.isFinite(patch.priceKes)) {
    next.priceKes = Math.round(patch.priceKes);
  }
  if (patch.inStock === null) delete next.inStock;
  else if (typeof patch.inStock === "boolean") next.inStock = patch.inStock;

  if (next.priceKes == null && next.inStock == null) {
    delete map[id];
  } else {
    map[id] = next;
  }
  await saveOverlayMap(map);
  return map[id] || null;
}
