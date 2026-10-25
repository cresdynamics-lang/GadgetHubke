/** PM2 process file for the VPS (/var/www/sites/gadgethubke.com) */
const fs = require("node:fs");
const path = require("node:path");

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
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
    out[key] = value;
  }
  return out;
}

const fileEnv = loadDotEnv(path.join(__dirname, ".env"));

module.exports = {
  apps: [
    {
      name: "gadgethub",
      cwd: "/var/www/sites/gadgethubke.com",
      script: "./dist/server/entry.mjs",
      interpreter: "/usr/bin/node",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "3030",
        REVIEWS_LOCAL_FILE: "1",
        PAYMENTS_MODE: fileEnv.PAYMENTS_MODE || "sandbox",
        STANBIC_API_BASE:
          fileEnv.STANBIC_API_BASE ||
          "https://api.connect.stanbicbank.co.ke/api/sandbox",
        STANBIC_TOKEN_URL: fileEnv.STANBIC_TOKEN_URL || "",
        STANBIC_STK_PATH: fileEnv.STANBIC_STK_PATH || "",
        STANBIC_BILL_ACCOUNT_REF: fileEnv.STANBIC_BILL_ACCOUNT_REF || "0100013199528",
        STANBIC_CLIENT_ID: fileEnv.STANBIC_CLIENT_ID || "",
        STANBIC_CLIENT_SECRET: fileEnv.STANBIC_CLIENT_SECRET || "",
        STANBIC_WEBHOOK_SECRET: fileEnv.STANBIC_WEBHOOK_SECRET || "",
        SMTP_HOST: fileEnv.SMTP_HOST || "mail.privateemail.com",
        SMTP_PORT: fileEnv.SMTP_PORT || "465",
        SMTP_SECURE: fileEnv.SMTP_SECURE || "true",
        SMTP_USER: fileEnv.SMTP_USER || "",
        SMTP_PASS: fileEnv.SMTP_PASS || "",
        MAIL_FROM: fileEnv.MAIL_FROM || "",
        RESEND_API_KEY: fileEnv.RESEND_API_KEY || "",
        RESEND_API_KEY_ORDERS: fileEnv.RESEND_API_KEY_ORDERS || "",
        RESEND_API_KEY_ACCOUNTS: fileEnv.RESEND_API_KEY_ACCOUNTS || "",
        MAIL_REPLY_TO: fileEnv.MAIL_REPLY_TO || "",
        GH_SIGNING_SECRET: fileEnv.GH_SIGNING_SECRET || "",
        // Admin sign-in (set with scripts/set-admin-password.mjs; never committed)
        ADMIN_EMAIL: fileEnv.ADMIN_EMAIL || "",
        ADMIN_PASSWORD_HASH: fileEnv.ADMIN_PASSWORD_HASH || "",
        ADMIN_SESSION_SECRET: fileEnv.ADMIN_SESSION_SECRET || "",
        ADMIN_SECRET: fileEnv.ADMIN_SECRET || "",
        MANAGEMENT_OTP_CODE: fileEnv.MANAGEMENT_OTP_CODE || "",
      },
    },
  ],
};
