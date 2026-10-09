import { listOrders } from "../checkout/orders";
import { journalStatusCounts, listJournalPosts } from "../journal";
import { listLipaPlans } from "./lipa";
import {
  countByTab,
  isNairobiToday,
  isNairobiYesterday,
  toMgmtRow,
} from "./orders-view";
import { listTradeIns } from "./trade-ins";

export async function buildDashboard() {
  const [orders, tradeIns, lipa, journal] = await Promise.all([
    listOrders(),
    listTradeIns(),
    listLipaPlans(),
    listJournalPosts(),
  ]);

  const rows = orders.map(toMgmtRow);
  const counts = countByTab(rows);
  const todayOrders = orders.filter((o) => isNairobiToday(o.createdAt));
  const yesterdayOrders = orders.filter((o) => isNairobiYesterday(o.createdAt));
  const paidToday = todayOrders.filter((o) => o.status === "paid");
  const salesTodayKes = paidToday.reduce((sum, o) => sum + o.subtotalKes, 0);
  const waitingQuote = tradeIns.filter((t) => t.status === "Waiting for quote").length;
  const lipaDue = lipa.filter((p) => p.status === "Due today").length;
  const lipaMissed = lipa.filter((p) => p.status === "Missed").length;
  const jCounts = journalStatusCounts(journal);

  const attention: { count: number; label: string; href: string; badge?: string }[] = [];
  if (counts.new > 0) {
    attention.push({
      count: counts.new,
      label: "Orders waiting to be confirmed",
      href: "/management/orders?status=new",
      badge: `${counts.new} new`,
    });
  }
  if (waitingQuote > 0) {
    attention.push({
      count: waitingQuote,
      label: "Trade-in requests without a quote",
      href: "/management/trade-ins",
    });
  }
  if (lipaDue > 0) {
    attention.push({
      count: lipaDue,
      label: "Lipa Mdogo Mdogo payments due today",
      href: "/management/lipa?filter=due",
    });
  }
  if (lipaMissed > 0) {
    attention.push({
      count: lipaMissed,
      label: "Installments missed",
      href: "/management/lipa?filter=missed",
    });
  }
  if (jCounts.review > 0) {
    attention.push({
      count: jCounts.review,
      label: "Journal drafts waiting for review",
      href: "/management/journal?status=review",
    });
  }

  return {
    visitorsNow: 0,
    visitorsLast5Min: 0,
    phones: 0,
    computers: 0,
    tablets: 0,
    ordersToday: todayOrders.length,
    ordersDelta: todayOrders.length - yesterdayOrders.length,
    salesTodayKes,
    whatsappClicks: 0,
    tradeInRequests: tradeIns.length,
    tradeInsWaitingQuote: waitingQuote,
    attention,
    pagesNow: [] as { label: string; count: number }[],
    latestOrders: rows.slice(0, 8).map((o) => ({
      id: o.id,
      customer: o.customer,
      item: o.item,
      total: o.total,
      payment: o.payment,
      status: o.status,
    })),
    liveReady: false,
  };
}
