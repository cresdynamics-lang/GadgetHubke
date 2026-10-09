/**
 * Owner-editable CONFIG for AirPods (2 - 5, Pro, Max, 2020 - 2026).
 * All KES prices are samples. Re-verify specs on apple.com/airpods/compare before launch.
 */

export const airpodsConfig = {
  whatsapp: "254729585471",
  whatsappDisplay: "0729 585 471",

  address: {
    line: "To be confirmed",
    city: "Nairobi, Kenya",
    hours: "To be confirmed",
  },

  /** Wireless charging case add-on where offered (KES). */
  wirelessCaseStepKes: 4000,

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
      likeNew: 35,
      good: 25,
      worn: 12,
    } as const,
    note: "AirPods trade-in is at the owner's discretion. Indicative only if accepted after inspection.",
    acceptAirpods: null as boolean | null, // owner to confirm
  },

  samplePriceDisclaimer:
    "Sample price until stock is entered in the admin. Sealed, serial number on the invoice.",

  announce:
    "Sealed AirPods, serial number on your invoice. Lipa Mdogo Mdogo available.",

  appleSpecsFootnote:
    "Battery hours, ANC ratios, IP ratings, microphone counts, chip and weights are flagged check-final-specs until the owner confirms Apple's published compare page.",

  trademarkLine:
    "Apple, AirPods and the Apple logo are trademarks of Apple Inc. Product images belong to Apple and are used here for a design mock-up. Live use needs permission.",

  medicalHonesty:
    "AirPods hearing features are not a substitute for a clinical hearing test or hearing aid prescription. See a hearing professional for any concern. Availability depends on country and software; the owner must confirm availability in Kenya.",

  /**
   * Apple-published ANC ratio claims only. Do not invent bars.
   * Owner: confirm source/date before launch.
   */
  ancRatios: [
    {
      id: "pro3-vs-pro2",
      label: "AirPods Pro 3 vs Pro 2 Active Noise Cancellation",
      ratio: 2,
      source: "Apple AirPods Pro 3 marketing (approx. up to 2×)",
      date: "2025",
      note: "Illustration only - confirm exact published claim before launch.",
    },
  ] as const,

  missingStoreShotNotes: [
    "AirPods 2 - no store photo; case overview + stand-in note",
    "AirPods 3 - no store photo; case overview + stand-in note",
    "AirPods Pro 1 - no store photo",
    "AirPods Pro 2 (2022/2023) - use 2024 Pro 2 shots with 'Image shows the current design'",
    "AirPods Max (2020 Lightning) - no colour photos; text chips only for space gray/silver/sky blue/green/pink",
    "Max purple and starlight colour dots - approximate CSS (#B8A9C9, #E3D8CC)",
  ] as const,

  /** Approximate Max colour dots for missing swatch files. */
  maxDotApprox: {
    purple: "#B8A9C9",
    starlight: "#E3D8CC",
  } as const,
} as const;

/** Sample base prices in KES. */
export const airpodsBasePricesKes = {
  "airpods-5": 22000,
  "airpods-5-wireless": 26000,
  "airpods-4": 18000,
  "airpods-4-anc": 25000,
  "airpods-pro-3": 38000,
  "airpods-pro-2": 32000,
  "airpods-max-2": 85000,
  "airpods-max-usbc": 72000,
  "airpods-3": 20000,
  "airpods-2": 14000,
  "airpods-pro-1": 22000,
  "airpods-max-2020": 55000,
} as const;

export type AirpodsConfig = typeof airpodsConfig;
export type AirpodsModelPriceId = keyof typeof airpodsBasePricesKes;
