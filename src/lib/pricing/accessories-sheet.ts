/**
 * Official Gadget Hub Accessories price sheet (NEW + EX-UK, KES).
 * Source: Gadget_Hub_Price_List_Full PDF — AC-001 … AC-115 (Accessories section).
 */
export type AccessoriesSheetRow = {
  id: string;
  product: string;
  config: string;
  newKes: number;
  exUkKes: number;
  modelId: string | null;
};

export const accessoriesSheet: AccessoriesSheetRow[] = [
  { id: "AC-001", product: "iPhone 18 Pro Max Silicone Case with MagSafe All colours (same price u", config: "iPhone 18 Pro Max Silicone Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-18-pro-max-silicone" },
  { id: "AC-002", product: "iPhone 18 Pro Max TechWoven Case with MagSafe All colours (same price ", config: "iPhone 18 Pro Max TechWoven Case with MagSafe All colours (same price unless noted)", newKes: 6500, exUkKes: 4500, modelId: "case-iphone-18-pro-max-techwoven" },
  { id: "AC-003", product: "iPhone 18 Pro Max Clear Case with MagSafe All colours (same price unle", config: "iPhone 18 Pro Max Clear Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-18-pro-max-clear" },
  { id: "AC-004", product: "iPhone 18 Pro Silicone Case with MagSafe All colours (same price unles", config: "iPhone 18 Pro Silicone Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-18-pro-silicone" },
  { id: "AC-005", product: "iPhone 18 Pro TechWoven Case with MagSafe All colours (same price unle", config: "iPhone 18 Pro TechWoven Case with MagSafe All colours (same price unless noted)", newKes: 6500, exUkKes: 4500, modelId: "case-iphone-18-pro-techwoven" },
  { id: "AC-006", product: "iPhone 18 Pro Clear Case with MagSafe All colours (same price unless n", config: "iPhone 18 Pro Clear Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-18-pro-clear" },
  { id: "AC-007", product: "iPhone 17 Pro Max Silicone Case with MagSafe All colours (same price u", config: "iPhone 17 Pro Max Silicone Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-17-pro-max-silicone" },
  { id: "AC-008", product: "iPhone 17 Pro Max Clear Case with MagSafe All colours (same price unle", config: "iPhone 17 Pro Max Clear Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-17-pro-max-clear" },
  { id: "AC-009", product: "iPhone 17 Pro Silicone Case with MagSafe All colours (same price unles", config: "iPhone 17 Pro Silicone Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-17-pro-silicone" },
  { id: "AC-010", product: "iPhone 17 Pro Clear Case with MagSafe All colours (same price unless n", config: "iPhone 17 Pro Clear Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-17-pro-clear" },
  { id: "AC-011", product: "iPhone 17 Silicone Case with MagSafe All colours (same price unless no", config: "iPhone 17 Silicone Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-17-silicone" },
  { id: "AC-012", product: "iPhone 17 Clear Case with MagSafe All colours (same price unless noted", config: "iPhone 17 Clear Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-17-clear" },
  { id: "AC-013", product: "iPhone 17e Silicone Case with MagSafe All colours (same price unless n", config: "iPhone 17e Silicone Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-17e-silicone" },
  { id: "AC-014", product: "iPhone 17e Clear Case with MagSafe All colours (same price unless note", config: "iPhone 17e Clear Case with MagSafe All colours (same price unless noted)", newKes: 4500, exUkKes: 3000, modelId: "case-iphone-17e-clear" },
  { id: "AC-015", product: "iPhone Air Case with MagSafe All colours (same price unless noted)", config: "iPhone Air Case with MagSafe All colours (same price unless noted)", newKes: 3500, exUkKes: 2500, modelId: "case-iphone-air-case" },
  { id: "AC-016", product: "iPhone Air Bumper All colours (same price unless noted)", config: "iPhone Air Bumper All colours (same price unless noted)", newKes: 3500, exUkKes: 2500, modelId: "case-iphone-air-bumper" },
  { id: "AC-017", product: "iPhone Duo Case All colours (same price unless noted)", config: "iPhone Duo Case All colours (same price unless noted)", newKes: 3500, exUkKes: 2500, modelId: "case-iphone-duo-case" },
  { id: "AC-018", product: "iPhone Duo Folio with Kickstand All colours (same price unless noted)", config: "iPhone Duo Folio with Kickstand All colours (same price unless noted)", newKes: 6500, exUkKes: 4500, modelId: "case-iphone-duo-folio" },
  { id: "AC-019", product: "iPhone FineWoven Wallet with MagSafe All colours (same price unless no", config: "iPhone FineWoven Wallet with MagSafe All colours (same price unless noted)", newKes: 5500, exUkKes: 4000, modelId: "case-iphone-finewoven-wallet" },
  { id: "AC-020", product: "iPhone 16 Pro Max Silicone Case Only price if you stock it", config: "iPhone 16 Pro Max Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-021", product: "iPhone 16 Pro Max Clear Case Only price if you stock it", config: "iPhone 16 Pro Max Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-022", product: "iPhone 16 Pro Silicone Case Only price if you stock it", config: "iPhone 16 Pro Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-023", product: "iPhone 16 Pro Clear Case Only price if you stock it", config: "iPhone 16 Pro Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-024", product: "iPhone 16 Plus Silicone Case Only price if you stock it", config: "iPhone 16 Plus Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-025", product: "iPhone 16 Plus Clear Case Only price if you stock it", config: "iPhone 16 Plus Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-026", product: "iPhone 16 Silicone Case Only price if you stock it", config: "iPhone 16 Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-027", product: "iPhone 16 Clear Case Only price if you stock it", config: "iPhone 16 Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-028", product: "iPhone 16e Silicone Case Only price if you stock it", config: "iPhone 16e Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-029", product: "iPhone 16e Clear Case Only price if you stock it", config: "iPhone 16e Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-030", product: "iPhone 15 Pro Max Silicone Case Only price if you stock it", config: "iPhone 15 Pro Max Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-031", product: "iPhone 15 Pro Max Clear Case Only price if you stock it", config: "iPhone 15 Pro Max Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-032", product: "iPhone 15 Pro Silicone Case Only price if you stock it", config: "iPhone 15 Pro Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-033", product: "iPhone 15 Pro Clear Case Only price if you stock it", config: "iPhone 15 Pro Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-034", product: "iPhone 15 Plus Silicone Case Only price if you stock it", config: "iPhone 15 Plus Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-035", product: "iPhone 15 Plus Clear Case Only price if you stock it", config: "iPhone 15 Plus Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-036", product: "iPhone 15 Silicone Case Only price if you stock it", config: "iPhone 15 Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-037", product: "iPhone 15 Clear Case Only price if you stock it", config: "iPhone 15 Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-038", product: "iPhone 14 Pro Max Silicone Case Only price if you stock it", config: "iPhone 14 Pro Max Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-039", product: "iPhone 14 Pro Max Clear Case Only price if you stock it", config: "iPhone 14 Pro Max Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-040", product: "iPhone 14 Pro Silicone Case Only price if you stock it", config: "iPhone 14 Pro Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-041", product: "iPhone 14 Pro Clear Case Only price if you stock it", config: "iPhone 14 Pro Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-042", product: "iPhone 14 Plus Silicone Case Only price if you stock it", config: "iPhone 14 Plus Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-043", product: "iPhone 14 Plus Clear Case Only price if you stock it", config: "iPhone 14 Plus Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-044", product: "iPhone 14 Silicone Case Only price if you stock it", config: "iPhone 14 Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-045", product: "iPhone 14 Clear Case Only price if you stock it", config: "iPhone 14 Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-046", product: "iPhone 13 Pro Max Silicone Case Only price if you stock it", config: "iPhone 13 Pro Max Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-047", product: "iPhone 13 Pro Max Clear Case Only price if you stock it", config: "iPhone 13 Pro Max Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-048", product: "iPhone 13 Pro Silicone Case Only price if you stock it", config: "iPhone 13 Pro Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-049", product: "iPhone 13 Pro Clear Case Only price if you stock it", config: "iPhone 13 Pro Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-050", product: "iPhone 13 Silicone Case Only price if you stock it", config: "iPhone 13 Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-051", product: "iPhone 13 Clear Case Only price if you stock it", config: "iPhone 13 Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-052", product: "iPhone 13 mini Silicone Case Only price if you stock it", config: "iPhone 13 mini Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-053", product: "iPhone 13 mini Clear Case Only price if you stock it", config: "iPhone 13 mini Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-054", product: "iPhone 12 Pro Max Silicone Case Only price if you stock it", config: "iPhone 12 Pro Max Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-055", product: "iPhone 12 Pro Max Clear Case Only price if you stock it", config: "iPhone 12 Pro Max Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-056", product: "iPhone 12 Pro Silicone Case Only price if you stock it", config: "iPhone 12 Pro Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-057", product: "iPhone 12 Pro Clear Case Only price if you stock it", config: "iPhone 12 Pro Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-058", product: "iPhone 12 Silicone Case Only price if you stock it", config: "iPhone 12 Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-059", product: "iPhone 12 Clear Case Only price if you stock it", config: "iPhone 12 Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-060", product: "iPhone 12 mini Silicone Case Only price if you stock it", config: "iPhone 12 mini Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-061", product: "iPhone 12 mini Clear Case Only price if you stock it", config: "iPhone 12 mini Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-062", product: "iPhone 11 Pro Max Silicone Case Only price if you stock it", config: "iPhone 11 Pro Max Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-063", product: "iPhone 11 Pro Max Clear Case Only price if you stock it", config: "iPhone 11 Pro Max Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-064", product: "iPhone 11 Pro Silicone Case Only price if you stock it", config: "iPhone 11 Pro Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-065", product: "iPhone 11 Pro Clear Case Only price if you stock it", config: "iPhone 11 Pro Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-066", product: "iPhone 11 Silicone Case Only price if you stock it", config: "iPhone 11 Silicone Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-067", product: "iPhone 11 Clear Case Only price if you stock it", config: "iPhone 11 Clear Case Only price if you stock it", newKes: 4500, exUkKes: 3000, modelId: null },
  { id: "AC-068", product: "Crossbody Strap All colours (same price unless noted)", config: "Crossbody Strap All colours (same price unless noted)", newKes: 3500, exUkKes: 2500, modelId: "strap-crossbody" },
  { id: "AC-069", product: "Wrist Strap All colours (same price unless noted)", config: "Wrist Strap All colours (same price unless noted)", newKes: 3500, exUkKes: 2500, modelId: "strap-wrist" },
  { id: "AC-070", product: "20W USBC Power Adapter Confirm plug type", config: "20W USBC Power Adapter Confirm plug type", newKes: 3000, exUkKes: 2000, modelId: "power-adapter-20w" },
  { id: "AC-071", product: "35W Dual USBC Port Compact Power Adapter Confirm plug type", config: "35W Dual USBC Port Compact Power Adapter Confirm plug type", newKes: 5500, exUkKes: 4000, modelId: "power-adapter-35w-dual" },
  { id: "AC-072", product: "40W Dynamic Power Adapter with 60W Max Confirm plug type", config: "40W Dynamic Power Adapter with 60W Max Confirm plug type", newKes: 6500, exUkKes: 4500, modelId: "power-adapter-40w-dynamic" },
  { id: "AC-073", product: "70W USBC Power Adapter Confirm plug type", config: "70W USBC Power Adapter Confirm plug type", newKes: 8500, exUkKes: 6000, modelId: "power-adapter-70w" },
  { id: "AC-074", product: "96W USBC Power Adapter Confirm plug type", config: "96W USBC Power Adapter Confirm plug type", newKes: 10500, exUkKes: 7500, modelId: "power-adapter-96w" },
  { id: "AC-075", product: "140W USBC Power Adapter Confirm plug type", config: "140W USBC Power Adapter Confirm plug type", newKes: 6500, exUkKes: 4500, modelId: "power-adapter-140w" },
  { id: "AC-076", product: "Power Adapter Extension Cable Standard", config: "Power Adapter Extension Cable Standard", newKes: 3000, exUkKes: 2000, modelId: "power-extension-cable" },
  { id: "AC-077", product: "MagSafe Charger (1 m) Standard", config: "MagSafe Charger (1 m) Standard", newKes: 6000, exUkKes: 4000, modelId: "magsafe-charger-1m" },
  { id: "AC-078", product: "MagSafe Charger (2 m) Standard", config: "MagSafe Charger (2 m) Standard", newKes: 7500, exUkKes: 5000, modelId: "magsafe-charger-2m" },
  { id: "AC-079", product: "Apple Watch Magnetic Fast Charger to USBC Cable (1 m) Standard", config: "Apple Watch Magnetic Fast Charger to USBC Cable (1 m) Standard", newKes: 5000, exUkKes: 3500, modelId: "watch-magnetic-charger-1m" },
  { id: "AC-080", product: "iPhone Air MagSafe Battery Standard", config: "iPhone Air MagSafe Battery Standard", newKes: 13000, exUkKes: 9000, modelId: null },
  { id: "AC-081", product: "MagSafe Battery Pack Standard", config: "MagSafe Battery Pack Standard", newKes: 13000, exUkKes: 9000, modelId: null },
  { id: "AC-082", product: "60W USBC Charge Cable 1 m", config: "60W USBC Charge Cable 1 m", newKes: 3000, exUkKes: 2000, modelId: "cable-usbc-60w-1m" },
  { id: "AC-083", product: "240W USBC Charge Cable 2 m", config: "240W USBC Charge Cable 2 m", newKes: 4500, exUkKes: 3000, modelId: "cable-usbc-240w-2m" },
  { id: "AC-084", product: "USBC to MagSafe 3 Cable 2 m", config: "USBC to MagSafe 3 Cable 2 m", newKes: 7000, exUkKes: 5000, modelId: "cable-magsafe3-2m" },
  { id: "AC-085", product: "USBC to Lightning Cable 1 m", config: "USBC to Lightning Cable 1 m", newKes: 2000, exUkKes: 1500, modelId: null },
  { id: "AC-086", product: "USBC to Lightning Cable 2 m", config: "USBC to Lightning Cable 2 m", newKes: 3000, exUkKes: 2000, modelId: null },
  { id: "AC-087", product: "Thunderbolt 4 USBC Pro Cable 1.8 m", config: "Thunderbolt 4 USBC Pro Cable 1.8 m", newKes: 11500, exUkKes: 8000, modelId: "cable-tb4-1-8m" },
  { id: "AC-088", product: "Thunderbolt 4 USBC Pro Cable 3 m", config: "Thunderbolt 4 USBC Pro Cable 3 m", newKes: 19500, exUkKes: 13500, modelId: "cable-tb4-3m" },
  { id: "AC-089", product: "Thunderbolt 5 USBC Pro Cable 1 m", config: "Thunderbolt 5 USBC Pro Cable 1 m", newKes: 12500, exUkKes: 9000, modelId: "cable-tb5-1m" },
  { id: "AC-090", product: "Smart Folio for iPad Pro 13-inch M5 All colours (same price unless not", config: "Smart Folio for iPad Pro 13-inch M5 All colours (same price unless noted)", newKes: 13500, exUkKes: 9500, modelId: "folio-ipad-pro-13-m5" },
  { id: "AC-091", product: "Smart Folio for iPad Pro 11-inch M5 All colours (same price unless not", config: "Smart Folio for iPad Pro 11-inch M5 All colours (same price unless noted)", newKes: 11500, exUkKes: 8000, modelId: "folio-ipad-pro-11-m5" },
  { id: "AC-092", product: "Smart Folio for iPad Air 13-inch M4 All colours (same price unless not", config: "Smart Folio for iPad Air 13-inch M4 All colours (same price unless noted)", newKes: 13500, exUkKes: 9500, modelId: "folio-ipad-air-13-m4" },
  { id: "AC-093", product: "Smart Folio for iPad Air 11-inch M4 All colours (same price unless not", config: "Smart Folio for iPad Air 11-inch M4 All colours (same price unless noted)", newKes: 11500, exUkKes: 8000, modelId: "folio-ipad-air-11-m4" },
  { id: "AC-094", product: "Smart Folio for iPad A16 All colours (same price unless noted)", config: "Smart Folio for iPad A16 All colours (same price unless noted)", newKes: 9500, exUkKes: 6500, modelId: "folio-ipad-a16" },
  { id: "AC-095", product: "Smart Folio for iPad mini A17 Pro) All colours (same price unless note", config: "Smart Folio for iPad mini A17 Pro) All colours (same price unless noted)", newKes: 9500, exUkKes: 6500, modelId: "folio-ipad-mini-a17-pro" },
  { id: "AC-096", product: "Apple Pencil Pro Standard", config: "Apple Pencil Pro Standard", newKes: 18000, exUkKes: 12500, modelId: "pencil-pro" },
  { id: "AC-097", product: "Apple Pencil USBC Standard", config: "Apple Pencil USBC Standard", newKes: 15000, exUkKes: 10500, modelId: "pencil-usbc" },
  { id: "AC-098", product: "Apple Pencil 2nd generation) Standard", config: "Apple Pencil 2nd generation) Standard", newKes: 17500, exUkKes: 12000, modelId: "pencil-2" },
  { id: "AC-099", product: "Apple Pencil 1st generation) Standard", config: "Apple Pencil 1st generation) Standard", newKes: 14000, exUkKes: 10000, modelId: "pencil-1" },
  { id: "AC-100", product: "Magic Keyboard for iPad Pro 13-inch M5 US English; confirm layout", config: "Magic Keyboard for iPad Pro 13-inch M5 US English; confirm layout", newKes: 53000, exUkKes: 37000, modelId: "keyboard-ipad-pro-13" },
  { id: "AC-101", product: "Magic Keyboard for iPad Pro 11-inch M5 US English; confirm layout", config: "Magic Keyboard for iPad Pro 11-inch M5 US English; confirm layout", newKes: 47000, exUkKes: 33000, modelId: "keyboard-ipad-pro-11" },
  { id: "AC-102", product: "Magic Keyboard for iPad Air 13-inch M4 US English; confirm layout", config: "Magic Keyboard for iPad Air 13-inch M4 US English; confirm layout", newKes: 50000, exUkKes: 35000, modelId: "keyboard-ipad-air-13" },
  { id: "AC-103", product: "Magic Keyboard for iPad Air 11-inch M4 US English; confirm layout", config: "Magic Keyboard for iPad Air 11-inch M4 US English; confirm layout", newKes: 43000, exUkKes: 30000, modelId: "keyboard-ipad-air-11" },
  { id: "AC-104", product: "Magic Keyboard Folio for iPad A16 US English; confirm layout", config: "Magic Keyboard Folio for iPad A16 US English; confirm layout", newKes: 36000, exUkKes: 25000, modelId: "keyboard-folio" },
  { id: "AC-105", product: "Magic Keyboard with Touch ID Mac with Apple silicon", config: "Magic Keyboard with Touch ID Mac with Apple silicon", newKes: 21000, exUkKes: 14500, modelId: "keyboard-mac-touchid" },
  { id: "AC-106", product: "Magic Keyboard with Touch ID and Numeric Keypad Mac with Apple silicon", config: "Magic Keyboard with Touch ID and Numeric Keypad Mac with Apple silicon", newKes: 25000, exUkKes: 17500, modelId: "keyboard-mac-touchid-num-white" },
  { id: "AC-106", product: "Magic Keyboard with Touch ID and Numeric Keypad Mac with Apple silicon", config: "Magic Keyboard with Touch ID and Numeric Keypad Mac with Apple silicon", newKes: 25000, exUkKes: 17500, modelId: "keyboard-mac-touchid-num-black" },
  { id: "AC-107", product: "Magic Keyboard USBC Mac", config: "Magic Keyboard USBC Mac", newKes: 16000, exUkKes: 11000, modelId: "keyboard-mac-usbc" },
  { id: "AC-108", product: "Magic Mouse USBC, White Multi-Touch Surface", config: "Magic Mouse USBC, White Multi-Touch Surface", newKes: 17000, exUkKes: 12000, modelId: "mouse-usbc-white" },
  { id: "AC-109", product: "Magic Mouse USBC, Black Multi-Touch Surface", config: "Magic Mouse USBC, Black Multi-Touch Surface", newKes: 17000, exUkKes: 12000, modelId: "mouse-usbc-black" },
  { id: "AC-110", product: "Magic Trackpad USBC, White Multi-Touch Surface", config: "Magic Trackpad USBC, White Multi-Touch Surface", newKes: 22000, exUkKes: 15500, modelId: "trackpad-usbc-white" },
  { id: "AC-111", product: "Magic Trackpad USBC, Black Multi-Touch Surface", config: "Magic Trackpad USBC, Black Multi-Touch Surface", newKes: 22000, exUkKes: 15500, modelId: "trackpad-usbc-black" },
  { id: "AC-112", product: "Magic Mouse (earlier generation) Confirm model", config: "Magic Mouse (earlier generation) Confirm model", newKes: 17000, exUkKes: 12000, modelId: "mouse-earlier-space-gray" },
  { id: "AC-113", product: "Magic Trackpad (earlier generation) Confirm model", config: "Magic Trackpad (earlier generation) Confirm model", newKes: 22000, exUkKes: 15500, modelId: "trackpad-earlier-space-gray" },
  { id: "AC-113", product: "Magic Trackpad (earlier generation) Confirm model", config: "Magic Trackpad (earlier generation) Confirm model", newKes: 22000, exUkKes: 15500, modelId: "trackpad-earlier-white" },
  { id: "AC-114", product: "AirTag 1 pack", config: "AirTag 1 pack", newKes: 6500, exUkKes: 4500, modelId: null },
  { id: "AC-115", product: "AirTag 4 pack", config: "AirTag 4 pack", newKes: 17500, exUkKes: 12000, modelId: null },
];

export function accessoriesSheetForModel(modelId: string): AccessoriesSheetRow[] {
  return accessoriesSheet.filter((r) => r.modelId === modelId);
}

export function accessoryBaseFromSheet(modelId: string): number | undefined {
  const rows = accessoriesSheetForModel(modelId);
  if (!rows.length) return undefined;
  return Math.min(..rows.map((r) => r.newKes));
}

export function accessoryBaseExUkFromSheet(modelId: string): number | undefined {
  const rows = accessoriesSheetForModel(modelId);
  if (!rows.length) return undefined;
  return rows.slice().sort((a, b) => a.newKes - b.newKes)[0].exUkKes;
}

export function accessorySheetPrice(
  modelId: string,
): { newKes: number; exUkKes: number; sheetId: string } | undefined {
  const rows = accessoriesSheetForModel(modelId);
  if (!rows.length) return undefined;
  const r = rows.slice().sort((a, b) => a.newKes - b.newKes)[0];
  return { newKes: r.newKes, exUkKes: r.exUkKes, sheetId: r.id };
}

/** Sheet rows that look inverted or unusually stepped — flag in admin. */
export const accessoriesSheetWatchIds = new Set(["AC-075"]);

