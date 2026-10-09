/**
 * Mac accessories with fit rules (sample prices).
 */

import type { MacModel } from "./models";

export type MacAccessory = {
  id: string;
  name: string;
  blurb: string;
  priceKes: number;
  href: string;
  sizes?: Array<13 | 14 | 15 | 16>;
  requiresMagSafe?: boolean;
  wattHint?: string;
  category: "sleeve" | "case" | "power" | "hub" | "protection" | "desk" | "audio" | "cross";
};

const CATALOG: MacAccessory[] = [
  {
    id: "sleeve-13",
    name: "13″ MacBook sleeve",
    blurb: "Padded sleeve for 13″ Air and Pro",
    priceKes: 4999,
    href: "/accessories",
    sizes: [13],
    category: "sleeve",
  },
  {
    id: "sleeve-14",
    name: "14″ MacBook sleeve",
    blurb: "Fits 14″ Pro",
    priceKes: 5499,
    href: "/accessories",
    sizes: [14],
    category: "sleeve",
  },
  {
    id: "sleeve-15",
    name: "15″ MacBook sleeve",
    blurb: "Fits 15″ Air",
    priceKes: 5999,
    href: "/accessories",
    sizes: [15],
    category: "sleeve",
  },
  {
    id: "sleeve-16",
    name: "16″ MacBook sleeve",
    blurb: "Fits 16″ Pro",
    priceKes: 6499,
    href: "/accessories",
    sizes: [16],
    category: "sleeve",
  },
  {
    id: "hardshell",
    name: "Hard shell case",
    blurb: "Clear shell - confirm exact year/size in shop",
    priceKes: 3999,
    href: "/accessories",
    category: "case",
  },
  {
    id: "magsafe-cable",
    name: "MagSafe 3 cable",
    blurb: "Snap charging for MagSafe Macs",
    priceKes: 4500,
    href: "/accessories/cable-magsafe3-2m",
    requiresMagSafe: true,
    category: "power",
  },
  {
    id: "usbc-charger-70",
    name: "70W USB-C charger",
    blurb: "Good daily brick for most Air / 14″ Pro",
    priceKes: 8500,
    href: "/accessories/power-adapter-70w",
    wattHint: "70W",
    category: "power",
  },
  {
    id: "usbc-hub",
    name: "USB-C hub (HDMI + SD + USB-A)",
    blurb: "One stick for older monitors and drives",
    priceKes: 7999,
    href: "/accessories",
    category: "hub",
  },
  {
    id: "keyboard-mac-touchid",
    name: "Magic Keyboard with Touch ID",
    blurb: "Touch ID needs Apple silicon - check before you pay.",
    priceKes: 18000,
    href: "/accessories/keyboard-mac-touchid",
    category: "desk",
  },
  {
    id: "keyboard-mac-usbc",
    name: "Magic Keyboard (USB-C)",
    blurb: "Bluetooth Mac keyboard.",
    priceKes: 14000,
    href: "/accessories/keyboard-mac-usbc",
    category: "desk",
  },
  {
    id: "tb-dock",
    name: "Thunderbolt dock",
    blurb: "Desk expansion for Pro workflows",
    priceKes: 24999,
    href: "/accessories",
    category: "hub",
  },
  {
    id: "screen-protector",
    name: "Screen protector",
    blurb: "Sized per exact model - layouts differ",
    priceKes: 2999,
    href: "/accessories",
    category: "protection",
  },
  {
    id: "keyboard-cover",
    name: "Keyboard cover",
    blurb: "Dust cover for this keyboard layout",
    priceKes: 1999,
    href: "/accessories",
    category: "protection",
  },
  {
    id: "ssd",
    name: "External SSD 1 TB",
    blurb: "Fast USB-C backup and scratch disk",
    priceKes: 14999,
    href: "/accessories",
    category: "desk",
  },
  {
    id: "mouse",
    name: "Magic Mouse",
    blurb: "Multi-Touch surface",
    priceKes: 14000,
    href: "/accessories/magic-mouse",
    category: "desk",
  },
  {
    id: "stand",
    name: "Laptop stand",
    blurb: "Raise the screen for posture",
    priceKes: 5499,
    href: "/accessories",
    category: "desk",
  },
  {
    id: "airpods-cross",
    name: "AirPods",
    blurb: "Pair with your Mac (category coming next)",
    priceKes: 0,
    href: "/airpods",
    category: "cross",
  },
  {
    id: "ipad-cross",
    name: "iPad",
    blurb: "Second screen with Continuity (coming next)",
    priceKes: 0,
    href: "/ipad",
    category: "cross",
  },
];

