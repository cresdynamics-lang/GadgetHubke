/**
 * Accessories CONFIG — Pencil, Keyboard, Mouse, Trackpad, Power, Cases.
 * Owner: re-verify every price, spec and compatibility rule on apple.com before launch.
 */

export const accessoriesConfig = {
  whatsapp: "254729585471",
  whatsappDisplay: "0729 585 471",

  address: {
    line: "To be confirmed",
    city: "Nairobi, Kenya",
    hours: "To be confirmed",
  },

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
    note: "Accessory trade-in is at the owner's discretion.",
    acceptAccessories: null as boolean | null,
  },

  samplePriceDisclaimer:
    "Sample price until stock is entered in the admin. Sealed, serial number on the invoice.",

  announce:
    "Sealed accessories, serial on your invoice. Compatibility checked before you pay.",

  trademarkLine:
    "Apple, MagSafe, iPhone, iPad, Apple Pencil, Magic Keyboard, Magic Mouse, Magic Trackpad and the Apple logo are trademarks of Apple Inc. Product images belong to Apple and are used here for a design mock-up. Live use needs permission.",

  appleCompatNote:
    "Check Apple's compatibility list if your device is not shown. Every fit rule is flagged check-final-specs until the owner confirms.",

  engravingNote:
    "Engraving for Pencil Pro — owner confirms whether the shop offers it. Sample add +0 KES.",

  layoutNote:
    "Photos show US layouts. The shop confirms the keyboard layout on stock.",

  mouseChargeNote:
    "The Magic Mouse charging port is on the underside — it cannot be used while charging by cable. Flag check.",

  trackpadChargeNote:
    "The Magic Trackpad USB-C port is on the back edge — it can be used while charging if the owner confirms. Flag check.",

  blackPremiumNote:
    "Black and white are the same hardware; the black finish may cost more — owner to confirm.",

  /** All Accessories groups are live. */
  comingNextGroups: [] as const,

  plugCaption:
    "Plug shape varies by country; ask us which version we stock.",

  powerChargeClaimNote:
    "This site never states a charging time, percentage, or fast-charging claim unless Apple publishes it and the owner confirms.",

  strapCasePairingNote:
    "Whether each strap works with each case is owner-to-confirm. We do not claim a pairing until confirmed.",

  thirdPartyBrandsNote:
    "We stock Apple's own cases and chargers for the latest iPhones, iPads and Macs. Ask us on WhatsApp about other brands or older models.",
} as const;

/** Sample base prices in KES. */
export const accessoryBasePricesKes = {
  "pencil-pro": 18000,
  "pencil-usbc": 11000,
  "pencil-2": 16000,
  "pencil-1": 14000,
  "keyboard-ipad-pro-11": 45000,
  "keyboard-ipad-pro-13": 55000,
  "keyboard-ipad-air-11": 35000,
  "keyboard-ipad-air-13": 42000,
  "keyboard-folio": 28000,
  "keyboard-mac-usbc": 14000,
  "keyboard-mac-touchid": 18000,
  "keyboard-mac-touchid-num-white": 22000,
  "keyboard-mac-touchid-num-black": 22000,
  "keyboard-mac-num-mq052": 16000,
  "mouse-usbc-white": 14000,
  "mouse-usbc-black": 16000,
  "mouse-earlier-space-gray": 12000,
  "trackpad-usbc-white": 20000,
  "trackpad-usbc-black": 23000,
  "trackpad-earlier-space-gray": 15000,
  "trackpad-earlier-white": 14000,
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

export type AccessoriesConfig = typeof accessoriesConfig;
export type AccessoryPriceId = keyof typeof accessoryBasePricesKes;
