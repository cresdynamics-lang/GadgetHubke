/**
 * Admin sign-in lockout: 5 wrong tries from one client locks it out for 15 minutes.
 * In-memory (single PM2 process), so a restart clears it — enough to stop guessing.
 */
const MAX_TRIES = 5;
const LOCK_MS = 15 * 60_000;
const tries = new Map<string, { count: number; lockedUntil: number }>();

export function clientKey(request: Request, clientAddress?: string): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || clientAddress || "unknown";
}

/** Minutes left on a lock, or 0 if this client may try. */
export function lockedMinutes(key: string): number {
  const t = tries.get(key);
  if (!t || t.lockedUntil <= Date.now()) return 0;
  return Math.ceil((t.lockedUntil - Date.now()) / 60_000);
}

export function recordFailure(key: string) {
  const t = tries.get(key) ?? { count: 0, lockedUntil: 0 };
  if (t.lockedUntil && t.lockedUntil <= Date.now()) t.count = 0;
  t.count += 1;
  if (t.count >= MAX_TRIES) t.lockedUntil = Date.now() + LOCK_MS;
  tries.set(key, t);
}

export function recordSuccess(key: string) {
  tries.delete(key);
}
