/**
 * Official Gadget Hub iPad price sheet (NEW + EX-UK, KES).
 * Source: Gadget_Hub_Price_List_Full PDF — PAD-001 … PAD-104.
 * Wi-Fi and Wi-Fi + Cellular listed separately.
 */
export type IpadSheetRow = {
  id: string;
  product: string;
  config: string;
  newKes: number;
  exUkKes: number;
  modelId: string | null;
  storage: string | null;
  cellular: boolean;
};

export const ipadSheet: IpadSheetRow[] = [
  { id: "PAD-001", product: "iPad Pro 13-inch (M5)", config: "256GB \u00b7 Wi-Fi", newKes: 177000, exUkKes: 142000, modelId: "ipad-pro-13-m5", storage: "256GB", cellular: false },
  { id: "PAD-002", product: "iPad Pro 13-inch (M5)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 178999, exUkKes: 143000, modelId: "ipad-pro-13-m5", storage: "256GB", cellular: true },
  { id: "PAD-003", product: "iPad Pro 13-inch (M5)", config: "512GB \u00b7 Wi-Fi", newKes: 198000, exUkKes: 158000, modelId: "ipad-pro-13-m5", storage: "512GB", cellular: false },
  { id: "PAD-004", product: "iPad Pro 13-inch (M5)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 205000, exUkKes: 164000, modelId: "ipad-pro-13-m5", storage: "512GB", cellular: true },
  { id: "PAD-005", product: "iPad Pro 13-inch (M5)", config: "1TB \u00b7 Wi-Fi", newKes: 228000, exUkKes: 182000, modelId: "ipad-pro-13-m5", storage: "1TB", cellular: false },
  { id: "PAD-006", product: "iPad Pro 13-inch (M5)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 238000, exUkKes: 190000, modelId: "ipad-pro-13-m5", storage: "1TB", cellular: true },
  { id: "PAD-007", product: "iPad Pro 13-inch (M5)", config: "2TB \u00b7 Wi-Fi", newKes: 260000, exUkKes: 208000, modelId: "ipad-pro-13-m5", storage: "2TB", cellular: false },
  { id: "PAD-008", product: "iPad Pro 13-inch (M5)", config: "2TB \u00b7 Wi-Fi Cellular", newKes: 265000, exUkKes: 212000, modelId: "ipad-pro-13-m5", storage: "2TB", cellular: true },
  { id: "PAD-009", product: "iPad Pro 11-inch (M5)", config: "256GB \u00b7 Wi-Fi", newKes: 160000, exUkKes: 128000, modelId: "ipad-pro-11-m5", storage: "256GB", cellular: false },
  { id: "PAD-010", product: "iPad Pro 11-inch (M5)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 168000, exUkKes: 134000, modelId: "ipad-pro-11-m5", storage: "256GB", cellular: true },
  { id: "PAD-011", product: "iPad Pro 11-inch (M5)", config: "512GB \u00b7 Wi-Fi", newKes: 178000, exUkKes: 142000, modelId: "ipad-pro-11-m5", storage: "512GB", cellular: false },
  { id: "PAD-012", product: "iPad Pro 11-inch (M5)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 188000, exUkKes: 150000, modelId: "ipad-pro-11-m5", storage: "512GB", cellular: true },
  { id: "PAD-013", product: "iPad Pro 11-inch (M5)", config: "1TB \u00b7 Wi-Fi", newKes: 202000, exUkKes: 162000, modelId: "ipad-pro-11-m5", storage: "1TB", cellular: false },
  { id: "PAD-014", product: "iPad Pro 11-inch (M5)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 213000, exUkKes: 170000, modelId: "ipad-pro-11-m5", storage: "1TB", cellular: true },
  { id: "PAD-015", product: "iPad Pro 11-inch (M5)", config: "2TB \u00b7 Wi-Fi", newKes: 235000, exUkKes: 188000, modelId: "ipad-pro-11-m5", storage: "2TB", cellular: false },
  { id: "PAD-016", product: "iPad Pro 11-inch (M5)", config: "2TB \u00b7 Wi-Fi Cellular", newKes: 245000, exUkKes: 196000, modelId: "ipad-pro-11-m5", storage: "2TB", cellular: true },
  { id: "PAD-017", product: "iPad Pro 13-inch (M4, 2024)", config: "256GB \u00b7 Wi-Fi", newKes: 163000, exUkKes: 135000, modelId: "ipad-pro-13-m4", storage: "256GB", cellular: false },
  { id: "PAD-018", product: "iPad Pro 13-inch (M4, 2024)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 165000, exUkKes: 135000, modelId: "ipad-pro-13-m4", storage: "256GB", cellular: true },
  { id: "PAD-019", product: "iPad Pro 13-inch (M4, 2024)", config: "512GB \u00b7 Wi-Fi", newKes: 198000, exUkKes: 155000, modelId: "ipad-pro-13-m4", storage: "512GB", cellular: false },
  { id: "PAD-020", product: "iPad Pro 13-inch (M4, 2024)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 195000, exUkKes: 155000, modelId: "ipad-pro-13-m4", storage: "512GB", cellular: true },
  { id: "PAD-021", product: "iPad Pro 13-inch (M4, 2024)", config: "1TB \u00b7 Wi-Fi", newKes: 220000, exUkKes: 175000, modelId: "ipad-pro-13-m4", storage: "1TB", cellular: false },
  { id: "PAD-022", product: "iPad Pro 13-inch (M4, 2024)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 225000, exUkKes: 175000, modelId: "ipad-pro-13-m4", storage: "1TB", cellular: true },
  { id: "PAD-023", product: "iPad Pro 13-inch (M4, 2024)", config: "2TB \u00b7 Wi-Fi", newKes: 255000, exUkKes: 195000, modelId: "ipad-pro-13-m4", storage: "2TB", cellular: false },
  { id: "PAD-024", product: "iPad Pro 13-inch (M4, 2024)", config: "2TB \u00b7 Wi-Fi Cellular", newKes: 255000, exUkKes: 195000, modelId: "ipad-pro-13-m4", storage: "2TB", cellular: true },
  { id: "PAD-025", product: "iPad Pro 11-inch (M4, 2024)", config: "256GB \u00b7 Wi-Fi", newKes: 137000, exUkKes: 115000, modelId: "ipad-pro-11-m4", storage: "256GB", cellular: false },
  { id: "PAD-026", product: "iPad Pro 11-inch (M4, 2024)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 155000, exUkKes: 115000, modelId: "ipad-pro-11-m4", storage: "256GB", cellular: true },
  { id: "PAD-027", product: "iPad Pro 11-inch (M4, 2024)", config: "512GB \u00b7 Wi-Fi", newKes: 165000, exUkKes: 135000, modelId: "ipad-pro-11-m4", storage: "512GB", cellular: false },
  { id: "PAD-028", product: "iPad Pro 11-inch (M4, 2024)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 185000, exUkKes: 135000, modelId: "ipad-pro-11-m4", storage: "512GB", cellular: true },
  { id: "PAD-029", product: "iPad Pro 11-inch (M4, 2024)", config: "1TB \u00b7 Wi-Fi", newKes: 205000, exUkKes: 155000, modelId: "ipad-pro-11-m4", storage: "1TB", cellular: false },
  { id: "PAD-030", product: "iPad Pro 11-inch (M4, 2024)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 205000, exUkKes: 155000, modelId: "ipad-pro-11-m4", storage: "1TB", cellular: true },
  { id: "PAD-031", product: "iPad Pro 11-inch (M4, 2024)", config: "2TB \u00b7 Wi-Fi", newKes: 230000, exUkKes: 175000, modelId: "ipad-pro-11-m4", storage: "2TB", cellular: false },
  { id: "PAD-032", product: "iPad Pro 11-inch (M4, 2024)", config: "2TB \u00b7 Wi-Fi Cellular", newKes: 230000, exUkKes: 175000, modelId: "ipad-pro-11-m4", storage: "2TB", cellular: true },
  { id: "PAD-033", product: "iPad Air 13-inch (M4)", config: "128GB \u00b7 Wi-Fi", newKes: 143000, exUkKes: 114000, modelId: "ipad-air-13-m4", storage: "128GB", cellular: false },
  { id: "PAD-034", product: "iPad Air 13-inch (M4)", config: "128GB \u00b7 Wi-Fi Cellular", newKes: 155000, exUkKes: 124000, modelId: "ipad-air-13-m4", storage: "128GB", cellular: true },
  { id: "PAD-035", product: "iPad Air 13-inch (M4)", config: "256GB \u00b7 Wi-Fi", newKes: 158000, exUkKes: 126000, modelId: "ipad-air-13-m4", storage: "256GB", cellular: false },
  { id: "PAD-036", product: "iPad Air 13-inch (M4)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 170000, exUkKes: 136000, modelId: "ipad-air-13-m4", storage: "256GB", cellular: true },
  { id: "PAD-037", product: "iPad Air 13-inch (M4)", config: "512GB \u00b7 Wi-Fi", newKes: 180000, exUkKes: 144000, modelId: "ipad-air-13-m4", storage: "512GB", cellular: false },
  { id: "PAD-038", product: "iPad Air 13-inch (M4)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 195000, exUkKes: 156000, modelId: "ipad-air-13-m4", storage: "512GB", cellular: true },
  { id: "PAD-039", product: "iPad Air 13-inch (M4)", config: "1TB \u00b7 Wi-Fi", newKes: 210000, exUkKes: 168000, modelId: "ipad-air-13-m4", storage: "1TB", cellular: false },
  { id: "PAD-040", product: "iPad Air 13-inch (M4)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 225000, exUkKes: 180000, modelId: "ipad-air-13-m4", storage: "1TB", cellular: true },
  { id: "PAD-041", product: "iPad Air 11-inch (M4)", config: "128GB \u00b7 Wi-Fi", newKes: 100000, exUkKes: 80000, modelId: "ipad-air-11-m4", storage: "128GB", cellular: false },
  { id: "PAD-042", product: "iPad Air 11-inch (M4)", config: "128GB \u00b7 Wi-Fi Cellular", newKes: 115000, exUkKes: 92000, modelId: "ipad-air-11-m4", storage: "128GB", cellular: true },
  { id: "PAD-043", product: "iPad Air 11-inch (M4)", config: "256GB \u00b7 Wi-Fi", newKes: 120000, exUkKes: 96000, modelId: "ipad-air-11-m4", storage: "256GB", cellular: false },
  { id: "PAD-044", product: "iPad Air 11-inch (M4)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 128000, exUkKes: 102000, modelId: "ipad-air-11-m4", storage: "256GB", cellular: true },
  { id: "PAD-045", product: "iPad Air 11-inch (M4)", config: "512GB \u00b7 Wi-Fi", newKes: 138000, exUkKes: 110000, modelId: "ipad-air-11-m4", storage: "512GB", cellular: false },
  { id: "PAD-046", product: "iPad Air 11-inch (M4)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 150000, exUkKes: 120000, modelId: "ipad-air-11-m4", storage: "512GB", cellular: true },
  { id: "PAD-047", product: "iPad Air 11-inch (M4)", config: "1TB \u00b7 Wi-Fi", newKes: 160000, exUkKes: 128000, modelId: "ipad-air-11-m4", storage: "1TB", cellular: false },
  { id: "PAD-048", product: "iPad Air 11-inch (M4)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 175000, exUkKes: 140000, modelId: "ipad-air-11-m4", storage: "1TB", cellular: true },
  { id: "PAD-049", product: "iPad Air 13-inch (M3)", config: "128GB \u00b7 Wi-Fi", newKes: 110000, exUkKes: 88000, modelId: "ipad-air-13-m3", storage: "128GB", cellular: false },
  { id: "PAD-050", product: "iPad Air 13-inch (M3)", config: "128GB \u00b7 Wi-Fi Cellular", newKes: 125000, exUkKes: 88000, modelId: "ipad-air-13-m3", storage: "128GB", cellular: true },
  { id: "PAD-051", product: "iPad Air 13-inch (M3)", config: "256GB \u00b7 Wi-Fi", newKes: 125000, exUkKes: 98000, modelId: "ipad-air-13-m3", storage: "256GB", cellular: false },
  { id: "PAD-052", product: "iPad Air 13-inch (M3)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 140000, exUkKes: 98000, modelId: "ipad-air-13-m3", storage: "256GB", cellular: true },
  { id: "PAD-053", product: "iPad Air 13-inch (M3)", config: "512GB \u00b7 Wi-Fi", newKes: 145000, exUkKes: 115000, modelId: "ipad-air-13-m3", storage: "512GB", cellular: false },
  { id: "PAD-054", product: "iPad Air 13-inch (M3)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 160000, exUkKes: 115000, modelId: "ipad-air-13-m3", storage: "512GB", cellular: true },
  { id: "PAD-055", product: "iPad Air 13-inch (M3)", config: "1TB \u00b7 Wi-Fi", newKes: 160000, exUkKes: 130000, modelId: "ipad-air-13-m3", storage: "1TB", cellular: false },
  { id: "PAD-056", product: "iPad Air 13-inch (M3)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 175000, exUkKes: 130000, modelId: "ipad-air-13-m3", storage: "1TB", cellular: true },
  { id: "PAD-057", product: "iPad Air 11-inch (M3)", config: "128GB \u00b7 Wi-Fi", newKes: 85000, exUkKes: 68000, modelId: "ipad-air-11-m3", storage: "128GB", cellular: false },
  { id: "PAD-058", product: "iPad Air 11-inch (M3)", config: "128GB \u00b7 Wi-Fi Cellular", newKes: 112000, exUkKes: 68000, modelId: "ipad-air-11-m3", storage: "128GB", cellular: true },
  { id: "PAD-059", product: "iPad Air 11-inch (M3)", config: "256GB \u00b7 Wi-Fi", newKes: 103000, exUkKes: 78000, modelId: "ipad-air-11-m3", storage: "256GB", cellular: false },
  { id: "PAD-060", product: "iPad Air 11-inch (M3)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 128000, exUkKes: 78000, modelId: "ipad-air-11-m3", storage: "256GB", cellular: true },
  { id: "PAD-061", product: "iPad Air 11-inch (M3)", config: "512GB \u00b7 Wi-Fi", newKes: 120000, exUkKes: 92000, modelId: "ipad-air-11-m3", storage: "512GB", cellular: false },
  { id: "PAD-062", product: "iPad Air 11-inch (M3)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 145000, exUkKes: 92000, modelId: "ipad-air-11-m3", storage: "512GB", cellular: true },
  { id: "PAD-063", product: "iPad Air 11-inch (M3)", config: "1TB \u00b7 Wi-Fi", newKes: 140000, exUkKes: 105000, modelId: "ipad-air-11-m3", storage: "1TB", cellular: false },
  { id: "PAD-064", product: "iPad Air 11-inch (M3)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 165000, exUkKes: 105000, modelId: "ipad-air-11-m3", storage: "1TB", cellular: true },
  { id: "PAD-065", product: "iPad Air 13-inch (M2, 2024)", config: "128GB \u00b7 Wi-Fi", newKes: 110000, exUkKes: 88000, modelId: "ipad-air-13-m2", storage: "128GB", cellular: false },
  { id: "PAD-066", product: "iPad Air 13-inch (M2, 2024)", config: "128GB \u00b7 Wi-Fi Cellular", newKes: 125000, exUkKes: 88000, modelId: "ipad-air-13-m2", storage: "128GB", cellular: true },
  { id: "PAD-067", product: "iPad Air 13-inch (M2, 2024)", config: "256GB \u00b7 Wi-Fi", newKes: 125000, exUkKes: 98000, modelId: "ipad-air-13-m2", storage: "256GB", cellular: false },
  { id: "PAD-068", product: "iPad Air 13-inch (M2, 2024)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 140000, exUkKes: 98000, modelId: "ipad-air-13-m2", storage: "256GB", cellular: true },
  { id: "PAD-069", product: "iPad Air 13-inch (M2, 2024)", config: "512GB \u00b7 Wi-Fi", newKes: 145000, exUkKes: 115000, modelId: "ipad-air-13-m2", storage: "512GB", cellular: false },
  { id: "PAD-070", product: "iPad Air 13-inch (M2, 2024)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 160000, exUkKes: 115000, modelId: "ipad-air-13-m2", storage: "512GB", cellular: true },
  { id: "PAD-071", product: "iPad Air 13-inch (M2, 2024)", config: "1TB \u00b7 Wi-Fi", newKes: 160000, exUkKes: 130000, modelId: "ipad-air-13-m2", storage: "1TB", cellular: false },
  { id: "PAD-072", product: "iPad Air 13-inch (M2, 2024)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 175000, exUkKes: 130000, modelId: "ipad-air-13-m2", storage: "1TB", cellular: true },
  { id: "PAD-073", product: "iPad Air 11-inch (M2, 2024)", config: "128GB \u00b7 Wi-Fi", newKes: 85000, exUkKes: 68000, modelId: "ipad-air-11-m2", storage: "128GB", cellular: false },
  { id: "PAD-074", product: "iPad Air 11-inch (M2, 2024)", config: "128GB \u00b7 Wi-Fi Cellular", newKes: 112000, exUkKes: 68000, modelId: "ipad-air-11-m2", storage: "128GB", cellular: true },
  { id: "PAD-075", product: "iPad Air 11-inch (M2, 2024)", config: "256GB \u00b7 Wi-Fi", newKes: 103000, exUkKes: 78000, modelId: "ipad-air-11-m2", storage: "256GB", cellular: false },
  { id: "PAD-076", product: "iPad Air 11-inch (M2, 2024)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 128000, exUkKes: 78000, modelId: "ipad-air-11-m2", storage: "256GB", cellular: true },
  { id: "PAD-077", product: "iPad Air 11-inch (M2, 2024)", config: "512GB \u00b7 Wi-Fi", newKes: 120000, exUkKes: 92000, modelId: "ipad-air-11-m2", storage: "512GB", cellular: false },
  { id: "PAD-078", product: "iPad Air 11-inch (M2, 2024)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 145000, exUkKes: 92000, modelId: "ipad-air-11-m2", storage: "512GB", cellular: true },
  { id: "PAD-079", product: "iPad Air 11-inch (M2, 2024)", config: "1TB \u00b7 Wi-Fi", newKes: 140000, exUkKes: 105000, modelId: "ipad-air-11-m2", storage: "1TB", cellular: false },
  { id: "PAD-080", product: "iPad Air 11-inch (M2, 2024)", config: "1TB \u00b7 Wi-Fi Cellular", newKes: 165000, exUkKes: 105000, modelId: "ipad-air-11-m2", storage: "1TB", cellular: true },
  { id: "PAD-081", product: "iPad (A16)", config: "128GB \u00b7 Wi-Fi", newKes: 63000, exUkKes: 50000, modelId: "ipad-a16", storage: "128GB", cellular: false },
  { id: "PAD-082", product: "iPad (A16)", config: "128GB \u00b7 Wi-Fi Cellular", newKes: 81000, exUkKes: 65000, modelId: "ipad-a16", storage: "128GB", cellular: true },
  { id: "PAD-083", product: "iPad (A16)", config: "256GB \u00b7 Wi-Fi", newKes: 77000, exUkKes: 62000, modelId: "ipad-a16", storage: "256GB", cellular: false },
  { id: "PAD-084", product: "iPad (A16)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 95000, exUkKes: 76000, modelId: "ipad-a16", storage: "256GB", cellular: true },
  { id: "PAD-085", product: "iPad (A16)", config: "512GB \u00b7 Wi-Fi", newKes: 88000, exUkKes: 70000, modelId: "ipad-a16", storage: "512GB", cellular: false },
  { id: "PAD-086", product: "iPad (A16)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 105000, exUkKes: 84000, modelId: "ipad-a16", storage: "512GB", cellular: true },
  { id: "PAD-087", product: "iPad (10th generation)", config: "64GB \u00b7 Wi-Fi", newKes: 45000, exUkKes: 36000, modelId: "ipad-10", storage: "64GB", cellular: false },
  { id: "PAD-088", product: "iPad (10th generation)", config: "64GB \u00b7 Wi-Fi Cellular", newKes: 55000, exUkKes: 36000, modelId: "ipad-10", storage: "64GB", cellular: true },
  { id: "PAD-089", product: "iPad (10th generation)", config: "256GB \u00b7 Wi-Fi", newKes: 62000, exUkKes: 48000, modelId: "ipad-10", storage: "256GB", cellular: false },
  { id: "PAD-090", product: "iPad (10th generation)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 72000, exUkKes: 48000, modelId: "ipad-10", storage: "256GB", cellular: true },
  { id: "PAD-091", product: "iPad (9th generation)", config: "64GB \u00b7 Wi-Fi", newKes: 36000, exUkKes: 26000, modelId: "ipad-9", storage: "64GB", cellular: false },
  { id: "PAD-092", product: "iPad (9th generation)", config: "64GB \u00b7 Wi-Fi Cellular", newKes: 36000, exUkKes: 26000, modelId: "ipad-9", storage: "64GB", cellular: true },
  { id: "PAD-093", product: "iPad (9th generation)", config: "256GB \u00b7 Wi-Fi", newKes: 46000, exUkKes: 34000, modelId: "ipad-9", storage: "256GB", cellular: false },
  { id: "PAD-094", product: "iPad (9th generation)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 46000, exUkKes: 34000, modelId: "ipad-9", storage: "256GB", cellular: true },
  { id: "PAD-095", product: "iPad mini (A17 Pro)", config: "128GB \u00b7 Wi-Fi", newKes: 75000, exUkKes: 60000, modelId: "ipad-mini-a17-pro", storage: "128GB", cellular: false },
  { id: "PAD-096", product: "iPad mini (A17 Pro)", config: "128GB \u00b7 Wi-Fi Cellular", newKes: 88000, exUkKes: 70000, modelId: "ipad-mini-a17-pro", storage: "128GB", cellular: true },
  { id: "PAD-097", product: "iPad mini (A17 Pro)", config: "256GB \u00b7 Wi-Fi", newKes: 89000, exUkKes: 71000, modelId: "ipad-mini-a17-pro", storage: "256GB", cellular: false },
  { id: "PAD-098", product: "iPad mini (A17 Pro)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 102000, exUkKes: 82000, modelId: "ipad-mini-a17-pro", storage: "256GB", cellular: true },
  { id: "PAD-099", product: "iPad mini (A17 Pro)", config: "512GB \u00b7 Wi-Fi", newKes: 108000, exUkKes: 86000, modelId: "ipad-mini-a17-pro", storage: "512GB", cellular: false },
  { id: "PAD-100", product: "iPad mini (A17 Pro)", config: "512GB \u00b7 Wi-Fi Cellular", newKes: 122000, exUkKes: 98000, modelId: "ipad-mini-a17-pro", storage: "512GB", cellular: true },
  { id: "PAD-101", product: "iPad mini (6th generation)", config: "64GB \u00b7 Wi-Fi", newKes: 58000, exUkKes: 42000, modelId: "ipad-mini-6", storage: "64GB", cellular: false },
  { id: "PAD-102", product: "iPad mini (6th generation)", config: "64GB \u00b7 Wi-Fi Cellular", newKes: 58000, exUkKes: 42000, modelId: "ipad-mini-6", storage: "64GB", cellular: true },
  { id: "PAD-103", product: "iPad mini (6th generation)", config: "256GB \u00b7 Wi-Fi", newKes: 72000, exUkKes: 52000, modelId: "ipad-mini-6", storage: "256GB", cellular: false },
  { id: "PAD-104", product: "iPad mini (6th generation)", config: "256GB \u00b7 Wi-Fi Cellular", newKes: 72000, exUkKes: 52000, modelId: "ipad-mini-6", storage: "256GB", cellular: true },
];

/** Sheet rows that look inverted or unusually stepped — flag in admin. */
export const ipadSheetWatchIds = new Set(["PAD-002", "PAD-019", "PAD-020"]);

export function normalizeIpadStorage(label: string): string {
  return label.toUpperCase().replace(/\s+/g, "");
}

export function ipadSheetForModel(modelId: string): IpadSheetRow[] {
  return ipadSheet.filter((r) => r.modelId === modelId);
}

export function ipadBaseFromSheet(modelId: string): number | undefined {
  const wifi = ipadSheetForModel(modelId).filter((r) => !r.cellular);
  if (!wifi.length) return undefined;
  return Math.min(..wifi.map((r) => r.newKes));
}

export function ipadBaseExUkFromSheet(modelId: string): number | undefined {
  const wifi = ipadSheetForModel(modelId).filter((r) => !r.cellular);
  if (!wifi.length) return undefined;
  const best = wifi.slice().sort((a, b) => a.newKes - b.newKes)[0];
  return best.exUkKes;
}

export function ipadConfigStorageId(storage: string | null, cellular: boolean): string {
  const stor = (storage || "base").toLowerCase().replace(/\s+/g, "");
  return cellular ? `${stor}-cell` : stor;
}

export function ipadConfigStorageLabel(storage: string | null, cellular: boolean): string {
  const s = storage || "Base";
  return cellular ? `${s} · Cellular` : `${s} · Wi-Fi`;
}

export function ipadSheetPrice(
  modelId: string,
  storageLabel: string,
  cellular = false,
): { newKes: number; exUkKes: number; sheetId: string } | undefined {
  const want = normalizeIpadStorage(storageLabel);
  const rows = ipadSheetForModel(modelId).filter((r) => r.cellular === cellular);
  const exact = rows.find((r) => r.storage && normalizeIpadStorage(r.storage) === want);
  if (exact) return { newKes: exact.newKes, exUkKes: exact.exUkKes, sheetId: exact.id };
  const any = rows.slice().sort((a, b) => a.newKes - b.newKes)[0];
  if (any) return { newKes: any.newKes, exUkKes: any.exUkKes, sheetId: any.id };
  return undefined;
}
