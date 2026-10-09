import { kvGetJson, kvSetJson } from "../admin/kv";

export type LipaStatus = "On track" | "Due today" | "Missed" | "Completed";

export type LipaPlan = {
  id: string;
  customer: string;
  phone?: string;
  device: string;
  status: LipaStatus;
  nextDue: string;
  remainingKes: number;
  createdAt: string;
  notes?: string;
};

const KEY = "gh:lipa-plans:v1";

function newId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `LP-${stamp}-${rand}`;
}

export async function listLipaPlans(): Promise<LipaPlan[]> {
  const rows = await kvGetJson<LipaPlan[]>(KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export async function getLipaPlan(id: string): Promise<LipaPlan | null> {
  const all = await listLipaPlans();
  return all.find((p) => p.id === id) || null;
}

export async function addLipaPlan(
  input: Omit<LipaPlan, "id" | "createdAt" | "status"> & { status?: LipaStatus },
): Promise<LipaPlan> {
  const plan: LipaPlan = {
    id: newId(),
    customer: input.customer,
    phone: input.phone,
    device: input.device,
    status: input.status || "On track",
    nextDue: input.nextDue,
    remainingKes: input.remainingKes,
    createdAt: new Date().toISOString(),
    notes: input.notes,
  };
  const all = await listLipaPlans();
  all.unshift(plan);
  await kvSetJson(KEY, all.slice(0, 500));
  return plan;
}

export async function updateLipaPlan(
  id: string,
  patch: Partial<Pick<LipaPlan, "status" | "nextDue" | "remainingKes" | "notes">>,
): Promise<LipaPlan | null> {
  const all = await listLipaPlans();
  const idx = all.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...patch };
  await kvSetJson(KEY, all);
  return all[idx];
}
