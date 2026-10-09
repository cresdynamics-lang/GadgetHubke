/**
 * Power + Cases catalog helpers.
 * re-verify every wattage, MagSafe model list, case fit and cable rating on apple.com before launch.
 * Where unclear, store null - show nothing rather than guess.
 */

import { accessoryBasePricesKes } from "./config";
import accessoriesManifest from "./generated-manifest.json";

export type CaseVariant = {
  partNumber: string;
  colour: string;
  mainImage: string | null;
  swatchImage: string | null;
  angleImages: string[];
};

export type CaseFamilyManifest = {
  id: string;
  folder: string;
  group: string;
  variants: CaseVariant[];
  colourCount?: number;
  leadPartNumber?: string | null;
};

export type PowerSubgroup = "adapters" | "magsafe" | "cables" | "extension";
export type CaseSubgroup = "iphone-case" | "strap" | "folio";

export type AccessoryVariantFields = {
  subgroup?: PowerSubgroup | CaseSubgroup | string;
  wattage?: number | null;
  ports?: number | null;
  lengthM?: number | null;
  powerRatingW?: number | null;
  dataSpeed?: string | null;
  material?: string | null;
  magSafe?: boolean;
  fitsModels?: string[];
  /** Exact device model ids this case is made for (caseFits). */
  fitsDeviceIds?: string[];
  designedFor?: string | null;
  geoUs?: boolean;
  plugShape?: "uk" | "us" | "ask-us" | null;
  variants?: CaseVariant[];
  leadPartNumber?: string | null;
};

const caseVariantsRoot = (accessoriesManifest as { caseVariants?: Record<string, CaseFamilyManifest> })
  .caseVariants || {};

export function getCaseFamilyManifest(id: string): CaseFamilyManifest | undefined {
  return caseVariantsRoot[id];
}

export function getCaseVariants(productId: string): CaseVariant[] {
  const fam = caseVariantsRoot[productId];
  if (fam?.variants?.length) return fam.variants;
  return [];
}

export function getCaseVariant(productId: string, partNumber?: string | null): CaseVariant | undefined {
  const list = getCaseVariants(productId);
  if (!list.length) return undefined;
  if (!partNumber) return list[0];
  return list.find((v) => v.partNumber.toUpperCase() === partNumber.toUpperCase()) || list[0];
}

export function caseFamilyColourCount(productId: string): number {
  return getCaseVariants(productId).length;
}

export function allCaseFamilySummaries(): { id: string; folder: string; colours: number }[] {
  return Object.values(caseVariantsRoot).map((f) => ({
    id: f.id,
    folder: f.folder,
    colours: f.variants?.length || f.colourCount || 0,
  }));
}

/** Sample prices - owner replaces in config.ts */
export const powerCasePriceDefaults = {
  "power-adapter-20w": 3500,
  "power-adapter-35w-dual": 5500,
  "power-adapter-40w-dynamic": 6500,
  "power-adapter-70w": 8500,
  "power-adapter-96w": 11000,
  "power-adapter-140w": 14000,
  "power-extension-cable": 2500,
  "magsafe-charger-1m": 5500,
  "magsafe-charger-2m": 7500,
  "watch-magnetic-charger-1m": 5000,
  "cable-usbc-60w-1m": 2500,
  "cable-usbc-240w-2m": 4500,
  "cable-magsafe3-2m": 5500,
  "cable-tb4-1-8m": 7500,
  "cable-tb4-3m": 9500,
  "cable-tb5-1m": 8500,
  "case-iphone-17-silicone": 6500,
  "case-iphone-17-pro-silicone": 7500,
  "case-iphone-17-pro-max-silicone": 8500,
  "case-iphone-17e-silicone": 6500,
  "case-iphone-18-pro-silicone": 7500,
  "case-iphone-18-pro-max-silicone": 8500,
  "case-iphone-17-clear": 6500,
  "case-iphone-17-pro-clear": 7500,
  "case-iphone-17-pro-max-clear": 8000,
  "case-iphone-17e-clear": 6500,
  "case-iphone-18-pro-clear": 7500,
  "case-iphone-18-pro-max-clear": 8000,
  "case-iphone-18-pro-techwoven": 10000,
  "case-iphone-18-pro-max-techwoven": 12000,
  "case-iphone-air-bumper": 7000,
  "case-iphone-air-case": 9000,
  "case-iphone-finewoven-wallet": 9500,
  "case-iphone-duo-case": 11000,
  "case-iphone-duo-folio": 14000,
  "strap-crossbody": 6500,
  "strap-wrist": 4500,
  "folio-ipad-a16": 8500,
  "folio-ipad-mini-a17-pro": 9500,
  "folio-ipad-air-11-m4": 11000,
  "folio-ipad-air-13-m4": 13000,
  "folio-ipad-pro-11-m5": 14000,
  "folio-ipad-pro-13-m5": 15000,
} as const;

export type PowerCasePriceId = keyof typeof powerCasePriceDefaults;

