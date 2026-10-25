import fs from "node:fs";
import path from "node:path";
import { site } from "../site";

function hydrateFromDotEnv() {
  if (process.env.SMTP_PASS || process.env.RESEND_API_KEY) return;
  const file = path.join(process.cwd(), ".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === "") process.env[key] = value;
  }
}

hydrateFromDotEnv();

export type MailStream = "notifications" | "orders" | "accounts";

/** Resend key for a stream; orders and accounts fall back to the shared key. */
export function resendKey(stream: MailStream = "notifications"): string {
  const own =
    stream === "orders"
      ? process.env.RESEND_API_KEY_ORDERS
      : stream === "accounts"
        ? process.env.RESEND_API_KEY_ACCOUNTS
        : undefined;
  return own || process.env.RESEND_API_KEY || "";
}

export function smtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function smtpOptions() {
  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    process.env.SMTP_SECURE === "false" ? false : port === 465 || process.env.SMTP_SECURE === "true";
  return {
    host: process.env.SMTP_HOST || "mail.privateemail.com",
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER || site.email,
      pass: process.env.SMTP_PASS || "",
    },
  };
}

export function mailFrom() {
  return process.env.MAIL_FROM || `Gadget Hub <${site.email}>`;
}

export function mailReplyTo() {
  return process.env.MAIL_REPLY_TO || site.email;
}

/** HMAC secret for pay links and password-reset tokens. */
export function signingSecret() {
  return (
    process.env.GH_SIGNING_SECRET ||
    process.env.SMTP_PASS ||
    process.env.ADMIN_SECRET ||
    (import.meta.env.DEV ? "gadgethub-dev-sign" : "")
  );
}
