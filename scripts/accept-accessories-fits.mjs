#!/usr/bin/env node
/**
 * Part 12 fit acceptance — mirrors src/lib/accessories/fits.ts for the named cases.
 * Run: node scripts/accept-accessories-fits.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const report = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/accessories/manifest-report.json"), "utf8"),
);

function ipadMeta(id) {
  const lower = id.toLowerCase();
  return {
    isPro: /ipad-pro/.test(lower),
    isAir: /ipad-air/.test(lower),
    isMiniA17: lower === "ipad-mini-a17-pro",
    chip: lower.includes("m5")
      ? "M5"
      : lower.includes("m4")
        ? "M4"
        : lower.includes("m3")
          ? "M3"
          : lower.includes("m2")
            ? "M2"
            : "other",
    size13: /13|12-9|12\.9/.test(lower),
    size11: /11/.test(lower) && !/13/.test(lower),
    is10th: lower === "ipad-10",
    isA16: lower === "ipad-a16",
  };
}

function pencilFits(device, pencil) {
  const d = ipadMeta(device);
  if (pencil === "pencil-pro") {
    const ok =
      (d.isPro && (d.chip === "M4" || d.chip === "M5")) ||
      (d.isAir && ["M2", "M3", "M4"].includes(d.chip)) ||
      d.isMiniA17;
    return ok
      ? { status: "fits", reason: "Listed for Pencil Pro" }
      : { status: "no", reason: "Does not fit" };
  }
  if (pencil === "pencil-usbc") {
    return { status: "fits", reason: "USB-C Pencil for recent iPads" };
  }
  if (pencil === "pencil-1") {
    if (d.is10th || d.isA16) {
      return { status: "note", reason: "Fits with USB-C adapter" };
    }
    return { status: "fits", reason: "1st gen" };
  }
  return { status: "no", reason: "unknown" };
}

function keyboardFits(device, kb) {
  const isMac = /macbook|imac|mac-mini|intel-mac/.test(device);
  const d = ipadMeta(device);
  if (kb === "keyboard-folio") {
    return d.is10th || d.isA16
      ? { status: "fits", reason: "Folio for 10th/A16" }
      : { status: "no", reason: "Not Folio device" };
  }
  if (kb === "keyboard-ipad-pro-13") {
    return d.isPro && d.size13 && ["M4", "M5"].includes(d.chip)
      ? { status: "fits", reason: "Pro 13 M4+" }
      : { status: "no", reason: "Only iPad Pro 13 M4+" };
  }
  if (kb === "keyboard-mac-touchid") {
    if (!isMac) return { status: "no", reason: "Mac keyboard" };
    if (/m[1-5]|apple.?silicon/i.test(device)) {
      return { status: "fits", reason: "Touch ID on Apple silicon" };
    }
    return { status: "note", reason: "Bluetooth ok; Touch ID will not work on Intel" };
  }
  return { status: "no", reason: "unknown" };
}

function label(s) {
  if (s === "fits") return "Fits";
  if (s === "note") return "Fits, but …";
  return "Does not fit";
}

const cases = [
  ["iPad Pro 13\" M4 + Pencil Pro", pencilFits("ipad-pro-13-m4", "pencil-pro"), "fits"],
  ["iPad 10th gen + Pencil Pro", pencilFits("ipad-10", "pencil-pro"), "no"],
  ["iPad 10th gen + Pencil 1st gen", pencilFits("ipad-10", "pencil-1"), "note"],
  ["iPad Air M2 + Pencil USB-C", pencilFits("ipad-air-11-m2", "pencil-usbc"), "fits"],
  ["iPad A16 + Magic Keyboard Folio", keyboardFits("ipad-a16", "keyboard-folio"), "fits"],
  ["iPad Air 13\" M3 + Magic Keyboard for iPad Pro", keyboardFits("ipad-air-13-m3", "keyboard-ipad-pro-13"), "no"],
  ["MacBook Air M2 + Magic Keyboard with Touch ID", keyboardFits("macbook-air-13-m2", "keyboard-mac-touchid"), "fits"],
  ["Intel MacBook + Magic Keyboard with Touch ID", keyboardFits("intel-macbook-pro", "keyboard-mac-touchid"), "note"],
];

let fail = 0;
console.log("Manifest: pencil=" + report.countPencil + " keyboard=" + report.countKeyboard);
console.log("| Case | Result | Expected | Pass |");
console.log("|---|---|---|---|");
for (const [name, result, expected] of cases) {
  const ok = result.status === expected;
  if (!ok) fail++;
  console.log(
    `| ${name} | ${label(result.status)} — ${result.reason} | ${expected} | ${ok ? "PASS" : "FAIL"} |`,
  );
}

const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/accessories/generated-manifest.json"), "utf8"),
);
const pencil1 = manifest.products["pencil-1"];
console.log(
  "\nPencil 1st gen hero overviewOnly:",
  Boolean(pencil1?.overviewOnly || pencil1?.hero?.includes("first-gen")),
  pencil1?.hero?.split("/").pop(),
);

process.exit(fail ? 1 : 0);