function price(id: PowerCasePriceId): number {
  return (accessoryBasePricesKes as Record<string, number>)[id] ?? powerCasePriceDefaults[id];
}

function variantsFor(id: string): CaseVariant[] {
  return getCaseVariants(id);
}

function coloursFrom(id: string): string[] {
  const v = variantsFor(id);
  return v.length ? v.map((x) => x.colour) : ["-"];
}

function leadColour(id: string): string {
  return coloursFrom(id)[0] || "-";
}

function leadPart(id: string): string {
  return variantsFor(id)[0]?.partNumber || "-";
}

type AccLike = Record<string, unknown> & {
  id: PowerCasePriceId;
  name: string;
  group: "power" | "cases";
  basePriceKes?: number;
};

type PartialAcc = AccLike &
  AccessoryVariantFields & {
    generation: string;
    year: number;
    partNumber: string;
    colours: string[];
    defaultColour: string;
    connection: string;
    charging: string | null;
    features: string[];
    featureIds: string[];
    weightG: number | null;
    tagline: string;
    whoItSuits: string;
    whyChoose: [string, string, string];
    platform: "ipad" | "mac" | "both" | "pointer";
    notes: string;
    imageProductKey: string;
    stocked?: boolean;
    checkFinalSpecs?: boolean;
  };

function pc(partial: PartialAcc): AccLike & AccessoryVariantFields {
  const vars = partial.variants ?? variantsFor(partial.id);
  return {
    ...partial,
    colours: partial.colours?.length ? partial.colours : coloursFrom(partial.id),
    defaultColour: partial.defaultColour || leadColour(partial.id),
    partNumber: partial.partNumber || leadPart(partial.id),
    variants: vars,
    leadPartNumber: vars[0]?.partNumber || null,
    basePriceKes: price(partial.id),
    stocked: partial.stocked !== false,
    checkFinalSpecs: true,
  };
}

/** Exact model slug → human label for caseFits reasons. */
export const caseDeviceLabels: Record<string, string> = {
  "iphone-17": "iPhone 17",
  "iphone-17-pro": "iPhone 17 Pro",
  "iphone-17-pro-max": "iPhone 17 Pro Max",
  "iphone-17e": "iPhone 17e",
  "iphone-air": "iPhone Air",
  "iphone-18-pro": "iPhone 18 Pro",
  "iphone-18-pro-max": "iPhone 18 Pro Max",
  "ipad-a16": "iPad (A16)",
  "ipad-mini-a17-pro": "iPad mini (A17 Pro)",
  "ipad-air-11-m4": "iPad Air 11-inch (M4)",
  "ipad-air-13-m4": "iPad Air 13-inch (M4)",
  "ipad-pro-11-m5": "iPad Pro 11-inch (M5)",
  "ipad-pro-13-m5": "iPad Pro 13-inch (M5)",
};

