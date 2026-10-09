/**
 * Owner-editable CONFIG for Apple Watch (Series 6 - 12, SE, Ultra, Hermès, Nike).
 * All KES prices are samples. Re-verify specs on apple.com/watch/compare before launch.
 */

export const watchConfig = {
  whatsapp: "254729585471",
  whatsappDisplay: "0729 585 471",

  address: {
    line: "To be confirmed",
    city: "Nairobi, Kenya",
    hours: "To be confirmed",
  },

  /** Cellular connectivity add-on (KES). */
  cellularStepKes: 9000,

  /** Material price steps above aluminum base (KES). */
  materialStepKes: {
    aluminum: 0,
    titanium: 45000,
    ceramic: 60000,
    stainless: 35000,
  } as const,

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
    note: "Indicative only. Final value is confirmed after we inspect the watch, battery health and activation lock.",
  },

  samplePriceDisclaimer:
    "Sample price until stock is entered in the admin. Sealed, serial number on the invoice.",

  announce:
    "Sealed Apple Watches, serial number on your invoice. Lipa Mdogo Mdogo available.",

  appleSpecsFootnote:
    "Brightness, chip, battery hours, charging times, depth ratings and Always-On status on SE 3 are flagged check-final-specs until the owner confirms Apple's published compare page.",

  trademarkLine:
    "Apple, Apple Watch and the Apple logo are trademarks of Apple Inc. Product images belong to Apple and are used here for a design mock-up. Live use needs permission.",

  cellularKenyaNote:
    "Cellular needs a carrier plan; ask us how eSIM works in Kenya. Owner: confirm carrier support before launch.",

  medicalHonesty:
    "Apple Watch features are not medical devices for diagnosis. Talk to a doctor about any health concern. Some features are not available in every country, including Kenya; the owner must confirm availability per feature.",

  bandFitRule:
    "Bands fit within case-size families: 38/40/41/42 mm, 42/44/45/46 mm, and 49 mm Ultra. Ultra-only bands (Alpine, Trail, Ocean) fit the 49 mm family and larger bands of the 42 - 46 mm family - check Apple's fit guide before launch.",

  missingStoreShotNotes: [
    "Series 6 / 7 / 8 - overview only (no gallery lineup in pack)",
    "SE 1st and 2nd gen - overview only",
    "Ultra 1 (2022) - overview only",
    "Apple publishes no store photo per colour per model - do not promise colour-accurate product shots or wrist try-on",
  ] as const,
} as const;

/** Sample base prices in KES - aluminum GPS base unless noted. */
export const watchBasePricesKes = {
  "watch-s12-42": 55000,
  "watch-s12-46": 60000,
  "watch-ultra-4": 120000,
  "watch-se3-40": 32000,
  "watch-se3-44": 35000,
  "watch-s11-42": 45000,
  "watch-s11-46": 50000,
  "watch-s10-42": 40000,
  "watch-s10-46": 45000,
  "watch-s9-41": 32000,
  "watch-s9-45": 36000,
  "watch-s8-41": 28000,
  "watch-s8-45": 32000,
  "watch-s7-41": 24000,
  "watch-s7-45": 28000,
  "watch-s6-40": 18000,
  "watch-s6-44": 22000,
  "watch-se2-40": 22000,
  "watch-se2-44": 22000,
  "watch-se1-40": 14000,
  "watch-se1-44": 14000,
  "watch-ultra-3": 100000,
  "watch-ultra-2": 85000,
  "watch-ultra-1": 65000,
  "watch-s12-hermes-42": 115000,
  "watch-s12-hermes-46": 125000,
  "watch-ultra-4-hermes": 180000,
  "watch-s9-nike-41": 34000,
  "watch-s9-nike-45": 38000,
  "watch-s8-nike-41": 30000,
  "watch-s8-nike-45": 34000,
  "watch-s7-nike-41": 26000,
  "watch-s7-nike-45": 30000,
  "watch-s6-nike-40": 20000,
  "watch-s6-nike-44": 24000,
} as const;

export type WatchConfig = typeof watchConfig;
export type WatchModelPriceId = keyof typeof watchBasePricesKes;
