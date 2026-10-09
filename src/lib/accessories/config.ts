/**
 * Accessories CONFIG - Pencil, Keyboard, Mouse, Trackpad, Power, Cases.
 * re-verify every price, spec and compatibility rule on apple.com before launch.
 */

export const accessoriesConfig = {
  whatsapp: "254729585471",
  whatsappDisplay: "0729 585 471",

  address: {
    line: "Norwich House, Suite 15, 4th Floor",
    city: "Nairobi, Kenya",
    hours: "Mon-Sat 8am-8pm · Sun 10am-8pm",
  },

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
    note: "Accessory trade-in is indicative and confirmed after inspection.",
    acceptAccessories: null as boolean | null,
  },

  samplePriceDisclaimer:
    "Sealed product, serial on the invoice. 1-year warranty. Set-up fees vary and are confirmed when you engage with us.",

  announce:
    "Sealed accessories, serial on your invoice. Compatibility checked before you pay.",

  trademarkLine:
    "Apple, MagSafe, iPhone, iPad, Apple Pencil, Magic Keyboard, Magic Mouse, Magic Trackpad and the Apple logo are trademarks of Apple Inc. Product images belong to Apple and are used here for a design mock-up. Live use needs permission.",

  appleCompatNote:
    "Check Apple's compatibility list if your device is not shown. Ask us on WhatsApp if your device is not listed.",

  engravingNote:
    "Ask us on WhatsApp about Pencil Pro engraving.",

  layoutNote:
    "Photos show US layouts. The shop confirms the keyboard layout on stock.",

  mouseChargeNote:
    "The Magic Mouse charging port is on the underside - it cannot be used while charging by cable. ",

  trackpadChargeNote:
    "The Magic Trackpad USB-C port is on the back edge.",

  blackPremiumNote:
    "Black and white are the same hardware; the black finish may cost more — ask us on WhatsApp.",

  /** All Accessories groups are live. */
  comingNextGroups: [] as const,

  plugCaption:
    "Plug shape varies by country; ask us which version we stock.",

  powerChargeClaimNote:
    "We only state charging claims that Apple publishes.",

  strapCasePairingNote:
    "Ask us on WhatsApp to confirm strap and case pairing.",

  thirdPartyBrandsNote:
    "We stock Apple's own cases and chargers for the latest iPhones, iPads and Macs. Ask us on WhatsApp about other brands or older models.",
} as const;

/** Sample base prices in KES. */
export const accessoryBasePricesKes = {
  "pencil-pro": 18000,
  "pencil-usbc": 15000,
  "pencil-2": 17500,
  "pencil-1": 14000,
  "keyboard-ipad-pro-11": 47000,
  "keyboard-ipad-pro-13": 53000,
  "keyboard-ipad-air-11": 43000,
  "keyboard-ipad-air-13": 50000,
  "keyboard-folio": 36000,
  "keyboard-mac-usbc": 16000,
  "keyboard-mac-touchid": 21000,
  "keyboard-mac-touchid-num-white": 25000,
  "keyboard-mac-touchid-num-black": 25000,
  "keyboard-mac-num-mq052": 16000,
  "mouse-usbc-white": 17000,
  "mouse-usbc-black": 17000,
  "mouse-earlier-space-gray": 17000,
  "trackpad-usbc-white": 22000,
  "trackpad-usbc-black": 22000,
  "trackpad-earlier-space-gray": 22000,
  "trackpad-earlier-white": 22000,
  "power-adapter-20w": 3000,
  "power-adapter-35w-dual": 5500,
  "power-adapter-40w-dynamic": 6500,
  "power-adapter-70w": 8500,
  "power-adapter-96w": 10500,
  "power-adapter-140w": 6500,
  "power-extension-cable": 3000,
  "magsafe-charger-1m": 6000,
  "magsafe-charger-2m": 7500,
  "watch-magnetic-charger-1m": 5000,
  "cable-usbc-60w-1m": 3000,
  "cable-usbc-240w-2m": 4500,
  "cable-magsafe3-2m": 7000,
  "cable-tb4-1-8m": 11500,
  "cable-tb4-3m": 19500,
  "cable-tb5-1m": 12500,
  "case-iphone-17-silicone": 4500,
  "case-iphone-17-pro-silicone": 4500,
  "case-iphone-17-pro-max-silicone": 4500,
  "case-iphone-17e-silicone": 4500,
  "case-iphone-18-pro-silicone": 4500,
  "case-iphone-18-pro-max-silicone": 4500,
  "case-iphone-17-clear": 4500,
  "case-iphone-17-pro-clear": 4500,
  "case-iphone-17-pro-max-clear": 4500,
  "case-iphone-17e-clear": 4500,
  "case-iphone-18-pro-clear": 4500,
  "case-iphone-18-pro-max-clear": 4500,
  "case-iphone-18-pro-techwoven": 6500,
  "case-iphone-18-pro-max-techwoven": 6500,
  "case-iphone-air-bumper": 3500,
  "case-iphone-air-case": 3500,
  "case-iphone-finewoven-wallet": 5500,
  "case-iphone-duo-case": 3500,
  "case-iphone-duo-folio": 6500,
  "strap-crossbody": 3500,
  "strap-wrist": 3500,
  "folio-ipad-a16": 9500,
  "folio-ipad-mini-a17-pro": 9500,
  "folio-ipad-air-11-m4": 11500,
  "folio-ipad-air-13-m4": 13500,
  "folio-ipad-pro-11-m5": 11500,
  "folio-ipad-pro-13-m5": 13500,
} as const;