export const powerAndCaseProducts: (AccLike & AccessoryVariantFields)[] = [
  pc({
    id: "power-adapter-20w",
    name: "20W USB-C Power Adapter",
    group: "power",
    subgroup: "adapters",
    generation: "USB-C",
    year: 2024,
    partNumber: "MWVV3",
    colours: ["White"],
    defaultColour: "White",
    connection: "USB-C",
    charging: null,
    wattage: 20,
    ports: 1,
    designedFor: "iPhone and many iPad models - check Apple's list.",
    plugShape: "ask-us",
    geoUs: true,
    features: ["20W USB-C", "Single port"],
    featureIds: ["adapter", "20w"],
    weightG: null,
    tagline: "Everyday USB-C power for iPhone.",
    whoItSuits: "iPhone owners who need a sealed Apple adapter.",
    whyChoose: [
      "Apple's common USB-C brick for iPhone - check wattage for your model.",
      "Pair with a USB-C charge cable.",
      "Plug shape varies by country - we confirm before collect.",
    ],
    platform: "both",
    notes: "Ask us about the Kenya plug shape. No charge-time claims.",
    imageProductKey: "power-adapter-20w",
  }),
  pc({
    id: "power-adapter-35w-dual",
    name: "35W Dual USB-C Port Compact Power Adapter",
    group: "power",
    subgroup: "adapters",
    generation: "USB-C Dual",
    year: 2024,
    partNumber: "MW2H3",
    colours: ["White"],
    defaultColour: "White",
    connection: "USB-C",
    charging: null,
    wattage: 35,
    ports: 2,
    designedFor: "Two devices at once - iPhone, iPad and compact Macs - check.",
    plugShape: "ask-us",
    features: ["35W shared", "Two USB-C ports", "Compact"],
    featureIds: ["adapter", "35w", "dual"],
    weightG: null,
    tagline: "Two ports. One compact brick.",
    whoItSuits: "Travelers charging phone and earbuds or iPad together.",
    whyChoose: [
      "Dual USB-C in a small body.",
      "Shared 35W across ports - check Apple's sharing notes.",
      "Ask us about the Kenya plug variant.",
    ],
    platform: "both",
    notes: "Sample price. Dual-port power sharing - on request.",
    imageProductKey: "power-adapter-35w-dual",
  }),
  pc({
    id: "power-adapter-40w-dynamic",
    name: "40W Dynamic Power Adapter with 60W Max",
    group: "power",
    subgroup: "adapters",
    generation: "Dynamic",
    year: 2025,
    partNumber: "MGKN4",
    colours: ["White"],
    defaultColour: "White",
    connection: "USB-C",
    charging: null,
    wattage: 40,
    ports: null,
    designedFor: "Dynamic power up to 60W max - check Apple's page for supported devices.",
    plugShape: "ask-us",
    features: ["40W dynamic", "60W max"],
    featureIds: ["adapter", "40w"],
    weightG: null,
    tagline: "Dynamic power when you need more.",
    whoItSuits: "Mixed Apple device desks - confirm your MacBook needs.",
    whyChoose: [
      "Dynamic rating - confirm on Apple's product page.",
      "Not a charge-time promise.",
      "Pair with a cable rated for the load.",
    ],
    platform: "both",
    notes: "Confirm dynamic / 60W max wording with us.",
    imageProductKey: "power-adapter-40w-dynamic",
  }),
  pc({
    id: "power-adapter-70w",
    name: "70W USB-C Power Adapter",
    group: "power",
    subgroup: "adapters",
    generation: "USB-C",
    year: 2024,
    partNumber: "MQLN3",
    colours: ["White"],
    defaultColour: "White",
    connection: "USB-C",
    charging: null,
    wattage: 70,
    ports: 1,
    designedFor: "MacBook Air and many 14-inch MacBook Pro configs - check.",
    plugShape: "ask-us",
    geoUs: true,
    features: ["70W USB-C"],
    featureIds: ["adapter", "70w"],
    weightG: null,
    tagline: "MacBook Air class power.",
    whoItSuits: "MacBook Air owners matching Apple's recommended wattage.",
    whyChoose: [
      "Common MacBook Air pairing - check your model.",
      "Photos may show a US plug - we confirm the Kenyan plug.",
      "Use a cable rated for the adapter.",
    ],
    platform: "mac",
    notes: "GEO_US photos on file. Plug caption required.",
    imageProductKey: "power-adapter-70w",
  }),
  pc({
    id: "power-adapter-96w",
    name: "96W USB-C Power Adapter",
    group: "power",
    subgroup: "adapters",
    generation: "USB-C",
    year: 2024,
    partNumber: "MW2L3",
    colours: ["White"],
    defaultColour: "White",
    connection: "USB-C",
    charging: null,
    wattage: 96,
    ports: 1,
    designedFor: "Higher-power MacBook Pro configs - check Apple's list.",
    plugShape: "ask-us",
    geoUs: true,
    features: ["96W USB-C"],
    featureIds: ["adapter", "96w"],
    weightG: null,
    tagline: "Higher wattage for Pro notebooks.",
    whoItSuits: "MacBook Pro owners who need more than 70W - check.",
    whyChoose: [
      "Match the wattage Apple lists for your MacBook.",
      "GEO_US plug photos - confirm stocked plug.",
      "Pair with a high-rated USB-C or MagSafe 3 cable.",
    ],
    platform: "mac",
    notes: "GEO_US photos. Sample price.",
    imageProductKey: "power-adapter-96w",
  }),
  pc({
    id: "power-adapter-140w",
    name: "140W USB-C Power Adapter",
    group: "power",
    subgroup: "adapters",
    generation: "USB-C",
    year: 2024,
    partNumber: "MW2M3",
    colours: ["White"],
    defaultColour: "White",
    connection: "USB-C",
    charging: null,
    wattage: 140,
    ports: 1,
    designedFor: "16-inch MacBook Pro and high-power configs - check.",
    plugShape: "ask-us",
    features: ["140W USB-C"],
    featureIds: ["adapter", "140w"],
    weightG: null,
    tagline: "Top of the USB-C adapter ladder.",
    whoItSuits: "16-inch MacBook Pro owners matching Apple's brick.",
    whyChoose: [
      "Highest wattage Apple USB-C adapter we list - check your model.",
      "Needs a cable rated for the load (e.g. MagSafe 3 or 240W USB-C).",
      "No charge-time claims on this site.",
    ],
    platform: "mac",
    notes: "Sample. Confirm which MacBook Pro SKUs Apple pairs with 140W.",
    imageProductKey: "power-adapter-140w",
  }),
  pc({
    id: "power-extension-cable",
    name: "Power Adapter Extension Cable",
    group: "power",
    subgroup: "extension",
    generation: "Extension",
    year: 2020,
    partNumber: "MK122",
    colours: ["White"],
    defaultColour: "White",
    connection: "Apple power adapter extension",
    charging: null,
    wattage: null,
    features: ["Extension cable"],
    featureIds: ["extension"],
    weightG: null,
    tagline: "Reach further from the wall.",
    whoItSuits: "Anyone using an Apple power adapter that takes this extension.",
    whyChoose: [
      "One photo only in the library.",
      "Confirm compatibility with your adapter.",
      "Ask us about stock.",
    ],
    platform: "both",
    notes: "Single photo. Sample price.",
    imageProductKey: "power-extension-cable",
  }),
  pc({
    id: "magsafe-charger-1m",
    name: "MagSafe Charger (1 m)",
    group: "power",
    subgroup: "magsafe",
    generation: "MagSafe",
    year: 2024,
    partNumber: "MGD74",
    colours: ["White"],
    defaultColour: "White",
    connection: "MagSafe / USB-C",
    charging: "Magnetic wireless for supported iPhones - check.",
    lengthM: 1,
    magSafe: true,
    features: ["MagSafe", "1 m cable"],
    featureIds: ["magsafe", "wireless"],
    weightG: null,
    tagline: "Snaps on. Charges wirelessly.",
    whoItSuits: "MagSafe-compatible iPhone owners.",
    whyChoose: [
      "Magnetic alignment on supported iPhones - check models.",
      "Works with MagSafe cases - check.",
      "Pair with a USB-C adapter (often 20W+) - check.",
    ],
    platform: "both",
    notes: "No charge-time or percentage claims. Sample price.",
    imageProductKey: "magsafe-charger-1m",
  }),
  pc({
    id: "magsafe-charger-2m",
    name: "MagSafe Charger (2 m)",
    group: "power",
    subgroup: "magsafe",
    generation: "MagSafe",
    year: 2024,
    partNumber: "MGDM4",
    colours: ["White"],
    defaultColour: "White",
    connection: "MagSafe / USB-C",
    charging: "Magnetic wireless for supported iPhones - check.",
    lengthM: 2,
    magSafe: true,
    features: ["MagSafe", "2 m cable"],
    featureIds: ["magsafe", "wireless"],
    weightG: null,
    tagline: "MagSafe with a longer lead.",
    whoItSuits: "Bedside or desk setups that need 2 metres.",
    whyChoose: [
      "Same MagSafe snap, longer cable.",
      "Confirm iPhone MagSafe support.",
      "Needs a USB-C power adapter.",
    ],
    platform: "both",
    notes: "Sample price.",
    imageProductKey: "magsafe-charger-2m",
  }),
  pc({
    id: "watch-magnetic-charger-1m",
    name: "Apple Watch Magnetic Fast Charger to USB-C (1 m)",
    group: "power",
    subgroup: "magsafe",
    generation: "Watch",
    year: 2024,
    partNumber: "ML434",
    colours: ["White"],
    defaultColour: "White",
    connection: "Magnetic Watch / USB-C",
    charging: "Magnetic fast charger for supported Apple Watch - check.",
    lengthM: 1,
    features: ["Watch magnetic", "USB-C", "1 m"],
    featureIds: ["watch-charger"],
    weightG: null,
    tagline: "Made for Apple Watch.",
    whoItSuits: "Apple Watch owners needing a sealed USB-C magnetic cable.",
    whyChoose: [
      "Confirm your Watch model on Apple's list.",
      "USB-C end needs an adapter.",
      "No charge-time claims here.",
    ],
    platform: "both",
    notes: "Sample. Flag check Watch model support.",
    imageProductKey: "watch-magnetic-charger-1m",
  }),
  pc({
    id: "cable-usbc-60w-1m",
    name: "60W USB-C Charge Cable (1 m)",
    group: "power",
    subgroup: "cables",
    generation: "USB-C",
    year: 2024,
    partNumber: "MQKJ3",
    colours: ["White"],
    defaultColour: "White",
    connection: "USB-C to USB-C",
    charging: null,
    lengthM: 1,
    powerRatingW: 60,
    dataSpeed: "USB data - check Apple's page",
    features: ["60W", "1 m", "USB-C"],
    featureIds: ["cable", "60w"],
    weightG: null,
    tagline: "Charge cable for everyday USB-C.",
    whoItSuits: "iPhone, iPad and lower-wattage Mac charging - check.",
    whyChoose: [
      "60W rating - do not pair as the only cable for a 140W brick without checking.",
      "1 metre length.",
      "Data capability follows Apple's wording.",
    ],
    platform: "both",
    notes: "Sample. Pairing warnings via chargerAdvice.",
    imageProductKey: "cable-usbc-60w-1m",
  }),
  pc({
    id: "cable-usbc-240w-2m",
    name: "240W USB-C Charge Cable (2 m)",
    group: "power",
    subgroup: "cables",
    generation: "USB-C",
    year: 2024,
    partNumber: "MU2G3",
    colours: ["White"],
    defaultColour: "White",
    connection: "USB-C to USB-C",
    charging: null,
    lengthM: 2,
    powerRatingW: 240,
    dataSpeed: "USB data - check Apple's page",
    features: ["240W", "2 m", "USB-C"],
    featureIds: ["cable", "240w"],
    weightG: null,
    tagline: "High-power USB-C charge cable.",
    whoItSuits: "High-wattage MacBook charging over USB-C - check.",
    whyChoose: [
      "Rated up to 240W - match to your adapter.",
      "2 metre reach.",
      "Confirm data vs charge use on Apple's page.",
    ],
    platform: "mac",
    notes: "Sample.",
    imageProductKey: "cable-usbc-240w-2m",
  }),
  pc({
    id: "cable-magsafe3-2m",
    name: "USB-C to MagSafe 3 Cable (2 m)",
    group: "power",
    subgroup: "cables",
    generation: "MagSafe 3",
    year: 2024,
    partNumber: "MLYV3",
    colours: ["White"],
    defaultColour: "White",
    connection: "USB-C to MagSafe 3",
    charging: null,
    lengthM: 2,
    powerRatingW: null,
    magSafe: true,
    features: ["MagSafe 3", "2 m"],
    featureIds: ["cable", "magsafe3"],
    weightG: null,
    tagline: "MagSafe 3 for Mac notebooks that have the port.",
    whoItSuits: "MacBook Air / Pro with MagSafe 3 - check.",
    whyChoose: [
      "Only for Macs with MagSafe 3.",
      "Pair with the wattage Apple recommends for your Mac.",
      "Not an iPhone MagSafe charger.",
    ],
    platform: "mac",
    notes: "Sample. Flag MagSafe 3 port requirement.",
    imageProductKey: "cable-magsafe3-2m",
  }),
  pc({
    id: "cable-tb4-1-8m",
    name: "Thunderbolt 4 (USB-C) Pro Cable (1.8 m)",
    group: "power",
    subgroup: "cables",
    generation: "Thunderbolt 4",
    year: 2024,
    partNumber: "MW5J3",
    colours: ["Black"],
    defaultColour: "Black",
    connection: "Thunderbolt 4 / USB-C",
    charging: null,
    lengthM: 1.8,
    powerRatingW: null,
    dataSpeed: "Thunderbolt 4 - check Apple's page",
    features: ["Thunderbolt 4", "1.8 m", "Pro Cable"],
    featureIds: ["cable", "thunderbolt4"],
    weightG: null,
    tagline: "Pro cable for Thunderbolt 4.",
    whoItSuits: "Docking, displays and high-speed data - check.",
    whyChoose: [
      "Thunderbolt 4 data - confirm speed on Apple's page.",
      "Not the same as a basic charge cable.",
      "1.8 m Pro Cable.",
    ],
    platform: "mac",
    notes: "Confirm power delivery rating with us.",
    imageProductKey: "cable-tb4-1-8m",
  }),
  pc({
    id: "cable-tb4-3m",
    name: "Thunderbolt 4 (USB-C) Pro Cable (3 m)",
    group: "power",
    subgroup: "cables",
    generation: "Thunderbolt 4",
    year: 2024,
    partNumber: "MWP02",
    colours: ["Black"],
    defaultColour: "Black",
    connection: "Thunderbolt 4 / USB-C",
    charging: null,
    lengthM: 3,
    powerRatingW: null,
    dataSpeed: "Thunderbolt 4 - check Apple's page",
    features: ["Thunderbolt 4", "3 m", "Pro Cable"],
    featureIds: ["cable", "thunderbolt4"],
    weightG: null,
    tagline: "Longer Thunderbolt 4 Pro Cable.",
    whoItSuits: "Setups that need 3 metres of Thunderbolt 4.",
    whyChoose: [
      "3 m reach.",
      "Confirm Thunderbolt 4 use case.",
      "Sealed product pricing.",
    ],
    platform: "mac",
    notes: "Sample.",
    imageProductKey: "cable-tb4-3m",
  }),
  pc({
    id: "cable-tb5-1m",
    name: "Thunderbolt 5 (USB-C) Pro Cable (1 m)",
    group: "power",
    subgroup: "cables",
    generation: "Thunderbolt 5",
    year: 2025,
    partNumber: "MDW94",
    colours: ["Black"],
    defaultColour: "Black",
    connection: "Thunderbolt 5 / USB-C",
    charging: null,
    lengthM: 1,
    powerRatingW: null,
    dataSpeed: "Thunderbolt 5 - check Apple's page",
    features: ["Thunderbolt 5", "1 m", "Pro Cable"],
    featureIds: ["cable", "thunderbolt5"],
    weightG: null,
    tagline: "Thunderbolt 5 Pro Cable.",
    whoItSuits: "Devices that need Thunderbolt 5 - check.",
    whyChoose: [
      "Newest Thunderbolt Pro Cable we list.",
      "Confirm host and device support.",
      "1 metre.",
    ],
    platform: "mac",
    notes: "Sample. Flag check Thunderbolt 5 compatibility.",
    imageProductKey: "cable-tb5-1m",
  }),
];

