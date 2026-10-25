/**
 * Contact, newsletter and track-order messages from the site's WhatsApp forms.
 * Saved before WhatsApp opens so nothing is lost if the customer never hits Send.
 */
import { kvGetJson, kvSetJson } from "../admin/kv";

export type ContactKind = "contact" | "newsletter" | "track";

export type ContactMessage = {
  id: string;
  kind: ContactKind;
  name: string;
  phone: string;
  topic?: string;
  message?: string;
  orderRef?: string;
  createdAt: string;
};

const KEY = "gh:contact-messages:v1";

function clip(s: unknown, max: number) {
  return String(s ?? "").trim().slice(0, max);
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const rows = await kvGetJson<ContactMessage[]>(KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export async function addContactMessage(input: Record<string, unknown>): Promise<ContactMessage> {
  const kind: ContactKind = input.kind === "newsletter" || input.kind === "track" ? input.kind : "contact";
  const row: ContactMessage = {
    id: `MSG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    kind,
    name: clip(input.name, 80),
    phone: clip(input.phone, 30),
    topic: clip(input.topic, 80) || undefined,
    message: clip(input.message, 2000) || undefined,
    orderRef: clip(input.ref, 60) || undefined,
    createdAt: new Date().toISOString(),
  };
  if (row.name.length < 2) throw new Error("Enter your name.");
  if (row.phone.replace(/\D/g, "").length < 9) throw new Error("Enter a valid phone number.");
  const rows = await listContactMessages();
  await kvSetJson(KEY, [row, ...rows].slice(0, 2000));
  return row;
}
