import { kvGetJson, kvSetJson } from "./kv";

const KEY = "gh:catalog-overlay:v1";

export type CatalogOverlayVariant = {
  priceKes?: number;
  exUkKes?: number;
  inStock?: boolean;
};

export type CatalogOverlayEntry = {
  priceKes?: number;
  exUkKes?: number;
  inStock?: boolean;
  /** Per storage / configuration prices, keyed like the price sheets (e.g. "256", "256gb-cell"). */
  storages?: Record<string, CatalogOverlayVariant>;
  coloursInStock?: string[];
  confirmed?: boolean;
  confirmedAt?: string;
  updatedAt: string;
};

export type CatalogOverlayMap = Record<string, CatalogOverlayEntry>;

export type OverlayVariantPatch = {
  priceKes?: number | null;
  exUkKes?: number | null;
  inStock?: boolean | null;
};

export async function getOverlayMap(): Promise<CatalogOverlayMap> {
  return kvGetJson<CatalogOverlayMap>(KEY, {});
}

export async function saveOverlayMap(map: CatalogOverlayMap) {
  await kvSetJson(KEY, map);
}

function money(n: unknown): number | undefined {
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

function applyVariantPatch<T extends CatalogOverlayVariant>(prev: T, patch: OverlayVariantPatch): T {
  const next = { ...prev };
  if (patch.priceKes === null) delete next.priceKes;
  else if (money(patch.priceKes) != null) next.priceKes = money(patch.priceKes);
  if (patch.exUkKes === null) delete next.exUkKes;
  else if (money(patch.exUkKes) != null) next.exUkKes = money(patch.exUkKes);
  if (patch.inStock === null) delete next.inStock;
  else if (typeof patch.inStock === "boolean") next.inStock = patch.inStock;
  return next;
}

export async function upsertOverlay(
  id: string,
  patch: {
    priceKes?: number | null;
    exUkKes?: number | null;
    inStock?: boolean | null;
    storages?: Record<string, OverlayVariantPatch>;
  },
) {
  const map = await getOverlayMap();
  const now = new Date().toISOString();
  const prev = map[id] || { updatedAt: now };
  const next = applyVariantPatch<CatalogOverlayEntry>({ ...prev, updatedAt: now }, patch);

  if (patch.storages) {
    const storages = { ...(next.storages || {}) };
    for (const [key, vp] of Object.entries(patch.storages)) {
      const v = applyVariantPatch(storages[key] || {}, vp || {});
      if (v.priceKes == null && v.exUkKes == null && v.inStock == null) delete storages[key];
      else storages[key] = v;
    }
    next.storages = storages;
    // Card "from" price follows the cheapest in-stock configuration.
    const priced = Object.values(storages).filter((v) => v.priceKes != null);
    const pool = priced.filter((v) => v.inStock !== false);
    const from = (pool.length ? pool : priced).map((v) => v.priceKes!);
    if (from.length) next.priceKes = Math.min(...from);
  }

  const empty =
    next.priceKes == null &&
    next.exUkKes == null &&
    next.inStock == null &&
    !Object.keys(next.storages || {}).length;
  if (empty) delete map[id];
  else map[id] = next;
  await saveOverlayMap(map);
  return map[id] || null;
}
