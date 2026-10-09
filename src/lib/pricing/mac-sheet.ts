/**
 * Official Gadget Hub Mac price sheet (NEW + EX-UK, KES).
 * Source: Gadget_Hub_Price_List_Full PDF — MAC-001 … MAC-105.
 */
export type MacSheetRow = {
  id: string;
  product: string;
  config: string;
  newKes: number;
  exUkKes: number;
  modelId: string | null;
  memoryGb: number | null;
  storage: string | null;
};

export const macSheet: MacSheetRow[] = [
  { id: "MAC-001", product: "MacBook Neo (A18 Pro)", config: "256GB SSD", newKes: 100000, exUkKes: 78000, modelId: null, memoryGb: null, storage: "256GB" },
  { id: "MAC-002", product: "MacBook Neo (A18 Pro)", config: "512GB SSD", newKes: 118000, exUkKes: 92000, modelId: null, memoryGb: null, storage: "512GB" },
  { id: "MAC-003", product: "MacBook Air 13-inch (M5, 2026)", config: "10-core CPU, 8-core GPU, 16GB memory, 512GB SSD", newKes: 190000, exUkKes: 150000, modelId: "macbook-air-13-m5", memoryGb: 16, storage: "512GB" },
  { id: "MAC-004", product: "MacBook Air 13-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 16GB memory, 1TB SSD", newKes: 220000, exUkKes: 168000, modelId: "macbook-air-13-m5", memoryGb: 16, storage: "1TB" },
  { id: "MAC-005", product: "MacBook Air 13-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 24GB memory, 512GB SSD", newKes: 215000, exUkKes: 175000, modelId: "macbook-air-13-m5", memoryGb: 24, storage: "512GB" },
  { id: "MAC-006", product: "MacBook Air 13-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 24GB memory, 1TB SSD", newKes: 255000, exUkKes: 192000, modelId: "macbook-air-13-m5", memoryGb: 24, storage: "1TB" },
  { id: "MAC-007", product: "MacBook Air 13-inch (M4, 2025)", config: "16GB memory, 256GB SSD", newKes: 148000, exUkKes: 118000, modelId: "macbook-air-13-m4", memoryGb: 16, storage: "256GB" },
  { id: "MAC-008", product: "MacBook Air 13-inch (M4, 2025)", config: "16GB memory, 512GB SSD", newKes: 169000, exUkKes: 135000, modelId: "macbook-air-13-m4", memoryGb: 16, storage: "512GB" },
  { id: "MAC-009", product: "MacBook Air 13-inch (M4, 2025)", config: "24GB memory, 512GB SSD", newKes: 185000, exUkKes: 148000, modelId: "macbook-air-13-m4", memoryGb: 24, storage: "512GB" },
  { id: "MAC-010", product: "MacBook Air 13-inch (M3, 2024)", config: "8GB memory, 256GB SSD", newKes: 135000, exUkKes: 105000, modelId: "macbook-air-13-m3", memoryGb: 8, storage: "256GB" },
  { id: "MAC-011", product: "MacBook Air 13-inch (M3, 2024)", config: "8GB memory, 512GB SSD", newKes: 150000, exUkKes: 118000, modelId: "macbook-air-13-m3", memoryGb: 8, storage: "512GB" },
  { id: "MAC-012", product: "MacBook Air 13-inch (M3, 2024)", config: "16GB memory, 512GB SSD", newKes: 165000, exUkKes: 128000, modelId: "macbook-air-13-m3", memoryGb: 16, storage: "512GB" },
  { id: "MAC-013", product: "MacBook Air 13-inch (M2, 2022)", config: "8GB memory, 256GB SSD", newKes: 118000, exUkKes: 88000, modelId: "macbook-air-13-m2", memoryGb: 8, storage: "256GB" },
  { id: "MAC-014", product: "MacBook Air 13-inch (M2, 2022)", config: "8GB memory, 512GB SSD", newKes: 132000, exUkKes: 98000, modelId: "macbook-air-13-m2", memoryGb: 8, storage: "512GB" },
  { id: "MAC-015", product: "MacBook Air 13-inch (M2, 2022)", config: "16GB memory, 512GB SSD", newKes: 145000, exUkKes: 108000, modelId: "macbook-air-13-m2", memoryGb: 16, storage: "512GB" },
  { id: "MAC-016", product: "MacBook Air 13-inch (M1, 2020)", config: "8GB memory, 256GB SSD", newKes: 99000, exUkKes: 68000, modelId: "macbook-air-13-m1", memoryGb: 8, storage: "256GB" },
  { id: "MAC-017", product: "MacBook Air 13-inch (M1, 2020)", config: "8GB memory, 512GB SSD", newKes: 112000, exUkKes: 78000, modelId: "macbook-air-13-m1", memoryGb: 8, storage: "512GB" },
  { id: "MAC-018", product: "MacBook Air 13-inch (Intel, 2020)", config: "8GB memory, 256GB SSD", newKes: 65000, exUkKes: 45000, modelId: null, memoryGb: 8, storage: "256GB" },
  { id: "MAC-019", product: "MacBook Air 13-inch (Intel, 2020)", config: "8GB memory, 512GB SSD", newKes: 75000, exUkKes: 52000, modelId: null, memoryGb: 8, storage: "512GB" },
  { id: "MAC-020", product: "MacBook Air 15-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 16GB memory, 512GB SSD", newKes: 225000, exUkKes: 180000, modelId: "macbook-air-15-m5", memoryGb: 16, storage: "512GB" },
  { id: "MAC-021", product: "MacBook Air 15-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 16GB memory, 1TB SSD", newKes: 295000, exUkKes: 198000, modelId: "macbook-air-15-m5", memoryGb: 16, storage: "1TB" },
  { id: "MAC-022", product: "MacBook Air 15-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 24GB memory, 512GB SSD", newKes: 255000, exUkKes: 205000, modelId: "macbook-air-15-m5", memoryGb: 24, storage: "512GB" },
  { id: "MAC-023", product: "MacBook Air 15-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 24GB memory, 1TB SSD", newKes: 275000, exUkKes: 222000, modelId: "macbook-air-15-m5", memoryGb: 24, storage: "1TB" },
  { id: "MAC-024", product: "MacBook Air 15-inch (M4, 2025)", config: "16GB memory, 256GB SSD", newKes: 180000, exUkKes: 145000, modelId: "macbook-air-15-m4", memoryGb: 16, storage: "256GB" },
  { id: "MAC-025", product: "MacBook Air 15-inch (M4, 2025)", config: "16GB memory, 512GB SSD", newKes: 205000, exUkKes: 165000, modelId: "macbook-air-15-m4", memoryGb: 16, storage: "512GB" },
  { id: "MAC-026", product: "MacBook Air 15-inch (M4, 2025)", config: "24GB memory, 512GB SSD", newKes: 225000, exUkKes: 182000, modelId: "macbook-air-15-m4", memoryGb: 24, storage: "512GB" },
  { id: "MAC-027", product: "MacBook Air 15-inch (M3, 2024)", config: "8GB memory, 256GB SSD", newKes: 160000, exUkKes: 125000, modelId: "macbook-air-15-m3", memoryGb: 8, storage: "256GB" },
  { id: "MAC-028", product: "MacBook Air 15-inch (M3, 2024)", config: "16GB memory, 512GB SSD", newKes: 180000, exUkKes: 140000, modelId: "macbook-air-15-m3", memoryGb: 16, storage: "512GB" },
  { id: "MAC-029", product: "MacBook Air 15-inch (M2, 2023)", config: "8GB memory, 256GB SSD", newKes: 145000, exUkKes: 110000, modelId: "macbook-air-15-m2", memoryGb: 8, storage: "256GB" },
  { id: "MAC-030", product: "MacBook Air 15-inch (M2, 2023)", config: "8GB memory, 512GB SSD", newKes: 165000, exUkKes: 125000, modelId: "macbook-air-15-m2", memoryGb: 8, storage: "512GB" },
  { id: "MAC-031", product: "MacBook Pro 13-inch (M2, 2022)", config: "8GB memory, 256GB SSD", newKes: 135000, exUkKes: 95000, modelId: "macbook-pro-13-m2", memoryGb: 8, storage: "256GB" },
  { id: "MAC-032", product: "MacBook Pro 13-inch (M2, 2022)", config: "8GB memory, 512GB SSD", newKes: 150000, exUkKes: 110000, modelId: "macbook-pro-13-m2", memoryGb: 8, storage: "512GB" },
  { id: "MAC-033", product: "MacBook Pro 13-inch (M1, 2020)", config: "8GB memory, 256GB SSD", newKes: 110000, exUkKes: 75000, modelId: "macbook-pro-13-m1", memoryGb: 8, storage: "256GB" },
  { id: "MAC-034", product: "MacBook Pro 13-inch (M1, 2020)", config: "8GB memory, 512GB SSD", newKes: 125000, exUkKes: 88000, modelId: "macbook-pro-13-m1", memoryGb: 8, storage: "512GB" },
  { id: "MAC-035", product: "MacBook Pro 13-inch (Intel, 2020)", config: "8GB memory, 256GB SSD", newKes: 72000, exUkKes: 48000, modelId: null, memoryGb: 8, storage: "256GB" },
  { id: "MAC-036", product: "MacBook Pro 13-inch (Intel, 2020)", config: "16GB memory, 512GB SSD", newKes: 85000, exUkKes: 55000, modelId: null, memoryGb: 16, storage: "512GB" },
  { id: "MAC-037", product: "MacBook Pro 14-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 16GB memory, 1TB SSD", newKes: 255000, exUkKes: 205000, modelId: "macbook-pro-14-m5", memoryGb: 16, storage: "1TB" },
  { id: "MAC-038", product: "MacBook Pro 14-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 24GB memory, 1TB SSD", newKes: 280000, exUkKes: 228000, modelId: "macbook-pro-14-m5", memoryGb: 24, storage: "1TB" },
  { id: "MAC-039", product: "MacBook Pro 14-inch (M5, 2026)", config: "10-core CPU, 10-core GPU, 32GB memory, 1TB SSD", newKes: 305000, exUkKes: 248000, modelId: "macbook-pro-14-m5", memoryGb: 32, storage: "1TB" },
  { id: "MAC-040", product: "MacBook Pro 14-inch (M5 Pro)", config: "15-core CPU, 16-core GPU, 24GB memory, 1TB SSD", newKes: 365000, exUkKes: 295000, modelId: "macbook-pro-14-m5-pro", memoryGb: 24, storage: "1TB" },
  { id: "MAC-041", product: "MacBook Pro 14-inch (M5 Pro)", config: "15-core CPU, 16-core GPU, 24GB memory, 2TB SSD", newKes: 410000, exUkKes: 330000, modelId: "macbook-pro-14-m5-pro", memoryGb: 24, storage: "2TB" },
  { id: "MAC-042", product: "MacBook Pro 14-inch (M5 Pro)", config: "18-core CPU, 20-core GPU, 24GB memory, 2TB SSD", newKes: 440000, exUkKes: 355000, modelId: "macbook-pro-14-m5-pro", memoryGb: 24, storage: "2TB" },
  { id: "MAC-043", product: "MacBook Pro 14-inch (M5 Pro)", config: "18-core CPU, 20-core GPU, 48GB memory, 2TB SSD", newKes: 490000, exUkKes: 395000, modelId: "macbook-pro-14-m5-pro", memoryGb: 48, storage: "2TB" },
  { id: "MAC-044", product: "MacBook Pro 14-inch (M5 Max)", config: "18-core CPU, 32-core GPU, 36GB memory, 2TB SSD", newKes: 570000, exUkKes: 460000, modelId: null, memoryGb: 36, storage: "2TB" },
  { id: "MAC-045", product: "MacBook Pro 14-inch (M4, 2024)", config: "16GB memory, 512GB SSD", newKes: 215000, exUkKes: 175000, modelId: "macbook-pro-14-m4", memoryGb: 16, storage: "512GB" },
  { id: "MAC-046", product: "MacBook Pro 14-inch (M4, 2024)", config: "16GB memory, 1TB SSD", newKes: 250000, exUkKes: 200000, modelId: "macbook-pro-14-m4", memoryGb: 16, storage: "1TB" },
  { id: "MAC-047", product: "MacBook Pro 14-inch (M4, 2024)", config: "24GB memory, 1TB SSD", newKes: 275000, exUkKes: 225000, modelId: "macbook-pro-14-m4", memoryGb: 24, storage: "1TB" },
  { id: "MAC-048", product: "MacBook Pro 14-inch (M4 Pro)", config: "24GB memory, 512GB SSD", newKes: 270000, exUkKes: 220000, modelId: "macbook-pro-14-m4-pro", memoryGb: 24, storage: "512GB" },
  { id: "MAC-049", product: "MacBook Pro 14-inch (M4 Pro)", config: "24GB memory, 1TB SSD", newKes: 330000, exUkKes: 265000, modelId: "macbook-pro-14-m4-pro", memoryGb: 24, storage: "1TB" },
  { id: "MAC-050", product: "MacBook Pro 14-inch (M4 Max)", config: "36GB memory, 1TB SSD", newKes: 420000, exUkKes: 340000, modelId: null, memoryGb: 36, storage: "1TB" },
  { id: "MAC-051", product: "MacBook Pro 14-inch (M3, 2023)", config: "8GB memory, 512GB SSD", newKes: 195000, exUkKes: 155000, modelId: "macbook-pro-14-m3", memoryGb: 8, storage: "512GB" },
  { id: "MAC-052", product: "MacBook Pro 14-inch (M3, 2023)", config: "8GB memory, 1TB SSD", newKes: 220000, exUkKes: 175000, modelId: "macbook-pro-14-m3", memoryGb: 8, storage: "1TB" },
  { id: "MAC-053", product: "MacBook Pro 14-inch (M3 Pro)", config: "18GB memory, 512GB SSD", newKes: 245000, exUkKes: 195000, modelId: "macbook-pro-14-m3-pro", memoryGb: 18, storage: "512GB" },
  { id: "MAC-054", product: "MacBook Pro 14-inch (M3 Pro)", config: "18GB memory, 1TB SSD", newKes: 275000, exUkKes: 220000, modelId: "macbook-pro-14-m3-pro", memoryGb: 18, storage: "1TB" },
  { id: "MAC-055", product: "MacBook Pro 14-inch (M3 Max)", config: "36GB memory, 1TB SSD", newKes: 350000, exUkKes: 280000, modelId: null, memoryGb: 36, storage: "1TB" },
  { id: "MAC-056", product: "MacBook Pro 14-inch (M2 Pro, 2023)", config: "16GB memory, 512GB SSD", newKes: 215000, exUkKes: 165000, modelId: "macbook-pro-14-m2-pro", memoryGb: 16, storage: "512GB" },
  { id: "MAC-057", product: "MacBook Pro 14-inch (M2 Pro, 2023)", config: "16GB memory, 1TB SSD", newKes: 245000, exUkKes: 185000, modelId: "macbook-pro-14-m2-pro", memoryGb: 16, storage: "1TB" },
  { id: "MAC-058", product: "MacBook Pro 14-inch (M2 Max, 2023)", config: "32GB memory, 1TB SSD", newKes: 295000, exUkKes: 230000, modelId: null, memoryGb: 32, storage: "1TB" },
  { id: "MAC-059", product: "MacBook Pro 14-inch (M1 Pro, 2021)", config: "16GB memory, 512GB SSD", newKes: 180000, exUkKes: 135000, modelId: "macbook-pro-14-m1-pro", memoryGb: 16, storage: "512GB" },
  { id: "MAC-060", product: "MacBook Pro 14-inch (M1 Pro, 2021)", config: "16GB memory, 1TB SSD", newKes: 200000, exUkKes: 150000, modelId: "macbook-pro-14-m1-pro", memoryGb: 16, storage: "1TB" },
  { id: "MAC-061", product: "MacBook Pro 14-inch (M1 Max, 2021)", config: "32GB memory, 1TB SSD", newKes: 250000, exUkKes: 190000, modelId: null, memoryGb: 32, storage: "1TB" },
  { id: "MAC-062", product: "MacBook Pro 16-inch (M5 Pro)", config: "18-core CPU, 20-core GPU, 24GB memory, 1TB SSD", newKes: 430000, exUkKes: 350000, modelId: "macbook-pro-16-m5-pro", memoryGb: 24, storage: "1TB" },
  { id: "MAC-063", product: "MacBook Pro 16-inch (M5 Pro)", config: "18-core CPU, 20-core GPU, 48GB memory, 1TB SSD", newKes: 485000, exUkKes: 395000, modelId: "macbook-pro-16-m5-pro", memoryGb: 48, storage: "1TB" },
  { id: "MAC-064", product: "MacBook Pro 16-inch (M5 Max)", config: "18-core CPU, 32-core GPU, 36GB memory, 2TB SSD", newKes: 540000, exUkKes: 440000, modelId: null, memoryGb: 36, storage: "2TB" },
  { id: "MAC-065", product: "MacBook Pro 16-inch (M5 Max)", config: "18-core CPU, 40-core GPU, 48GB memory, 2TB SSD", newKes: 660000, exUkKes: 485000, modelId: null, memoryGb: 48, storage: "2TB" },
  { id: "MAC-066", product: "MacBook Pro 16-inch (M4 Pro)", config: "24GB memory, 512GB SSD", newKes: 340000, exUkKes: 275000, modelId: "macbook-pro-16-m4-pro", memoryGb: 24, storage: "512GB" },
  { id: "MAC-067", product: "MacBook Pro 16-inch (M4 Pro)", config: "24GB memory, 1TB SSD", newKes: 385000, exUkKes: 310000, modelId: "macbook-pro-16-m4-pro", memoryGb: 24, storage: "1TB" },
  { id: "MAC-068", product: "MacBook Pro 16-inch (M4 Max)", config: "36GB memory, 1TB SSD", newKes: 480000, exUkKes: 390000, modelId: null, memoryGb: 36, storage: "1TB" },
  { id: "MAC-069", product: "MacBook Pro 16-inch (M3 Pro)", config: "18GB memory, 512GB SSD", newKes: 295000, exUkKes: 235000, modelId: "macbook-pro-16-m3-pro", memoryGb: 18, storage: "512GB" },
  { id: "MAC-070", product: "MacBook Pro 16-inch (M3 Pro)", config: "18GB memory, 1TB SSD", newKes: 325000, exUkKes: 260000, modelId: "macbook-pro-16-m3-pro", memoryGb: 18, storage: "1TB" },
  { id: "MAC-071", product: "MacBook Pro 16-inch (M3 Max)", config: "36GB memory, 1TB SSD", newKes: 410000, exUkKes: 330000, modelId: null, memoryGb: 36, storage: "1TB" },
  { id: "MAC-072", product: "MacBook Pro 16-inch (M2 Pro, 2023)", config: "16GB memory, 512GB SSD", newKes: 250000, exUkKes: 195000, modelId: "macbook-pro-16-m2-pro", memoryGb: 16, storage: "512GB" },
  { id: "MAC-073", product: "MacBook Pro 16-inch (M2 Pro, 2023)", config: "16GB memory, 1TB SSD", newKes: 285000, exUkKes: 220000, modelId: "macbook-pro-16-m2-pro", memoryGb: 16, storage: "1TB" },
  { id: "MAC-074", product: "MacBook Pro 16-inch (M2 Max, 2023)", config: "32GB memory, 1TB SSD", newKes: 330000, exUkKes: 260000, modelId: null, memoryGb: 32, storage: "1TB" },
  { id: "MAC-075", product: "MacBook Pro 16-inch (M1 Pro, 2021)", config: "16GB memory, 512GB SSD", newKes: 210000, exUkKes: 160000, modelId: "macbook-pro-16-m1-pro", memoryGb: 16, storage: "512GB" },
  { id: "MAC-076", product: "MacBook Pro 16-inch (M1 Pro, 2021)", config: "16GB memory, 1TB SSD", newKes: 235000, exUkKes: 180000, modelId: "macbook-pro-16-m1-pro", memoryGb: 16, storage: "1TB" },
  { id: "MAC-077", product: "MacBook Pro 16-inch (M1 Max, 2021)", config: "32GB memory, 1TB SSD", newKes: 280000, exUkKes: 220000, modelId: null, memoryGb: 32, storage: "1TB" },
  { id: "MAC-078", product: "MacBook Pro 16-inch (Intel, 2019)", config: "16GB memory, 512GB SSD", newKes: 95000, exUkKes: 65000, modelId: null, memoryGb: 16, storage: "512GB" },
  { id: "MAC-079", product: "MacBook Pro 16-inch (Intel, 2019)", config: "16GB memory, 1TB SSD", newKes: 110000, exUkKes: 75000, modelId: null, memoryGb: 16, storage: "1TB" },
  { id: "MAC-080", product: "iMac 24-inch (M4)", config: "8-core CPU, 8-core GPU, 16GB memory, 256GB SSD", newKes: 99000, exUkKes: 78000, modelId: null, memoryGb: 16, storage: "256GB" },
  { id: "MAC-081", product: "iMac 24-inch (M4)", config: "10-core CPU, 10-core GPU, 16GB memory, 256GB SSD", newKes: 128000, exUkKes: 105000, modelId: null, memoryGb: 16, storage: "256GB" },
  { id: "MAC-082", product: "iMac 24-inch (M4)", config: "10-core CPU, 10-core GPU, 16GB memory, 512GB SSD", newKes: 158000, exUkKes: 128000, modelId: null, memoryGb: 16, storage: "512GB" },
  { id: "MAC-083", product: "iMac 24-inch (M4)", config: "10-core CPU, 10-core GPU, 24GB memory, 512GB SSD", newKes: 185000, exUkKes: 150000, modelId: null, memoryGb: 24, storage: "512GB" },
  { id: "MAC-084", product: "iMac 24-inch (M3)", config: "8GB memory, 256GB SSD", newKes: 145000, exUkKes: 110000, modelId: null, memoryGb: 8, storage: "256GB" },
  { id: "MAC-085", product: "iMac 24-inch (M3)", config: "8GB memory, 512GB SSD", newKes: 165000, exUkKes: 130000, modelId: null, memoryGb: 8, storage: "512GB" },
  { id: "MAC-086", product: "iMac 24-inch (M1, 2021)", config: "8GB memory, 256GB SSD", newKes: 115000, exUkKes: 85000, modelId: null, memoryGb: 8, storage: "256GB" },
  { id: "MAC-087", product: "iMac 24-inch (M1, 2021)", config: "8GB memory, 512GB SSD", newKes: 135000, exUkKes: 100000, modelId: null, memoryGb: 8, storage: "512GB" },
  { id: "MAC-088", product: "Mac mini (M6)", config: "12-core CPU, 12-core GPU, 16GB memory, 256GB SSD", newKes: 125000, exUkKes: 100000, modelId: null, memoryGb: 16, storage: "256GB" },
  { id: "MAC-089", product: "Mac mini (M6)", config: "12-core CPU, 12-core GPU, 16GB memory, 512GB SSD", newKes: 145000, exUkKes: 118000, modelId: null, memoryGb: 16, storage: "512GB" },
  { id: "MAC-090", product: "Mac mini (M6)", config: "12-core CPU, 12-core GPU, 24GB memory, 512GB SSD", newKes: 165000, exUkKes: 135000, modelId: null, memoryGb: 24, storage: "512GB" },
  { id: "MAC-091", product: "Mac mini (M6)", config: "12-core CPU, 12-core GPU, 32GB memory, 1TB SSD", newKes: 195000, exUkKes: 160000, modelId: null, memoryGb: 32, storage: "1TB" },
  { id: "MAC-092", product: "Mac mini (M5 Pro)", config: "15-core CPU, 16-core GPU, 24GB memory, 512GB SSD", newKes: 240000, exUkKes: 195000, modelId: null, memoryGb: 24, storage: "512GB" },
  { id: "MAC-093", product: "Mac mini (M5 Pro)", config: "18-core CPU, 20-core GPU, 64GB memory, 1TB SSD", newKes: 295000, exUkKes: 240000, modelId: null, memoryGb: 64, storage: "1TB" },
  { id: "MAC-094", product: "Mac mini (M4, 2024)", config: "16GB memory, 256GB SSD", newKes: 103000, exUkKes: 78000, modelId: null, memoryGb: 16, storage: "256GB" },
  { id: "MAC-095", product: "Mac mini (M4, 2024)", config: "16GB memory, 512GB SSD", newKes: 135000, exUkKes: 108000, modelId: null, memoryGb: 16, storage: "512GB" },
  { id: "MAC-096", product: "Mac mini (M4, 2024)", config: "24GB memory, 512GB SSD", newKes: 158000, exUkKes: 128000, modelId: null, memoryGb: 24, storage: "512GB" },
  { id: "MAC-097", product: "Mac mini (M2, 2023)", config: "8GB memory, 256GB SSD", newKes: 85000, exUkKes: 65000, modelId: null, memoryGb: 8, storage: "256GB" },
  { id: "MAC-098", product: "Mac mini (M2, 2023)", config: "8GB memory, 512GB SSD", newKes: 105000, exUkKes: 78000, modelId: null, memoryGb: 8, storage: "512GB" },
  { id: "MAC-099", product: "Mac mini (M1, 2020)", config: "8GB memory, 256GB SSD", newKes: 68000, exUkKes: 50000, modelId: null, memoryGb: 8, storage: "256GB" },
  { id: "MAC-100", product: "Mac mini (M1, 2020)", config: "8GB memory, 512GB SSD", newKes: 84000, exUkKes: 62000, modelId: null, memoryGb: 8, storage: "512GB" },
  { id: "MAC-101", product: "Mac Studio (M5 Max)", config: "18-core CPU, 32-core GPU, 36GB memory, 512GB SSD", newKes: 360000, exUkKes: 295000, modelId: null, memoryGb: 36, storage: "512GB" },
  { id: "MAC-102", product: "Mac Studio (M5 Max)", config: "18-core CPU, 40-core GPU, 64GB memory, 1TB SSD", newKes: 420000, exUkKes: 345000, modelId: null, memoryGb: 64, storage: "1TB" },
  { id: "MAC-103", product: "Mac Studio (M5 Ultra)", config: "30-core CPU, 64-core GPU, 96GB memory, 1TB SSD", newKes: 680000, exUkKes: 550000, modelId: null, memoryGb: 96, storage: "1TB" },
  { id: "MAC-104", product: "Mac Studio (M4 Max)", config: "36GB memory, 512GB SSD", newKes: 320000, exUkKes: 260000, modelId: null, memoryGb: 36, storage: "512GB" },
  { id: "MAC-105", product: "Mac Studio (M4 Max)", config: "64GB memory, 1TB SSD", newKes: 370000, exUkKes: 300000, modelId: null, memoryGb: 64, storage: "1TB" },
];

