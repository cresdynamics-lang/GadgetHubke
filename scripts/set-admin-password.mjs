#!/usr/bin/env node
/**
 * Set the super-admin sign-in on the server without the password ever touching git
 * or shell history. Run from the app folder on the VPS:
 *
 *   cd /var/www/sites/gadgethubke.com
 *   sudo -u site_gadget node scripts/set-admin-password.mjs
 *   sudo -u site_gadget env PM2_HOME=$PWD/.pm2 pm2 startOrReload ecosystem.config.cjs --update-env
 *
 * Prompts for the email and password (hidden), writes ADMIN_EMAIL, ADMIN_PASSWORD_HASH
 * (scrypt) and ADMIN_SESSION_SECRET to .env, and keeps a backup of the old .env.
 */
import fs from "node:fs";
import readline from "node:readline";
import { randomBytes, scryptSync } from "node:crypto";

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

const email = (await ask("Super-admin email [info@gadgethubke.com]: ", { fallback: "info@gadgethubke.com" })).toLowerCase();
const password = await ask("Password: ", { hidden: true });
const again = await ask("Repeat password: ", { hidden: true });
if (!password || password !== again) {
  console.error("Passwords do not match. Nothing changed.");
  process.exit(1);
}
if (password.length < 10) {
  console.error("Use at least 10 characters. Nothing changed.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
const values = {
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD_HASH: `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`,
};

const current = fs.existsSync(ENV) ? fs.readFileSync(ENV, "utf8") : "";
if (!/^ADMIN_SESSION_SECRET=.+/m.test(current)) values.ADMIN_SESSION_SECRET = randomBytes(32).toString("hex");

if (current) fs.copyFileSync(ENV, `${ENV}.bak-${Date.now()}`);
let next = current;
for (const [key, value] of Object.entries(values)) {
  const line = `${key}=${value}`;
  next = new RegExp(`^${key}=.*$`, "m").test(next) ? next.replace(new RegExp(`^${key}=.*$`, "m"), line) : `${next.replace(/\n?$/, "\n")}${line}\n`;
}
fs.writeFileSync(ENV, next, { mode: 0o600 });
console.log(`Saved admin sign-in for ${email}. Reload PM2 so the app picks it up.`);
