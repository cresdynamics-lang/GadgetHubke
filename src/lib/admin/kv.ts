/**
 * Shared Upstash / local-file KV used by admin overlays and related stores.
 */
import fs from "node:fs";
import path from "node:path";

function upstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export function adminPersistenceMode(): "upstash" | "local" | "none" {
  if (upstashConfigured()) return "upstash";
  if (import.meta.env.DEV || process.env.REVIEWS_LOCAL_FILE === "1" || !process.env.VERCEL) {
    return "local";
  }
  return "none";
}

async function redisCommand(command: (string | number)[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash command failed (${res.status})`);
  return (await res.json()) as { result?: unknown };
}

function localPath(key: string) {
  const safe = key.replace(/[^a-z0-9:_-]/gi, "_");
  return path.join(process.cwd(), ".data", `${safe}.json`);
}

export async function kvGetJson<T>(key: string, fallback: T): Promise<T> {
  const mode = adminPersistenceMode();
  if (mode === "upstash") {
    try {
      const data = await redisCommand(["GET", key]);
      if (typeof data.result !== "string" || !data.result) return fallback;
      return JSON.parse(data.result) as T;
    } catch {
      return fallback;
    }
  }
  if (mode === "local") {
    try {
      const file = localPath(key);
      if (!fs.existsSync(file)) return fallback;
      return JSON.parse(fs.readFileSync(file, "utf8")) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export async function kvSetJson(key: string, value: unknown) {
  const mode = adminPersistenceMode();
  if (mode === "upstash") {
    await redisCommand(["SET", key, JSON.stringify(value)]);
    return;
  }
  if (mode === "local") {
    const file = localPath(key);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf8");
    return;
  }
  throw new Error("Admin storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.");
}
