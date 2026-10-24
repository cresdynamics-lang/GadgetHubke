/**
 * Pending/paid checkout orders.
 * Uses Upstash when configured; otherwise .data/checkout-orders.json locally.
 */
import fs from "node:fs";
import path from "node:path";
import { documentUrl, payUrl } from "../documents/pay-link";
import { sendInvoiceForOrder, sendReceiptForOrder } from "../mail/orders";
import type { BagItem, CheckoutCustomer, CheckoutOrder, LipaTerms, OrderIntent, OrderStatus, PaymentMethod } from "./types";
import { bagTotal } from "./bag";
import { buildLipaTerms, nairobiDay, parseIntent } from "./intent";

const REDIS_KEY = "gh:checkout-orders:v1";
const LOCAL_FILE = path.join(process.cwd(), ".data", "checkout-orders.json");

function upstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
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
  if (!res.ok) throw new Error(`Upstash failed (${res.status})`);
  return (await res.json()) as { result?: unknown };
}

function readLocal(): CheckoutOrder[] {
  try {
    if (!fs.existsSync(LOCAL_FILE)) return [];
    const parsed = JSON.parse(fs.readFileSync(LOCAL_FILE, "utf8")) as CheckoutOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(orders: CheckoutOrder[]) {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(orders, null, 2), "utf8");
}

async function readAll(): Promise<CheckoutOrder[]> {
  if (upstashConfigured()) {
    try {
      const data = await redisCommand(["GET", REDIS_KEY]);
      if (typeof data.result !== "string" || !data.result) return [];
      const parsed = JSON.parse(data.result) as CheckoutOrder[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return readLocal();
}

async function writeAll(orders: CheckoutOrder[]) {
  if (upstashConfigured()) {
    await redisCommand(["SET", REDIS_KEY, JSON.stringify(orders)]);
    return;
  }
  writeLocal(orders);
}

function newId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GH-${stamp}-${rand}`;
}

export async function createOrder(input: {
  items: BagItem[];
  customer: CheckoutCustomer;
  intent?: OrderIntent | string;
  depositPct?: number;
  months?: number;
  visitorId?: string;
}): Promise<CheckoutOrder> {
  if (!input.items.length) throw new Error("Cart is empty.");
  const now = new Date().toISOString();
  const catalogKes = bagTotal(input.items);
  const intent = parseIntent(input.intent);
  const lipa: LipaTerms | undefined =
    intent === "lipa" ? buildLipaTerms(catalogKes, input.depositPct, input.months) : undefined;
  const order: CheckoutOrder = {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    status: "pending",
    items: input.items,
    customer: input.customer,
    subtotalKes: lipa ? lipa.depositKes : catalogKes,
    catalogKes,
    intent,
    lipa,
    currency: "KES",
    paymentProvider: "stanbic",
  };
  const all = await readAll();
  all.unshift(order);
  await writeAll(all.slice(0, 500));
  try {
    const { markLeadsConverted } = await import("../leads/carts");
    await markLeadsConverted({
      visitorId: input.visitorId,
      email: input.customer.email,
      phone: input.customer.phone,
      orderId: order.id,
    });
  } catch (e) {
    console.error("[cart-lead]", e);
  }
  if (lipa) {
    try {
      const { addLipaPlan } = await import("../management/lipa");
      await addLipaPlan({
        customer: input.customer.name,
        phone: input.customer.phone,
        email: input.customer.email,
        device: input.items.map((i) => i.name).join(", ").slice(0, 160),
        nextDue: "Awaiting deposit",
        remainingKes: lipa.remainingKes,
        status: "Awaiting deposit",
        orderId: order.id,
        depositKes: lipa.depositKes,
        months: lipa.months,
        catalogKes: lipa.catalogKes,
        notes: `Checkout ${order.id} · ${lipa.depositPct}% deposit`,
      });
    } catch (e) {
      console.error("[lipa-plan]", e);
    }
  }
  try {
    const result = await sendInvoiceForOrder(order);
    if (result.ok) {
      const sentAt = new Date().toISOString();
      order.invoiceSentAt = sentAt;
      await updateOrder(order.id, { invoiceSentAt: sentAt });
    } else {
      console.error("[invoice-mail]", result.error);
    }
  } catch (e) {
    console.error("[invoice-mail]", e);
  }
  return order;
}

export async function listOrders(): Promise<CheckoutOrder[]> {
  return readAll();
}

export async function getOrder(id: string): Promise<CheckoutOrder | null> {
  const all = await readAll();
  const needle = id.trim();
  if (!needle) return null;
  return (
    all.find((o) => o.id === needle) ||
    all.find((o) => o.paymentRef && o.paymentRef === needle) ||
    null
  );
}

export async function updateOrder(
  id: string,
  patch: Partial<
    Pick<
      CheckoutOrder,
      | "status"
      | "paymentMethod"
      | "paymentRef"
      | "mock"
      | "paidAt"
      | "error"
      | "updatedAt"
      | "invoiceSentAt"
      | "receiptSentAt"
    >
  >,
): Promise<CheckoutOrder | null> {
  const all = await readAll();
  const idx = all.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  const next: CheckoutOrder = {
    ...all[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = next;
  await writeAll(all);
  return next;
}

export async function markAwaitingPayment(
  id: string,
  method: PaymentMethod,
  paymentRef: string,
  mock = false,
) {
  return updateOrder(id, {
    status: "awaiting_payment",
    paymentMethod: method,
    paymentRef,
    mock,
    error: undefined,
  });
}

export async function markPaid(id: string, paymentRef?: string) {
  const existing = await getOrder(id);
  if (existing?.status === "paid") return existing;
  const updated = await updateOrder(id, {
    status: "paid",
    paymentRef: paymentRef,
    paidAt: new Date().toISOString(),
    error: undefined,
  });
  if (updated?.intent === "lipa") {
    try {
      const { listLipaPlans, updateLipaPlan } = await import("../management/lipa");
      const plans = await listLipaPlans();
      const existing = plans.find((p) => p.orderId === updated.id);
      if (existing) {
        await updateLipaPlan(existing.id, {
          status: "On track",
          nextDue: nairobiDay(undefined, 30),
          remainingKes: updated.lipa?.remainingKes ?? existing.remainingKes,
        });
      }
    } catch (e) {
      console.error("[lipa-plan]", e);
    }
  }
  if (updated && !updated.receiptSentAt) {
    try {
      const result = await sendReceiptForOrder(updated);
      if (result.ok) {
        const sentAt = new Date().toISOString();
        updated.receiptSentAt = sentAt;
        await updateOrder(updated.id, { receiptSentAt: sentAt });
      } else {
        console.error("[receipt-mail]", result.error);
      }
    } catch (e) {
      console.error("[receipt-mail]", e);
    }
  }
  return updated;
}

export async function markFailed(id: string, error: string) {
  return updateOrder(id, {
    status: "failed" satisfies OrderStatus,
    error,
  });
}

export function publicOrder(order: CheckoutOrder) {
  const paid = order.status === "paid";
  return {
    id: order.id,
    status: order.status,
    items: order.items,
    customer: {
      name: order.customer.name,
      phone: order.customer.phone,
      email: order.customer.email,
      fulfillment: order.customer.fulfillment,
    },
    subtotalKes: order.subtotalKes,
    catalogKes: order.catalogKes ?? order.subtotalKes,
    intent: order.intent || "purchase",
    lipa: order.lipa,
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    paymentProvider: order.paymentProvider,
    mock: order.mock,
    paidAt: order.paidAt,
    createdAt: order.createdAt,
    error: order.error,
    payUrl: paid ? undefined : payUrl(order.id),
    invoiceUrl: documentUrl(order.id, "invoice"),
    receiptUrl: paid ? documentUrl(order.id, "receipt") : undefined,
    invoiceSentAt: order.invoiceSentAt,
    receiptSentAt: order.receiptSentAt,
  };
}