function casePc(
  id: PowerCasePriceId,
  name: string,
  opts: {
    subgroup: CaseSubgroup;
    material: string;
    fitsDeviceIds: string[];
    magSafe?: boolean;
    tagline: string;
    whoItSuits: string;
    whyChoose: [string, string, string];
    platform?: "ipad" | "mac" | "both" | "pointer";
  },
): AccLike & AccessoryVariantFields {
  const vars = variantsFor(id);
  return pc({
    id,
    name,
    group: "cases",
    subgroup: opts.subgroup,
    generation: name,
    year: 2025,
    partNumber: vars[0]?.partNumber || "-",
    colours: coloursFrom(id),
    defaultColour: leadColour(id),
    connection: opts.magSafe ? "MagSafe" : "-",
    charging: null,
    material: opts.material,
    magSafe: opts.magSafe ?? false,
    fitsDeviceIds: opts.fitsDeviceIds,
    fitsModels: opts.fitsDeviceIds.map((d) => caseDeviceLabels[d] || d),
    features: [opts.material, ...(opts.magSafe ? ["MagSafe"] : [])],
    featureIds: [opts.material.toLowerCase().replace(/\s+/g, "-")],
    weightG: null,
    tagline: opts.tagline,
    whoItSuits: opts.whoItSuits,
    whyChoose: opts.whyChoose,
    platform: opts.platform || "both",
    notes: "Made for the exact model in the title. Colour names from Apple file names. Sample price.",
    imageProductKey: id,
    variants: vars,
  });
}

