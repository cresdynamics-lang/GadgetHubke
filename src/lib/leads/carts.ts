/**
 * Abandoned-cart / in-progress checkout contacts for staff follow-up.
 * Stores name, email, phone and bag items only — never passwords.
 */
import { kvGetJson, kvSetJson } from "../admin/kv";
import { trySendMail } from "../mail/smtp";
import { cartFollowUpNoticeToShop } from "../mail/templates";
import { site } from "../site";

export type CartLeadItem = {
  id?: string;
  name: string;
  qty: number;
  kes: number;
  href?: string;
};

export type CartLead = {
  id: string;
  visitorId: string;
  name?: string;
  email?: string;
  phone?: string;
  items: CartLeadItem[];
  totalKes: number;
  source: "cart" | "checkout" | "account";
  href?: string;
  createdAt: string;
  updatedAt: string;
  notifiedAt?: string;
  convertedOrderId?: string;
};

const KEY = "gh:cart-leads:v1";

function clip(s: string, max = 120) {
  return s.trim().slice(0, max);
}

function digits(s: string) {
  return s.replace(/\D/g, "").slice(-12);
}

function newId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CL-${stamp}-${rand}`;
}

async function readAll(): Promise<CartLead[]> {
  const rows = await kvGetJson<CartLead[]>(KEY, []);
  return Array.isArray(rows) ? rows : [];
}

async function writeAll(rows: CartLead[]) {
  await kvSetJson(KEY, rows.slice(0, 800));
}

function samePerson(a: CartLead, visitorId: string, email?: string, phone?: string) {
  if (visitorId && a.visitorId === visitorId) return true;
  if (email && a.email && a.email.toLowerCase() === email.toLowerCase()) return true;
  if (phone && a.phone && digits(a.phone) && digits(a.phone) === digits(phone)) return true;
  return false;
}

export async function listCartLeads(): Promise<CartLead[]> {
  const rows = await readAll();
  return rows.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function upsertCartLead(input: {
  visitorId: string;
  name?: string;
  email?: string;
  phone?: string;
  items: CartLeadItem[];
  source?: CartLead["source"];
  href?: string;
}): Promise<CartLead | null> {
  const visitorId = clip(input.visitorId || "", 80);
  const name = clip(input.name || "");
  const email = clip((input.email || "").toLowerCase());
  const phone = clip(input.phone || "", 32);
  const items = (input.items || [])
    .filter((i) => i && String(i.name || "").trim())
    .slice(0, 30)
    .map((i) => ({
      id: clip(String(i.id || ""), 80) || undefined,
      name: clip(String(i.name || "Item"), 160),
      qty: Math.max(1, Math.min(99, Number(i.qty) || 1)),
      kes: Math.max(0, Math.round(Number(i.kes) || 0)),
      href: i.href ? clip(String(i.href), 200) : undefined,
    }));

  if (!visitorId && !email && !phone) return null;
  if (!items.length && !email && !phone) return null;

  const totalKes = items.reduce((n, i) => n + i.kes * i.qty, 0);
  const now = new Date().toISOString();
  const all = await readAll();
  const idx = all.findIndex((row) => samePerson(row, visitorId, email, phone) && !row.convertedOrderId);
  const prev = idx >= 0 ? all[idx] : null;
  const next: CartLead = {
    id: prev?.id || newId(),
    visitorId: visitorId || prev?.visitorId || newId(),
    name: name || prev?.name,
    email: email || prev?.email,
    phone: phone || prev?.phone,
    items: items.length ? items : prev?.items || [],
    totalKes: items.length ? totalKes : prev?.totalKes || 0,
    source: input.source || prev?.source || "cart",
    href: input.href || prev?.href,
    createdAt: prev?.createdAt || now,
    updatedAt: now,
    notifiedAt: prev?.notifiedAt,
    convertedOrderId: prev?.convertedOrderId,
  };

  if (idx >= 0) all[idx] = next;
  else all.unshift(next);
  await writeAll(all);

  const hasContact = Boolean(next.email || next.phone);
  if (hasContact && !next.notifiedAt && !next.convertedOrderId && next.items.length) {
    try {
      const msg = cartFollowUpNoticeToShop({
        name: next.name,
        phone: next.phone,
        email: next.email,
        items: next.items,
        totalKes: next.totalKes,
        href: next.href,
      });
      const sent = await trySendMail({
        to: site.email,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      });
      if (sent.ok) {
        next.notifiedAt = new Date().toISOString();
        const fresh = await readAll();
        const nidx = fresh.findIndex((r) => r.id === next.id);
        if (nidx >= 0) {
          fresh[nidx] = { ...fresh[nidx], notifiedAt: next.notifiedAt };
          await writeAll(fresh);
        }
      }
    } catch (e) {
      console.error("[cart-lead-mail]", e);
    }
  }

  return next;
}

export async function markLeadsConverted(input: {
  visitorId?: string;
  email?: string;
  phone?: string;
  orderId: string;
}) {
  const all = await readAll();
  let changed = false;
  const now = new Date().toISOString();
  for (const row of all) {
    if (row.convertedOrderId) continue;
    const match =
      (input.visitorId && row.visitorId === input.visitorId) ||
      (input.email && row.email && row.email.toLowerCase() === input.email.toLowerCase()) ||
      (input.phone && row.phone && digits(row.phone) === digits(input.phone));
    if (!match) continue;
    row.convertedOrderId = input.orderId;
    row.updatedAt = now;
    changed = true;
  }
  if (changed) await writeAll(all);
}
