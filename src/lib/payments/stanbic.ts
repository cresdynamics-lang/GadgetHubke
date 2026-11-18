/**
 * Stanbic Bank Kenya payment adapter.
 * Sandbox product: STK Push – M-Pesa Checkout only.
 * Card is not available (Stanbic email, Oct 2026).
 *
 * Portal: https://sandbox.stanbicbank.co.ke/
 * API:    https://sandbox.connect.stanbicbank.co.ke/api/sandbox/ (host from the portal's mpesa-checkout spec)
 *
 * Bank whitelist:
 * - Website: https://gadgethubke.com
 * - Server IP: 143.198.169.74
 * - Callback: https://gadgethubke.com/api/checkout/webhook
 */

import { site } from "../site";
import { readStanbicCallback } from "./stanbic-callback";
import { apiBase, liveSettingsProblem, paymentsMode, statusUrl, stkUrl, tokenUrl } from "./stanbic-config";

export { liveSettingsProblem, paymentsMode, type StanbicMode } from "./stanbic-config";

export const STANBIC_WEBHOOK_URL = `${site.url}/api/checkout/webhook`;

/** Gadget Hub Investments — Stanbic current account (bill / credit account). */
export const STANBIC_ACCOUNT_NUMBER = "0100013199528";



export function cardPaymentsEnabled(): boolean {
  return false;
}

/** App-side readiness — no secrets. True when STK can be attempted against Stanbic. */
export function paymentsReady() {
  const mode = paymentsMode();
  const hasCreds = Boolean(process.env.STANBIC_CLIENT_ID && process.env.STANBIC_CLIENT_SECRET);
  const liveProblem = liveSettingsProblem();
  const waitingOn = liveProblem
    ? ("production_settings" as const)
    : mode === "mock" && !hasCreds
      ? ("credentials" as const)
      : ("stanbic_api" as const);
  return {
    mode,
    hasCredentials: hasCreds,
    cardEnabled: false,
    product: "STK Push – M-Pesa Checkout",
    billAccountRef: billAccountRef(),
    apiBase: apiBase(),
    tokenUrl: tokenUrl(),
    stkUrl: stkUrl(),
    webhookUrl: STANBIC_WEBHOOK_URL,
    website: site.url,
    serverIpHint: "143.198.169.74",
    waitingOn,
    liveProblem,
    /** Mock always works locally; sandbox/live need bank credentials present. */
    ready: mode === "mock" || (hasCreds && !liveProblem),
  };
}


function assertLiveSettings() {
  const problem = liveSettingsProblem();
  if (problem) throw new Error(`Payments are not set up for live yet: ${problem}`);
}

function billAccountRef(): string {
  return process.env.STANBIC_BILL_ACCOUNT_REF || STANBIC_ACCOUNT_NUMBER;
}

