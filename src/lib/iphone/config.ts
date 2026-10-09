/**
 * Owner-editable CONFIG for the iPhone 11 - 16 shop section.
 * Replace placeholders before launch. All KES prices are samples.
 */

export const iphoneConfig = {
  whatsapp: "254729585471",
  whatsappDisplay: "0729 585 471",

  address: {
    line: "To be confirmed",
    city: "Nairobi, Kenya",
    hours: "To be confirmed",
  },

  /** Sample storage steps above base (KES). Owner can change. */
  storageStepsKes: [0, 14000, 34000, 54000] as const,

  lipa: {
    depositMinPct: 40,
    depositMaxPct: 60,
    depositStepPct: 5,
    depositDefaultPct: 40,
    monthOptions: [3, 6, 9, 12] as const,
    monthsDefault: 6,
    /** UI label: illustration only */
    note: "Illustration at 0% extra; the real terms are set by Gadget Hub.",
  },

  tradeIn: {
    conditionPct: {
      likeNew: 42,
      good: 33,
      worn: 20,
    } as const,
    note: "Indicative only. Final value is confirmed after we inspect battery health, screen and iCloud status.",
  },

  samplePriceDisclaimer:
    "Sample price until stock is entered in the admin. Sealed, serial number on the invoice.",

  announce:
    "Sealed iPhones, serial number on your invoice. Lipa Mdogo Mdogo available.",

  /** Footnote for Apple-published figures */
  appleSpecsFootnote:
    "Battery figures are Apple's video-playback claims for a new battery. Satellite and carrier features vary by country. Owner: re-verify specs on apple.com before launch.",
} as const;

export type IphoneConfig = typeof iphoneConfig;
