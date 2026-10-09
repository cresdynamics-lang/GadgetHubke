import { currentStaff } from "./staff";

/** Sample / fallback data for management UI until live stores are wired. */


/** Signed-in chrome — from env, not dummy people. */
export const sampleStaff = currentStaff();

export const sampleDashboard = {
  visitorsNow: 28,
  visitorsLast5Min: 28,
  phones: 19,
  computers: 8,
  tablets: 1,
  ordersToday: 9,
  ordersDelta: 3,
  salesTodayKes: 412_000,
  whatsappClicks: 37,
  tradeInRequests: 4,
  tradeInsWaitingQuote: 2,
  attention: [
    { count: 3, label: "Orders waiting to be confirmed", href: "/management/orders?status=new", badge: "3 new" },
    { count: 2, label: "Trade-in requests without a quote", href: "/management/trade-ins" },
    { count: 5, label: "Lipa Mdogo Mdogo payments due today", href: "/management/lipa" },
    { count: 2, label: "Installments missed", href: "/management/lipa?filter=missed" },
    { count: 2, label: "Journal drafts waiting for review", href: "/management/journal?status=review" },
  ],
  pagesNow: [
    { label: "iPhone 16 Pro", count: 9 },
    { label: "Home", count: 6 },
    { label: "MacBook Air", count: 5 },
    { label: "Trade-in form", count: 3 },
    { label: "Lipa Mdogo Mdogo", count: 2 },
  ],
  latestOrders: [
    { id: "#1042", customer: "Customer", item: "iPhone 15 Pro", total: "KES 168,000", payment: "M-Pesa", status: "New" },
    { id: "#1041", customer: "Mercy A.", item: "AirPods Pro", total: "KES 29,500", payment: "On delivery", status: "Confirmed" },
    { id: "#1040", customer: "Kevin O.", item: "MacBook Air", total: "KES 134,000", payment: "Lipa Mdogo Mdogo", status: "Dispatched" },
    { id: "#1039", customer: "Joy W.", item: "iPad Air", total: "KES 92,000", payment: "M-Pesa", status: "Delivered" },
  ],
};

export const sampleLive = {
  now: 28,
  lookingAtProduct: 17,
  inCart: 3,
  atCheckout: 1,
  visitors: [
    { id: "4F2A", town: "Nairobi", device: "Phone", page: "iPhone 16 Pro", from: "Instagram", onSite: "2m 14s" },
    { id: "91C7", town: "Mombasa", device: "Phone", page: "Home", from: "Google", onSite: "0m 48s" },
    { id: "2B0E", town: "Nairobi", device: "Computer", page: "MacBook Air", from: "Google", onSite: "6m 02s" },
    { id: "7D31", town: "Kisumu", device: "Phone", page: "Trade-in form", from: "WhatsApp", onSite: "3m 40s" },
    { id: "C85A", town: "Nakuru", device: "Phone", page: "Lipa Mdogo Mdogo", from: "Direct", onSite: "1m 05s" },
    { id: "0E69", town: "Nairobi", device: "Tablet", page: "iPad Air", from: "TikTok", onSite: "4m 31s" },
    { id: "A413", town: "Eldoret", device: "Phone", page: "AirPods Pro", from: "Google", onSite: "0m 22s" },
  ],
  sources: [
    { label: "Google", count: 11 },
    { label: "Instagram", count: 7 },
    { label: "TikTok", count: 4 },
    { label: "WhatsApp", count: 3 },
    { label: "Direct", count: 3 },
  ],
  activity: [
    { when: "just now", text: "Visitor 4F2A opened iPhone 16 Pro" },
    { when: "12s ago", text: "Visitor 7D31 started the Trade-in form" },
    { when: "40s ago", text: "Visitor 2B0E tapped Order on WhatsApp" },
    { when: "1m ago", text: "Visitor 0E69 added iPad Air to the cart" },
    { when: "2m ago", text: "Visitor C85A read Lipa Mdogo Mdogo" },
  ],
  pages: [
    { path: "/iphone/iphone-16-pro", count: 9 },
    { path: "/ (home)", count: 6 },
    { path: "/mac/macbook-air", count: 5 },
    { path: "/trade-in", count: 3 },
    { path: "/lipa-mdogo-mdogo", count: 2 },
  ],
};

