/**
 * Pencil + Magic Keyboard search: normalize, routing hints, fits filtering, future alerts.
 */

import { accessoriesConfig } from "./config";
import { keyboardFits, pencilFits, pointerFits } from "./fits";
import { getAccessoryImage } from "./images";
import { lipaMonthly } from "./pricing";
import { accessories, getAccessory, type Accessory, type AccessoryGroup } from "./models";

export type AccessorySearchHit = {
  id: string;
  name: string;
  href: string;
  priceKes: number;
  imageSrc: string;
  imageAlt: string;
  group: AccessoryGroup;
  generation: string;
  year: number;
  searchable: string;
  kind: "accessory";
  overviewOnly?: boolean;
};

export const accessoriesPopularSearches = [
  "Apple Pencil Pro",
  "Pencil USB-C",
  "Magic Keyboard iPad Pro",
  "Magic Keyboard Folio",
  "Magic Keyboard Touch ID",
  "Magic Mouse black",
  "Magic Trackpad white",
  "Numeric keypad",
] as const;

const VOCAB = [
  "case", "iphone", "silicone", "clear", "techwoven", "finewoven", "wallet", "bumper", "duo",
  "strap", "crossbody", "wrist", "folio", "smart", "charger", "adapter", "power", "20w", "35w",
  "70w", "96w", "140w", "magsafe", "cable", "usb", "thunderbolt", "watch",

  "pencil",
  "apple",
  "pro",
  "usbc",
  "usb",
  "magic",
  "keyboard",
  "folio",
  "touchid",
  "touch",
  "numeric",
  "keypad",
  "ipad",
  "mac",
  "bluetooth",
  "remote",
  "band",
  "strap",
  "mouse",
  "trackpad",
  "pointer",
  "magic",
  "black",
  "white",
  "gaming",
];

function editDistance1(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a === b) return true;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    edits++;
    if (edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  if (i < a.length || j < b.length) edits++;
  return edits <= 1;
}

export function normalizePencilQuery(raw: string): string {
  let q = raw.toLowerCase().trim();
  q = q.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  q = q
    .replace(/\bapple\s*pencil\b/g, "pencil")
    .replace(/\bpencil\s*pro\b/g, "pencil pro")
    .replace(/\bpencil\s*(\d)(st|nd|rd|th)?\s*gen\b/g, "pencil $1 gen")
    .replace(/\b2nd\s*generation\b/g, "pencil 2 gen")
    .replace(/\b1st\s*generation\b/g, "pencil 1 gen")
    .replace(/\busb\s*c\b/g, "usbc");
  q = q
    .split(" ")
    .map((w) => {
      if (VOCAB.includes(w) || /^[12]$/.test(w)) return w;
      return VOCAB.find((v) => editDistance1(w, v)) || w;
    })
    .join(" ");
  return q.replace(/\s+/g, " ").trim();
}

export function normalizeKeyboardQuery(raw: string): string {
  let q = raw.toLowerCase().trim();
  q = q.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  q = q
    .replace(/\bmagic\s*keyboard\b/g, "magic keyboard")
    .replace(/\btouch\s*id\b/g, "touchid")
    .replace(/\bnum\s*pad\b/g, "numeric keypad")
    .replace(/\bkey\s*pad\b/g, "keypad")
    .replace(/\bfolio\b/g, "folio keyboard")
    .replace(/\busb\s*c\b/g, "usbc");
  q = q
    .split(" ")
    .map((w) => {
      if (VOCAB.includes(w) || /^(11|13)$/.test(w)) return w;
      return VOCAB.find((v) => editDistance1(w, v)) || w;
    })
    .join(" ");
  return q.replace(/\s+/g, " ").trim();
}


const THIRD_PARTY = ["belkin", "anker", "spigen", "mophie", "otterbox", "beats", "tech21", "moft", "logitech", "nimble"];

export function accessoriesThirdPartyMessage(query: string): string | null {
  const q = query.toLowerCase();
  if (THIRD_PARTY.some((b) => q.includes(b))) {
    return "We stock Apple's own cases and chargers for the latest iPhones, iPads and Macs. Ask us on WhatsApp about other brands or older models.";
  }
  if (/iphone\s*(12|13|14|15|16)\b.*case|case.*iphone\s*(12|13|14|15|16)\b/.test(q)) {
    return "We stock Apple's own cases and chargers for the latest iPhones, iPads and Macs. Ask us on WhatsApp about other brands or older models.";
  }
  return null;
}

export function normalizeAccessoriesQuery(raw: string): string {
  const lower = raw.toLowerCase();
  if (/\bpencil\b/.test(lower) && !/\bkeyboard\b/.test(lower)) {
    return normalizePencilQuery(raw);
  }
  if (/\bkeyboard\b|\bfolio\b|\btouchid\b/.test(lower)) {
    return normalizeKeyboardQuery(raw);
  }
  const pencil = normalizePencilQuery(raw);
  const keyboard = normalizeKeyboardQuery(raw);
  return pencil.length >= keyboard.length ? pencil : keyboard;
}

