import { listOrders } from "../checkout/orders";
import { withinLastDays } from "./orders-view";

function formatKes(n: number) {
  return `KES ${n.toLocaleString("en-KE")}`;
}

export async function buildSales(days = 7) {
  const orders = (await listOrders()).filter(
    (o) => o.status === "paid" && withinLastDays(o.paidAt || o.createdAt, days),
  );

  const revenueKes = orders.reduce((s, o) => s + o.subtotalKes, 0);
  const avgOrderKes = orders.length ? Math.round(revenueKes / orders.length) : 0;

  const methodCounts = new Map<string, number>();
  for (const o of orders) {
    const label = o.paymentMethod === "card" ? "Card" : o.paymentMethod === "mpesa" ? "M-Pesa" : "Other";
    methodCounts.set(label, (methodCounts.get(label) || 0) + 1);
  }
  const paymentMix = [...methodCounts.entries()]
    .map(([label, count]) => ({
      label,
      pct: orders.length ? Math.round((count / orders.length) * 100) : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  const productMap = new Map<string, { units: number; revenue: number }>();
  for (const o of orders) {
    for (const item of o.items) {
      const cur = productMap.get(item.name) || { units: 0, revenue: 0 };
      cur.units += item.qty;
      cur.revenue += item.kes * item.qty;
      productMap.set(item.name, cur);
    }
  }
  const topProducts = [...productMap.entries()]
    .map(([name, v]) => ({ name, units: v.units, revenue: formatKes(v.revenue) }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 8);

  return {
    rangeLabel: `Last ${days} days`,
    revenueKes,
    orders: orders.length,
    avgOrderKes,
    paymentMix,
    topProducts,
    byStaff: [] as { name: string; orders: number; revenue: string }[],
  };
}
