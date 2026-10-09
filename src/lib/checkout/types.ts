/** Shared checkout / bag types */

export type BagItem = {
  id: string;
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

export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "failed"
  | "cancelled";

export type CheckoutCustomer = {
  name: string;
  phone: string;
  email: string;
  fulfillment: Fulfillment;
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
  subtotalKes: number;
  currency: "KES";
  paymentMethod?: PaymentMethod;
  paymentRef?: string;
  paymentProvider: "stanbic";
  mock?: boolean;
  paidAt?: string;
  error?: string;
};

export const BAG_KEY = "gh-bag";
export const BAG_LEGACY_KEYS = ["gh-iphone-bag", "gh-cart"] as const;
export const EXPRESS_KEY = "gh-checkout-express";
export const RECENT_ORDER_KEY = "gh-recent-order";