export function macSheetForModel(modelId: string): MacSheetRow[] {
  return macSheet.filter((r) => r.modelId === modelId);
}

export function macConfigStorageId(memoryGb: number | null, storage: string | null): string {
  const mem = memoryGb != null ? `${memoryGb}gb` : "base";
  const stor = (storage || "base").toLowerCase().replace(/\s+/g, "");
  return `${mem}-${stor}`;
}

export function macConfigStorageLabel(memoryGb: number | null, storage: string | null): string {
  if (memoryGb != null && storage) return `${memoryGb} GB · ${storage}`;
  if (storage) return storage;
  if (memoryGb != null) return `${memoryGb} GB`;
  return "Base";
}

export function macBaseFromSheet(modelId: string): number | undefined {
  const rows = macSheetForModel(modelId);
  if (!rows.length) return undefined;
  return Math.min(..rows.map((r) => r.newKes));
}

export function macSheetPrice(
  modelId: string,
  memoryGb: number,
  storageLabel: string,
): { newKes: number; exUkKes: number; sheetId: string } | undefined {
  const want = storageLabel.toUpperCase().replace(/\s+/g, "");
  const rows = macSheetForModel(modelId);
  const exact = rows.find(
    (r) => r.memoryGb === memoryGb && r.storage && r.storage.replace(/\s+/g, "") === want,
  );
  if (exact) return { newKes: exact.newKes, exUkKes: exact.exUkKes, sheetId: exact.id };
  const sameStor = rows.filter(
    (r) => r.storage && r.storage.replace(/\s+/g, "") === want && r.memoryGb != null,
  );
  if (sameStor.length) {
    sameStor.sort(
      (a, b) => Math.abs((a.memoryGb || 0) - memoryGb) - Math.abs((b.memoryGb || 0) - memoryGb),
    );
    const r = sameStor[0];
    return { newKes: r.newKes, exUkKes: r.exUkKes, sheetId: r.id };
  }
  const any = rows.slice().sort((a, b) => a.newKes - b.newKes)[0];
  if (any) return { newKes: any.newKes, exUkKes: any.exUkKes, sheetId: any.id };
  return undefined;
}
