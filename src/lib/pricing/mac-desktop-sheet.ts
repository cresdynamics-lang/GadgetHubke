/** Mac desktop price sheet (iMac / mini / Studio / Pro) — owner list 2026-10-09. */
export type MacDesktopSheetRow = { id: string; newKes: number; exUkKes: number };
export const macDesktopSheet: MacDesktopSheetRow[] = [
  { id: "imac-24-m1-256", newKes: 115000, exUkKes: 85000 },
  { id: "imac-24-m1-512", newKes: 135000, exUkKes: 100000 },
  { id: "imac-24-m3-256", newKes: 145000, exUkKes: 110000 },
  { id: "imac-24-m3-512", newKes: 165000, exUkKes: 130000 },
  { id: "imac-24-m4-256", newKes: 128000, exUkKes: 105000 },
  { id: "imac-24-m4-512", newKes: 158000, exUkKes: 128000 },
  { id: "mac-mini-m1-256", newKes: 68000, exUkKes: 50000 },
  { id: "mac-mini-m1-512", newKes: 84000, exUkKes: 62000 },
  { id: "mac-mini-m2-256", newKes: 85000, exUkKes: 65000 },
  { id: "mac-mini-m2-512", newKes: 105000, exUkKes: 78000 },
  { id: "mac-mini-m2-pro-512", newKes: 225000, exUkKes: 165000 },
  { id: "mac-mini-m4-256", newKes: 103000, exUkKes: 78000 },
  { id: "mac-mini-m4-pro-512", newKes: 222000, exUkKes: 175000 },
  { id: "mac-studio-m1-max-512", newKes: 288000, exUkKes: 195000 },
  { id: "mac-studio-m2-max-512", newKes: 320000, exUkKes: 240000 },
  { id: "mac-studio-m2-ultra-1tb", newKes: 590000, exUkKes: 420000 },
  { id: "mac-pro-m2-ultra", newKes: 950000, exUkKes: 350000 },
  { id: "mac-pro-2019", newKes: 0, exUkKes: 350000 }, // discontinued NEW
];
