/**
 * Present checkout orders in the management UI (labels, filters, relative time).
 */
import type { CheckoutOrder, FulfillmentStatus, OrderStatus } from "../checkout/types";

export type MgmtOrderLabel =
  | "New"
  | "Confirmed"
  | "Dispatched"
  | "Delivered"
  | "Cancelled"
  | "Failed"
  | "Awaiting payment";

export type MgmtOrderRow = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  item: string;
  total: string;
  totalKes: number;
  payment: string;
  from: string;
  status: MgmtOrderLabel;
  fulfillment?: FulfillmentStatus;
  placed: string;
  placedAt: string;
  notes?: string;
  items: CheckoutOrder["items"];
  raw: CheckoutOrder;
};

function formatKes(n: number) {
  return `KES ${n.toLocaleString("en-KE")}`;
}

function relativeTime(iso: string) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return iso;
  const diffSec = Math.round((Date.now() - t) / 1000);
  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86_400) return `${Math.floor(diffSec / 3600)} hr ago`;
  if (diffSec < 172_800) return "Yesterday";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "Africa/Nairobi",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function itemSummary(order: CheckoutOrder) {
  if (!order.items.length) return "—";
  const first = order.items[0];
  const bits = [first.name, first.storage, first.colour].filter(Boolean);
  const base = bits.join(" · ");
  if (order.items.length === 1) return base;
  return `${base} +${order.items.length - 1} more`;
}

function paymentLabel(order: CheckoutOrder) {
  if (order.paymentMethod === "mpesa") return "M-Pesa";
  if (order.paymentMethod === "card") return "Card";
  if (order.status === "pending") return "Not started";
  return "—";
}

export function mgmtStatus(order: CheckoutOrder): MgmtOrderLabel {
  if (order.status === "cancelled") return "Cancelled";
  if (order.status === "failed") return "Failed";
  if (order.status === "awaiting_payment") return "Awaiting payment";
  if (order.status === "pending") return "New";
  if (order.status === "paid") {
    if (order.fulfillmentStatus === "delivered") return "Delivered";
    if (order.fulfillmentStatus === "dispatched") return "Dispatched";
    return "Confirmed";
  }
  return "New";
}

export function toMgmtRow(order: CheckoutOrder): MgmtOrderRow {
  return {
    id: order.id,
    customer: order.customer.name || "—",
    phone: order.customer.phone || "",
    email: order.customer.email || "",
    item: itemSummary(order),
    total: formatKes(order.subtotalKes),
    totalKes: order.subtotalKes,
    payment: paymentLabel(order),
    from: "Website",
    status: mgmtStatus(order),
    fulfillment: order.fulfillmentStatus,
    placed: relativeTime(order.createdAt),
    placedAt: order.createdAt,
    notes: order.adminNotes || order.customer.notes,
    items: order.items,
    raw: order,
  };
}

export function filterByTab(rows: MgmtOrderRow[], tab: string) {
  const t = tab.toLowerCase();
  if (t === "all" || !t) return rows;
  if (t === "new") return rows.filter((r) => r.status === "New" || r.status === "Awaiting payment");
  if (t === "confirmed") return rows.filter((r) => r.status === "Confirmed");
  if (t === "dispatched") return rows.filter((r) => r.status === "Dispatched");
  if (t === "delivered") return rows.filter((r) => r.status === "Delivered");
  if (t === "cancelled") return rows.filter((r) => r.status === "Cancelled" || r.status === "Failed");
  return rows;
}

export function countByTab(rows: MgmtOrderRow[]) {
  return {
    new: rows.filter((r) => r.status === "New" || r.status === "Awaiting payment").length,
    confirmed: rows.filter((r) => r.status === "Confirmed").length,
    dispatched: rows.filter((r) => r.status === "Dispatched").length,
    delivered: rows.filter((r) => r.status === "Delivered").length,
    cancelled: rows.filter((r) => r.status === "Cancelled" || r.status === "Failed").length,
  };
}

export function isNairobiToday(iso: string) {
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Nairobi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return fmt.format(new Date(iso)) === fmt.format(new Date());
  } catch {
    return iso.slice(0, 10) === new Date().toISOString().slice(0, 10);
  }
}

export function isNairobiYesterday(iso: string) {
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Nairobi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return fmt.format(new Date(iso)) === fmt.format(y);
  } catch {
    return false;
  }
}

export function withinLastDays(iso: string, days: number) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return false;
  return Date.now() - t <= days * 86_400_000;
}

export function orderStatusPatch(
  action: "confirm" | "dispatch" | "deliver" | "cancel",
): Partial<Pick<CheckoutOrder, "status" | "fulfillmentStatus">> {
  if (action === "cancel") return { status: "cancelled" satisfies OrderStatus };
  if (action === "confirm") return { fulfillmentStatus: "confirmed" };
  if (action === "dispatch") return { fulfillmentStatus: "dispatched" };
  return { fulfillmentStatus: "delivered" };
}
