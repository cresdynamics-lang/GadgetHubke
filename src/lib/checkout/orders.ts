/**
 * Pending/paid checkout orders.
 * Uses Upstash when configured; otherwise .data/checkout-orders.json locally.
 */
import fs from "node:fs";
import path from "node:path";
import type { BagItem, CheckoutCustomer, CheckoutOrder, OrderStatus, PaymentMethod } from "./types";
import { bagTotal } from "./bag";

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
}): Promise<CheckoutOrder> {
  if (!input.items.length) throw new Error("Cart is empty.");
  const now = new Date().toISOString();
  const order: CheckoutOrder = {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    status: "pending",
    items: input.items,
    customer: input.customer,
    subtotalKes: bagTotal(input.items),
    currency: "KES",
    paymentProvider: "stanbic",
  };
  const all = await readAll();
  all.unshift(order);
  await writeAll(all.slice(0, 500));
  return order;
}

export async function getOrder(id: string): Promise<CheckoutOrder | null> {
  const all = await readAll();
  return all.find((o) => o.id === id) || null;
}

export async function updateOrder(
  id: string,
  patch: Partial<
    Pick<
      CheckoutOrder,
      "status" | "paymentMethod" | "paymentRef" | "mock" | "paidAt" | "error" | "updatedAt"
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
  return updateOrder(id, {
    status: "paid",
    paymentRef: paymentRef,
    paidAt: new Date().toISOString(),
    error: undefined,
  });
}

export async function markFailed(id: string, error: string) {
  return updateOrder(id, {
    status: "failed" satisfies OrderStatus,
    error,
  });
}

export function publicOrder(order: CheckoutOrder) {
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
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    paymentProvider: order.paymentProvider,
    mock: order.mock,
    paidAt: order.paidAt,
    createdAt: order.createdAt,
    error: order.error,
  };
}
