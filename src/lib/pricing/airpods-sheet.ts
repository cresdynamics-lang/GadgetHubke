/**
 * Official Gadget Hub AirPods price sheet (NEW + EX-UK, KES).
 * Source: Gadget_Hub_Price_List_Full PDF — AP-001 … AP-010.
 */
export type AirpodsSheetRow = {
  id: string;
  product: string;
  config: string;
  newKes: number;
  exUkKes: number;
  modelId: string | null;
};

export const airpodsSheet: AirpodsSheetRow[] = [
  { id: "AP-001", product: "AirPods 5 Standard charging case", config: "AirPods 5 Standard charging case", newKes: 24000, exUkKes: 19000, modelId: "airpods-5" },
  { id: "AP-002", product: "AirPods 5 With Wireless Charging Case", config: "AirPods 5 With Wireless Charging Case", newKes: 28000, exUkKes: 19000, modelId: "airpods-5-wireless" },
  { id: "AP-003", product: "AirPods 4 With USBC Charging Case", config: "AirPods 4 With USBC Charging Case", newKes: 21000, exUkKes: 16000, modelId: "airpods-4" },
  { id: "AP-004", product: "AirPods 4 with Active Noise Cancellation With Wireless Charg", config: "AirPods 4 with Active Noise Cancellation With Wireless Charging Case", newKes: 26000, exUkKes: 20000, modelId: "airpods-4-anc" },
  { id: "AP-005", product: "AirPods Pro 3 With MagSafe Charging Case USBC", config: "AirPods Pro 3 With MagSafe Charging Case USBC", newKes: 33000, exUkKes: 25000, modelId: "airpods-pro-3" },
  { id: "AP-006", product: "AirPods Pro 2 With MagSafe Charging Case USBC", config: "AirPods Pro 2 With MagSafe Charging Case USBC", newKes: 32000, exUkKes: 23000, modelId: "airpods-pro-2" },
  { id: "AP-007", product: "AirPods Max 2 With Smart Case", config: "AirPods Max 2 With Smart Case", newKes: 75000, exUkKes: 58000, modelId: "airpods-max-2" },
  { id: "AP-008", product: "AirPods Max USBC With Smart Case", config: "AirPods Max USBC With Smart Case", newKes: 72000, exUkKes: 55000, modelId: "airpods-max-usbc" },
  { id: "AP-009", product: "AirPods 3rd generation) With MagSafe Charging Case", config: "AirPods 3rd generation) With MagSafe Charging Case", newKes: 22000, exUkKes: 15000, modelId: "airpods-3" },
  { id: "AP-010", product: "AirPods 2nd generation) With Charging Case", config: "AirPods 2nd generation) With Charging Case", newKes: 16000, exUkKes: 11000, modelId: "airpods-2" },
];

export function airpodsSheetForModel(modelId: string): AirpodsSheetRow[] {
  return airpodsSheet.filter((r) => r.modelId === modelId);
}

export function airpodsBaseFromSheet(modelId: string): number | undefined {
  const rows = airpodsSheetForModel(modelId);
  if (!rows.length) return undefined;
  return Math.min(..rows.map((r) => r.newKes));
}

export function airpodsBaseExUkFromSheet(modelId: string): number | undefined {
  const rows = airpodsSheetForModel(modelId);
  if (!rows.length) return undefined;
  return rows.slice().sort((a, b) => a.newKes - b.newKes)[0].exUkKes;
}

export function airpodsSheetPrice(
  modelId: string,
): { newKes: number; exUkKes: number; sheetId: string } | undefined {
  const rows = airpodsSheetForModel(modelId);
  if (!rows.length) return undefined;
  const r = rows[0];
  return { newKes: r.newKes, exUkKes: r.exUkKes, sheetId: r.id };
}

