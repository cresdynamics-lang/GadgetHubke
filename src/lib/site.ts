/** Central site constants - Phase 1 */

export const site = {
  name: "GadgetHub",
  legalName: "Gadget Hub Investments",
  tagline: "New devices. Nairobi.",
  url: "https://gadgethubke.com",
  domain: "gadgethubke.com",
  phoneDisplay: "0729 585 471",
  phoneE164: "+254729585471",
  phoneRaw: "0729585471",
  whatsapp: "254729585471",
  email: "hello@gadgethubke.com",
  /** Data Protection / privacy requests */
  privacyEmail: "hello@gadgethubke.com",
  location: "Nairobi, Kenya",
  /** Short line for footer / compact UI */
  address: "Norwich Union Building, 4th Floor, Suite 15",
  /** Full store address for the locations page */
  addressLines: [
    "Norwich Union Building",
    "4th Floor, Suite 15",
    "Nairobi, Kenya",
  ],
  hours: {
    weekday: "Monday - Saturday: 8:00 AM - 8:00 PM",
    sunday: "Sunday: 10:00 AM - 8:00 PM",
    short: "Mon-Sat 8am-8pm · Sun 10am-8pm",
  },
  /** Lipa Mdogo Mdogo is operated by Gadget Hub Investments - no external finance partner */
  lipa: {
    inHouse: true,
    label: "Lipa Mdogo Mdogo",
    note: "Installment plans are offered directly by Gadget Hub Investments. Corporate and bulk orders are settled by agreement.",
  },
  warranty: {
    type: "manufacturer" as const,
    note: "All new devices carry the manufacturer’s standard warranty. Gadget Hub Investments does not provide any additional warranty beyond the manufacturer’s terms.",
  },
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
    x: "https://x.com/",
  },
} as const;

/**
 * Locked commercial / policy numbers for legal copy.
 * Adjust here once; Terms / Returns / Privacy pull from this.
 */
export const policy = {
  lastUpdated: "30 September 2026",
  /** Displayed prices include VAT where VAT applies */
  pricesIncludeVat: true,
  /** Days from delivery to request a return (faulty / damaged / not as described) */
  returnWindowDays: 7,
  /** Business days to issue an approved refund after inspection */
  refundBusinessDays: 7,
  /** Hours after delivery to report transit damage */
  transitDamageHours: 48,
  /**
   * Change-of-mind returns are not offered on sealed new devices.
   * Returns are for faulty, damaged-on-arrival, or materially not-as-described items only.
   */
  changeOfMindReturns: false,
  /** Who pays return shipping when the item is faulty / not as described */
  faultyReturnShipping: "GadgetHub" as const,
  /** Card rail - processor name TBD; do not invent a provider */
  cardPaymentsLabel: "card payments via our payment provider",
  paymentMethods: ["M-Pesa", "card", "Lipa Mdogo Mdogo"] as const,
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function telUrl(): string {
  return `tel:${site.phoneE164}`;
}
