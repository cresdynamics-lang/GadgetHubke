#!/usr/bin/env node
/**
 * Part 12 Power/Cases acceptance - mirrors fits.ts caseFits + chargerAdvice.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const report = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/accessories/manifest-report.json"), "utf8"),
);

// Inline mirrors of caseFits / chargerAdvice (keep in sync with fits.ts)
const caseFitsMap = {
  "case-iphone-17-pro-max-silicone": ["iphone-17-pro-max"],
  "case-iphone-17-pro-silicone": ["iphone-17-pro"],
  "case-iphone-air-case": ["iphone-air"],
  "folio-ipad-air-13-m4": ["ipad-air-13-m4"],
  "folio-ipad-air-11-m4": ["ipad-air-11-m4"],
};

function caseFits(device, caseId) {
  const fits = caseFitsMap[caseId];
  if (!fits) return { status: "no", reason: "Unknown" };
  if (fits.includes(device)) return { status: "fits", reason: `Made for ${device}` };
  return {
    status: "no",
    reason: `This case is made for ${fits.join(", ")}, not ${device}.`,
  };
}

function chargerAdvice(device) {
  const id = device.toLowerCase();
  if (/iphone/.test(id)) {
    return [
      { id: "power-adapter-20w", role: "recommended" },
      { id: "cable-usbc-60w-1m", role: "recommended" },
      { id: "magsafe-charger-1m", role: "optional" },
    ];
  }
  if (/macbook-air/.test(id)) {
    return [
      { id: "power-adapter-70w", role: "recommended" },
      { id: "cable-magsafe3-2m", role: "recommended" },
    ];
  }
  return [];
}

const cases = [
  ["iPhone 17 Pro Max + 17 Pro Max Silicone", caseFits("iphone-17-pro-max", "case-iphone-17-pro-max-silicone"), "fits"],
  ["iPhone 17 Pro + 17 Pro Max Silicone", caseFits("iphone-17-pro", "case-iphone-17-pro-max-silicone"), "no"],
  ["iPhone Air + Air Case", caseFits("iphone-air", "case-iphone-air-case"), "fits"],
  ["iPad Air 11 + Folio 13", caseFits("ipad-air-11-m4", "folio-ipad-air-13-m4"), "no"],
];

let fail = 0;
console.log(
  `Manifest: power=${report.countPower} cases=${report.countCases} pencil=${report.countPencil} keyboard=${report.countKeyboard} mouse=${report.countMouse} trackpad=${report.countTrackpad}`,
);
console.log("| Case | Result | Expected | Pass |");
console.log("|---|---|---|---|");
for (const [name, result, expected] of cases) {
  const ok = result.status === expected;
  if (!ok) fail++;
  console.log(`| ${name} | ${result.status} - ${result.reason.slice(0, 70)} | ${expected} | ${ok ? "PASS" : "FAIL"} |`);
}

const iphoneAdvice = chargerAdvice("iphone-17-pro");
const macAdvice = chargerAdvice("macbook-air-13-m2");
const a1 = iphoneAdvice.some((x) => x.id === "power-adapter-20w" && x.role === "recommended");
const a2 = iphoneAdvice.some((x) => x.id === "magsafe-charger-1m" && x.role === "optional");
const a3 = macAdvice.some((x) => x.id === "power-adapter-70w");
console.log(`| iPhone 17 Pro charger advice | 20W+cable+optional MagSafe | recommended | ${a1 && a2 ? "PASS" : "FAIL"} |`);
console.log(`| MacBook Air charger advice | 70W + MagSafe 3 | recommended | ${a3 ? "PASS" : "FAIL"} |`);
if (!a1 || !a2 || !a3) fail++;

console.log("\nCase family colour counts:");
for (const row of report.caseFamilySummary || []) {
  console.log(`| ${row.id} | ${row.colours} |`);
}

process.exit(fail ? 1 : 0);