export const sampleOrders = [
  { id: "#1042", customer: "Customer", item: "iPhone 15 Pro · 256 GB", total: "KES 168,000", payment: "M-Pesa", from: "Website", status: "New", placed: "2 min ago" },
  { id: "#1041", customer: "Mercy A.", item: "AirPods Pro", total: "KES 29,500", payment: "On delivery", from: "WhatsApp", status: "Confirmed", placed: "25 min ago" },
  { id: "#1040", customer: "Kevin O.", item: "MacBook Air · 13\"", total: "KES 134,000", payment: "Lipa Mdogo Mdogo", from: "Website", status: "Dispatched", placed: "1 hr ago" },
  { id: "#1039", customer: "Joy W.", item: "iPad Air · 256 GB", total: "KES 92,000", payment: "M-Pesa", from: "Website", status: "Delivered", placed: "3 hrs ago" },
  { id: "#1038", customer: "Peter N.", item: "iPhone 13 · 128 GB", total: "KES 78,000", payment: "On delivery", from: "WhatsApp", status: "New", placed: "4 hrs ago" },
  { id: "#1037", customer: "Faith M.", item: "MagSafe Charger", total: "KES 6,500", payment: "M-Pesa", from: "Website", status: "Delivered", placed: "Yesterday" },
  { id: "#1036", customer: "Dennis L.", item: "iPhone 16 Pro · 512 GB", total: "KES 189,000", payment: "Lipa Mdogo Mdogo", from: "WhatsApp", status: "Confirmed", placed: "Yesterday" },
  { id: "#1035", customer: "Grace T.", item: "HomePod mini", total: "KES 14,500", payment: "M-Pesa", from: "Website", status: "Cancelled", placed: "2 days ago" },
];

export const sampleTradeIns = [
  { id: "TI-204", customer: "Customer", device: "iPhone 13 Pro · 256 GB", status: "Waiting for quote", submitted: "12 min ago" },
  { id: "TI-203", customer: "Ann W.", device: "Samsung S23 · 128 GB", status: "Quoted", submitted: "1 hr ago", quote: "KES 42,000" },
  { id: "TI-202", customer: "Customer", device: "iPhone 12 · 64 GB", status: "Credit applied", submitted: "Yesterday", quote: "KES 28,000" },
  { id: "TI-201", customer: "Grace T.", device: "iPhone 14 · 128 GB", status: "Waiting for quote", submitted: "Yesterday" },
];

export const sampleSales = {
  rangeLabel: "Last 7 days",
  revenueKes: 2_480_000,
  orders: 54,
  avgOrderKes: 45_926,
  paymentMix: [
    { label: "M-Pesa", pct: 58 },
    { label: "On delivery", pct: 22 },
    { label: "Lipa Mdogo Mdogo", pct: 20 },
  ],
  topProducts: [
    { name: "iPhone 16 Pro", units: 12, revenue: "KES 2,160,000" },
    { name: "MacBook Air", units: 8, revenue: "KES 1,072,000" },
    { name: "AirPods Pro", units: 15, revenue: "KES 442,500" },
  ],
  byStaff: [] as { name: string; orders: number; revenue: string }[],
};

export const sampleLipa = [
  { id: "LP-88", customer: "Kevin O.", device: "MacBook Air", status: "On track", nextDue: "Today", remaining: "KES 96,000" },
  { id: "LP-87", customer: "Dennis L.", device: "iPhone 16 Pro", status: "Due today", nextDue: "Today", remaining: "KES 140,000" },
  { id: "LP-86", customer: "Mercy A.", device: "iPad Air", status: "Missed", nextDue: "2 days ago", remaining: "KES 54,000" },
  { id: "LP-85", customer: "Joy W.", device: "iPhone 15", status: "On track", nextDue: "12 Oct", remaining: "KES 72,000" },
];

/** Live staff invites are not wired yet — keep empty (no dummy people). */
export const sampleStaffList: { name: string; email: string; role: string; status: string }[] = [];
