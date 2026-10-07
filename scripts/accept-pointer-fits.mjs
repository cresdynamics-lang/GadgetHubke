#!/usr/bin/env node
/**
 * Part 12 pointer fit acceptance - mirrors src/lib/accessories/fits.ts pointerFits cases.
 * Run: node scripts/accept-pointer-fits.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const report = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/accessories/manifest-report.json"), "utf8"),
);

function pointerFits(deviceModelId, productId) {
  const id = deviceModelId.toLowerCase();
  if (!/mouse|trackpad/.test(productId)) {
    return { status: "no", reason: "Unknown pointer." };
  }
  if (id === "windows-pc" || id === "windows") {
    return {
      status: "note",
      reason: "Works as a basic Bluetooth pointer on Windows; surface gestures do not work - check.",
    };
  }
  if (id === "android-phone") {
    return {
      status: "note",
      reason: "May pair as a basic Bluetooth pointer on some Android phones; gestures do not work - check.",
    };
  }
  if (/macbook|imac|mac-mini|mac-studio|mac-pro|^mac|intel-mac/.test(id)) {
    return {
      status: "fits",
      reason: "Works over Bluetooth with Macs that meet Apple's macOS minimum - check Apple's list.",
    };
  }
  if (/ipad/.test(id)) {
    if (/ipad-[67]$|ipad-mini-[45]|ipad-air-[123]$/.test(id)) {
      return {
        status: "note",
        reason: "Older iPad - confirm it runs a supported iPadOS for pointer use; gestures limited.",
      };
    }
    return {
      status: "note",
      reason: "Works as a pointer on supported iPads (iPadOS 13.4+); Mac gestures are limited on iPad - check.",
    };
  }
  return { status: "no", reason: "Device not in the shop list - check Apple's compatibility list." };
}

function label(s) {
  if (s === "fits") return "Fits";
  if (s === "note") return "Fits, but …";
  return "Does not fit";
}

const cases = [
  ["MacBook Air (Apple silicon) + Magic Mouse", pointerFits("macbook-air-13-m2", "mouse-usbc-white"), "fits"],
  ["MacBook Pro 14-inch + Magic Trackpad", pointerFits("macbook-pro-14-m4", "trackpad-usbc-black"), "fits"],
  ["iPad Air M2 + Magic Trackpad", pointerFits("ipad-air-11-m2", "trackpad-usbc-white"), "note"],
  ["iPad 10th gen + Magic Mouse", pointerFits("ipad-10", "mouse-usbc-white"), "note"],
  ["Windows PC + Magic Mouse", pointerFits("windows-pc", "mouse-usbc-black"), "note"],
  ["Android phone + Magic Trackpad", pointerFits("android-phone", "trackpad-usbc-white"), "note"],
];

let fail = 0;
console.log(
  "Manifest: mouse=" + report.countMouse + " trackpad=" + report.countTrackpad,
);
console.log("| Case | Result | Expected | Pass |");
console.log("|---|---|---|---|");
for (const [name, result, expected] of cases) {
  const ok = result.status === expected;
  if (!ok) fail++;
  console.log(
    `| ${name} | ${label(result.status)} - ${result.reason.slice(0, 60)}… | ${expected} | ${ok ? "PASS" : "FAIL"} |`,
  );
}

process.exit(fail ? 1 : 0);
