/**
 * Official Gadget Hub Apple Watch price sheet (NEW + EX-UK, KES).
 * Source: Gadget_Hub_Price_List_Full PDF — WA-001 … WA-044.
 */
export type WatchSheetRow = {
  id: string;
  product: string;
  config: string;
  newKes: number;
  exUkKes: number;
  modelId: string | null;
  caseMm: number | null;
  material: string | null;
  cellular: boolean;
};

export const watchSheet: WatchSheetRow[] = [
  { id: "WA-001", product: "Apple Watch Series 12 42mm", config: "Apple Watch Series 12 42mm \u00b7 Aluminium \u00b7 GPS", newKes: 78000, exUkKes: 62000, modelId: "watch-s12-42", caseMm: 42, material: "aluminum", cellular: false },
  { id: "WA-002", product: "Apple Watch Series 12 42mm", config: "Apple Watch Series 12 42mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 88000, exUkKes: 72000, modelId: "watch-s12-42", caseMm: 42, material: "aluminum", cellular: true },
  { id: "WA-003", product: "Apple Watch Series 12 46mm", config: "Apple Watch Series 12 46mm \u00b7 Aluminium \u00b7 GPS", newKes: 85000, exUkKes: 68000, modelId: "watch-s12-46", caseMm: 46, material: "aluminum", cellular: false },
  { id: "WA-004", product: "Apple Watch Series 12 46mm", config: "Apple Watch Series 12 46mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 95000, exUkKes: 78000, modelId: "watch-s12-46", caseMm: 46, material: "aluminum", cellular: true },
  { id: "WA-005", product: "Apple Watch Series 12 42mm", config: "Apple Watch Series 12 42mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 115000, exUkKes: 95000, modelId: "watch-s12-42", caseMm: 42, material: "titanium", cellular: true },
  { id: "WA-006", product: "Apple Watch Series 12 42mm", config: "Apple Watch Series 12 42mm \u00b7 Ceramic \u00b7 GPS Cellular", newKes: 115000, exUkKes: 95000, modelId: "watch-s12-42", caseMm: 42, material: "ceramic", cellular: true },
  { id: "WA-007", product: "Apple Watch Series 12 46mm", config: "Apple Watch Series 12 46mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 125000, exUkKes: 105000, modelId: "watch-s12-46", caseMm: 46, material: "titanium", cellular: true },
  { id: "WA-008", product: "Apple Watch Series 12 46mm", config: "Apple Watch Series 12 46mm \u00b7 Ceramic \u00b7 GPS Cellular", newKes: 125000, exUkKes: 105000, modelId: "watch-s12-46", caseMm: 46, material: "ceramic", cellular: true },
  { id: "WA-009", product: "Apple Watch Series 11 42mm", config: "Apple Watch Series 11 42mm \u00b7 Aluminium \u00b7 GPS", newKes: 48000, exUkKes: 38000, modelId: "watch-s11-42", caseMm: 42, material: "aluminum", cellular: false },
  { id: "WA-010", product: "Apple Watch Series 11 42mm", config: "Apple Watch Series 11 42mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 55000, exUkKes: 45000, modelId: "watch-s11-42", caseMm: 42, material: "aluminum", cellular: true },
  { id: "WA-011", product: "Apple Watch Series 11 46mm", config: "Apple Watch Series 11 46mm \u00b7 Aluminium \u00b7 GPS", newKes: 52000, exUkKes: 42000, modelId: "watch-s11-46", caseMm: 46, material: "aluminum", cellular: false },
  { id: "WA-012", product: "Apple Watch Series 11 46mm", config: "Apple Watch Series 11 46mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 60000, exUkKes: 48000, modelId: "watch-s11-46", caseMm: 46, material: "aluminum", cellular: true },
  { id: "WA-013", product: "Apple Watch Series 11 42mm", config: "Apple Watch Series 11 42mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 85000, exUkKes: 68000, modelId: "watch-s11-42", caseMm: 42, material: "titanium", cellular: true },
  { id: "WA-014", product: "Apple Watch Series 11 46mm", config: "Apple Watch Series 11 46mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 92000, exUkKes: 74000, modelId: "watch-s11-46", caseMm: 46, material: "titanium", cellular: true },
  { id: "WA-015", product: "Apple Watch Series 10 42mm", config: "Apple Watch Series 10 42mm \u00b7 Aluminium \u00b7 GPS", newKes: 42000, exUkKes: 32000, modelId: "watch-s10-42", caseMm: 42, material: "aluminum", cellular: false },
  { id: "WA-016", product: "Apple Watch Series 10 42mm", config: "Apple Watch Series 10 42mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 46000, exUkKes: 36000, modelId: "watch-s10-42", caseMm: 42, material: "aluminum", cellular: true },
  { id: "WA-017", product: "Apple Watch Series 10 46mm", config: "Apple Watch Series 10 46mm \u00b7 Aluminium \u00b7 GPS", newKes: 46000, exUkKes: 35000, modelId: "watch-s10-46", caseMm: 46, material: "aluminum", cellular: false },
  { id: "WA-018", product: "Apple Watch Series 10 46mm", config: "Apple Watch Series 10 46mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 50000, exUkKes: 39000, modelId: "watch-s10-46", caseMm: 46, material: "aluminum", cellular: true },
  { id: "WA-019", product: "Apple Watch Series 10 42mm", config: "Apple Watch Series 10 42mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 75000, exUkKes: 58000, modelId: "watch-s10-42", caseMm: 42, material: "titanium", cellular: true },
  { id: "WA-020", product: "Apple Watch Series 10 46mm", config: "Apple Watch Series 10 46mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 82000, exUkKes: 64000, modelId: "watch-s10-46", caseMm: 46, material: "titanium", cellular: true },
  { id: "WA-021", product: "Apple Watch Series 9 41mm", config: "Apple Watch Series 9 41mm \u00b7 Aluminium \u00b7 GPS", newKes: 34000, exUkKes: 26000, modelId: "watch-s9-41", caseMm: 41, material: "aluminum", cellular: false },
  { id: "WA-022", product: "Apple Watch Series 9 41mm", config: "Apple Watch Series 9 41mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 38000, exUkKes: 30000, modelId: "watch-s9-41", caseMm: 41, material: "aluminum", cellular: true },
  { id: "WA-023", product: "Apple Watch Series 9 45mm", config: "Apple Watch Series 9 45mm \u00b7 Aluminium \u00b7 GPS", newKes: 37000, exUkKes: 29000, modelId: "watch-s9-45", caseMm: 45, material: "aluminum", cellular: false },
  { id: "WA-024", product: "Apple Watch Series 9 45mm", config: "Apple Watch Series 9 45mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 42000, exUkKes: 33000, modelId: "watch-s9-45", caseMm: 45, material: "aluminum", cellular: true },
  { id: "WA-025", product: "Apple Watch Series 8 41mm", config: "Apple Watch Series 8 41mm \u00b7 Aluminium \u00b7 GPS", newKes: 32000, exUkKes: 22000, modelId: "watch-s8-41", caseMm: 41, material: "aluminum", cellular: false },
  { id: "WA-026", product: "Apple Watch Series 8 41mm", config: "Apple Watch Series 8 41mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 32000, exUkKes: 22000, modelId: "watch-s8-41", caseMm: 41, material: "aluminum", cellular: true },
  { id: "WA-027", product: "Apple Watch Series 8 45mm", config: "Apple Watch Series 8 45mm \u00b7 Aluminium \u00b7 GPS", newKes: 35000, exUkKes: 25000, modelId: "watch-s8-45", caseMm: 45, material: "aluminum", cellular: false },
  { id: "WA-028", product: "Apple Watch Series 8 45mm", config: "Apple Watch Series 8 45mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 35000, exUkKes: 25000, modelId: "watch-s8-45", caseMm: 45, material: "aluminum", cellular: true },
  { id: "WA-029", product: "Apple Watch Series 7 41mm", config: "Apple Watch Series 7 41mm \u00b7 Aluminium \u00b7 GPS", newKes: 26000, exUkKes: 18000, modelId: "watch-s7-41", caseMm: 41, material: "aluminum", cellular: false },
  { id: "WA-030", product: "Apple Watch Series 7 41mm", config: "Apple Watch Series 7 41mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 26000, exUkKes: 18000, modelId: "watch-s7-41", caseMm: 41, material: "aluminum", cellular: true },
  { id: "WA-031", product: "Apple Watch Series 7 45mm", config: "Apple Watch Series 7 45mm \u00b7 Aluminium \u00b7 GPS", newKes: 29000, exUkKes: 21000, modelId: "watch-s7-45", caseMm: 45, material: "aluminum", cellular: false },
  { id: "WA-032", product: "Apple Watch Series 7 45mm", config: "Apple Watch Series 7 45mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 29000, exUkKes: 21000, modelId: "watch-s7-45", caseMm: 45, material: "aluminum", cellular: true },
  { id: "WA-033", product: "Apple Watch SE 3 40mm", config: "Apple Watch SE 3 40mm \u00b7 Aluminium \u00b7 GPS", newKes: 36000, exUkKes: 28000, modelId: "watch-se3-40", caseMm: 40, material: "aluminum", cellular: false },
  { id: "WA-034", product: "Apple Watch SE 3 40mm", config: "Apple Watch SE 3 40mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 42000, exUkKes: 28000, modelId: "watch-se3-40", caseMm: 40, material: "aluminum", cellular: true },
  { id: "WA-035", product: "Apple Watch SE 3 44mm", config: "Apple Watch SE 3 44mm \u00b7 Aluminium \u00b7 GPS", newKes: 42000, exUkKes: 33000, modelId: "watch-se3-44", caseMm: 44, material: "aluminum", cellular: false },
  { id: "WA-036", product: "Apple Watch SE 3 44mm", config: "Apple Watch SE 3 44mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 48000, exUkKes: 33000, modelId: "watch-se3-44", caseMm: 44, material: "aluminum", cellular: true },
  { id: "WA-037", product: "Apple Watch SE 2 2022 40mm", config: "Apple Watch SE 2 2022 40mm \u00b7 Aluminium \u00b7 GPS", newKes: 28000, exUkKes: 18000, modelId: "watch-se2-40", caseMm: 40, material: "aluminum", cellular: false },
  { id: "WA-038", product: "Apple Watch SE 2 2022 40mm", config: "Apple Watch SE 2 2022 40mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 28000, exUkKes: 18000, modelId: "watch-se2-40", caseMm: 40, material: "aluminum", cellular: true },
  { id: "WA-039", product: "Apple Watch SE 2 2022 44mm", config: "Apple Watch SE 2 2022 44mm \u00b7 Aluminium \u00b7 GPS", newKes: 32000, exUkKes: 22000, modelId: "watch-se2-44", caseMm: 44, material: "aluminum", cellular: false },
  { id: "WA-040", product: "Apple Watch SE 2 2022 44mm", config: "Apple Watch SE 2 2022 44mm \u00b7 Aluminium \u00b7 GPS Cellular", newKes: 32000, exUkKes: 22000, modelId: "watch-se2-44", caseMm: 44, material: "aluminum", cellular: true },
  { id: "WA-041", product: "Apple Watch Ultra 4 49mm", config: "Apple Watch Ultra 4 49mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 135000, exUkKes: 110000, modelId: "watch-ultra-4", caseMm: 49, material: "titanium", cellular: true },
  { id: "WA-042", product: "Apple Watch Ultra 3 49mm", config: "Apple Watch Ultra 3 49mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 107000, exUkKes: 85000, modelId: "watch-ultra-3", caseMm: 49, material: "titanium", cellular: true },
  { id: "WA-043", product: "Apple Watch Ultra 2 49mm", config: "Apple Watch Ultra 2 49mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 99000, exUkKes: 78000, modelId: "watch-ultra-2", caseMm: 49, material: "titanium", cellular: true },
  { id: "WA-044", product: "Apple Watch Ultra 1st gen) 49mm", config: "Apple Watch Ultra 1st gen) 49mm \u00b7 Titanium \u00b7 GPS Cellular", newKes: 85000, exUkKes: 65000, modelId: "watch-ultra-1", caseMm: 49, material: "titanium", cellular: true },
];

export function watchSheetForModel(modelId: string): WatchSheetRow[] {
  return watchSheet.filter((r) => r.modelId === modelId);
}

export function watchBaseFromSheet(modelId: string): number | undefined {
  const wifiAlu = watchSheetForModel(modelId).filter(
    (r) => r.material === "aluminum" && !r.cellular,
  );
  const pool = wifiAlu.length ? wifiAlu : watchSheetForModel(modelId);
  if (!pool.length) return undefined;
  return Math.min(..pool.map((r) => r.newKes));
}

export function watchBaseExUkFromSheet(modelId: string): number | undefined {
  const wifiAlu = watchSheetForModel(modelId).filter(
    (r) => r.material === "aluminum" && !r.cellular,
  );
  const pool = wifiAlu.length ? wifiAlu : watchSheetForModel(modelId);
  if (!pool.length) return undefined;
  return pool.slice().sort((a, b) => a.newKes - b.newKes)[0].exUkKes;
}

export function watchConfigStorageId(row: WatchSheetRow): string {
  const mat = row.material || "base";
  const conn = row.cellular ? "cell" : "gps";
  return `${mat}-${conn}`;
}

export function watchConfigStorageLabel(row: WatchSheetRow): string {
  const mat = row.material ? row.material[0].toUpperCase() + row.material.slice(1) : "Base";
  return `${mat} · ${row.cellular ? "GPS + Cellular" : "GPS"}`;
}

export function watchSheetPrice(
  modelId: string,
  opts: { material?: string; cellular?: boolean } = {},
): { newKes: number; exUkKes: number; sheetId: string } | undefined {
  const rows = watchSheetForModel(modelId);
  if (!rows.length) return undefined;
  const material = (opts.material || "aluminum").toLowerCase();
  const cellular = Boolean(opts.cellular);
  const exact = rows.find(
    (r) => (r.material || "").toLowerCase() === material && r.cellular === cellular,
  );
  if (exact) return { newKes: exact.newKes, exUkKes: exact.exUkKes, sheetId: exact.id };
  const sameMat = rows.filter((r) => (r.material || "").toLowerCase() === material);
  if (sameMat.length) {
    const r = sameMat.slice().sort((a, b) => a.newKes - b.newKes)[0];
    return { newKes: r.newKes, exUkKes: r.exUkKes, sheetId: r.id };
  }
  const best = rows.slice().sort((a, b) => a.newKes - b.newKes)[0];
  return { newKes: best.newKes, exUkKes: best.exUkKes, sheetId: best.id };
}

