import { kvGetJson, kvSetJson } from "../admin/kv";

export type TradeInStatus = "Waiting for quote" | "Quoted" | "Credit applied" | "Declined";

export type TradeInRequest = {
  id: string;
  customer: string;
  phone?: string;
  device: string;
  status: TradeInStatus;
  quoteKes?: number;
  submittedAt: string;
  notes?: string;
};

const KEY = "gh:trade-ins:v1";

function newId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `TI-${stamp}-${rand}`;
}

export async function listTradeIns(): Promise<TradeInRequest[]> {
  const rows = await kvGetJson<TradeInRequest[]>(KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export async function addTradeIn(
  input: Omit<TradeInRequest, "id" | "submittedAt" | "status"> & { status?: TradeInStatus },
): Promise<TradeInRequest> {
  const row: TradeInRequest = {
    id: newId(),
    customer: input.customer,
    phone: input.phone,
    device: input.device,
    status: input.status || "Waiting for quote",
    quoteKes: input.quoteKes,
    submittedAt: new Date().toISOString(),
    notes: input.notes,
  };
  const all = await listTradeIns();
  all.unshift(row);
  await kvSetJson(KEY, all.slice(0, 500));
  return row;
}

export async function updateTradeIn(
  id: string,
  patch: Partial<Pick<TradeInRequest, "status" | "quoteKes" | "notes">>,
): Promise<TradeInRequest | null> {
  const all = await listTradeIns();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...patch };
  await kvSetJson(KEY, all);
  return all[idx];
}
