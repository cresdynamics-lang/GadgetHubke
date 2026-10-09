/**
 * Official Gadget Hub iPhone price sheet (NEW + EX-UK, KES).
 * Source: Gadget_Hub_Price_List_Full PDF — IP-001 … IP-104.
 * Competitor benchmark notes stripped; colour stock notes kept separately.
 */

export type IphoneSheetRow = {
  id: string;
  name: string;
  storage: string;
  newKes: number;
  exUkKes: number;
  /** In-stock colour hints from the sheet (not competitor names). */
  colours?: string[];
};

export const iphoneSheet: IphoneSheetRow[] = [
  { id: "IP-001", name: "iPhone 11", storage: "64GB", newKes: 36000, exUkKes: 25000 },
  { id: "IP-002", name: "iPhone 11", storage: "128GB", newKes: 42000, exUkKes: 31000 },
  { id: "IP-003", name: "iPhone 11", storage: "256GB", newKes: 48000, exUkKes: 36000 },
  { id: "IP-004", name: "iPhone 11 Pro", storage: "64GB", newKes: 40000, exUkKes: 33000 },
  { id: "IP-005", name: "iPhone 11 Pro", storage: "256GB", newKes: 46000, exUkKes: 38000 },
  { id: "IP-006", name: "iPhone 11 Pro", storage: "512GB", newKes: 52000, exUkKes: 42000 },
  { id: "IP-007", name: "iPhone 11 Pro Max", storage: "64GB", newKes: 46000, exUkKes: 38000 },
  { id: "IP-008", name: "iPhone 11 Pro Max", storage: "256GB", newKes: 52000, exUkKes: 44000 },
  { id: "IP-009", name: "iPhone 11 Pro Max", storage: "512GB", newKes: 58000, exUkKes: 48000 },
  { id: "IP-010", name: "iPhone 12 mini", storage: "64GB", newKes: 34000, exUkKes: 25000 },
  { id: "IP-011", name: "iPhone 12 mini", storage: "128GB", newKes: 39000, exUkKes: 29000 },
  { id: "IP-012", name: "iPhone 12 mini", storage: "256GB", newKes: 44000, exUkKes: 33000 },
  { id: "IP-013", name: "iPhone 12", storage: "64GB", newKes: 42000, exUkKes: 27000 },
  { id: "IP-014", name: "iPhone 12", storage: "128GB", newKes: 48000, exUkKes: 32000 },
  { id: "IP-015", name: "iPhone 12", storage: "256GB", newKes: 54000, exUkKes: 37000 },
  { id: "IP-016", name: "iPhone 12 Pro", storage: "128GB", newKes: 50000, exUkKes: 40000 },
  { id: "IP-017", name: "iPhone 12 Pro", storage: "256GB", newKes: 56000, exUkKes: 45000 },
  { id: "IP-018", name: "iPhone 12 Pro", storage: "512GB", newKes: 62000, exUkKes: 50000 },
  { id: "IP-019", name: "iPhone 12 Pro Max", storage: "128GB", newKes: 60000, exUkKes: 48000 },
  { id: "IP-020", name: "iPhone 12 Pro Max", storage: "256GB", newKes: 66000, exUkKes: 53000 },
  { id: "IP-021", name: "iPhone 12 Pro Max", storage: "512GB", newKes: 72000, exUkKes: 58000 },
  { id: "IP-022", name: "iPhone 13 mini", storage: "128GB", newKes: 48000, exUkKes: 38000 },
  { id: "IP-023", name: "iPhone 13 mini", storage: "256GB", newKes: 54000, exUkKes: 43000 },
  { id: "IP-024", name: "iPhone 13 mini", storage: "512GB", newKes: 60000, exUkKes: 48000 },
  { id: "IP-025", name: "iPhone 13", storage: "128GB", newKes: 62000, exUkKes: 43000 },
  { id: "IP-026", name: "iPhone 13", storage: "256GB", newKes: 70000, exUkKes: 47000 },
  { id: "IP-027", name: "iPhone 13", storage: "512GB", newKes: 78000, exUkKes: 53000 },
  { id: "IP-028", name: "iPhone 13 Pro", storage: "128GB", newKes: 65000, exUkKes: 52000 },
  { id: "IP-029", name: "iPhone 13 Pro", storage: "256GB", newKes: 72000, exUkKes: 58000 },
  { id: "IP-030", name: "iPhone 13 Pro", storage: "512GB", newKes: 80000, exUkKes: 64000 },
  { id: "IP-031", name: "iPhone 13 Pro", storage: "1TB", newKes: 88000, exUkKes: 70000 },
  { id: "IP-032", name: "iPhone 13 Pro Max", storage: "128GB", newKes: 78000, exUkKes: 62000 },
  { id: "IP-033", name: "iPhone 13 Pro Max", storage: "256GB", newKes: 85000, exUkKes: 68000 },
  { id: "IP-034", name: "iPhone 13 Pro Max", storage: "512GB", newKes: 92000, exUkKes: 74000 },
  { id: "IP-035", name: "iPhone 13 Pro Max", storage: "1TB", newKes: 102000, exUkKes: 80000 },
  { id: "IP-036", name: "iPhone 14", storage: "128GB", newKes: 85000, exUkKes: 49000 },
  { id: "IP-037", name: "iPhone 14", storage: "256GB", newKes: 100000, exUkKes: 56000 },
  { id: "IP-038", name: "iPhone 14", storage: "512GB", newKes: 112000, exUkKes: 63000 },
  { id: "IP-039", name: "iPhone 14 Plus", storage: "128GB", newKes: 92000, exUkKes: 56000 },
  { id: "IP-040", name: "iPhone 14 Plus", storage: "256GB", newKes: 105000, exUkKes: 62000 },
  { id: "IP-041", name: "iPhone 14 Plus", storage: "512GB", newKes: 118000, exUkKes: 69000 },
  { id: "IP-042", name: "iPhone 14 Pro", storage: "128GB", newKes: 110000, exUkKes: 74000 },
  { id: "IP-043", name: "iPhone 14 Pro", storage: "256GB", newKes: 120000, exUkKes: 80000 },
  { id: "IP-044", name: "iPhone 14 Pro", storage: "512GB", newKes: 132000, exUkKes: 87000 },
  { id: "IP-045", name: "iPhone 14 Pro", storage: "1TB", newKes: 145000, exUkKes: 94000 },
  { id: "IP-046", name: "iPhone 14 Pro Max", storage: "128GB", newKes: 120000, exUkKes: 82000 },
  { id: "IP-047", name: "iPhone 14 Pro Max", storage: "256GB", newKes: 132000, exUkKes: 89000 },
  { id: "IP-048", name: "iPhone 14 Pro Max", storage: "512GB", newKes: 145000, exUkKes: 96000 },
  { id: "IP-049", name: "iPhone 14 Pro Max", storage: "1TB", newKes: 158000, exUkKes: 104000 },
  { id: "IP-050", name: "iPhone 15", storage: "128GB", newKes: 82000, exUkKes: 52000 },
  { id: "IP-051", name: "iPhone 15", storage: "256GB", newKes: 107000, exUkKes: 63000 },
  { id: "IP-052", name: "iPhone 15", storage: "512GB", newKes: 105000, exUkKes: 72000 },
  { id: "IP-053", name: "iPhone 15 Plus", storage: "128GB", newKes: 78000, exUkKes: 62000 },
  { id: "IP-054", name: "iPhone 15 Plus", storage: "256GB", newKes: 95000, exUkKes: 68000 },
  { id: "IP-055", name: "iPhone 15 Plus", storage: "512GB", newKes: 114000, exUkKes: 76000 },
  { id: "IP-056", name: "iPhone 15 Pro", storage: "128GB", newKes: 128000, exUkKes: 85000 },
  { id: "IP-057", name: "iPhone 15 Pro", storage: "256GB", newKes: 135000, exUkKes: 82000 },
  { id: "IP-058", name: "iPhone 15 Pro", storage: "512GB", newKes: 148000, exUkKes: 86000 },
  { id: "IP-059", name: "iPhone 15 Pro", storage: "1TB", newKes: 162000, exUkKes: 95000 },
  { id: "IP-060", name: "iPhone 15 Pro Max", storage: "256GB", newKes: 150000, exUkKes: 93000 },
  { id: "IP-061", name: "iPhone 15 Pro Max", storage: "512GB", newKes: 165000, exUkKes: 100000 },
  { id: "IP-062", name: "iPhone 15 Pro Max", storage: "1TB", newKes: 180000, exUkKes: 108000 },
  { id: "IP-063", name: "iPhone 16e", storage: "128GB", newKes: 79000, exUkKes: 65000 },
  { id: "IP-064", name: "iPhone 16e", storage: "256GB", newKes: 93000, exUkKes: 76000 },
  { id: "IP-065", name: "iPhone 16e", storage: "512GB", newKes: 108000, exUkKes: 88000 },
  { id: "IP-066", name: "iPhone 16", storage: "128GB", newKes: 99000, exUkKes: 68000 },
  { id: "IP-067", name: "iPhone 16", storage: "256GB", newKes: 110000, exUkKes: 78000 },
  { id: "IP-068", name: "iPhone 16", storage: "512GB", newKes: 121000, exUkKes: 88000 },
  { id: "IP-069", name: "iPhone 16 Plus", storage: "128GB", newKes: 116000, exUkKes: 74000 },
  { id: "IP-070", name: "iPhone 16 Plus", storage: "256GB", newKes: 128000, exUkKes: 85000 },
  { id: "IP-071", name: "iPhone 16 Plus", storage: "512GB", newKes: 122000, exUkKes: 98000 },
  { id: "IP-072", name: "iPhone 16 Pro", storage: "128GB", newKes: 111000, exUkKes: 82000 },
  { id: "IP-073", name: "iPhone 16 Pro", storage: "256GB", newKes: 125000, exUkKes: 90000 },
  { id: "IP-074", name: "iPhone 16 Pro", storage: "512GB", newKes: 145000, exUkKes: 105000 },
  { id: "IP-075", name: "iPhone 16 Pro", storage: "1TB", newKes: 160000, exUkKes: 118000 },
  { id: "IP-076", name: "iPhone 16 Pro Max", storage: "256GB", newKes: 124000, exUkKes: 98000 },
  { id: "IP-077", name: "iPhone 16 Pro Max", storage: "512GB", newKes: 165000, exUkKes: 115000 },
  { id: "IP-078", name: "iPhone 16 Pro Max", storage: "1TB", newKes: 211000, exUkKes: 130000 },
  { id: "IP-079", name: "iPhone 17e", storage: "256GB", newKes: 115000, exUkKes: 92000 },
  { id: "IP-080", name: "iPhone 17e", storage: "512GB", newKes: 130000, exUkKes: 105000 },
  { id: "IP-081", name: "iPhone 17", storage: "256GB", newKes: 125000, exUkKes: 80000 },
  { id: "IP-082", name: "iPhone 17", storage: "512GB", newKes: 156000, exUkKes: 118000 },
  { id: "IP-083", name: "iPhone Air", storage: "256GB", newKes: 124000, exUkKes: 82000 },
  { id: "IP-084", name: "iPhone Air", storage: "512GB", newKes: 145000, exUkKes: 106000 },
  { id: "IP-085", name: "iPhone Air", storage: "1TB", newKes: 170000, exUkKes: 128000 },
  { id: "IP-086", name: "iPhone 17 Pro", storage: "256GB", newKes: 151000, exUkKes: 110000 },
  { id: "IP-087", name: "iPhone 17 Pro", storage: "512GB", newKes: 185000, exUkKes: 145000 },
  { id: "IP-088", name: "iPhone 17 Pro", storage: "1TB", newKes: 225000, exUkKes: 175000 },
  { id: "IP-089", name: "iPhone 17 Pro Max", storage: "256GB", newKes: 163000, exUkKes: 118000 },
  { id: "IP-090", name: "iPhone 17 Pro Max", storage: "512GB", newKes: 198000, exUkKes: 155000 },
  { id: "IP-091", name: "iPhone 17 Pro Max", storage: "1TB", newKes: 245000, exUkKes: 198000 },
  { id: "IP-092", name: "iPhone 17 Pro Max", storage: "2TB", newKes: 305000, exUkKes: 250000 },
  { id: "IP-093", name: "iPhone 18 Pro", storage: "256GB", newKes: 203000, exUkKes: 165000 },
  { id: "IP-094", name: "iPhone 18 Pro", storage: "512GB", newKes: 225000, exUkKes: 180000 },
  { id: "IP-095", name: "iPhone 18 Pro", storage: "1TB", newKes: 240000, exUkKes: 195000 },
  { id: "IP-096", name: "iPhone 18 Pro", storage: "2TB", newKes: 258000, exUkKes: 205000 },
  { id: "IP-097", name: "iPhone 18 Pro Max", storage: "256GB", newKes: 240000, exUkKes: 200000 },
  { id: "IP-098", name: "iPhone 18 Pro Max", storage: "512GB", newKes: 255000, exUkKes: 215000 },
  { id: "IP-099", name: "iPhone 18 Pro Max", storage: "1TB", newKes: 285000, exUkKes: 228000 },
  { id: "IP-100", name: "iPhone 18 Pro Max", storage: "2TB", newKes: 358000, exUkKes: 235000 },
  { id: "IP-101", name: "iPhone Duo", storage: "256GB", newKes: 350000, exUkKes: 295000 },
  { id: "IP-102", name: "iPhone Duo", storage: "512GB", newKes: 370000, exUkKes: 315000 },
  { id: "IP-103", name: "iPhone Duo", storage: "1TB", newKes: 385000, exUkKes: 330000 },
  { id: "IP-104", name: "iPhone Duo", storage: "2TB", newKes: 400000, exUkKes: 345000 },
];

