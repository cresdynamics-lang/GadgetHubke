#!/usr/bin/env node
/**
 * Store the Resend API key on the server without it touching git or shell history,
 * then send a test email. Run from the app folder on the VPS:
 *
 *   cd /var/www/sites/gadgethubke.com
 *   sudo -u site_gadget node scripts/set-resend-key.mjs
 *   sudo -u site_gadget env PM2_HOME=$PWD/.pm2 pm2 startOrReload ecosystem.config.cjs --update-env
 *
 * Writes RESEND_API_KEY (and MAIL_FROM if you change it) to .env, keeping a backup.
 * The From address must be on a domain verified in Resend (gadgethubke.com).
 */
import fs from "node:fs";
import readline from "node:readline";

const ENV = ".env";

function ask(question, { hidden = false, fallback = "" } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(s);
        else rl.output.write("*");
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim() || fallback);
    });
  });
}

const current = fs.existsSync(ENV) ? fs.readFileSync(ENV, "utf8") : "";
const currentFrom = current.match(/^MAIL_FROM=(.*)$/m)?.[1]?.replace(/^["']|["']$/g, "") || "Gadget Hub <info@gadgethubke.com>";

const key = await ask("Resend API key (starts with re_): ", { hidden: true });
if (!/^re_[A-Za-z0-9_]{10,}$/.test(key)) {
  console.error("That doesn't look like a Resend API key. Nothing changed.");
  process.exit(1);
}
const from = await ask(`From address [${currentFrom}]: `, { fallback: currentFrom });
const testTo = await ask("Send a test email to [info@gadgethubke.com]: ", { fallback: "info@gadgethubke.com" });

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    from,
    to: [testTo],
    subject: "Gadget Hub email is working",
    text: "This is a test from gadgethubke.com. Orders, trade-ins, contact messages and account emails will now send through Resend.",
  }),
});
const data = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`Resend refused the test email (${res.status}): ${data.message || res.statusText}`);
  console.error("Check the key, and that the From domain is verified in Resend. Nothing changed.");
  process.exit(1);
}

if (current) fs.copyFileSync(ENV, `${ENV}.bak-${Date.now()}`);
let next = current;
for (const [k, v] of Object.entries({ RESEND_API_KEY: key, MAIL_FROM: from })) {
  const line = `${k}=${v}`;
  const re = new RegExp(`^${k}=.*$`, "m");
  next = re.test(next) ? next.replace(re, () => line) : `${next.replace(/\n?$/, "\n")}${line}\n`;
}
fs.writeFileSync(ENV, next, { mode: 0o600 });
console.log(`Test email sent to ${testTo} (id ${data.id}). Key saved. Reload PM2 so the site uses it.`);