/** Where a query should route in global search (pencil/keyboard → accessories; remote → tv-home; band → watch). */
export function routeAccessoriesDomain(raw: string): "accessories" | "tv-home" | "watch" | null {
  const q = normalizeAccessoriesQuery(raw);
  if (/\b(case|cases|charger|adapter|magsafe|cable|thunderbolt|folio|silicone|techwoven)\b/.test(q)) return "accessories";
  if (/\b(siri remote|apple tv remote|remote)\b/.test(q) && !/\bkeyboard\b/.test(q)) {
    return "tv-home";
  }
  if (/\b(band|strap)\b/.test(q) && !/\bpencil\b/.test(q) && !/\bkeyboard\b/.test(q)) {
    return "watch";
  }
  if (/\bgaming\s*mouse\b/.test(q) && !/\bmagic\b/.test(q)) {
    return "accessories";
  }
  if (
    /\bpencil\b/.test(q) ||
    /\bmagic keyboard\b/.test(q) ||
    /\bmagic mouse\b/.test(q) ||
    /\bmagic trackpad\b/.test(q) ||
    (/\bmouse\b/.test(q) && /\b(magic|apple|mxk|bluetooth)\b/.test(q)) ||
    (/\btrackpad\b/.test(q) && /\b(magic|apple|mxk|force)\b/.test(q)) ||
    (/\bkeyboard\b/.test(q) && /\b(magic|folio|touchid|ipad|mac)\b/.test(q))
  ) {
    return "accessories";
  }
  return null;
}

export function looksLikeAccessoriesQuery(raw: string): boolean {
  return routeAccessoriesDomain(raw) === "accessories";
}

