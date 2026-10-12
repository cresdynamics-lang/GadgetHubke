/** SEO model record — one per product; variants priced from the sheet. */

export type SeoSpec = { label: string; value: string };
export type SeoFaq = { question: string; answer: string };

export type SeoVariant = {
  sheetId: string;
  storage: string;
  newKes: number;
  /** Stored for future use; never shown while SHOW_EX_UK is false. */
  exUkKes: number;
  /** Real stock only; default ask on WhatsApp when unknown. */
  stockStatus: "in_stock" | "out_of_stock" | "ask_whatsapp";
};

export type IphoneSeoModel = {
  id: string;
  slug: string;
  categorySlug: "iphone";
  name: string;
  family: number;
  series: string;
  year: number;
  aliases: string[];
  seoTitle: string;
  h1: string;
  metaDescription: string;
  intro: string;
  bestFor: string;
  specs: SeoSpec[];
  colours: string[];
  variants: SeoVariant[];
  fromKes: number;
  faq: SeoFaq[];
  compareWith: string[];
  related: string[];
  imageAlt: string;
  lastPriceUpdate: string;
};
