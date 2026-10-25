/** Shared checkout / bag types */

export type BagItem = {
  id: string;
  /** Meta / Google catalogue retailer id (must match feed `id`) */
  catalogId?: string;
  sheetId?: string;
  name: string;
  colour?: string;
  storage?: string;
  chip?: string;
  memory?: string;
  size?: string;
  material?: string;
  connectivity?: string;
  connector?: string | null;
  partNumber?: string | null;
  caseOption?: string;
  pair?: string;
  band?: string;
  extras?: string;
  deviceFor?: string | null;
  kind?: string | null;
  channel?: string;
  kes: number;
  image?: string;
  href?: string;
  qty: number;
};

export type Fulfillment = "pickup" | "delivery";

export type PaymentMethod = "mpesa" | "card";

/** What the customer is settling — drives invoice/receipt copy and the amount due today. */
export type OrderIntent = "purchase" | "lipa";

export type LipaTerms = {
  depositPct: number;
  months: number;
  catalogKes: number;
  depositKes: number;
  remainingKes: number;
};

export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "failed"
  | "cancelled";

/** Staff-side progress after payment (management Orders). */
export type FulfillmentStatus = "confirmed" | "dispatched" | "delivered";

export type CheckoutCustomer = {
  name: string;
  phone: string;
  email: string;
  fulfillment: Fulfillment;
  /** Area / estate, building and landmark — required for delivery. */
  deliveryAddress?: string;
  notes?: string;
  mpesaPhone?: string;
};

export type CheckoutOrder = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  items: BagItem[];
  customer: CheckoutCustomer;
  /** Amount due today (full purchase, or Lipa deposit). */
  subtotalKes: number;
  /** Full cart value before Lipa split. Defaults to subtotalKes for purchases. */
  catalogKes?: number;
  intent?: OrderIntent;
  lipa?: LipaTerms;
  currency: "KES";
  paymentMethod?: PaymentMethod;
  paymentRef?: string;
  paymentProvider: "stanbic";
  mock?: boolean;
  paidAt?: string;
  error?: string;
  invoiceSentAt?: string;
  receiptSentAt?: string;
  fulfillmentStatus?: FulfillmentStatus;
  adminNotes?: string;
};

export const BAG_KEY = "gh-bag";
export const BAG_LEGACY_KEYS = ["gh-iphone-bag", "gh-cart"] as const;
export const EXPRESS_KEY = "gh-checkout-express";
export const RECENT_ORDER_KEY = "gh-recent-order";
