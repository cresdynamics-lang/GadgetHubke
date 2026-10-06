/**
 * Shared accessories catalog — Pencil, Keyboard, Mouse, Trackpad, Power, Cases.
 * Owner: re-verify every figure and compatibility rule on apple.com before launch.
 * Where unclear, store null — show nothing rather than guess.
 */

import { accessoryBasePricesKes } from "./config";
import { allPowerCaseProducts, type AccessoryVariantFields } from "./power-cases-data";

export type AccessoryGroup = "pencil" | "keyboard" | "mouse" | "trackpad" | "power" | "cases";

export type Accessory = {
  id: keyof typeof accessoryBasePricesKes;
  name: string;
  group: AccessoryGroup;
  generation: string;
  year: number;
  partNumber: string;
  colours: string[];
  defaultColour: string;
  connection: string;
  charging: string | null;
  features: string[];
  /** Feature / gesture ids */
  featureIds: string[];
  weightG: number | null;
  tagline: string;
  whoItSuits: string;
  whyChoose: [string, string, string];
  basePriceKes: number;
  platform: "ipad" | "mac" | "both" | "pointer";
  sizeHint?: "11" | "13" | null;
  touchId?: boolean;
  numericKeypad?: boolean;
  overviewOnly?: boolean;
  noStorePhoto?: boolean;
  checkFinalSpecs?: boolean;
  notes: string;
  imageProductKey: string;
  /** USB-C | Lightning | owner-confirm */
  connector?: "usb-c" | "lightning" | "owner-confirm" | null;
  surface?: string | null;
  earlierGeneration?: boolean;
  /** Show in shop lists when true (earlier gen: owner toggles if stock exists). */
  stocked?: boolean;
  dimensionsMm?: { length: number | null; width: number | null; height: number | null } | null;
  forceTouch?: boolean;
} & AccessoryVariantFields;

function a(
  partial: Omit<Accessory, "basePriceKes"> & { id: keyof typeof accessoryBasePricesKes },
): Accessory {
  return { ...partial, basePriceKes: accessoryBasePricesKes[partial.id] };
}

