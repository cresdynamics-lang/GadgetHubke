/**
 * Merge the current iPad stock list into the admin overlay without wiping
 * other products. Backs up the overlay file first.
 *
 *   node scripts/merge-listed-ipads.mjs
 */
import fs from "node:fs";
import path from "node:path";

const KEY = "gh:catalog-overlay:v1";
const file = path.join(process.cwd(), ".data", `${KEY}.json`);

const LISTED = {
  "ipad-pro-11-m5": { "256gb": 165000, "256gb-cell": 188000, "512gb-cell": 218000 },
  "ipad-pro-13-m5": { "256gb": 185000, "256gb-cell": 195000, "512gb-cell": 223000, "1tb-cell": 258000 },
  "ipad-air-13-m4": { "128gb": 130000, "128gb-cell": 138000, "256gb": 145000, "256gb-cell": 165000 },
  "ipad-air-11-m4": { "128gb": 105000, "128gb-cell": 121000, "256gb": 128000, "256gb-cell": 152000 },
  "ipad-a16": { "128gb": 64000, "128gb-cell": 80000, "256gb": 83000, "256gb-cell": 130000 },
  "ipad-mini-a17-pro": { "128gb": 88000, "128gb-cell": 107000, "256gb-cell": 138000 },
};

function isIpadId(id) {
  return id.startsWith("ipad-");
}

const now = new Date().toISOString();
const stamp = now.replace(/[:.]/g, "-");
let map = {};
if (fs.existsSync(file)) {
  const backup = `${file}.bak-${stamp}`;
  fs.copyFileSync(file, backup);
  console.log(`backed up ${backup}`);
  map = JSON.parse(fs.readFileSync(file, "utf8")) || {};
}

let hidden = 0;
let listed = 0;
const ids = new Set([...Object.keys(map), ...Object.keys(LISTED)]);
for (const id of ids) {
  if (!isIpadId(id)) continue;
  const prices = LISTED[id];
  const prev = map[id] || { updatedAt: now };
  if (!prices) {
    map[id] = {
      ...prev,
      showOnWebsite: false,
      showNewOnWebsite: false,
      inStock: false,
      updatedAt: now,
    };
    hidden += 1;
    continue;
  }
  const storages = { ...(prev.storages || {}) };
  for (const [key, kes] of Object.entries(prices)) {
    storages[key] = {
      ...(storages[key] || {}),
      priceKes: kes,
      inStock: true,
      showOnWebsite: true,
    };
  }
  for (const [key, v] of Object.entries(storages)) {
    if (!prices[key]) {
      storages[key] = { ...v, showOnWebsite: false, inStock: false };
    }
  }
  const next = {
    ...prev,
    storages,
    priceKes: Math.min(...Object.values(prices)),
    showOnWebsite: true,
    showNewOnWebsite: true,
    inStock: true,
    updatedAt: now,
  };
  delete next.coloursInStock;
  map[id] = next;
  listed += 1;
}

fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(map, null, 2), "utf8");
console.log(`merged listed iPads: ${listed} shown, ${hidden} hidden. wrote ${file}`);