export function buildAccessoriesSearchIndex(): AccessorySearchHit[] {
  return accessories.map((a) => {
    const img = getAccessoryImage(a.id, "hero", a.name);
    const searchable = [
      a.name,
      a.id,
      a.group,
      a.generation,
      a.partNumber,
      String(a.year),
      a.platform,
      a.sizeHint || "",
      a.connection,
      ...a.features,
      "pencil",
      "magic keyboard",
      "magic mouse",
      "magic trackpad",
      "mouse",
      "trackpad",
      "accessory",
      "accessories",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return {
      id: a.id,
      name: a.name,
      href: `/accessories/${a.id}`,
      priceKes: a.basePriceKes,
      imageSrc: img.src,
      imageAlt: img.alt,
      group: a.group,
      generation: a.generation,
      year: a.year,
      searchable,
      kind: "accessory" as const,
      overviewOnly: a.overviewOnly,
    };
  });
}

export const searchMisses: string[] = [];

export function logAccessoriesSearchMiss(query: string): void {
  const q = query.trim();
  if (!q) return;
  if (!searchMisses.includes(q)) searchMisses.push(q);
  if (searchMisses.length > 200) searchMisses.splice(0, searchMisses.length - 200);
}

export function searchAccessories(
  query: string,
  index: AccessorySearchHit[],
  opts: { deviceModelId?: string; group?: "pencil" | "keyboard" | "mouse" | "trackpad" } = {},
) {
  const q = normalizeAccessoriesQuery(query);
  if (!q) {
    return {
      hits: [] as AccessorySearchHit[],
      future: null as null | { queried: string; note: string },
      top: null as AccessorySearchHit | null,
      topScore: 0,
      route: routeAccessoriesDomain(query),
    };
  }

  let future: { queried: string; note: string } | null = null;
  const pencilFuture = q.match(/\bpencil\s*pro\s*([2-9]|[1-9]\d)\b/);
  if (pencilFuture) {
    future = {
      queried: `Apple Pencil Pro ${pencilFuture[1]}`,
      note: "That Pencil generation is not in the shop yet. We can message you when stock lands — meanwhile these are the Pencils we carry.",
    };
  }
  const mouseFuture = q.match(/\bmagic\s*mouse\s*([3-9]|[1-9]\d)\b/);
  if (mouseFuture) {
    future = {
      queried: `Magic Mouse ${mouseFuture[1]}`,
      note: "That Magic Mouse generation is not in the shop yet. We can message you when stock lands — meanwhile these are the Magic Mice we carry.",
    };
  }
  const trackpadFuture = q.match(/\bmagic\s*trackpad\s*([3-9]|[1-9]\d)\b/);
  if (trackpadFuture) {
    future = {
      queried: `Magic Trackpad ${trackpadFuture[1]}`,
      note: "That Magic Trackpad generation is not in the shop yet. We can message you when stock lands — meanwhile these are the Trackpads we carry.",
    };
  }

  const wantsGamingMouse = /\bgaming\s*mouse\b/.test(q) && !/\bmagic\b/.test(q);
  const wantsPencil = /\bpencil\b/.test(q);
  const wantsKeyboard = /\bkeyboard\b|\bfolio\b/.test(q) && !/\btrackpad\b/.test(q);
  const wantsMouse = /\bmagic\s*mouse\b/.test(q) || (/\bmouse\b/.test(q) && !/\btrackpad\b/.test(q));
  const wantsTrackpad = /\bmagic\s*trackpad\b/.test(q) || /\btrackpad\b/.test(q);
  const wantsBlack = /\bblack\b/.test(q);
  const wantsWhite = /\bwhite\b/.test(q);
  const wantsPro = /\bpro\b/.test(q) && wantsPencil;
  const wantsUsbc = /\busbc\b/.test(q);
  const wantsTouchId = /\btouchid\b/.test(q);
  const wantsNumeric = /\bnumeric\b|\bkeypad\b/.test(q);
  const wantsFolio = /\bfolio\b/.test(q);
  const wants11 = /\b11\b/.test(q);
  const wants13 = /\b13\b/.test(q);
  const wantsMac = /\bmac\b/.test(q);
  const wantsIpad = /\bipad\b/.test(q);

  const scored = index
    .map((item) => {
      if (opts.group && item.group !== opts.group) return { item, score: 0 };
      let score = 0;
      if (wantsGamingMouse && item.group === "mouse") score += 15;
      if (wantsPencil && item.group === "pencil") score += 60;
      if (wantsKeyboard && item.group === "keyboard") score += 60;
      if (wantsMouse && item.group === "mouse") score += 60;
      if (wantsTrackpad && item.group === "trackpad") score += 60;
      if (wantsBlack && item.searchable.includes("black")) score += 35;
      if (wantsWhite && item.searchable.includes("white")) score += 35;
      if (wantsPro && item.id === "pencil-pro") score += 80;
      if (wantsUsbc && item.id === "pencil-usbc") score += 70;
      if (wantsFolio && item.id === "keyboard-folio") score += 75;
      if (wantsTouchId && item.searchable.includes("touch id")) score += 40;
      if (wantsNumeric && item.searchable.includes("numeric")) score += 45;
      if (wants11 && item.searchable.includes("11")) score += 35;
      if (wants13 && item.searchable.includes("13")) score += 35;
      if (wantsMac && item.searchable.includes("mac")) score += 40;
      if (wantsIpad && item.searchable.includes("ipad")) score += 35;

      const tokens = q.split(" ").filter(Boolean);
      for (const t of tokens) {
        if (["pencil", "apple", "magic", "keyboard", "accessory", "accessories"].includes(t)) continue;
        if (item.searchable.includes(t)) score += 12;
      }

      if (opts.deviceModelId) {
        const product = getAccessory(item.id);
        if (product?.group === "pencil") {
          const fit = pencilFits(opts.deviceModelId, item.id);
          if (fit.status === "fits") score += 50;
          else if (fit.status === "note") score += 20;
          else score -= 80;
        } else if (product?.group === "keyboard") {
          const fit = keyboardFits(opts.deviceModelId, item.id);
          if (fit.status === "fits") score += 50;
          else if (fit.status === "note") score += 20;
          else score -= 80;
        } else if (product?.group === "mouse" || product?.group === "trackpad") {
          const fit = pointerFits(opts.deviceModelId, item.id);
          if (fit.status === "fits") score += 50;
          else if (fit.status === "note") score += 20;
          else score -= 80;
        }
      }

      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.item.year - a.item.year);

  const hits = scored.slice(0, 8).map((r) => r.item);
  const top = hits[0] || null;

  if (!hits.length && !future) logAccessoriesSearchMiss(query);

  const gamingNote = wantsGamingMouse
    ? "We stock Apple Magic Mouse, not third-party gaming mice — message us on WhatsApp if you need a gaming pointer."
    : null;

  return {
    hits,
    future,
    gamingNote,
    top,
    topScore: scored[0]?.score || 0,
    route: routeAccessoriesDomain(query),
  };
}

export function accessoriesMatchingDevice(
  deviceModelId: string,
  group?: "pencil" | "keyboard" | "mouse" | "trackpad",
): Accessory[] {
  return accessories.filter((a) => {
    if (group && a.group !== group) return false;
    if (a.group === "pencil") return pencilFits(deviceModelId, a.id).status !== "no";
    if (a.group === "keyboard") return keyboardFits(deviceModelId, a.id).status !== "no";
    if (a.group === "mouse" || a.group === "trackpad") {
      return pointerFits(deviceModelId, a.id).status !== "no";
    }
    return false;
  });
}

/** Alias for SiteSearch / routing helpers */
export const accessoriesSearchRoute = routeAccessoriesDomain;

export function accessoriesFutureAlert(query: string): {
  title: string;
  message: string;
  whatsappText: string;
} | null {
  const result = searchAccessories(query, buildAccessoriesSearchIndex());
  if (!result.future) return null;
  return {
    title: `${result.future.queried} is not in the shop yet`,
    message: result.future.note,
    whatsappText: `Alert me when ${result.future.queried} is in stock`,
  };
}

export { accessoriesConfig, lipaMonthly };
