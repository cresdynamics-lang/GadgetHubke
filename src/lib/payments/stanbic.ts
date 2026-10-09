/**
 * Stanbic Bank Kenya payment adapter.
 * - Live: OAuth + STK Push / card session when credentials exist
 * - Sandbox/mock: deterministic success path for UX demos
 *
 * Portal: https://sandbox.stanbicbank.co.ke/
 */

export type StanbicMode = "live" | "sandbox" | "mock";

export function paymentsMode(): StanbicMode {
  const forced = (process.env.PAYMENTS_MODE || "").toLowerCase();
  if (forced === "live" || forced === "sandbox" || forced === "mock") return forced;
  if (
    process.env.STANBIC_CLIENT_ID &&
    process.env.STANBIC_CLIENT_SECRET &&
    process.env.STANBIC_BILL_ACCOUNT_REF
  ) {
    return "sandbox";
  }
  return "mock";
}

export function toMsisdn(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length >= 12) return digits.slice(0, 12);
  if (digits.startsWith("0") && digits.length >= 10) return `254${digits.slice(1, 10)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

type TokenCache = { token: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) {
    return tokenCache.token;
  }
  const base = process.env.STANBIC_API_BASE || "https://sandbox.stanbicbank.co.ke";
  const id = process.env.STANBIC_CLIENT_ID!;
  const secret = process.env.STANBIC_CLIENT_SECRET!;
  const res = await fetch(`${base.replace(/\/$/, "")}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new Error(`Stanbic auth failed (${res.status})`);
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("Stanbic auth missing access_token");
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in) || 3600) * 1000,
  };
  return data.access_token;
}

export type StkResult = {
  ok: boolean;
  mock: boolean;
  reference: string;
  message: string;
  raw?: unknown;
};

export async function initiateStkPush(input: {
  orderId: string;
  amountKes: number;
  mobileNumber: string;
}): Promise<StkResult> {
  const mode = paymentsMode();
  const msisdn = toMsisdn(input.mobileNumber);
  if (!/^2547\d{8}$/.test(msisdn) && !/^2541\d{8}$/.test(msisdn)) {
    throw new Error("Enter a valid Safaricom M-Pesa number (07… or 01…).");
  }
  if (input.amountKes < 1) throw new Error("Invalid amount.");

  if (mode === "mock") {
    return {
      ok: true,
      mock: true,
      reference: `MOCK-STK-${input.orderId}`,
      message: "Sandbox mock STK sent. Approve on your phone (auto-confirms in a few seconds).",
    };
  }

  const base = process.env.STANBIC_API_BASE || "https://sandbox.stanbicbank.co.ke";
  const billAccountRef = process.env.STANBIC_BILL_ACCOUNT_REF!;
  const token = await getAccessToken();

  // Path may vary by Stanbic product subscription — owner confirms exact route after onboarding.
  const url =
    process.env.STANBIC_STK_PATH ||
    `${base.replace(/\/$/, "")}/api/v1/payments/stk-push`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      billAccountRef,
      amount: String(Math.round(input.amountKes)),
      mobileNumber: msisdn,
      externalReference: input.orderId,
    }),
  });

  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof (raw as { message?: string }).message === "string"
        ? (raw as { message: string }).message
        : `Stanbic STK failed (${res.status})`,
    );
  }

  const reference =
    String(
      (raw as { transactionId?: string; reference?: string; ConversationID?: string })
        .transactionId ||
        (raw as { reference?: string }).reference ||
        (raw as { ConversationID?: string }).ConversationID ||
        `STK-${input.orderId}`,
    );

  return {
    ok: true,
    mock: false,
    reference,
    message: "STK push sent. Enter your M-Pesa PIN on your phone.",
    raw,
  };
}

export type CardSessionResult = {
  ok: boolean;
  mock: boolean;
  reference: string;
  redirectUrl: string;
  message: string;
};

export async function initiateCardSession(input: {
  orderId: string;
  amountKes: number;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<CardSessionResult> {
  const mode = paymentsMode();
  if (input.amountKes < 1) throw new Error("Invalid amount.");

  if (mode === "mock") {
    const reference = `MOCK-CARD-${input.orderId}`;
    const redirectUrl = `${input.returnUrl}${input.returnUrl.includes("?") ? "&" : "?"}order=${encodeURIComponent(input.orderId)}&ref=${encodeURIComponent(reference)}&mock=1`;
    return {
      ok: true,
      mock: true,
      reference,
      redirectUrl,
      message: "Sandbox mock card session — confirming without a bank redirect.",
    };
  }

  const base = process.env.STANBIC_API_BASE || "https://sandbox.stanbicbank.co.ke";
  const token = await getAccessToken();
  const url =
    process.env.STANBIC_CARD_PATH ||
    `${base.replace(/\/$/, "")}/api/v1/payments/card-session`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      amount: String(Math.round(input.amountKes)),
      currency: "KES",
      externalReference: input.orderId,
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      returnUrl: input.returnUrl,
      cancelUrl: input.cancelUrl,
      billAccountRef: process.env.STANBIC_BILL_ACCOUNT_REF,
    }),
  });

  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof (raw as { message?: string }).message === "string"
        ? (raw as { message: string }).message
        : `Stanbic card session failed (${res.status})`,
    );
  }

  const redirectUrl = String(
    (raw as { redirectUrl?: string; paymentUrl?: string }).redirectUrl ||
      (raw as { paymentUrl?: string }).paymentUrl ||
      "",
  );
  if (!redirectUrl) throw new Error("Stanbic card session missing redirect URL.");

  const reference = String(
    (raw as { reference?: string; sessionId?: string }).reference ||
      (raw as { sessionId?: string }).sessionId ||
      `CARD-${input.orderId}`,
  );

  return {
    ok: true,
    mock: false,
    reference,
    redirectUrl,
    message: "Redirecting to Stanbic secure card payment.",
    ...{},
  };
}

/** Mock STK becomes paid ~4s after initiate (tracked by paymentRef timestamp in order). */
export function mockStkShouldSucceed(orderUpdatedAtIso: string, paymentRef?: string): boolean {
  if (!paymentRef?.startsWith("MOCK-STK-")) return false;
  const started = Date.parse(orderUpdatedAtIso);
  if (!Number.isFinite(started)) return false;
  return Date.now() - started >= 4000;
}
