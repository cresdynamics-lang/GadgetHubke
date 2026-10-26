/**
 * Live visitors, in memory (one PM2 process). Each browser reports a heartbeat
 * with an anonymous visitor id; every tab of that browser shares the id, so one
 * person is one visitor however many tabs they open. Bots are ignored.
 * Nothing personal is stored: no IP, no name, only the page and device type.
 */

export type Device = "Phone" | "Tablet" | "Computer";

type Visitor = {
  id: string;
  firstSeen: number;
  lastSeen: number;
  path: string;
  title: string;
  source: string;
  device: Device;
  bagCount: number;
};

export type Hit = {
  vid: string;
  path: string;
  title?: string;
  ref?: string;
  utm?: string;
  device?: string;
  bagCount?: number;
  event?: "view" | "leave" | "cart_add" | "whatsapp";
  label?: string;
};

const ACTIVE_MS = 60_000;
const RECENT_MS = 5 * 60_000;
const visitors = new Map<string, Visitor>();
const activity: { at: number; text: string }[] = [];
const daily = new Map<string, { visitors: Set<string>; pageviews: number; whatsapp: number; cartAdds: number }>();

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|headless|curl|wget|python|httpclient/i;

export function isBot(userAgent: string | null): boolean {
  return !userAgent || BOT.test(userAgent);
}

function nairobiDay(t = Date.now()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(t));
}

function today() {
  const key = nairobiDay();
  let d = daily.get(key);
  if (!d) {
    d = { visitors: new Set(), pageviews: 0, whatsapp: 0, cartAdds: 0 };
    daily.set(key, d);
    for (const k of daily.keys()) if (k < nairobiDay(Date.now() - 2 * 86_400_000)) daily.delete(k);
  }
  return d;
}

/** Where the visit came from, from the first referrer or utm_source of the session. */
export function sourceLabel(ref = "", utm = ""): string {
  const s = `${utm} ${ref}`.toLowerCase();
  if (!s.trim() || s.includes("gadgethubke.com")) return "Direct";
  if (/google/.test(s)) return "Google";
  if (/instagram/.test(s)) return "Instagram";
  if (/facebook|fb\.|m\.facebook/.test(s)) return "Facebook";
  if (/tiktok/.test(s)) return "TikTok";
  if (/whatsapp|wa\.me/.test(s)) return "WhatsApp";
  if (/bing/.test(s)) return "Bing";
  if (/t\.co|twitter|x\.com/.test(s)) return "X (Twitter)";
  if (/youtube/.test(s)) return "YouTube";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return utm || "Other";
  }
}

function log(text: string) {
  activity.unshift({ at: Date.now(), text });
  if (activity.length > 40) activity.length = 40;
}

const clip = (s: unknown, n: number) => String(s ?? "").slice(0, n);
const shortId = (vid: string) => vid.replace(/[^a-z0-9]/gi, "").slice(-4).toUpperCase();

export function recordHit(hit: Hit) {
  const vid = clip(hit.vid, 64);
  if (!vid) return;
  const now = Date.now();
  const path = clip(hit.path, 200) || "/";
  const title = clip(hit.title, 120).replace(/\s*[|–-]\s*Gadget ?Hub.*$/i, "") || path;
  let v = visitors.get(vid);

  if (hit.event === "leave") {
    if (v) v.lastSeen = now - ACTIVE_MS - 1;
    return;
  }

  const isNew = !v;
  if (!v) {
    v = {
      id: vid,
      firstSeen: now,
      lastSeen: now,
      path,
      title,
      source: sourceLabel(clip(hit.ref, 300), clip(hit.utm, 60)),
      device: hit.device === "Phone" || hit.device === "Tablet" ? hit.device : "Computer",
      bagCount: 0,
    };
    visitors.set(vid, v);
  }
  const changedPage = v.path !== path;
  v.lastSeen = now;
  v.path = path;
  v.title = title;
  v.bagCount = Math.max(0, Math.min(99, Number(hit.bagCount) || 0));

  const d = today();
  d.visitors.add(vid);
  if (hit.event === "cart_add") {
    d.cartAdds += 1;
    log(`Visitor ${shortId(vid)} added ${clip(hit.label, 60) || "an item"} to the cart`);
  } else if (hit.event === "whatsapp") {
    d.whatsapp += 1;
    log(`Visitor ${shortId(vid)} tapped WhatsApp on ${title}`);
  } else if (isNew || changedPage) {
    d.pageviews += 1;
    log(`Visitor ${shortId(vid)} opened ${title}`);
  }

  // Forget visitors gone for more than an hour.
  if (visitors.size > 500) {
    for (const [k, x] of visitors) if (now - x.lastSeen > 3_600_000) visitors.delete(k);
  }
}

const PRODUCT = /^\/(iphone|ipad|mac|watch|airpods|tv-home|accessories|shop)\/[^/]+/;

function ago(ms: number) {
  const s = Math.round(ms / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

function duration(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

export type LiveSnapshot = ReturnType<typeof liveSnapshot>;

export function liveSnapshot() {
  const now = Date.now();
  const active = [...visitors.values()].filter((v) => now - v.lastSeen <= ACTIVE_MS).sort((a, b) => b.lastSeen - a.lastSeen);
  const recent = [...visitors.values()].filter((v) => now - v.lastSeen <= RECENT_MS);
  const count = <T,>(rows: T[], key: (r: T) => string) => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(key(r), (m.get(key(r)) || 0) + 1);
    return [...m.entries()].map(([label, n]) => ({ label, count: n })).sort((a, b) => b.count - a.count);
  };
  const d = today();
  return {
    now: active.length,
    last5Min: recent.length,
    lookingAtProduct: active.filter((v) => PRODUCT.test(v.path)).length,
    inCart: active.filter((v) => v.bagCount > 0).length,
    atCheckout: active.filter((v) => v.path.startsWith("/checkout")).length,
    devices: { Phone: active.filter((v) => v.device === "Phone").length, Tablet: active.filter((v) => v.device === "Tablet").length, Computer: active.filter((v) => v.device === "Computer").length },
    visitors: active.slice(0, 50).map((v) => ({ id: shortId(v.id), device: v.device, page: v.title, path: v.path, from: v.source, onSite: duration(now - v.firstSeen) })),
    sources: count(active, (v) => v.source),
    pages: count(active, (v) => v.title).slice(0, 8),
    activity: activity.filter((a) => now - a.at <= 30 * 60_000).slice(0, 20).map((a) => ({ when: ago(now - a.at), text: a.text })),
    today: { visitors: d.visitors.size, pageviews: d.pageviews, whatsapp: d.whatsapp, cartAdds: d.cartAdds },
    updatedAt: new Date(now).toISOString(),
  };
}
