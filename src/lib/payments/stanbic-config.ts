/**
 * Which Stanbic environment the shop talks to, and its addresses. No secrets, no imports,
 * so it can be tested on its own. Sandbox host comes from the portal's mpesa-checkout spec.
 */

export type StanbicMode = "live" | "sandbox" | "mock";

const SANDBOX_API = "https://sandbox.connect.stanbicbank.co.ke/api/sandbox";

export function paymentsMode(): StanbicMode {
  const forced = (process.env.PAYMENTS_MODE || "").toLowerCase();
  if (forced === "live" || forced === "sandbox" || forced === "mock") return forced;
  if (process.env.STANBIC_CLIENT_ID && process.env.STANBIC_CLIENT_SECRET) {
    return "sandbox";
  }
  return "mock";
}

export function apiBase(): string {
  return (process.env.STANBIC_API_BASE || SANDBOX_API).replace(/\/$/, "");
}

export function tokenUrl(): string {
  return process.env.STANBIC_TOKEN_URL || `${apiBase()}/auth/oauth2/token`;
}

export function stkUrl(): string {
  return process.env.STANBIC_STK_PATH || `${apiBase()}/mpesa-checkout`;
}

export function statusUrl(): string {
  return process.env.STANBIC_STATUS_URL || `${apiBase()}/transaction-status-sandbox/`;
}

/**
 * Live mode must not fall back to the sandbox: the production addresses have to be set and none may be a sandbox one.
 * Returns what is wrong, or "" when live mode is safe (or the shop is not in live mode).
 */
export function liveSettingsProblem(): string {
  if (paymentsMode() !== "live") return "";
  if (!process.env.STANBIC_API_BASE) return "STANBIC_API_BASE is not set for live mode.";
  if (!process.env.STANBIC_STATUS_URL) return "STANBIC_STATUS_URL is not set for live mode.";
  const sandbox = [apiBase(), tokenUrl(), stkUrl(), statusUrl()].find((url) => /sandbox/i.test(url));
  return sandbox ? `Live mode is still pointing at a sandbox address (${new URL(sandbox).host}).` : "";
}