export function toMsisdn(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length >= 12) return digits.slice(0, 12);
  if (digits.startsWith("0") && digits.length >= 10) return `254${digits.slice(1, 10)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

/** Stanbic dbsReferenceId: 13 chars, A–Z / 2–9 (no 0, 1, I, O). */
function dbsReferenceId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 13; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

type TokenCache = { token: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) {
    return tokenCache.token;
  }
  const id = process.env.STANBIC_CLIENT_ID;
  const secret = process.env.STANBIC_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("Stanbic sandbox credentials are not configured.");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: id,
    client_secret: secret,
    scope: "payments",
  });

  const res = await fetch(tokenUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
    description?: string;
  };

  if (!res.ok || !data.access_token || data.access_token === "None") {
    const detail = data.error_description || data.description || data.error || `HTTP ${res.status}`;
    throw new Error(`Stanbic auth failed (${detail})`);
  }

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in) || 3600) * 1000,
  };
  return tokenCache.token;
}

export type StkResult = {
  ok: boolean;
  mock: boolean;
  reference: string;
  /** Every id the bank may quote back for this attempt. */
  references?: string[];
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

  assertLiveSettings();
  const token = await getAccessToken();
  const reference = dbsReferenceId();
  const payload = {
    dbsReferenceId: reference,
    billAccountRef: billAccountRef(),
    amount: String(Math.round(input.amountKes)),
    mobileNumber: msisdn,
    callBackUrl: STANBIC_WEBHOOK_URL,
    callbackUrl: STANBIC_WEBHOOK_URL,
    externalReference: input.orderId,
  };

  const res = await fetch(stkUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const raw = await res.json().catch(() => ({}));
  console.log("[stanbic-stk]", res.status, JSON.stringify(raw).slice(0, 500));
  const accepted = String((raw as { status?: string }).status || "").toLowerCase();
  if (!res.ok || (accepted && accepted !== "success")) {
    const message =
      typeof (raw as { message?: string }).message === "string"
        ? (raw as { message: string }).message
        : typeof (raw as { description?: string }).description === "string"
          ? (raw as { description: string }).description
          : `Stanbic STK failed (${res.status})`;
    throw new Error(message);
  }

  const bankRef = String(
    (raw as { transactionId?: string; reference?: string; ConversationID?: string; dbsReferenceId?: string })
      .transactionId ||
      (raw as { reference?: string }).reference ||
      (raw as { ConversationID?: string }).ConversationID ||
      (raw as { dbsReferenceId?: string }).dbsReferenceId ||
      reference,
  );

  return {
    ok: true,
    mock: false,
    reference: bankRef,
    references: [...new Set([reference, bankRef, ...readStanbicCallback(raw).refs])],
    message: "STK push sent. Enter your M-Pesa PIN on your phone.",
    raw,
  };
}

export type BankPaymentStatus = "paid" | "failed" | "pending";

const BANK_PAID = new Set(["success", "successful", "completed", "complete", "paid", "settled", "acsc", "accp", "processed"]);
const BANK_FAILED = new Set(["failed", "failure", "rejected", "rjct", "cancelled", "canceled", "declined", "expired", "timeout", "reversed"]);

/**
 * Ask Stanbic how an STK attempt ended (Retrieve Transaction Status API, by our dbsReferenceId).
 * Server-to-bank and authenticated, so unlike a webhook call it cannot be faked by a visitor.
 * Unrecognised answers stay "pending" and are logged, so we learn the bank's wording before trusting it.
 */
export async function stkTransactionStatus(dbsReferenceId: string): Promise<{ status: BankPaymentStatus; raw: unknown }> {
  assertLiveSettings();
  const token = await getAccessToken();
  const url = `${statusUrl()}?dbsReferenceId=${encodeURIComponent(dbsReferenceId)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  const raw = await res.json().catch(() => ({}));
  console.log("[stanbic-status]", dbsReferenceId, res.status, JSON.stringify(raw).slice(0, 500));
  if (!res.ok) return { status: "pending", raw };
  const row = (Array.isArray(raw) ? raw[0] : raw) as { bankStatus?: string; reasonCode?: string } | undefined;
  const word = String(row?.bankStatus || "").toLowerCase().replace(/[^a-z]/g, "");
  if (BANK_PAID.has(word)) return { status: "paid", raw };
  if (BANK_FAILED.has(word)) return { status: "failed", raw };
  return { status: "pending", raw };
}

export type CardSessionResult = {
  ok: boolean;
  mock: boolean;
  reference: string;
  redirectUrl: string;
  message: string;
};

export async function initiateCardSession(_input: {
  orderId: string;
  amountKes: number;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<CardSessionResult> {
  throw new Error(
    "Card payments are not available. Stanbic is not supporting card integrations at this time. Please pay with M-Pesa.",
  );
}

/** Mock STK becomes paid ~4s after initiate (tracked by paymentRef timestamp in order). */
export function mockStkShouldSucceed(orderUpdatedAtIso: string, paymentRef?: string): boolean {
  if (!paymentRef?.startsWith("MOCK-STK-")) return false;
  const started = Date.parse(orderUpdatedAtIso);
  if (!Number.isFinite(started)) return false;
  return Date.now() - started >= 4000;
}
