import { opsLinked } from "../ops/link";
import type { OpsCatalog } from "./ops-overlay";

const TIMEOUT_MS = 2500;

function configured() {
  return opsLinked() && Boolean(process.env.OPS_CATALOG_URL?.trim() && process.env.WEBSITE_SYNC_SECRET?.trim());
}

export function opsCatalogConfigured() {
  return configured();
}

export async function fetchOpsCatalog(): Promise<OpsCatalog | null> {
  if (!configured()) return null;
  const base = process.env.OPS_CATALOG_URL!.replace(/\/$/, "");
  const secret = process.env.WEBSITE_SYNC_SECRET!;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${base}/api/website/catalog`, {
      headers: { Authorization: `Bearer ${secret}`, Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      console.error("[ops-catalog]", response.status, await response.text().catch(() => ""));
      return null;
    }
    const data = (await response.json()) as OpsCatalog;
    if (!data || !Array.isArray(data.items)) return null;
    return data;
  } catch (error) {
    console.error("[ops-catalog]", error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