/** Sheet rows that look inverted or unusually stepped — flag in admin. */
export const iphoneSheetWatchIds = new Set(["IP-052", "IP-071", "IP-053"]);

export function sheetRowsForProduct(name: string): IphoneSheetRow[] {
  return iphoneSheet.filter((r) => r.name === name);
}

export function storageIdFromLabel(label: string): string {
  const n = label.trim().toUpperCase().replace(/\s+/g, "");
  if (n === "1TB") return "1tb";
  if (n === "2TB") return "2tb";
  if (n.endsWith("GB")) return n.replace("GB", "").toLowerCase();
  return n.toLowerCase();
}

export function storagesFromSheet(name: string) {
  return sheetRowsForProduct(name).map((r) => ({
    id: storageIdFromLabel(r.storage),
    label: r.storage,
    priceKes: r.newKes,
    exUkKes: r.exUkKes,
    sheetId: r.id,
    colours: r.colours,
  }));
}

/** Lowest NEW price for a model name (catalog “from” price). */
export function baseNewKes(name: string): number | undefined {
  const rows = sheetRowsForProduct(name);
  if (!rows.length) return undefined;
  return Math.min(..rows.map((r) => r.newKes));
}

export function sheetPrice(name: string, storageLabel: string): { newKes: number; exUkKes: number } | undefined {
  const row = sheetRowsForProduct(name).find(
    (r) => r.storage.replace(/\s+/g, "").toUpperCase() === storageLabel.replace(/\s+/g, "").toUpperCase(),
  );
  if (!row) return undefined;
  return { newKes: row.newKes, exUkKes: row.exUkKes };
}