export const accessories: Accessory[] = [
  a({
    id: "pencil-pro",
    name: "Apple Pencil Pro",
    group: "pencil",
    generation: "Pro",
    year: 2024,
    partNumber: "MX2D3",
    colours: ["white"],
    defaultColour: "white",
    connection: "Magnetic / Bluetooth",
    charging: "Magnetic attach and wireless charging",
    features: [
      "Squeeze",
      "Barrel roll",
      "Haptic feedback",
      "Hover on supported iPads",
      "Find My",
      "Pressure and tilt",
      "Double-tap",
      "Engraving available",
    ],
    featureIds: [
      "precision",
      "latency",
      "tilt",
      "pressure",
      "magnetic",
      "charging",
      "hover",
      "doubletap",
      "barrelroll",
      "squeeze",
      "haptic",
      "findmy",
      "engraving",
      "pro",
    ],
    weightG: null,
    tagline: "The Pencil that answers a squeeze.",
    whoItSuits: "Drawing and notes on the newest iPad Pro, Air and mini.",
    whyChoose: [
      "Squeeze, barrel roll and haptics — Pro only.",
      "Magnetic charge and Find My.",
      "Check Apple's list for exact iPad models.",
    ],
    platform: "ipad",
    checkFinalSpecs: true,
    notes: "Fits iPad Pro M4+, Air M2+, mini A17 Pro — flag check.",
    imageProductKey: "pencil-pro",
  }),
  a({
    id: "pencil-usbc",
    name: "Apple Pencil (USB-C)",
    group: "pencil",
    generation: "USB-C",
    year: 2023,
    partNumber: "MUWA3",
    colours: ["white"],
    defaultColour: "white",
    connection: "USB-C / Bluetooth",
    charging: "USB-C charging and pairing",
    features: ["Tilt", "Low latency", "Hover on supported iPads"],
    featureIds: ["precision", "latency", "tilt", "hover", "usbc"],
    weightG: null,
    tagline: "USB-C Pencil for everyday notes.",
    whoItSuits: "Budget notes and sketching when you do not need pressure.",
    whyChoose: [
      "USB-C charge and pair.",
      "No pressure sensitivity and no squeeze — flag check.",
      "Check Apple's iPad list.",
    ],
    platform: "ipad",
    checkFinalSpecs: true,
    notes: "No pressure / squeeze — confirm.",
    imageProductKey: "pencil-usbc",
  }),
  a({
    id: "pencil-2",
    name: "Apple Pencil (2nd generation)",
    group: "pencil",
    generation: "2nd",
    year: 2018,
    partNumber: "MU8F2",
    colours: ["white"],
    defaultColour: "white",
    connection: "Magnetic / Bluetooth",
    charging: "Magnetic attach and charging",
    features: ["Double-tap", "Pressure and tilt", "Hover on iPad Pro M2 (check)"],
    featureIds: ["precision", "latency", "tilt", "pressure", "magnetic", "charging", "hover", "doubletap"],
    weightG: null,
    tagline: "Magnetic Pencil for 2018–2022 Pros and Air 4/5.",
    whoItSuits: "Owners of earlier iPad Pro, Air 4/5 or mini 6.",
    whyChoose: [
      "Magnetic charge and double-tap.",
      "Pressure and tilt.",
      "Does not fit the newest Pencil Pro iPads — check list.",
    ],
    platform: "ipad",
    checkFinalSpecs: true,
    notes: "2018–2022 Pro, Air 4/5, mini 6 — flag check.",
    imageProductKey: "pencil-2",
  }),
  a({
    id: "pencil-1",
    name: "Apple Pencil (1st generation)",
    group: "pencil",
    generation: "1st",
    year: 2015,
    partNumber: "MYQW3",
    colours: ["white"],
    defaultColour: "white",
    connection: "Lightning / Bluetooth",
    charging: "Lightning plug-in or adapter",
    features: ["Pressure and tilt"],
    featureIds: ["precision", "latency", "tilt", "pressure"],
    weightG: null,
    tagline: "Lightning Pencil — adapter for USB-C iPads.",
    whoItSuits: "iPad 6th–10th gen and iPad A16 with the right adapter.",
    whyChoose: [
      "Lowest Pencil sample price.",
      "Needs USB-C adapter on 10th gen and A16 — flag check.",
      "No store photo — overview image only.",
    ],
    platform: "ipad",
    overviewOnly: true,
    noStorePhoto: true,
    checkFinalSpecs: true,
    notes: "Image shows the product design. Adapter note for USB-C iPads.",
    imageProductKey: "pencil-1",
  }),
  a({
    id: "keyboard-ipad-pro-11",
    name: "Magic Keyboard for iPad Pro 11-inch",
    group: "keyboard",
    generation: "iPad Pro 11",
    year: 2024,
    partNumber: "MWR03",
    colours: ["black"],
    defaultColour: "black",
    connection: "Magnetic / USB-C pass-through",
    charging: "USB-C pass-through charging (check)",
    features: ["Aluminium palm rest", "Function row", "Large trackpad", "Floating cantilever"],
    featureIds: [],
    weightG: null,
    tagline: "Laptop feel for iPad Pro 11.",
    whoItSuits: "iPad Pro 11-inch M4 and later.",
    whyChoose: [
      "Fits iPad Pro 11 M4/M5 only — flag check.",
      "Function row and large trackpad.",
      "Black aluminium finish.",
    ],
    platform: "ipad",
    sizeHint: "11",
    checkFinalSpecs: true,
    notes: "M4 and later iPad Pro 11 only.",
    imageProductKey: "keyboard-ipad-pro-11",
  }),
  a({
    id: "keyboard-ipad-pro-13",
    name: "Magic Keyboard for iPad Pro 13-inch",
    group: "keyboard",
    generation: "iPad Pro 13",
    year: 2024,
    partNumber: "MWR53",
    colours: ["black"],
    defaultColour: "black",
    connection: "Magnetic / USB-C pass-through",
    charging: "USB-C pass-through charging (check)",
    features: ["Aluminium palm rest", "Function row", "Large trackpad", "Floating cantilever"],
    featureIds: [],
    weightG: null,
    tagline: "Laptop feel for iPad Pro 13.",
    whoItSuits: "iPad Pro 13-inch M4 and later.",
    whyChoose: [
      "Fits iPad Pro 13 M4/M5 only — flag check.",
      "Function row and large trackpad.",
      "Black aluminium finish.",
    ],
    platform: "ipad",
    sizeHint: "13",
    checkFinalSpecs: true,
    notes: "M4 and later iPad Pro 13 only.",
    imageProductKey: "keyboard-ipad-pro-13",
  }),
  a({
    id: "keyboard-ipad-air-11",
    name: "Magic Keyboard for iPad Air 11-inch",
    group: "keyboard",
    generation: "iPad Air 11",
    year: 2024,
    partNumber: "MDFV4",
    colours: ["white"],
    defaultColour: "white",
    connection: "Magnetic / USB-C pass-through",
    charging: "USB-C pass-through (check)",
    features: ["Function row", "Trackpad", "Magnetic attach"],
    featureIds: [],
    weightG: null,
    tagline: "Keyboard for iPad Air 11.",
    whoItSuits: "iPad Air 11-inch M2 and later.",
    whyChoose: [
      "Fits Air 11 M2+ — flag check.",
      "Function row and trackpad.",
      "White finish as per swatch.",
    ],
    platform: "ipad",
    sizeHint: "11",
    checkFinalSpecs: true,
    notes: "Air M2 and later 11-inch.",
    imageProductKey: "keyboard-ipad-air-11",
  }),
  a({
    id: "keyboard-ipad-air-13",
    name: "Magic Keyboard for iPad Air 13-inch",
    group: "keyboard",
    generation: "iPad Air 13",
    year: 2024,
    partNumber: "MGYY4",
    colours: ["white"],
    defaultColour: "white",
    connection: "Magnetic / USB-C pass-through",
    charging: "USB-C pass-through (check)",
    features: ["Function row", "Trackpad", "Magnetic attach"],
    featureIds: [],
    weightG: null,
    tagline: "Keyboard for iPad Air 13.",
    whoItSuits: "iPad Air 13-inch M2 and later.",
    whyChoose: [
      "Fits Air 13 M2+ — flag check.",
      "Function row and trackpad.",
      "Not the Pro Magic Keyboard.",
    ],
    platform: "ipad",
    sizeHint: "13",
    checkFinalSpecs: true,
    notes: "Air M2 and later 13-inch.",
    imageProductKey: "keyboard-ipad-air-13",
  }),
  a({
    id: "keyboard-folio",
    name: "Magic Keyboard Folio",
    group: "keyboard",
    generation: "Folio",
    year: 2022,
    partNumber: "MQDP3",
    colours: ["white"],
    defaultColour: "white",
    connection: "Smart Connector",
    charging: null,
    features: ["Two-piece design", "Kickstand", "Function row", "Trackpad"],
    featureIds: [],
    weightG: null,
    tagline: "Folio keyboard for iPad 10th gen and A16.",
    whoItSuits: "iPad 10th generation and iPad A16.",
    whyChoose: [
      "Designed for iPad 10 / A16 — flag check.",
      "Kickstand and trackpad.",
      "Not for iPad Air or Pro.",
    ],
    platform: "ipad",
    checkFinalSpecs: true,
    notes: "iPad 10th gen and A16.",
    imageProductKey: "keyboard-folio",
  }),
  a({
    id: "keyboard-mac-usbc",
    name: "Magic Keyboard (USB-C)",
    group: "keyboard",
    generation: "Mac USB-C",
    year: 2024,
    partNumber: "MJLX4",
    colours: ["white"],
    defaultColour: "white",
    connection: "USB-C / Bluetooth",
    charging: "Rechargeable via USB-C",
    features: ["Bluetooth", "Rechargeable"],
    featureIds: [],
    weightG: null,
    tagline: "Wireless Mac keyboard.",
    whoItSuits: "Any Mac over Bluetooth.",
    whyChoose: [
      "Works with any Mac over Bluetooth.",
      "No Touch ID.",
      "US layout photos — confirm stock layout.",
    ],
    platform: "mac",
    touchId: false,
    checkFinalSpecs: true,
    notes: "Mac store shots only.",
    imageProductKey: "keyboard-mac-usbc",
  }),
  a({
    id: "keyboard-mac-touchid",
    name: "Magic Keyboard with Touch ID",
    group: "keyboard",
    generation: "Mac Touch ID",
    year: 2024,
    partNumber: "MJLY4",
    colours: ["white"],
    defaultColour: "white",
    connection: "USB-C / Bluetooth",
    charging: "Rechargeable via USB-C",
    features: ["Touch ID", "Bluetooth", "Rechargeable"],
    featureIds: [],
    weightG: null,
    tagline: "Touch ID for Apple silicon Macs.",
    whoItSuits: "Macs with Apple silicon.",
    whyChoose: [
      "Touch ID needs Apple silicon — note if Intel.",
      "Bluetooth keyboard for any Mac.",
      "Confirm layout on stock.",
    ],
    platform: "mac",
    touchId: true,
    checkFinalSpecs: true,
    notes: "Touch ID requires Apple silicon.",
    imageProductKey: "keyboard-mac-touchid",
  }),
  a({
    id: "keyboard-mac-touchid-num-white",
    name: "Magic Keyboard with Touch ID and Numeric Keypad (White)",
    group: "keyboard",
    generation: "Mac Touch ID Numeric",
    year: 2024,
    partNumber: "MJM64",
    colours: ["white"],
    defaultColour: "white",
    connection: "USB-C / Bluetooth",
    charging: "Rechargeable via USB-C",
    features: ["Touch ID", "Numeric keypad", "Bluetooth"],
    featureIds: [],
    weightG: null,
    tagline: "Full-size Mac keyboard, white keys.",
    whoItSuits: "Apple silicon Macs that need a number pad.",
    whyChoose: [
      "Touch ID + numeric keypad.",
      "White keys.",
      "Touch ID needs Apple silicon.",
    ],
    platform: "mac",
    touchId: true,
    numericKeypad: true,
    checkFinalSpecs: true,
    notes: "Confirm layout.",
    imageProductKey: "keyboard-mac-touchid-num-white",
  }),
  a({
    id: "keyboard-mac-touchid-num-black",
    name: "Magic Keyboard with Touch ID and Numeric Keypad (Black)",
    group: "keyboard",
    generation: "Mac Touch ID Numeric Black",
    year: 2024,
    partNumber: "MJM74",
    colours: ["black"],
    defaultColour: "black",
    connection: "USB-C / Bluetooth",
    charging: "Rechargeable via USB-C",
    features: ["Touch ID", "Numeric keypad", "Bluetooth"],
    featureIds: [],
    weightG: null,
    tagline: "Full-size Mac keyboard, black keys.",
    whoItSuits: "Apple silicon Macs that want black keys.",
    whyChoose: [
      "Touch ID + numeric keypad.",
      "Black keys.",
      "Touch ID needs Apple silicon.",
    ],
    platform: "mac",
    touchId: true,
    numericKeypad: true,
    checkFinalSpecs: true,
    notes: "Confirm layout.",
    imageProductKey: "keyboard-mac-touchid-num-black",
  }),
  a({
    id: "keyboard-mac-num-mq052",
    name: "Magic Keyboard with Numeric Keypad (older)",
    group: "keyboard",
    generation: "Mac Numeric MQ052",
    year: 2021,
    partNumber: "MQ052",
    colours: ["silver"],
    defaultColour: "silver",
    connection: "Lightning / Bluetooth",
    charging: "Rechargeable",
    features: ["Numeric keypad", "Bluetooth"],
    featureIds: [],
    weightG: null,
    tagline: "Older numeric-keypad Magic Keyboard.",
    whoItSuits: "Mac buyers watching the budget.",
    whyChoose: [
      "Lower sample price.",
      "Owner confirms generation of MQ052.",
      "No Touch ID.",
    ],
    platform: "mac",
    touchId: false,
    numericKeypad: true,
    checkFinalSpecs: true,
    notes: "Owner confirms MQ052 generation.",
    imageProductKey: "keyboard-mac-num-mq052",
  }),

  // ——— Magic Mouse ———
  // Owner: re-verify every figure and compatibility rule on apple.com before launch.
  a({
    id: "mouse-usbc-white",
    name: "Magic Mouse (USB-C) — White",
    group: "mouse",
    generation: "USB-C",
    year: 2024,
    partNumber: "MXK53",
    colours: ["white"],
    defaultColour: "white",
    connection: "Bluetooth / USB-C",
    charging: "Rechargeable via USB-C (underside — cannot use while charging)",
    features: [
      "Multi-Touch surface",
      "Optical tracking",
      "Scroll and swipe gestures",
      "Secondary click",
      "Smart zoom",
      "Mission Control",
    ],
    featureIds: [
      "scroll",
      "secondary_click",
      "smart_zoom",
      "swipe_between_pages",
      "swipe_apps",
      "mission_control",
    ],
    weightG: null,
    tagline: "A mouse you can swipe.",
    whoItSuits: "Mac and iPad users who want a compact Multi-Touch pointer.",
    whyChoose: [
      "Swipe and scroll on the surface — no scroll wheel.",
      "USB-C charging; port is on the underside.",
      "Works with Mac; limited gestures on iPad — check Apple's list.",
    ],
    platform: "pointer",
    connector: "usb-c",
    surface: "White Multi-Touch",
    stocked: true,
    dimensionsMm: { length: null, width: null, height: null },
    checkFinalSpecs: true,
    notes: "Works with Mac and iPad over Bluetooth — flag check. Cannot use while charging.",
    imageProductKey: "mouse-usbc-white",
  }),
  a({
    id: "mouse-usbc-black",
    name: "Magic Mouse (USB-C) — Black",
    group: "mouse",
    generation: "USB-C",
    year: 2024,
    partNumber: "MXK63",
    colours: ["black"],
    defaultColour: "black",
    connection: "Bluetooth / USB-C",
    charging: "Rechargeable via USB-C (underside — cannot use while charging)",
    features: [
      "Multi-Touch surface",
      "Optical tracking",
      "Scroll and swipe gestures",
      "Secondary click",
      "Smart zoom",
      "Mission Control",
    ],
    featureIds: [
      "scroll",
      "secondary_click",
      "smart_zoom",
      "swipe_between_pages",
      "swipe_apps",
      "mission_control",
    ],
    weightG: null,
    tagline: "Same Magic Mouse — black finish.",
    whoItSuits: "Buyers who want the black Multi-Touch surface.",
    whyChoose: [
      "Same hardware as white — black may cost more (owner to confirm).",
      "USB-C underside charging.",
      "Check Apple's list for your Mac or iPad.",
    ],
    platform: "pointer",
    connector: "usb-c",
    surface: "Black Multi-Touch",
    stocked: true,
    dimensionsMm: { length: null, width: null, height: null },
    checkFinalSpecs: true,
    notes: "Black premium sample — owner to confirm. Flag check specs.",
    imageProductKey: "mouse-usbc-black",
  }),
  a({
    id: "mouse-earlier-space-gray",
    name: "Magic Mouse — Space Gray (earlier)",
    group: "mouse",
    generation: "Earlier",
    year: 2019,
    partNumber: "MRME2",
    colours: ["space-gray"],
    defaultColour: "space-gray",
    connection: "Bluetooth (connector owner-to-confirm)",
    charging: "Rechargeable — connector owner-to-confirm (Lightning or USB-C)",
    features: ["Multi-Touch surface", "Optical tracking"],
    featureIds: ["scroll", "secondary_click", "smart_zoom", "swipe_between_pages", "swipe_apps", "mission_control"],
    weightG: null,
    tagline: "Earlier generation Magic Mouse.",
    whoItSuits: "Budget buyers when stock exists — check condition.",
    whyChoose: [
      "Lower sample price when stocked.",
      "Generation and connector — owner to confirm.",
      "Check battery and condition on the invoice.",
    ],
    platform: "pointer",
    connector: "owner-confirm",
    surface: "Space Gray Multi-Touch",
    earlierGeneration: true,
    stocked: true,
    overviewOnly: true,
    checkFinalSpecs: true,
    notes: "Earlier generation. Image shows the product design. Connector owner-to-confirm.",
    imageProductKey: "mouse-earlier-space-gray",
  }),

  // ——— Magic Trackpad ———
  a({
    id: "trackpad-usbc-white",
    name: "Magic Trackpad (USB-C) — White",
    group: "trackpad",
    generation: "USB-C",
    year: 2024,
    partNumber: "MXK93",
    colours: ["white"],
    defaultColour: "white",
    connection: "Bluetooth / USB-C",
    charging: "Rechargeable via USB-C (back edge — usable while charging if confirmed)",
    features: [
      "Force Touch with haptic feedback",
      "Large glass Multi-Touch surface",
      "Pinch, swipe and Mission Control gestures",
      "Three-finger drag",
    ],
    featureIds: [
      "secondary-click",
      "force-click",
      "look-up",
      "two-finger",
      "pinch-to-zoom",
      "smart-zoom",
      "swipe-between-pages",
      "swipe-full-screen-apps",
      "mission-control",
      "app-expose",
      "launchpad",
      "show-desktop",
      "open-notification-center",
      "three-finger-drag",
    ],
    weightG: null,
    tagline: "A whole surface to command.",
    whoItSuits: "Mac users who want Force Touch and full gestures; iPad as a limited pointer.",
    whyChoose: [
      "Force Touch and a large glass surface.",
      "Fullest gestures on Mac; limited on iPad.",
      "USB-C on the back edge — confirm charging-while-in-use.",
    ],
    platform: "pointer",
    connector: "usb-c",
    surface: "White Multi-Touch glass",
    forceTouch: true,
    stocked: true,
    dimensionsMm: { length: null, width: null, height: null },
    checkFinalSpecs: true,
    notes: "Works with Mac and iPad over Bluetooth — flag check.",
    imageProductKey: "trackpad-usbc-white",
  }),
  a({
    id: "trackpad-usbc-black",
    name: "Magic Trackpad (USB-C) — Black",
    group: "trackpad",
    generation: "USB-C",
    year: 2024,
    partNumber: "MXKA3",
    colours: ["black"],
    defaultColour: "black",
    connection: "Bluetooth / USB-C",
    charging: "Rechargeable via USB-C (back edge — usable while charging if confirmed)",
    features: [
      "Force Touch with haptic feedback",
      "Large glass Multi-Touch surface",
      "Pinch, swipe and Mission Control gestures",
      "Three-finger drag",
    ],
    featureIds: [
      "secondary-click",
      "force-click",
      "look-up",
      "two-finger",
      "pinch-to-zoom",
      "smart-zoom",
      "swipe-between-pages",
      "swipe-full-screen-apps",
      "mission-control",
      "app-expose",
      "launchpad",
      "show-desktop",
      "open-notification-center",
      "three-finger-drag",
    ],
    weightG: null,
    tagline: "Same Trackpad — black finish.",
    whoItSuits: "Buyers who want the black glass Multi-Touch surface.",
    whyChoose: [
      "Same hardware as white — black may cost more (owner to confirm).",
      "Force Touch and full Mac gestures.",
      "Check Apple's list for your device.",
    ],
    platform: "pointer",
    connector: "usb-c",
    surface: "Black Multi-Touch glass",
    forceTouch: true,
    stocked: true,
    dimensionsMm: { length: null, width: null, height: null },
    checkFinalSpecs: true,
    notes: "Black premium sample — owner to confirm. Flag check specs.",
    imageProductKey: "trackpad-usbc-black",
  }),
  a({
    id: "trackpad-earlier-space-gray",
    name: "Magic Trackpad — Space Gray (earlier)",
    group: "trackpad",
    generation: "Earlier",
    year: 2019,
    partNumber: "MRMF2",
    colours: ["space-gray"],
    defaultColour: "space-gray",
    connection: "Bluetooth (connector owner-to-confirm)",
    charging: "Rechargeable — connector owner-to-confirm",
    features: ["Force Touch", "Multi-Touch surface"],
    featureIds: [
      "secondary-click",
      "force-click",
      "look-up",
      "two-finger",
      "pinch-to-zoom",
      "smart-zoom",
      "swipe-between-pages",
      "swipe-full-screen-apps",
      "mission-control",
      "app-expose",
      "launchpad",
      "show-desktop",
      "open-notification-center",
      "three-finger-drag",
    ],
    weightG: null,
    tagline: "Earlier generation Magic Trackpad.",
    whoItSuits: "Budget Trackpad buyers when stock exists.",
    whyChoose: [
      "Lower sample price when stocked.",
      "Generation and connector — owner to confirm.",
      "Check condition on the invoice.",
    ],
    platform: "pointer",
    connector: "owner-confirm",
    surface: "Space Gray Multi-Touch",
    forceTouch: true,
    earlierGeneration: true,
    stocked: true,
    overviewOnly: true,
    checkFinalSpecs: true,
    notes: "Earlier generation. Image shows the product design. Connector owner-to-confirm.",
    imageProductKey: "trackpad-earlier-space-gray",
  }),
  a({
    id: "trackpad-earlier-white",
    name: "Magic Trackpad — White (earlier)",
    group: "trackpad",
    generation: "Earlier",
    year: 2019,
    partNumber: "MJ2R2",
    colours: ["white"],
    defaultColour: "white",
    connection: "Bluetooth (connector owner-to-confirm)",
    charging: "Rechargeable — connector owner-to-confirm",
    features: ["Force Touch", "Multi-Touch surface"],
    featureIds: [
      "secondary-click",
      "force-click",
      "look-up",
      "two-finger",
      "pinch-to-zoom",
      "smart-zoom",
      "swipe-between-pages",
      "swipe-full-screen-apps",
      "mission-control",
      "app-expose",
      "launchpad",
      "show-desktop",
      "open-notification-center",
      "three-finger-drag",
    ],
    weightG: null,
    tagline: "Earlier generation white Magic Trackpad.",
    whoItSuits: "Budget Trackpad buyers when stock exists.",
    whyChoose: [
      "Lower sample price when stocked.",
      "Generation and connector — owner to confirm.",
      "Check condition on the invoice.",
    ],
    platform: "pointer",
    connector: "owner-confirm",
    surface: "White Multi-Touch",
    forceTouch: true,
    earlierGeneration: true,
    stocked: true,
    overviewOnly: true,
    checkFinalSpecs: true,
    notes: "Earlier generation. Image shows the product design. Connector owner-to-confirm.",
    imageProductKey: "trackpad-earlier-white",
  }),
  ...allPowerCaseProducts as unknown as Accessory[],
];

