/**
 * Official Gadget Hub TV & Home price sheet (NEW + EX-UK, KES).
 * Source: Gadget_Hub_Price_List_Full PDF — TV-001 … TV-007.
 */
export type TvHomeSheetRow = {
  id: string;
  product: string;
  config: string;
  newKes: number;
  exUkKes: number;
  modelId: string | null;
  storage: string | null;
  /** wifi | ethernet for Apple TV 4K 3rd gen SKUs */
  variant: "wifi" | "ethernet" | null;
};

export const tvHomeSheet: TvHomeSheetRow[] = [
  { id: "TV-001", product: "Apple TV 4K (3rd generation, 2022)", config: "Wi-Fi \u00b7 64GB", newKes: 35000, exUkKes: 28000, modelId: "apple-tv-4k-3", storage: "64GB", variant: "wifi" },
  { id: "TV-002", product: "Apple TV 4K (3rd generation, 2022)", config: "Wi-Fi + Ethernet \u00b7 128GB", newKes: 43000, exUkKes: 34000, modelId: "apple-tv-4k-3-ethernet", storage: "128GB", variant: "ethernet" },
  { id: "TV-003", product: "Apple TV 4K (2nd generation, 2021)", config: "32GB", newKes: 25000, exUkKes: 18000, modelId: "apple-tv-4k-2", storage: "32GB", variant: null },
  { id: "TV-004", product: "Apple TV 4K (2nd generation, 2021)", config: "64GB", newKes: 30000, exUkKes: 22000, modelId: "apple-tv-4k-2", storage: "64GB", variant: null },
  { id: "TV-005", product: "HomePod (2nd generation)", config: "Midnight / White", newKes: 48000, exUkKes: 36000, modelId: "homepod-2", storage: null, variant: null },
  { id: "TV-006", product: "HomePod mini", config: "All colours", newKes: 18000, exUkKes: 13500, modelId: "homepod-mini", storage: null, variant: null },
  { id: "TV-007", product: "Siri Remote (USB-C)", config: "Apple TV remote", newKes: 9500, exUkKes: 6500, modelId: null, storage: null, variant: null },
];

export function tvHomeSheetForModel(modelId: string): TvHomeSheetRow[] {
  if (modelId === "apple-tv-4k-3") {
    return tvHomeSheet.filter(
      (r) => r.modelId === "apple-tv-4k-3" || r.modelId === "apple-tv-4k-3-ethernet",
    );
  }
  return tvHomeSheet.filter((r) => r.modelId === modelId);
}

export function tvHomeBaseFromSheet(modelId: string): number | undefined {
  const rows = tvHomeSheetForModel(modelId);
  if (!rows.length) return undefined;
  return Math.min(..rows.map((r) => r.newKes));
}

export function tvHomeBaseExUkFromSheet(modelId: string): number | undefined {
  const rows = tvHomeSheetForModel(modelId);
  if (!rows.length) return undefined;
  const best = rows.slice().sort((a, b) => a.newKes - b.newKes)[0];
  return best.exUkKes;
}

export function normalizeTvStorage(label: string): string {
  return label
.toUpperCase()
.replace(/\s+/g, "")
.replace("WIFI+", "")
.replace("WIFI", "")
.replace("+ETHERNET", "")
.replace("ETHERNET", "");
}

export function tvHomeConfigStorageId(row: TvHomeSheetRow): string {
  if (row.variant === "ethernet" || row.modelId === "apple-tv-4k-3-ethernet") return "128gb-ethernet";
  if (row.variant === "wifi") return "64gb-wifi";
  if (row.storage) return row.storage.toLowerCase().replace(/\s+/g, "");
  return "base";
}

export function tvHomeConfigStorageLabel(row: TvHomeSheetRow): string {
  return row.config;
}

export function tvHomeSheetPrice(
  modelId: string,
  opts: { ethernet?: boolean; storageLabel?: string } = {},
): { newKes: number; exUkKes: number; sheetId: string } | undefined {
  const rows = tvHomeSheetForModel(modelId);
  if (!rows.length) return undefined;

  if (modelId === "apple-tv-4k-3" || modelId === "apple-tv-4k-3-ethernet") {
    const wantEth = Boolean(opts.ethernet) || modelId === "apple-tv-4k-3-ethernet";
    const hit = rows.find((r) =>
      wantEth
        ? r.variant === "ethernet" || r.modelId === "apple-tv-4k-3-ethernet"
        : r.variant === "wifi" || r.modelId === "apple-tv-4k-3",
    );
    if (hit) return { newKes: hit.newKes, exUkKes: hit.exUkKes, sheetId: hit.id };
  }

  if (opts.storageLabel) {
    const want = normalizeTvStorage(opts.storageLabel);
    const hit = rows.find((r) => r.storage && normalizeTvStorage(r.storage) === want);
    if (hit) return { newKes: hit.newKes, exUkKes: hit.exUkKes, sheetId: hit.id };
  }

  const best = rows.slice().sort((a, b) => a.newKes - b.newKes)[0];
  return { newKes: best.newKes, exUkKes: best.exUkKes, sheetId: best.id };
}
