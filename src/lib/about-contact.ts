/**
 * About + Contact page copy.
 * Only include facts confirmed in site.ts / policy.
 * Anything still marked confirm:false stays off the page - do not invent.
 */

import { policy, site, whatsappUrl } from "./site";
import { ghImages, macProductPhotos } from "./images";
/** Owner still needs to confirm these - keep off the live pages */
export const pendingOwnerFacts = {
  founderStory: false,
  replyMinutes: false,
  walkInShop: true, // address exists in site.ts - treat as pickup/visit available
  socialHandles: false, // site.social URLs are placeholders
  exUkGradingDetail: false,
  deliveryAreasFees: false,
  payOnDelivery: false,
  warrantyOnExUk: false,
} as const;

export const aboutHero = {
  headline: "Apple, done properly.",
  intro:
    "Gadget Hub is a Nairobi Apple reseller for people who want the real thing at an honest price. iPhone, MacBook, iPad, Apple Watch, AirPods, Apple TV and Home, and the accessories that go with them, all in one place.",
} as const;

export const aboutStory = {
  sticky:
    "Clear stock. Clear prices. A real person on WhatsApp.",
  paragraphs: [
    "Gadget Hub Investments sells Apple products in Nairobi - New sealed units and EX-UK imports - with sample prices shown up front.",
    "Pick a device on the site, message us on WhatsApp, then receive or collect. Payment options include M-Pesa, card, and Lipa Mdogo Mdogo run in-house by Gadget Hub Investments.",
  ],
} as const;

export const aboutChannels = {
  new: {
    title: "New",
    body: "Sealed, straight from the box. Sample prices shown on each product.",
    note: site.warranty.note,
    image: ghImages.iphone.proBlue,
    imageAlt: "iPhone - New sealed stock",
  },
  "ex-uk": {
    title: "EX-UK",
    body: "Previously owned in the UK, sold at a lower sample price than New.",
    note: "Ask us on WhatsApp for the condition of any EX-UK unit before you buy.",
    image: ghImages.duo.openCamera,
    imageAlt: "iPhone - EX-UK option",
  },
} as const;

/** Only principles we can back with site/policy copy */
export const aboutWhy = [
  {
    n: "01",
    title: "Apple across the lineup",
    body: "iPhone, Mac, iPad, Watch, AirPods, TV & Home, and Accessories - shopped in one place.",
  },
  {
    n: "02",
    title: "New and EX-UK, side by side",
    body: "Toggle sample prices for sealed New stock and EX-UK imports on the product display.",
  },
  {
    n: "03",
    title: "Manufacturer warranty on New",
    body: site.warranty.note,
  },
  {
    n: "04",
    title: "Lipa Mdogo Mdogo, in-house",
    body: site.lipa.note,
  },
  {
    n: "05",
    title: "WhatsApp with a real person",
    body: `Message ${site.phoneDisplay} for stock, pricing, and orders - no call-centre script.`,
  },
] as const;

export const aboutSteps = [
  {
    n: "01",
    title: "Pick your device",
    body: "Browse New or EX-UK sample prices across the Apple lineup.",
  },
  {
    n: "02",
    title: "Message us on WhatsApp",
    body: "Confirm stock, finish, and price with the shop.",
  },
  {
    n: "03",
    title: "Receive or collect",
    body: `Arrange delivery or collection. Payments: ${policy.paymentMethods.join(", ")}.`,
  },
] as const;

export const aboutClosing = {
  headline: "Not sure which iPhone or MacBook is right for you? Talk to us, we are here.",
  waLabel: "WhatsApp us",
  waHref: whatsappUrl("Hi Gadget Hub - I'd like help choosing a device."),
} as const;

export const aboutHeroProducts = [
  { src: ghImages.iphone.proBlue, alt: "iPhone" },
  { src: macProductPhotos.air13M4.skyBlue, alt: "MacBook Air" },
  { src: ghImages.watchAirPods.watch, alt: "Apple Watch" },
  { src: ghImages.watchAirPods.airpodsPro, alt: "AirPods Pro" },
] as const;

export const aboutCategoryRail = [
  { label: "iPhone", href: "/iphone", image: ghImages.iphone.proBlue },
  { label: "Mac", href: "/mac", image: ghImages.mac.air },
  { label: "iPad", href: "/ipad", image: ghImages.ipad.air },
  { label: "Watch", href: "/watch", image: ghImages.watchAirPods.watch },
  { label: "AirPods", href: "/airpods", image: ghImages.watchAirPods.airpodsPro },
  { label: "TV & Home", href: "/tv-home", image: ghImages.mac.mini },
  { label: "Accessories", href: "/accessories", image: ghImages.accessories.magsafeCharger },
] as const;

export const contactHero = {
  headline: "Talk to us, we are here.",
  lede: "Message us on WhatsApp for the fastest reply.",
} as const;

export const contactChips = [
  { label: "New iPhone", msg: "Hi Gadget Hub, I'm interested in a New iPhone." },
  { label: "EX-UK iPhone", msg: "Hi Gadget Hub, I'm interested in an EX-UK iPhone." },
  { label: "MacBook", msg: "Hi Gadget Hub, I'm interested in a MacBook." },
  { label: "iPad", msg: "Hi Gadget Hub, I'm interested in an iPad." },
  { label: "Watch", msg: "Hi Gadget Hub, I'm interested in an Apple Watch." },
  { label: "AirPods", msg: "Hi Gadget Hub, I'm interested in AirPods." },
  { label: "Accessories", msg: "Hi Gadget Hub, I'm interested in Accessories." },
  { label: "Trade-in", msg: "Hi Gadget Hub, I'd like to ask about trade-in." },
  { label: "Delivery question", msg: "Hi Gadget Hub, I have a delivery question." },
] as const;

/** FAQ - only answers backed by current site/policy */
export const contactFaq = [
  {
    q: "Do you sell New and EX-UK?",
    a: "Yes. New means sealed, straight from the box. EX-UK means previously owned in the UK and sold at a lower sample price. Toggle both on product pages.",
  },
  {
    q: "Do New phones come with a warranty?",
    a: site.warranty.note,
  },
  {
    q: "What payment methods do you take?",
    a: `We accept ${policy.paymentMethods.join(", ")}. Ask on WhatsApp which option fits your order.`,
  },
  {
    q: "Can I trade in my old phone?",
    a: "Yes - we accept iPhone and Samsung trade-ins as credit toward a new purchase. Start on the Trade-in page or WhatsApp us.",
  },
  {
    q: "Where are you based?",
    a: `${site.addressLines.join(", ")}. Hours: ${site.hours.short}.`,
  },
] as const;

export const contactFormTopics = [
  "iPhone",
  "MacBook",
  "iPad",
  "Watch",
  "AirPods",
  "Accessories",
  "Trade-in",
  "Delivery",
  "Other",
] as const;

export const contactConsentLine =
  "I agree to be contacted about my enquiry. We use your name and number only to reply on WhatsApp or phone - see our Privacy Policy.";

export function isPlaceholderSocial(url: string): boolean {
  try {
    const u = new URL(url);
    return u.pathname === "/" || u.pathname === "";
  } catch {
    return true;
  }
}