export function getAccessory(id: string): Accessory | undefined {
  return accessories.find((a) => a.id === id);
}

export function accessoriesByGroup(group: AccessoryGroup): Accessory[] {
  return accessories.filter((a) => a.group === group && a.stocked !== false);
}

export function pencils(): Accessory[] {
  return accessoriesByGroup("pencil");
}

export function keyboards(): Accessory[] {
  return accessoriesByGroup("keyboard");
}

export function mice(): Accessory[] {
  return accessoriesByGroup("mouse");
}

export function trackpads(): Accessory[] {
  return accessoriesByGroup("trackpad");
}

export function powerProducts(): Accessory[] {
  return accessoriesByGroup("power");
}

export function caseProducts(): Accessory[] {
  return accessoriesByGroup("cases");
}

export function adapters(): Accessory[] {
  return powerProducts().filter((a) => a.subgroup === "adapters");
}

export function cables(): Accessory[] {
  return powerProducts().filter((a) => a.subgroup === "cables");
}

export function magsafeChargers(): Accessory[] {
  return powerProducts().filter((a) => a.subgroup === "magsafe");
}

export function lowestAccessoryPrice(group?: AccessoryGroup): number {
  const pool = group ? accessoriesByGroup(group) : accessories.filter((a) => a.stocked !== false);
  return Math.min(...pool.map((a) => a.basePriceKes));
}

/** Empty — every Accessories group is live. */
export const comingNextGroups: { id: AccessoryGroup; label: string; href: string }[] = [];

export const liveAccessoryGroups: { id: AccessoryGroup; label: string; href: string }[] = [
  { id: "pencil", label: "Apple Pencil", href: "/accessories/apple-pencil" },
  { id: "keyboard", label: "Magic Keyboard", href: "/accessories/magic-keyboard" },
  { id: "mouse", label: "Mouse", href: "/accessories/magic-mouse" },
  { id: "trackpad", label: "Trackpad", href: "/accessories/magic-trackpad" },
  { id: "power", label: "Power", href: "/accessories/power" },
  { id: "cases", label: "Cases", href: "/accessories/cases" },
];