/**
 * Owner-editable CONFIG for the iPad section (Pro / Air / mini / standard, 2020 - 2026).
 * All KES prices are samples. Re-verify specs on apple.com before launch.
 */

export const ipadConfig = {
  whatsapp: "254729585471",
  whatsappDisplay: "0729 585 471",

  address: {
    line: "To be confirmed",
    city: "Nairobi, Kenya",
    hours: "To be confirmed",
  },

  /** Storage upgrade step above base (KES). */
  storageStepKes: 14000,
  /** Cellular connectivity add-on (KES). */
  cellularStepKes: 18000,
  /** Nano-texture glass add-on on Pro 1 TB / 2 TB (KES). */
  nanoTextureStepKes: 12000,

  lipa: {
    depositMinPct: 40,
    depositMaxPct: 60,
    depositStepPct: 5,
    depositDefaultPct: 40,
    monthOptions: [3, 6, 9, 12] as const,
    monthsDefault: 6,
    note: "Illustration at 0% extra; the real terms are set by Gadget Hub.",
  },

  tradeIn: {
    conditionPct: {
      likeNew: 42,
      good: 33,
      worn: 20,
    } as const,
    note: "Indicative only. Final value is confirmed after we inspect battery health, screen and activation lock.",
  },

  samplePriceDisclaimer:
    "Sample price until stock is entered in the admin. Sealed, serial number on the invoice.",

  announce:
    "Sealed iPads, serial number on your invoice. Lipa Mdogo Mdogo available.",

  appleSpecsFootnote:
    "Battery hours and performance ratios are Apple's published claims. Owner: re-verify on apple.com before launch. M5 Pro, M4 Air and A16 iPad carry a check-final-specs flag.",

  trademarkLine:
    "Apple, iPad, Apple Pencil and the Apple logo are trademarks of Apple Inc. Product images belong to Apple and are used here for a design mock-up. Live use needs permission.",

  /**
   * Approximate thickness (mm). Owner: confirm against Apple tech specs.
   * Flagged in owner checklist.
   */
  thicknessMm: {
    "pro-11-m4": 5.3,
    "pro-13-m4": 5.1,
    "pro-older": 5.9,
    air: 6.1,
    mini: 6.3,
    ipad: 7.0,
  } as const,

  /**
   * Relative performance illustration ratios. Only cite published Apple claims.
   * Do not invent bars. Owner: update source/date when verified.
   */
  performanceRatios: [
    {
      id: "m5-vs-m4-pro",
      label: "M5 vs M4 (iPad Pro)",
      cpuRatio: 1.12,
      gpuRatio: 1.35,
      source: "Apple iPad Pro M5 launch materials (approx. 10 - 15% CPU, ~35% GPU)",
      date: "2025",
      note: "Illustration only - Apple's claim; confirm exact published figures before launch.",
    },
    {
      id: "m4-vs-m2-pro",
      label: "M4 vs M2 (iPad Pro class)",
      ratio: 1.5,
      source: "Apple iPad Pro M4 marketing (approx.)",
      date: "2024-05",
      note: "Illustration only - confirm exact published claim before launch.",
    },
  ] as const,

  /** Generations without dedicated store colour shots - use folder 02 overview. */
  missingStoreShotNotes: [
    "iPad Pro 2020 / 2021 / 2022 - overview only (no per-colour select shots in pack)",
    "iPad Air 4th / 5th gen - overview only",
    "iPad mini 6th gen - overview only",
    "iPad 8th / 9th gen - overview only",
    "iPad Pro M4/M5 pack has witb + wificell select; plain wifi-select files not present - flag for owner",
  ] as const,
} as const;

/** Sample base prices in KES - one place to edit. */
export const ipadBasePricesKes = {
  "ipad-pro-11-2020": 60000,
  "ipad-pro-12-9-2020": 75000,
  "ipad-pro-11-m1": 105000,
  "ipad-pro-12-9-m1": 135000,
  "ipad-pro-11-m2": 125000,
  "ipad-pro-12-9-m2": 155000,
  "ipad-pro-11-m4": 170000,
  "ipad-pro-13-m4": 220000,
  "ipad-pro-11-m5": 190000,
  "ipad-pro-13-m5": 245000,
  "ipad-air-4": 55000,
  "ipad-air-5": 75000,
  "ipad-air-11-m2": 95000,
  "ipad-air-13-m2": 125000,
  "ipad-air-11-m3": 105000,
  "ipad-air-13-m3": 140000,
  "ipad-air-11-m4": 120000,
  "ipad-air-13-m4": 155000,
  "ipad-mini-6": 60000,
  "ipad-mini-a17-pro": 85000,
  "ipad-8": 32000,
  "ipad-9": 38000,
  "ipad-10": 50000,
  "ipad-a16": 55000,
} as const;

export type IpadConfig = typeof ipadConfig;
export type IpadModelPriceId = keyof typeof ipadBasePricesKes;
