/**
 * Owner-editable CONFIG for the MacBook Air + Pro shop section (M1 - M5, 2020+).
 * All KES prices are samples. Re-verify specs on apple.com before launch.
 */

export const macConfig = {
  whatsapp: "254729585471",
  whatsappDisplay: "0729 585 471",

  address: {
    line: "Norwich House, Suite 15, 4th Floor",
    city: "Nairobi, Kenya",
    hours: "Mon-Sat 8am-8pm · Sun 10am-8pm",
  },

  /** Memory upgrade steps above base (KES). */
  memoryStepKes: 16000,
  /** Storage upgrade steps above base (KES). */
  storageStepKes: 14000,

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
    "Sealed product, serial on the invoice. 1-year warranty. Set-up fees vary and are confirmed when you engage with us.",

  announce:
    "Sealed MacBooks, serial number on your invoice. Lipa Mdogo Mdogo available.",

  appleSpecsFootnote:
    "Battery hours and performance ratios are Apple's published claims for a new battery / cited launch materials. M5 figures follow Apple launch materials.",

  trademarkLine:
    "Apple, MacBook and the Apple logo are trademarks of Apple Inc. Product images belong to Apple and are used here for a design mock-up. Live use needs permission.",

  /**
   * Approximate closed-lid thickness (mm). Approximate; see Apple tech specs.
   * Air M1 uses thickest-point figure from older chassis.
   */
  thicknessMm: {
    "air-m1": 16.1,
    "air-13-m2-later": 11.3,
    "air-15": 11.5,
    "pro-13": 15.6,
    "pro-14": 15.5,
    "pro-16": 16.8,
  } as const,

  /**
   * Relative multi-core CPU illustration ratios. Only cite published Apple claims.
   * Do not invent bars for missing pairs. 
   */
  performanceRatios: [
    {
      id: "m4-vs-m1-air",
      label: "M4 vs M1 (Air class)",
      ratio: 2.0,
      source: "Apple MacBook Air M4 marketing (approx.)",
      date: "2025-03",
      note: "Illustration only - confirm exact published claim before launch.",
    },
    {
      id: "m4-pro-vs-m1-pro",
      label: "M4 Pro vs M1 Pro",
      ratio: 1.8,
      source: "Apple MacBook Pro M4 Pro marketing (approx.)",
      date: "2024-10",
      note: "Illustration only - confirm exact published claim before launch.",
    },
  ] as const,

  /** Models without a dedicated Apple store colour shot - use overview. */
  missingStoreShotNotes: [
    "MacBook Air 13\" M2 (2022) - overview only",
    "MacBook Air 15\" M3 (2024) - overview only",
    "All MacBook Air M5 - overview only",
    "All MacBook Pro M5 / M5 Pro / M5 Max - overview only",
    "MacBook Air M1 uses 2018-labelled chassis store shots (identical design)",
  ] as const,
} as const;

/** Sample base prices in KES - one place to edit. */
export const macBasePricesKes = {
  "macbook-air-13-m1": 99000,
  "macbook-air-13-m2": 118000,
  "macbook-air-15-m2": 145000,
  "macbook-air-13-m3": 135000,
  "macbook-air-15-m3": 160000,
  "macbook-air-13-m4": 148000,
  "macbook-air-15-m4": 180000,
  "macbook-air-13-m5": 190000,
  "macbook-air-15-m5": 225000,
  "macbook-pro-13-m1": 110000,
  "macbook-pro-13-m2": 135000,
  "macbook-pro-14-m1-pro": 180000,
  "macbook-pro-16-m1-pro": 210000,
  "macbook-pro-14-m2-pro": 215000,
  "macbook-pro-16-m2-pro": 250000,
  "macbook-pro-14-m3": 195000,
  "macbook-pro-14-m3-pro": 245000,
  "macbook-pro-16-m3-pro": 295000,
  "macbook-pro-14-m4": 215000,
  "macbook-pro-14-m4-pro": 270000,
  "macbook-pro-16-m4-pro": 340000,
  "macbook-pro-14-m5": 255000,
  "macbook-pro-14-m5-pro": 365000,
  "macbook-pro-16-m5-pro": 430000,
} as const;

/** EX-UK base prices from sheet / overlay. */
export const macBaseExUkKes = {
  "macbook-air-13-m1": 68000,
  "macbook-air-13-m2": 88000,
  "macbook-air-13-m3": 105000,
  "macbook-air-13-m4": 118000,
  "macbook-air-13-m5": 150000,
  "macbook-air-15-m2": 110000,
  "macbook-air-15-m3": 125000,
  "macbook-air-15-m4": 145000,
  "macbook-air-15-m5": 180000,
  "macbook-pro-13-m1": 75000,
  "macbook-pro-13-m2": 95000,
  "macbook-pro-14-m1-pro": 135000,
  "macbook-pro-14-m2-pro": 165000,
  "macbook-pro-14-m3": 155000,
  "macbook-pro-14-m3-pro": 195000,
  "macbook-pro-14-m4": 175000,
  "macbook-pro-14-m4-pro": 220000,
  "macbook-pro-14-m5": 205000,
  "macbook-pro-14-m5-pro": 295000,
  "macbook-pro-16-m1-pro": 160000,
  "macbook-pro-16-m2-pro": 195000,
  "macbook-pro-16-m3-pro": 235000,
  "macbook-pro-16-m4-pro": 275000,
  "macbook-pro-16-m5-pro": 350000,
  "macbook-pro": 175000,
} as const;

export type MacConfig = typeof macConfig;
export type MacModelPriceId = keyof typeof macBasePricesKes;
