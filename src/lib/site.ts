/** Central site constants — Phase 1 */

export const site = {
  name: "GadgetHub",
  tagline: "New devices. Nairobi.",
  url: "https://gadgethub.ke",
  phoneDisplay: "0729 585 471",
  phoneE164: "+254729585471",
  phoneRaw: "0729585471",
  whatsapp: "254729585471",
  email: "hello@gadgethub.ke",
  location: "Nairobi, Kenya",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
  },
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function telUrl(): string {
  return `tel:${site.phoneE164}`;
}
