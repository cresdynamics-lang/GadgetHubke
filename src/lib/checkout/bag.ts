import {
  BAG_KEY,
  BAG_LEGACY_KEYS,
  EXPRESS_KEY,
  type BagItem,
} from "./types";

export function formatKes(n: number): string {
  return `KES ${Math.round(n).toLocaleString("en-KE")}`;
}

export function normalizeBagItem(raw: Record<string, unknown>): BagItem | null {
  if (!raw || typeof raw !== "object") return null;
  const kes = Number(raw.kes ?? raw.priceKes ?? 0) || 0;
  const qty = Math.max(1, Number(raw.qty) || 1);
  const id = String(raw.id || raw.productId || "");
  const name = String(raw.name || "");
  if (!id && !name) return null;
  return {
    id: id || name,
    name: name || "Item",
    colour: String(raw.colour || raw.color || ""),
    storage: String(raw.storage || ""),
    chip: String(raw.chip || ""),
    memory: String(raw.memory || ""),
    size: String(raw.size || ""),
    material: String(raw.material || ""),
    connectivity: String(raw.connectivity || ""),
    connector: (raw.connector as string) || null,
    partNumber: (raw.partNumber as string) || null,
    caseOption: String(raw.caseOption || ""),
    pair: String(raw.pair || ""),
    band: String(raw.band || ""),
    extras: String(raw.extras || ""),
    deviceFor: (raw.deviceFor as string) || null,
    kind: (raw.kind as string) || null,
    channel: String(raw.channel || raw.channelLabel || ""),
    kes,
    image: String(raw.image || ""),
    href: String(raw.href || ""),
    qty,
  };
}

export function bagLineKey(item: BagItem): string {
  return [
    item.id,
    item.colour || "",
    item.storage || "",
    item.chip || "",
    item.memory || "",
    item.size || "",
    item.material || "",
    item.connectivity || "",
    item.connector || "",
    item.partNumber || "",
    item.caseOption || "",
    item.pair || "",
    item.band || "",
    item.extras || "",
    item.deviceFor || "",
    item.channel || "",
  ].join("|");
}

export function bagTotal(items: BagItem[]): number {
  return items.reduce((n, i) => n + i.kes * i.qty, 0);
}

export function bagMetaLine(item: BagItem): string {
  return [
    item.channel,
    item.chip,
    item.size,
    item.material,
    item.storage,
    item.connectivity,
    item.connector,
    item.partNumber ? `P/N ${item.partNumber}` : "",
    item.colour,
    item.caseOption,
    item.pair,
    item.band,
    item.memory,
    item.extras,
    item.deviceFor ? `For: ${item.deviceFor}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

export function whatsappOrderMessage(items: BagItem[], total: number): string {
  const lines = items.map((i) => {
    const bits = [
      i.name,
      i.chip,
      i.size,
      i.material,
      i.memory,
      i.connectivity,
      i.connector,
      i.colour || "-",
      i.caseOption ? `case: ${i.caseOption}` : "",
      i.storage,
      i.pair,
      i.band,
      i.extras,
      i.deviceFor ? `for: ${i.deviceFor}` : "",
      i.channel,
    ].filter(Boolean);
    return `• ${bits.join(" / ")} ×${i.qty} = ${formatKes(i.kes * i.qty)}`;
  });
  return [
    "Hi Gadget Hub, I'd like to order:",
    ...lines,
    `Total: ${formatKes(total)}`,
    "(Sample prices)",
  ].join("\n");
}

/** Browser-only helpers */
export function readBagFromStorage(): BagItem[] {
  if (typeof localStorage === "undefined") return [];
  const lists: BagItem[][] = [];
  for (const key of [BAG_KEY, ...BAG_LEGACY_KEYS]) {
    try {
      const raw = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(raw)) {
        lists.push(
          raw
            .map((r) => normalizeBagItem(r as Record<string, unknown>))
            .filter((x): x is BagItem => Boolean(x)),
        );
      }
    } catch {
      /* ignore */
    }
  }
  const map = new Map<string, BagItem>();
  for (const list of lists) {
    for (const item of list) {
      const key = bagLineKey(item);
      const prev = map.get(key);
      if (prev) prev.qty += item.qty;
      else map.set(key, { ...item });
    }
  }
  return [...map.values()];
}

export function writeBagToStorage(items: BagItem[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(BAG_KEY, JSON.stringify(items));
  for (const k of BAG_LEGACY_KEYS) localStorage.removeItem(k);
}

export function readExpressItems(): BagItem[] {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const raw = JSON.parse(sessionStorage.getItem(EXPRESS_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .map((r) => normalizeBagItem(r as Record<string, unknown>))
      .filter((x): x is BagItem => Boolean(x));
  } catch {
    return [];
  }
}

export function writeExpressItems(items: BagItem[]) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(EXPRESS_KEY, JSON.stringify(items));
}

export function clearExpressItems() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(EXPRESS_KEY);
}

export { BAG_KEY, EXPRESS_KEY };
