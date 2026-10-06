/**
 * Owner-editable CONFIG for TV & Home (Apple TV 4K, HomePod, HomePod mini).
 * All KES prices are samples. Re-verify specs on apple.com before launch.
 */

export const tvHomeConfig = {
  whatsapp: "254729585471",
  whatsappDisplay: "0729 585 471",

  address: {
    line: "To be confirmed",
    city: "Nairobi, Kenya",
    hours: "To be confirmed",
  },

  /** Apple TV 4K 3rd gen: Wi-Fi + Ethernet 128 GB step over 64 GB Wi-Fi (KES). */
  ethernetStorageStepKes: 4000,

  lipa: {
    depositMinPct: 20,
    depositMaxPct: 60,
    depositStepPct: 5,
    depositDefaultPct: 40,
    monthOptions: [3, 6, 9, 12] as const,
    monthsDefault: 6,
    note: "Illustration at 0% extra; the real terms are set by Gadget Hub.",
  },

  tradeIn: {
    conditionPct: {
      likeNew: 30,
      good: 20,
      worn: 10,
    } as const,
    note: "TV & Home trade-in is at the owner's discretion. Indicative only if accepted after inspection.",
    acceptTvHome: null as boolean | null,
  },

  samplePriceDisclaimer:
    "Sample price until stock is entered in the admin. Sealed, serial number on the invoice.",

  announce:
    "Sealed Apple TV and HomePod, serial on your invoice. Lipa Mdogo Mdogo available.",

  appleSpecsFootnote:
    "Chips, storage, connections, Thread/Matter, drivers, mics, weights and sizes are flagged check-final-specs until the owner confirms Apple's published pages.",

  trademarkLine:
    "Apple, Apple TV, HomePod and the Apple logo are trademarks of Apple Inc. Product images belong to Apple and are used here for a design mock-up. Live use needs permission.",

  kenyaAvailability:
    "Some Siri features, services and smart home brands are not available in every country, including Kenya. The owner confirms availability.",

  setupRequirement:
    "HomePod needs an iPhone or iPad to set up. Apple TV needs a TV with HDMI and a Wi-Fi or Ethernet connection. Some Siri and service features are not available in every country, including Kenya; the owner must confirm each.",

  /**
   * Published performance ratio claims only. Do not invent bars.
   * Owner: confirm source/date before launch.
   */
  performanceRatios: [
    {
      id: "atv4k3-vs-prior",
      label: "Apple TV 4K (3rd gen) vs earlier Apple TV",
      ratio: null as number | null,
      source: "Owner to confirm any Apple-published ratio",
      date: "2022",
      note: "No bar until a published ratio is confirmed.",
    },
  ] as const,

  missingImageNotes: [
    "Original HomePod (2018) — no store photo; show text-only with 'Image not available'",
    "Apple TV 4K 1st and 2nd gen — use folder 05 overviews only (no 2022 store hero for those gens)",
    "Apple TV 4K Wi-Fi vs Wi-Fi + Ethernet — same store shots; do not invent separate photos",
  ] as const,
} as const;

/** Sample base prices in KES. */
export const tvHomeBasePricesKes = {
  "apple-tv-4k-3": 24000,
  "apple-tv-4k-3-ethernet": 28000,
  "apple-tv-4k-2": 18000,
  "apple-tv-4k-1": 12000,
  "apple-tv-hd": 9000,
  "homepod-2": 42000,
  "homepod-1": 22000,
  "homepod-mini": 14000,
} as const;

export type TvHomeConfig = typeof tvHomeConfig;
export type TvHomeModelPriceId = keyof typeof tvHomeBasePricesKes;