export const caseProductsList: (AccLike & AccessoryVariantFields)[] = [
  casePc("case-iphone-17-silicone", "iPhone 17 Silicone Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Silicone",
    fitsDeviceIds: ["iphone-17"],
    magSafe: true,
    tagline: "Soft silicone. Made for iPhone 17 only.",
    whoItSuits: "iPhone 17 owners who want MagSafe colours.",
    whyChoose: [
      "Exact fit for iPhone 17 - not Pro or Pro Max.",
      "MagSafe compatible - check.",
      "Colours from Apple's photos.",
    ],
  }),
  casePc("case-iphone-17-pro-silicone", "iPhone 17 Pro Silicone Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Silicone",
    fitsDeviceIds: ["iphone-17-pro"],
    magSafe: true,
    tagline: "Silicone for iPhone 17 Pro only.",
    whoItSuits: "iPhone 17 Pro owners.",
    whyChoose: [
      "Does not fit iPhone 17 or 17 Pro Max.",
      "MagSafe compatible.",
      "Pick a colour; part number changes with colour.",
    ],
  }),
  casePc("case-iphone-17-pro-max-silicone", "iPhone 17 Pro Max Silicone Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Silicone",
    fitsDeviceIds: ["iphone-17-pro-max"],
    magSafe: true,
    tagline: "Silicone for iPhone 17 Pro Max only.",
    whoItSuits: "iPhone 17 Pro Max owners.",
    whyChoose: [
      "Pro Max size only - not the Pro.",
      "MagSafe compatible.",
      "Tell us your exact model before you pay.",
    ],
  }),
  casePc("case-iphone-17e-silicone", "iPhone 17e Silicone Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Silicone",
    fitsDeviceIds: ["iphone-17e"],
    magSafe: true,
    tagline: "Silicone for iPhone 17e only.",
    whoItSuits: "iPhone 17e owners.",
    whyChoose: ["Exact 17e fit.", "MagSafe compatible.", "Sealed product pricing."],
  }),
  casePc("case-iphone-18-pro-silicone", "iPhone 18 Pro Silicone Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Silicone",
    fitsDeviceIds: ["iphone-18-pro"],
    magSafe: true,
    tagline: "Silicone for iPhone 18 Pro only.",
    whoItSuits: "iPhone 18 Pro owners.",
    whyChoose: ["Not for 18 Pro Max.", "MagSafe compatible.", "Colours from Apple files."],
  }),
  casePc("case-iphone-18-pro-max-silicone", "iPhone 18 Pro Max Silicone Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Silicone",
    fitsDeviceIds: ["iphone-18-pro-max"],
    magSafe: true,
    tagline: "Silicone for iPhone 18 Pro Max only.",
    whoItSuits: "iPhone 18 Pro Max owners.",
    whyChoose: ["Pro Max only.", "MagSafe compatible.", "Sample price."],
  }),
  casePc("case-iphone-17-clear", "iPhone 17 Clear Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Clear",
    fitsDeviceIds: ["iphone-17"],
    magSafe: true,
    tagline: "Clear case for iPhone 17 only.",
    whoItSuits: "Show the phone colour with MagSafe.",
    whyChoose: ["Exact iPhone 17 fit.", "Limited angles in the photo library.", "MagSafe compatible."],
  }),
  casePc("case-iphone-17-pro-clear", "iPhone 17 Pro Clear Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Clear",
    fitsDeviceIds: ["iphone-17-pro"],
    magSafe: true,
    tagline: "Clear case for iPhone 17 Pro only.",
    whoItSuits: "iPhone 17 Pro owners who want a clear shell.",
    whyChoose: ["Main + limited angles only.", "Not for Pro Max.", "MagSafe compatible."],
  }),
  casePc("case-iphone-17-pro-max-clear", "iPhone 17 Pro Max Clear Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Clear",
    fitsDeviceIds: ["iphone-17-pro-max"],
    magSafe: true,
    tagline: "Clear case for iPhone 17 Pro Max only.",
    whoItSuits: "iPhone 17 Pro Max owners.",
    whyChoose: ["Pro Max only.", "Sparse photo set for some Clear SKUs.", "MagSafe compatible."],
  }),
  casePc("case-iphone-17e-clear", "iPhone 17e Clear Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Clear",
    fitsDeviceIds: ["iphone-17e"],
    magSafe: true,
    tagline: "Clear case for iPhone 17e only.",
    whoItSuits: "iPhone 17e owners.",
    whyChoose: ["Exact 17e fit.", "MagSafe compatible.", "Sample price."],
  }),
  casePc("case-iphone-18-pro-clear", "iPhone 18 Pro Clear Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Clear",
    fitsDeviceIds: ["iphone-18-pro"],
    magSafe: true,
    tagline: "Clear case for iPhone 18 Pro only.",
    whoItSuits: "iPhone 18 Pro owners.",
    whyChoose: ["Not Pro Max.", "Limited photos.", "MagSafe compatible."],
  }),
  casePc("case-iphone-18-pro-max-clear", "iPhone 18 Pro Max Clear Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Clear",
    fitsDeviceIds: ["iphone-18-pro-max"],
    magSafe: true,
    tagline: "Clear case for iPhone 18 Pro Max only.",
    whoItSuits: "iPhone 18 Pro Max owners.",
    whyChoose: ["Pro Max only.", "MagSafe compatible.", "Sample price."],
  }),
  casePc("case-iphone-18-pro-techwoven", "iPhone 18 Pro TechWoven Case with MagSafe", {
    subgroup: "iphone-case",
    material: "TechWoven",
    fitsDeviceIds: ["iphone-18-pro"],
    magSafe: true,
    tagline: "TechWoven for iPhone 18 Pro only.",
    whoItSuits: "Buyers who want a woven texture on 18 Pro.",
    whyChoose: ["18 Pro only.", "MagSafe compatible.", "Colours from Apple files."],
  }),
  casePc("case-iphone-18-pro-max-techwoven", "iPhone 18 Pro Max TechWoven Case with MagSafe", {
    subgroup: "iphone-case",
    material: "TechWoven",
    fitsDeviceIds: ["iphone-18-pro-max"],
    magSafe: true,
    tagline: "TechWoven for iPhone 18 Pro Max only.",
    whoItSuits: "iPhone 18 Pro Max woven-case buyers.",
    whyChoose: ["Pro Max only.", "MagSafe compatible.", "Sample price."],
  }),
  casePc("case-iphone-air-bumper", "iPhone Air Bumper", {
    subgroup: "iphone-case",
    material: "Bumper",
    fitsDeviceIds: ["iphone-air"],
    magSafe: false,
    tagline: "Bumper for iPhone Air only.",
    whoItSuits: "iPhone Air owners who want edge protection.",
    whyChoose: ["Air only.", "Ask us about MagSafe interaction.", "Sample price."],
  }),
  casePc("case-iphone-air-case", "iPhone Air Case with MagSafe", {
    subgroup: "iphone-case",
    material: "Air Case",
    fitsDeviceIds: ["iphone-air"],
    magSafe: true,
    tagline: "Case with MagSafe for iPhone Air only.",
    whoItSuits: "iPhone Air owners.",
    whyChoose: ["Air only - not other iPhones.", "MagSafe compatible.", "Colours from files."],
  }),
  casePc("case-iphone-finewoven-wallet", "iPhone FineWoven Wallet with MagSafe", {
    subgroup: "iphone-case",
    material: "FineWoven Wallet",
    fitsDeviceIds: ["iphone-17", "iphone-17-pro", "iphone-17-pro-max", "iphone-17e", "iphone-air", "iphone-18-pro", "iphone-18-pro-max"],
    magSafe: true,
    tagline: "FineWoven wallet that attaches with MagSafe.",
    whoItSuits: "MagSafe iPhone owners who want a wallet - confirm models.",
    whyChoose: [
      "MagSafe wallet - confirm which iPhones Apple lists.",
      "Not a full protective case.",
      "Colours from Apple files.",
    ],
  }),
  casePc("case-iphone-duo-case", "iPhone Duo Case", {
    subgroup: "iphone-case",
    material: "Duo",
    fitsDeviceIds: ["iphone-17", "iphone-17-pro", "iphone-17-pro-max", "iphone-air", "iphone-18-pro", "iphone-18-pro-max"],
    magSafe: false,
    tagline: "Duo Case - confirm exact iPhone models with the shop.",
    whoItSuits: "Buyers considering Apple's Duo Case — ask us about fit.",
    whyChoose: [
      "Fit list .",
      "Ask us which iPhone sizes we stock.",
      "Sample price.",
    ],
  }),
  casePc("case-iphone-duo-folio", "iPhone Duo Folio with Kickstand", {
    subgroup: "iphone-case",
    material: "Duo Folio",
    fitsDeviceIds: ["iphone-17", "iphone-17-pro", "iphone-17-pro-max", "iphone-air", "iphone-18-pro", "iphone-18-pro-max"],
    magSafe: false,
    tagline: "Duo Folio with kickstand - confirm model fit.",
    whoItSuits: "Buyers who want a folio kickstand — ask us to confirm fit.",
    whyChoose: ["Confirm fit with us.", "Kickstand design.", "Sample price."],
  }),
  casePc("strap-crossbody", "Crossbody Strap", {
    subgroup: "strap",
    material: "Strap",
    fitsDeviceIds: [],
    magSafe: false,
    tagline: "Crossbody strap — ask us which cases it pairs with.",
    whoItSuits: "iPhone owners adding a strap - we confirm which cases take it.",
    whyChoose: [
      "Do not assume every case accepts this strap.",
      "Colours from Apple files.",
      "Ask us about compatibility.",
    ],
  }),
  casePc("strap-wrist", "Wrist Strap", {
    subgroup: "strap",
    material: "Strap",
    fitsDeviceIds: [],
    magSafe: false,
    tagline: "Wrist strap — ask us which cases it pairs with.",
    whoItSuits: "Short strap preference - confirm case loops.",
    whyChoose: ["Confirm compatibility with us.", "Colours from files.", "Sample price."],
  }),
  casePc("folio-ipad-a16", "Smart Folio for iPad (A16)", {
    subgroup: "folio",
    material: "Smart Folio",
    fitsDeviceIds: ["ipad-a16"],
    magSafe: false,
    platform: "ipad",
    tagline: "Smart Folio for iPad (A16) only.",
    whoItSuits: "iPad (A16) owners.",
    whyChoose: ["Exact A16 iPad fit.", "Not for Air or Pro.", "Colours from files."],
  }),
  casePc("folio-ipad-mini-a17-pro", "Smart Folio for iPad mini (A17 Pro)", {
    subgroup: "folio",
    material: "Smart Folio",
    fitsDeviceIds: ["ipad-mini-a17-pro"],
    magSafe: false,
    platform: "ipad",
    tagline: "Smart Folio for iPad mini (A17 Pro) only.",
    whoItSuits: "iPad mini (A17 Pro) owners.",
    whyChoose: ["mini only.", "Not other iPads.", "Sample price."],
  }),
  casePc("folio-ipad-air-11-m4", "Smart Folio for iPad Air 11-inch (M4)", {
    subgroup: "folio",
    material: "Smart Folio",
    fitsDeviceIds: ["ipad-air-11-m4"],
    magSafe: false,
    platform: "ipad",
    tagline: "Smart Folio for iPad Air 11-inch (M4) only.",
    whoItSuits: "iPad Air 11-inch (M4) owners.",
    whyChoose: ["11-inch Air only - not 13-inch.", "Exact M4 Air fit.", "Sample price."],
  }),
  casePc("folio-ipad-air-13-m4", "Smart Folio for iPad Air 13-inch (M4)", {
    subgroup: "folio",
    material: "Smart Folio",
    fitsDeviceIds: ["ipad-air-13-m4"],
    magSafe: false,
    platform: "ipad",
    tagline: "Smart Folio for iPad Air 13-inch (M4) only.",
    whoItSuits: "iPad Air 13-inch (M4) owners.",
    whyChoose: ["13-inch Air only - not 11-inch.", "Exact fit.", "Sample price."],
  }),
  casePc("folio-ipad-pro-11-m5", "Smart Folio for iPad Pro 11-inch (M5)", {
    subgroup: "folio",
    material: "Smart Folio",
    fitsDeviceIds: ["ipad-pro-11-m5"],
    magSafe: false,
    platform: "ipad",
    tagline: "Smart Folio for iPad Pro 11-inch (M5) only.",
    whoItSuits: "iPad Pro 11-inch (M5) owners.",
    whyChoose: ["11-inch Pro only.", "Not 13-inch.", "Sample price."],
  }),
  casePc("folio-ipad-pro-13-m5", "Smart Folio for iPad Pro 13-inch (M5)", {
    subgroup: "folio",
    material: "Smart Folio",
    fitsDeviceIds: ["ipad-pro-13-m5"],
    magSafe: false,
    platform: "ipad",
    tagline: "Smart Folio for iPad Pro 13-inch (M5) only.",
    whoItSuits: "iPad Pro 13-inch (M5) owners.",
    whyChoose: ["13-inch Pro only.", "Not 11-inch.", "Sample price."],
  }),
];

export const allPowerCaseProducts = [...powerAndCaseProducts, ...caseProductsList];

export function isPowerOrCaseGroup(group: string): boolean {
  return group === "power" || group === "cases";
}