export function accessoriesForMac(model: MacModel): MacAccessory[] {
  return CATALOG.filter((a) => {
    if (a.sizes && !a.sizes.includes(model.screenInches)) return false;
    if (a.requiresMagSafe && !model.magsafe) return false;
    return true;
  });
}

export function homeMacAccessories(): MacAccessory[] {
  return CATALOG.filter((a) => a.category !== "cross").slice(0, 8);
}

export function macBuyingNotes(model: MacModel): { title: string; body: string }[] {
  const baseMem = model.memoryOptionsGb[0];
  return [
    {
      title: "Memory",
      body:
        baseMem <= 8
          ? "8 GB is enough for light use. 16 GB is the sensible starting point for most people today."
          : `${baseMem} GB is the base on this model. Unified memory is built in - pick enough now.`,
    },
    {
      title: "Storage",
      body:
        "256 GB fits a year of photos and everyday files. 512 GB is comfortable for a few projects. 1 TB suits video and large libraries.",
    },
    {
      title: "Ports",
      body: model.ports.includes("HDMI")
        ? "HDMI and SD are built in. Thunderbolt still covers charge, displays, and fast drives."
        : model.magsafe
          ? "MagSafe for charge; Thunderbolt/USB-C for displays and drives. Many older USB-A sticks need a hub."
          : "Two Thunderbolt/USB-C ports do charge and data. Expect a hub for HDMI or USB-A.",
    },
    {
      title: "Weight and size",
      body: `About ${model.weightKg} kg - roughly the weight of a full water bottle${model.weightKg >= 2 ? " and a half" : ""}.`,
    },
    {
      title: "Age and support",
      body: `${model.chip} (${model.year}). Check Apple’s list for current macOS support - we do not invent update promises.`,
    },
    {
      title: "Condition and seal",
      body:
        model.year <= 2022
          ? "On older stock we show battery cycle count and health on the invoice. Sealed units include the serial for Apple coverage checks."
          : "Sealed and serial on the invoice. Check coverage on Apple’s own site.",
    },
  ];
}

export function macFaq(): { q: string; a: string }[] {
  return [
    {
      q: "Is 8 GB enough?",
      a: "For light browsing and docs, yes. For creative work or many browser tabs in 2026, start at 16 GB - memory is not upgradeable later.",
    },
    {
      q: "Air or Pro?",
      a: "Air is thin, fanless, and quiet for everyday work. Pro adds XDR/ProMotion (14/16), active cooling, and more ports for heavy video, 3D, and compile loads.",
    },
    {
      q: "Which size should I get?",
      a: "13″ travels light. 14″ is the modern Pro sweet spot. 15″ Air adds canvas without Pro bulk. 16″ is a desk-class screen.",
    },
    {
      q: "Is the older M1 still good?",
      a: "Yes for everyday use. Check battery health on 2020 - 2022 stock. Prefer M3/M4 when you need longer software runway and newer cameras.",
    },
    {
      q: "Will my Windows software run?",
      a: "Excel and Word work. Most apps have a Mac version. A few Windows-only programs will not run - ask us before you buy.",
    },
    {
      q: "Do I need a dongle?",
      a: "Air and 13″ Pro often need a hub for HDMI or USB-A. 14″/16″ Pro include HDMI and SD.",
    },
    {
      q: "How long does the battery really last?",
      a: "We quote Apple’s video-playback claims. Real days vary with brightness and apps. Use the Your-day slider on the product page as a guide.",
    },
    {
      q: "Can I upgrade memory later?",
      a: "No - it is built in. That is why we help you pick the right config now.",
    },
    {
      q: "What do I get with the invoice?",
      a: "Sealed machine with serial number on the invoice. New devices include a 1-year warranty. Set-up fees vary and are confirmed when you engage with us.",
    },
  ];
}
