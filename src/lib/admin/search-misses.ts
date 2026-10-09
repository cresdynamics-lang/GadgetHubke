import { kvGetJson, kvSetJson } from "./kv";

const KEY = "gh:search-misses:v1";
const MAX = 200;

export type SearchMiss = {
  id: string;
  q: string;
  at: string;
};

export async function listSearchMisses(): Promise<SearchMiss[]> {
  const rows = await kvGetJson<SearchMiss[]>(KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export async function addSearchMiss(q: string) {
  const cleaned = q.replace(/\s+/g, " ").trim().slice(0, 120);
  if (cleaned.length < 2) return null;
  const rows = await listSearchMisses();
  const miss: SearchMiss = {
    id: `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    q: cleaned,
    at: new Date().toISOString(),
  };
  rows.unshift(miss);
  await kvSetJson(KEY, rows.slice(0, MAX));
  return miss;
}

export async function clearSearchMisses() {
  await kvSetJson(KEY, []);
}