/** EX-UK base prices from sheet. */
export const accessoryBaseExUkKes = {
  "case-iphone-18-pro-max-silicone": 3000,
  "case-iphone-18-pro-max-techwoven": 4500,
  "case-iphone-18-pro-max-clear": 3000,
  "case-iphone-18-pro-silicone": 3000,
  "case-iphone-18-pro-techwoven": 4500,
  "case-iphone-18-pro-clear": 3000,
  "case-iphone-17-pro-max-silicone": 3000,
  "case-iphone-17-pro-max-clear": 3000,
  "case-iphone-17-pro-silicone": 3000,
  "case-iphone-17-pro-clear": 3000,
  "case-iphone-17-silicone": 3000,
  "case-iphone-17-clear": 3000,
  "case-iphone-17e-silicone": 3000,
  "case-iphone-17e-clear": 3000,
  "case-iphone-air-case": 2500,
  "case-iphone-air-bumper": 2500,
  "case-iphone-duo-case": 2500,
  "case-iphone-duo-folio": 4500,
  "case-iphone-finewoven-wallet": 4000,
  "strap-crossbody": 2500,
  "strap-wrist": 2500,
  "power-adapter-20w": 2000,
  "power-adapter-35w-dual": 4000,
  "power-adapter-40w-dynamic": 4500,
  "power-adapter-70w": 6000,
  "power-adapter-96w": 7500,
  "power-adapter-140w": 4500,
  "power-extension-cable": 2000,
  "magsafe-charger-1m": 4000,
  "magsafe-charger-2m": 5000,
  "watch-magnetic-charger-1m": 3500,
  "cable-usbc-60w-1m": 2000,
  "cable-usbc-240w-2m": 3000,
  "cable-magsafe3-2m": 5000,
  "cable-tb4-1-8m": 8000,
  "cable-tb4-3m": 13500,
  "cable-tb5-1m": 9000,
  "folio-ipad-pro-13-m5": 9500,
  "folio-ipad-pro-11-m5": 8000,
  "folio-ipad-air-13-m4": 9500,
  "folio-ipad-air-11-m4": 8000,
  "folio-ipad-a16": 6500,
  "folio-ipad-mini-a17-pro": 6500,
  "pencil-pro": 12500,
  "pencil-usbc": 10500,
  "pencil-2": 12000,
  "pencil-1": 10000,
  "keyboard-ipad-pro-13": 37000,
  "keyboard-ipad-pro-11": 33000,
  "keyboard-ipad-air-13": 35000,
  "keyboard-ipad-air-11": 30000,
  "keyboard-folio": 25000,
  "keyboard-mac-touchid": 14500,
  "keyboard-mac-touchid-num-white": 17500,
  "keyboard-mac-touchid-num-black": 17500,
  "keyboard-mac-usbc": 11000,
  "mouse-usbc-white": 12000,
  "mouse-usbc-black": 12000,
  "trackpad-usbc-white": 15500,
  "trackpad-usbc-black": 15500,
  "mouse-earlier-space-gray": 12000,
  "trackpad-earlier-space-gray": 15500,
  "trackpad-earlier-white": 15500,
} as const;

export type AccessoriesConfig = typeof accessoriesConfig;
export type AccessoryPriceId = keyof typeof accessoryBasePricesKes;
