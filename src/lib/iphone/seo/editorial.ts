/**
 * Hand-written product copy for the iPhone 18 series pages (18 Pro, 18 Pro Max, Duo):
 * titles, descriptions, key features, long description, FAQs and feed text, per model
 * and per storage page. Source and pattern notes: docs/seo-copy/.
 *
 * Every price in the text is read from the live admin prices through `EditorialCtx`,
 * so changing a price in admin rewrites the copy. Specs are only those on the site's
 * own tech-spec pages; nothing here is invented.
 */
import { lipaPlan, type LipaPlan } from "../../pricing/lipa.ts";
import type { PricedProduct } from "../../pricing/live.ts";
import { listedVariantPrices } from "../../listing-offers.ts";
import type { IphoneSeoModel, SeoFaq, SeoSpec } from "./types.ts";

export type EditorialSection = { id: string; heading: string; paragraphs: string[]; list?: string[] };
export type EditorialFeature = { title: string; body: string };
export type EditorialLink = { href: string; text: string };

/** Live figures the copy quotes. */
export type EditorialCtx = {
  /** New price of this model at a storage ("256GB"), 0 when not listed. */
  price: (storage: string) => number;
  /** Ex-UK price at a storage, 0 when not listed. */
  exUk: (storage: string) => number;
  /** Listed storages, smallest first. */
  storages: string[];
  /** Lowest listed New and Ex-UK price of another model (by SEO id). 0 when not listed. */
  other: (seoId: string) => { newKes: number; exUkKes: number };
};

export type EditorialStorage = {
  title: string;
  metaDescription: (c: EditorialCtx) => string;
  h1: string;
  intro: (c: EditorialCtx) => string;
  fit: (c: EditorialCtx) => string;
  faq: (c: EditorialCtx) => (SeoFaq & { replaces?: RegExp })[];
  feedTitle: string;
  feedDescription: string;
  /** Feed copy for the Ex-UK item of this storage, when it is sold Ex-UK. */
  feedExUkTitle?: string;
  feedExUkDescription?: string;
};

export type ModelEditorial = {
  seoTitle: string;
  metaDescription: (c: EditorialCtx) => string;
  h1: string;
  intro: (c: EditorialCtx) => string;
  bestFor: string;
  keyFeatures: EditorialFeature[];
  sections: (c: EditorialCtx) => EditorialSection[];
  specs: SeoSpec[];
  faq: (c: EditorialCtx) => SeoFaq[];
  links: EditorialLink[];
  /** Other models whose live prices the copy quotes. */
  compareIds: string[];
  storages: Record<string, EditorialStorage>;
};

export const kes = (n: number) => `KES ${Math.round(n).toLocaleString("en-KE")}`;
const plan6 = (n: number): LipaPlan => lipaPlan(n, 40, 6);

function joinList(items: string[], word = "and"): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} ${word} ${items.at(-1)}`;
}

/** "KES 167,000 new or KES 142,000 Ex-UK", or whichever of the two is listed. */
function otherPrices(o: { newKes: number; exUkKes: number }): string {
  const bits = [o.newKes ? `${kes(o.newKes)} new` : "", o.exUkKes ? `${kes(o.exUkKes)} Ex-UK` : ""].filter(Boolean);
  return bits.join(" or ");
}

/** "256GB: KES 203,000" (plus "new, KES n Ex-UK" when sold Ex-UK) for every listed storage. */
function priceList(c: EditorialCtx): string[] {
  return c.storages
    .filter((s) => c.price(s) > 0 || c.exUk(s) > 0)
    .map((s) => `${s}: ${both(c, s)}`);
}

/** "KES 158,000 new or KES 136,000 Ex-UK", or whichever is listed. */
function both(c: EditorialCtx, s: string): string {
  return otherPrices({ newKes: c.price(s), exUkKes: c.exUk(s) });
}

/** "KES 203,000 for 256GB, KES 234,000 for 512GB and KES 292,000 for 1TB" */
function priceSentence(c: EditorialCtx): string {
  return joinList(c.storages.filter((s) => c.price(s) > 0).map((s) => `${kes(c.price(s))} for ${s}`));
}

function lipaExample(c: EditorialCtx, storage: string): string {
  const p = c.price(storage);
  if (!p) return "";
  const plan = plan6(p);
  return `For example, the ${storage} is a ${kes(plan.depositKes)} deposit, then ${kes(plan.monthlyKes)} a month for 6 months.`;
}

const fromKes = (c: EditorialCtx) => Math.min(...c.storages.map(c.price).filter((n) => n > 0));
const fromExUk = (c: EditorialCtx) => {
  const xs = c.storages.map(c.exUk).filter((n) => n > 0);
  return xs.length ? Math.min(...xs) : 0;
};
/** Lowest price in either condition. */
const fromAny = (c: EditorialCtx) => Math.min(...[fromKes(c), fromExUk(c)].filter((n) => n > 0 && Number.isFinite(n)));

const STORE = {
  address: "Norwich Union House, Suite 15, 4th Floor, opposite the Hilton Hotel in Nairobi CBD",
  hours: "Mon–Sat 8am–8pm and Sun 10am–8pm",
  whatsapp: "0729 585 471",
};

const TRUST =
  "GadgetHub is an Apple Authorised Reseller and has served over a million customers across Kenya, including Nairobi's Japanese and Chinese communities.";

const EX_UK_LINE =
  "Ex-UK: UK-used units, sold at a lower price. Condition and warranty terms are stated on your GadgetHub invoice, so ask us on WhatsApp before you buy.";

function whyBuyBoth(name: string): EditorialSection {
  const s = whyBuy(name);
  return {
    ...s,
    list: [
      `Genuine and traceable: every new ${name} is sealed, and the serial number is printed on your invoice.`,
      "Warranty: new units carry a 1-year warranty. Keep your GadgetHub invoice for support.",
      EX_UK_LINE,
      ...(s.list ?? []).slice(2),
    ],
  };
}

function whyBuy(name: string): EditorialSection {
  return {
    id: "why-gadgethub",
    heading: "Why buy from GadgetHub",
    paragraphs: [TRUST],
    list: [
      `Genuine, sealed and traceable: every ${name} is new and sealed, and the serial number is printed on your invoice.`,
      "Warranty: a 1-year warranty. Keep your GadgetHub invoice for support.",
      "Payment: M-Pesa STK Push at checkout, M-Pesa in store, or Lipa Mdogo Mdogo, our in-house plan: a 40% deposit, then the balance over 1 to 6 months.",
      `Collection: ${STORE.address}.`,
      "Delivery: anywhere in Kenya, from KES 1,500.",
      `Help: WhatsApp us on ${STORE.whatsapp} to confirm colour and stock before you pay.`,
    ],
  };
}

function inTheBox(name: string): EditorialSection {
  return {
    id: "in-the-box",
    heading: "What is in the box",
    paragraphs: ["There is no power adapter in the box."],
    list: [name, "USB-C Charge Cable", "Documentation"],
  };
}

const kenyaTerms: EditorialSection = {
  id: "delivery-terms",
  heading: "Delivery, payment, warranty and returns in Kenya",
  paragraphs: [],
  list: [
    `Nairobi: same-day or next-day delivery may be available, depending on stock and your area. Delivery starts from KES 1,500, or collect from our shop in Nairobi CBD (${STORE.hours}).`,
    "Outside Nairobi: we deliver by courier once we have confirmed your location. The fee and timeline are quoted on WhatsApp before you pay.",
    "Payment: M-Pesa STK Push at checkout, M-Pesa in store, or Lipa Mdogo Mdogo with a 40% deposit and 1 to 6 monthly payments.",
    "Warranty: 1 year on new devices. Keep your GadgetHub invoice. Claims follow GadgetHub's Return & Refund Policy, not AppleCare retail terms.",
    "Returns: report faulty, damaged or not-as-described items within 7 days of delivery, and transit damage within 48 hours with photos. Sealed new devices can't be returned for a change of mind. Approved refunds are paid within 7 business days after inspection.",
  ],
};

const kenyaTermsBoth: EditorialSection = {
  ...kenyaTerms,
  list: [...(kenyaTerms.list ?? []).slice(0, 3), (kenyaTerms.list ?? [])[3], EX_UK_LINE, ...(kenyaTerms.list ?? []).slice(4)],
};

// ---------------------------------------------------------------- iPhone 18 Pro Max

const PM_COLOURS = "Burgundy, Black, Glacier and Silver";

const proMax: ModelEditorial = {
  seoTitle: "iPhone 18 Pro Max Price in Kenya: 256GB, 512GB, 1TB",
  metaDescription: (c) =>
    `iPhone 18 Pro Max from ${kes(fromKes(c))}. New and sealed with a 1-year warranty. Pay by M-Pesa or Lipa Mdogo Mdogo; we deliver across Kenya. Order today.`,
  h1: "Apple iPhone 18 Pro Max, New",
  intro: (c) =>
    `The Apple iPhone 18 Pro Max is in stock at GadgetHub in Nairobi. Prices are ${priceSentence(c)}. It suits people who film, edit and work on their phone all day: it has the A20 Pro chip, a 6.9-inch ProMotion display and up to 45 hours of video playback. Every unit is new and sealed with a 1-year warranty, in ${PM_COLOURS}. Collect from our shop in Nairobi CBD, or we deliver anywhere in Kenya.`,
  bestFor: "people who film, edit and work on their phone all day and want the biggest Pro screen and the longest iPhone battery.",
  keyFeatures: [
    { title: "A20 Pro chip with vapor-chamber cooling.", body: "Long gaming, editing and filming sessions stay smooth instead of slowing down as the phone warms up." },
    { title: "6.9-inch Super Retina XDR display with ProMotion up to 120Hz.", body: "It is the biggest screen in the Pro range, and scrolling, maps and video feel fluid." },
    { title: "Three 48MP Fusion cameras.", body: "The main, Ultra Wide and Telephoto lenses are all 48MP, so detail holds up whether you shoot wide, close or far away." },
    { title: "Telephoto at 4x and 8x optical quality.", body: "Get close to the stage at a concert, the pitch on match day or wildlife on a game drive." },
    { title: "Up to 45 hours of video playback.", body: "Apple calls this the longest battery life in an iPhone, so most people get through a full Nairobi day and evening on one charge." },
    { title: "Fast USB-C charging.", body: "Reach up to 50% in about 15 minutes with a compatible adapter. MagSafe and Qi wireless charging also work." },
    { title: "IP68 water resistance (6 m for 30 minutes).", body: "Rain on the commute and a splash at the pool are covered." },
  ],
  sections: (c) => [
    {
      id: "overview",
      heading: "Overview",
      paragraphs: [
        `The iPhone 18 Pro Max is Apple's largest Pro iPhone for 2026. It is for buyers who want the most screen, the longest battery life in an iPhone and the full Pro camera system in one phone. GadgetHub sells it new and sealed in ${joinList(c.storages)}, and all four colours are available: ${PM_COLOURS}.`,
        "If you are moving up from an older iPhone, you can trade it in towards the cost, or spread the payment with Lipa Mdogo Mdogo.",
      ],
      list: priceList(c),
    },
    {
      id: "design",
      heading: "Design and display",
      paragraphs: [
        "The frame is a forged aluminium unibody. The front is Ceramic Shield 2 and the back is Ceramic Shield. At 249 g it feels solid in the hand without being awkward to carry.",
        "The 6.9-inch Super Retina XDR display uses ProMotion, which adjusts the refresh rate up to 120Hz. Text, games and scrolling stay smooth, and the screen saves power when nothing is moving. The Dynamic Island can show up to three Live Activities at once, such as a ride, a match score and a timer, so you don't need to open each app to check them.",
        "The phone also has the Action button, which you set to Silent, Translate, a Shortcut and more, and Camera Control for quick shots.",
      ],
    },
    {
      id: "performance",
      heading: "Performance",
      paragraphs: [
        "Inside is the A20 Pro chip with a dual 16-core Neural Engine. A next-generation vapor chamber spreads heat so the phone holds its speed during long sessions. That matters if you edit 4K video, play graphics-heavy games or use Apple Intelligence features through the day.",
        "With 5G, Wi-Fi 7 and eSIM, downloads and video calls feel quick. Safety features include Crash Detection, Messages via satellite and Emergency SOS via satellite where Apple supports them.",
      ],
    },
    {
      id: "camera",
      heading: "Camera",
      paragraphs: [
        "This is the reason many buyers choose the Pro Max. For video creators it records ProRes RAW, Apple Log 2 and Dual Capture, plus 4K Dolby Vision at up to 120 fps. This is the phone people in Nairobi use to film events, content and client work.",
      ],
      list: [
        "Main camera: 48MP Fusion with a variable aperture from ƒ/1.48 to ƒ/4.0, at 24 mm and 48 mm (1x and 2x), for control over light and background blur.",
        "Ultra Wide: 48MP at 13 mm (0.5x), which doubles as a macro camera for close-ups.",
        "Telephoto: 48MP at 100 mm and 200 mm, giving 4x and 8x optical-quality zoom.",
        "Front: the 18MP Center Stage camera keeps you in frame on video calls.",
      ],
    },
    {
      id: "battery",
      heading: "Battery and charging",
      paragraphs: [
        "Apple rates the iPhone 18 Pro Max at up to 45 hours of video playback and up to 30 hours of typical use per charge. With a compatible USB-C adapter, wired charging reaches up to 50% in around 15 minutes. MagSafe and Qi wireless charging also work, so cases and chargers snap into place.",
        "Only a USB-C charge cable is in the box. Add a 20W adapter if you don't already have one.",
      ],
    },
    whyBuy("iPhone 18 Pro Max"),
    inTheBox("iPhone 18 Pro Max"),
    kenyaTerms,
  ],
  specs: [
    { label: "Display", value: "6.9-inch Super Retina XDR, ProMotion up to 120Hz, Dynamic Island" },
    { label: "Chip", value: "A20 Pro, dual 16-core Neural Engine, next-generation vapor chamber" },
    { label: "Main camera", value: "48MP Fusion, variable aperture ƒ/1.48 to ƒ/4.0, 24/48 mm (1x/2x)" },
    { label: "Ultra Wide", value: "48MP Fusion Ultra Wide, 13 mm (0.5x/macro), ƒ/2.2" },
    { label: "Telephoto", value: "48MP Fusion Telephoto, 100/200 mm (4x/8x optical quality), ƒ/2.8" },
    { label: "Front camera", value: "18MP Center Stage" },
    { label: "Video", value: "ProRes RAW, Apple Log 2, Dual Capture, 4K Dolby Vision up to 120 fps" },
    { label: "Battery", value: "Up to 45 hours video playback; up to 30 hours typical use (Apple claims)" },
    { label: "Charging", value: "USB-C, up to 50% in around 15 minutes with a compatible adapter; MagSafe and Qi wireless" },
    { label: "Connectivity", value: "5G, Wi-Fi 7, Bluetooth, eSIM" },
    { label: "Safety", value: "Crash Detection; Messages and Emergency SOS via satellite (where available)" },
    { label: "Controls", value: "Camera Control, Action button, Face ID" },
    { label: "Build", value: "Forged aluminium unibody; Ceramic Shield 2 front; Ceramic Shield back" },
    { label: "Water resistance", value: "IP68 (6 m for 30 minutes)" },
    { label: "Weight", value: "249 g" },
    { label: "Colours", value: "Burgundy, Black, Glacier, Silver" },
    { label: "Software", value: "Apple Intelligence" },
    { label: "Storage", value: "256GB, 512GB, 1TB" },
  ],
  faq: (c) => {
    const p17 = c.other("iphone-17-pro-max");
    const p18 = c.other("iphone-18-pro");
    return [
      { question: "What is the price of the iPhone 18 Pro Max in Kenya?", answer: `At GadgetHub the iPhone 18 Pro Max costs ${priceSentence(c)}. All are new and sealed.` },
      { question: "Is this iPhone 18 Pro Max brand new and genuine?", answer: "Yes. GadgetHub is an Apple Authorised Reseller. Every unit is new and sealed, and the serial number is printed on your invoice." },
      { question: "Does the iPhone 18 Pro Max come with a warranty?", answer: "Yes, a 1-year warranty. Keep your GadgetHub invoice for any claim." },
      { question: "Can I pay for the iPhone 18 Pro Max by M-Pesa?", answer: "Yes. You can pay by M-Pesa STK Push at checkout or by M-Pesa in our shop." },
      { question: "Can I buy the iPhone 18 Pro Max on instalments?", answer: `Yes, with Lipa Mdogo Mdogo. You pay a 40% deposit, then the balance over 1 to 6 months. ${lipaExample(c, "256GB")}`.trim() },
      { question: "Do you deliver the iPhone 18 Pro Max outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay. Delivery starts from KES 1,500." },
      {
        question: "What is the difference between the iPhone 18 Pro Max and the iPhone 17 Pro Max?",
        answer: `The iPhone 18 Pro Max has the A20 Pro chip instead of the A19 Pro, up to 45 hours of video playback instead of 39, and a main camera with a variable aperture. Both have a 6.9-inch 120Hz display. The 17 Pro Max is lighter at 233 g, against 249 g.${otherPrices(p17) ? ` It also costs less: ${otherPrices(p17)}.` : ""}`,
      },
      { question: "Which colours does the iPhone 18 Pro Max come in?", answer: `${PM_COLOURS}. All four are available.` },
      {
        question: "Is the iPhone 18 Pro Max worth it over the iPhone 18 Pro?",
        answer: `Choose the Pro Max for the larger 6.9-inch screen and the longer battery: up to 45 hours of video, against 36 on the 18 Pro. The 18 Pro is smaller at 6.3 inches and 211 g${p18.newKes ? `, and costs from ${kes(p18.newKes)}` : ""}.`,
      },
      { question: "Can I trade in my old iPhone?", answer: "Yes. Bring or describe your current iPhone and we'll give you an estimate. The final value is confirmed after we check the battery health, screen and iCloud status." },
    ];
  },
  links: [
    { href: "/iphone/compare/iphone-18-pro-max-vs-iphone-17-pro-max", text: "iPhone 18 Pro Max vs iPhone 17 Pro Max" },
    { href: "/iphone/compare/iphone-18-pro-vs-iphone-18-pro-max", text: "Compare the iPhone 18 Pro and 18 Pro Max" },
    { href: "/accessories", text: "iPhone 18 Pro Max cases, MagSafe chargers and USB-C adapters" },
    { href: "/lipa-mdogo-mdogo", text: "Buy the iPhone 18 Pro Max on Lipa Mdogo Mdogo" },
    { href: "/journal/iphone-18-pro-price-in-kenya", text: "iPhone 18 prices in Kenya guide" },
  ],
  compareIds: ["iphone-17-pro-max", "iphone-18-pro"],
  storages: {
    "256GB": {
      title: "iPhone 18 Pro Max 256GB Price in Kenya | GadgetHub",
      metaDescription: (c) =>
        `iPhone 18 Pro Max 256GB at ${kes(c.price("256GB"))}, new and sealed with a 1-year warranty. Pay by M-Pesa or a 40% deposit. Delivery across Kenya.`,
      h1: "Apple iPhone 18 Pro Max 256GB, New",
      intro: (c) =>
        `The iPhone 18 Pro Max 256GB costs ${kes(c.price("256GB"))} at GadgetHub. It is the entry point to Apple's biggest Pro iPhone, with the same A20 Pro chip, 6.9-inch ProMotion display and 48MP Pro Fusion cameras as the larger sizes. It is in stock, new and sealed, in all four colours (${PM_COLOURS}), with a 1-year warranty. Pay by M-Pesa or spread it with Lipa Mdogo Mdogo. Collect in Nairobi CBD or have it delivered anywhere in Kenya.`,
      fit: () =>
        "256GB suits most buyers. It holds thousands of photos, your apps and WhatsApp history, plus a good amount of 4K video, especially if you back up to iCloud. Choose it if you mainly take photos and short clips and want the Pro Max screen and battery for less. If you record long ProRes or Apple Log video, look at 512GB or 1TB instead.",
      faq: (c) => [
        { question: "How much is the iPhone 18 Pro Max 256GB in Kenya?", answer: `It costs ${kes(c.price("256GB"))} new and sealed at GadgetHub.`, replaces: /^How much is/ },
        { question: "Can I pay for the iPhone 18 Pro Max 256GB in instalments?", answer: `Yes. With Lipa Mdogo Mdogo, pay a ${kes(plan6(c.price("256GB")).depositKes)} deposit, then ${kes(plan6(c.price("256GB")).monthlyKes)} a month for 6 months. Shorter plans cost less.`, replaces: /instalments\?$/ },
        { question: "Is 256GB enough on the iPhone 18 Pro Max?", answer: "For most people, yes. Choose 512GB or more if you shoot a lot of 4K or ProRes video." },
        { question: "Which colours are in stock for the 256GB?", answer: `All four: ${PM_COLOURS}.`, replaces: /^What colours/ },
      ],
      feedTitle: "Apple iPhone 18 Pro Max 256GB, New, Glacier, Burgundy, Black or Silver, A20 Pro, 6.9-inch ProMotion, 5G",
      feedDescription:
        "Apple iPhone 18 Pro Max with 256GB of storage, sold new and sealed by GadgetHub in Nairobi, Kenya. Available in Burgundy, Black, Glacier and Silver. The phone has a 6.9-inch Super Retina XDR display with ProMotion up to 120Hz and Dynamic Island. It runs on the A20 Pro chip with a dual 16-core Neural Engine and a vapor chamber for sustained performance. The rear camera system has three 48MP Fusion cameras: a main camera with variable aperture from f/1.48 to f/4.0, an Ultra Wide camera with macro, and a Telephoto camera with 4x and 8x optical-quality zoom. The front camera is 18MP Center Stage. Video recording includes ProRes RAW, Apple Log 2, Dual Capture and 4K Dolby Vision up to 120 fps. Battery life is rated by Apple at up to 45 hours of video playback. Charging is by USB-C, reaching up to 50 percent in around 15 minutes with a compatible adapter, with MagSafe and Qi wireless charging supported. Connectivity includes 5G, Wi-Fi 7, Bluetooth and eSIM. Water resistance is rated IP68 to 6 metres for 30 minutes. Weight is 249 g. In the box: iPhone 18 Pro Max, USB-C Charge Cable and documentation. Includes a 1-year warranty from GadgetHub.",
    },
    "512GB": {
      title: "iPhone 18 Pro Max 512GB Price in Kenya | GadgetHub",
      metaDescription: (c) =>
        `Buy the iPhone 18 Pro Max 512GB for ${kes(c.price("512GB"))} in Nairobi. New, sealed, 1-year warranty, M-Pesa or Lipa Mdogo Mdogo, delivery across Kenya.`,
      h1: "Apple iPhone 18 Pro Max 512GB, New",
      intro: (c) => {
        const diff = c.price("512GB") - c.price("256GB");
        return `The iPhone 18 Pro Max 512GB costs ${kes(c.price("512GB"))} at GadgetHub${c.price("256GB") && diff > 0 ? `, double the storage of the 256GB for ${kes(diff)} more` : ""}. It is built for people who keep everything on the phone: long 4K clips, big photo libraries, offline Netflix and games. You get the A20 Pro chip, a 6.9-inch ProMotion display and up to 45 hours of video playback, in ${PM_COLOURS}. It is new and sealed with a 1-year warranty, and we deliver anywhere in Kenya.`;
      },
      fit: () =>
        "This is the size for content creators, wedding and event shooters, and anyone who doesn't want to keep deleting things. The iPhone 18 Pro Max records ProRes RAW and Apple Log 2, and those files fill storage quickly. 512GB gives you room to film a full event before you offload it, and leaves space for years of apps and updates if you plan to keep the phone a long time.",
      faq: (c) => [
        { question: "What is the iPhone 18 Pro Max 512GB price in Kenya?", answer: `It is ${kes(c.price("512GB"))}, new and sealed.`, replaces: /^How much is/ },
        { question: "How much is the deposit for the iPhone 18 Pro Max 512GB on Lipa Mdogo Mdogo?", answer: `The deposit is ${kes(plan6(c.price("512GB")).depositKes)}, then ${kes(plan6(c.price("512GB")).monthlyKes)} a month over 6 months. Shorter plans cost less.`, replaces: /instalments\?$/ },
        { question: "Should I get 512GB or 256GB?", answer: `Choose 512GB if you shoot a lot of video or keep large files offline.${c.price("256GB") ? ` The 256GB is ${kes(c.price("256GB"))}.` : ""}`, replaces: /^Should I buy the .* or / },
        { question: "Do you deliver the 512GB outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay.", replaces: /^Do you deliver/ },
      ],
      feedTitle: "Apple iPhone 18 Pro Max 512GB, New, Burgundy, Black, Glacier or Silver, A20 Pro, 48MP Pro Fusion Camera, 5G",
      feedDescription:
        "Apple iPhone 18 Pro Max with 512GB of storage, new and sealed, sold by GadgetHub in Nairobi, Kenya. Colours: Burgundy, Black, Glacier and Silver. The 512GB capacity suits users who record long 4K, ProRes RAW or Apple Log 2 video, or who keep large photo and media libraries on the device. Display: 6.9-inch Super Retina XDR with ProMotion up to 120Hz and Dynamic Island. Chip: A20 Pro with a dual 16-core Neural Engine and next-generation vapor chamber cooling. Rear cameras: 48MP Fusion main camera with variable aperture, 48MP Fusion Ultra Wide with macro, and 48MP Fusion Telephoto with 4x and 8x optical-quality zoom. Front camera: 18MP Center Stage. Battery: up to 45 hours of video playback and up to 30 hours of typical use, as rated by Apple. Charging: USB-C wired charging to around 50 percent in 15 minutes with a compatible adapter, plus MagSafe and Qi wireless. Connectivity: 5G, Wi-Fi 7, Bluetooth and eSIM. Build: forged aluminium unibody with Ceramic Shield 2 front, IP68 water resistance to 6 metres for 30 minutes, 249 g. In the box: iPhone 18 Pro Max, USB-C Charge Cable and documentation. 1-year warranty.",
    },
    "1TB": {
      title: "iPhone 18 Pro Max 1TB Price in Kenya | Buy in Nairobi",
      metaDescription: (c) =>
        `iPhone 18 Pro Max 1TB for ${kes(c.price("1TB"))}. New and sealed, for creators who film ProRes and 4K. 1-year warranty, M-Pesa, delivery across Kenya.`,
      h1: "Apple iPhone 18 Pro Max 1TB, New",
      intro: (c) =>
        `The iPhone 18 Pro Max 1TB costs ${kes(c.price("1TB"))} at GadgetHub. It is the largest capacity we stock of Apple's biggest Pro iPhone, meant for filmmakers, photographers and business owners who treat the phone as their main camera and archive. You get the A20 Pro chip, three 48MP Fusion cameras, ProRes RAW recording and up to 45 hours of video playback, in ${PM_COLOURS}. It is new and sealed with a 1-year warranty: collect it in Nairobi CBD or have it delivered across Kenya.`,
      fit: (c) =>
        `1TB is for people who don't want storage to limit them: a full day of ProRes RAW or Apple Log 2 footage, years of photos at full resolution, and large offline libraries for travel. It is also a good choice if you work away from reliable Wi-Fi and can't upload to the cloud often. If you mostly take photos and short clips, the 256GB${c.price("256GB") ? ` at ${kes(c.price("256GB"))}` : ""} or the 512GB${c.price("512GB") ? ` at ${kes(c.price("512GB"))}` : ""} will do the same job for less.`,
      faq: (c) => [
        { question: "How much is the iPhone 18 Pro Max 1TB in Kenya?", answer: `It is ${kes(c.price("1TB"))}, new and sealed at GadgetHub.`, replaces: /^How much is/ },
        { question: "Is there a 2TB iPhone 18 Pro Max for sale?", answer: `We currently stock ${joinList(c.storages)}. Ask us on WhatsApp about other sizes.` },
        { question: "Can I buy the 1TB on instalments?", answer: `Yes. Pay a ${kes(plan6(c.price("1TB")).depositKes)} deposit, then ${kes(plan6(c.price("1TB")).monthlyKes)} a month over 6 months with Lipa Mdogo Mdogo.`, replaces: /instalments\?$/ },
        { question: "Is the 1TB model genuine and sealed?", answer: "Yes. It is new and sealed from an Apple Authorised Reseller, with the serial number on your invoice.", replaces: /original\?$/ },
      ],
      feedTitle: "Apple iPhone 18 Pro Max 1TB, New, Burgundy, Black, Glacier or Silver, A20 Pro, ProRes RAW Video, 6.9-inch, 5G",
      feedDescription:
        "Apple iPhone 18 Pro Max with 1TB of storage, new and sealed, sold by GadgetHub in Nairobi, Kenya. Available in Burgundy, Black, Glacier and Silver. The 1TB capacity is suited to recording long ProRes RAW, Apple Log 2 and 4K Dolby Vision video and to keeping large photo libraries on the phone. The device has a 6.9-inch Super Retina XDR display with ProMotion up to 120Hz, Dynamic Island, and the A20 Pro chip with a dual 16-core Neural Engine and vapor chamber cooling. The camera system includes a 48MP Fusion main camera with variable aperture from f/1.48 to f/4.0, a 48MP Fusion Ultra Wide camera with macro, a 48MP Fusion Telephoto camera with 4x and 8x optical-quality zoom, and an 18MP Center Stage front camera. Camera Control and the Action button are included. Battery life is rated at up to 45 hours of video playback. Charging is through USB-C, with up to 50 percent in about 15 minutes using a compatible adapter, and MagSafe and Qi wireless support. Connectivity: 5G, Wi-Fi 7, Bluetooth, eSIM. IP68 water resistance to 6 metres for 30 minutes. Weight 249 g. In the box: iPhone 18 Pro Max, USB-C Charge Cable and documentation. 1-year warranty.",
    },
  },
};

// ---------------------------------------------------------------- iPhone 18 Pro

const PRO_COLOURS = "Burgundy, Black, Glacier and Silver";

const pro: ModelEditorial = {
  seoTitle: "iPhone 18 Pro Price in Kenya: 256GB and 512GB | GadgetHub",
  metaDescription: (c) =>
    `iPhone 18 Pro from ${kes(fromKes(c))}: A20 Pro, 6.3-inch ProMotion, 48MP cameras. New, sealed, 1-year warranty. Pay by M-Pesa; delivery across Kenya.`,
  h1: "Apple iPhone 18 Pro, New",
  intro: (c) =>
    `The iPhone 18 Pro brings Apple's newest Pro features to a phone that fits easily in one hand. GadgetHub sells it new and sealed for ${priceSentence(c)}. It has the same A20 Pro chip and 48MP Pro Fusion camera system as the Pro Max, in a 6.3-inch body that weighs 211 g. Every colour is in stock (${PRO_COLOURS}) with a 1-year warranty. Collect in Nairobi CBD, or we deliver across Kenya.`,
  bestFor: "buyers who want Pro cameras and Pro speed in a compact phone that fits one hand.",
  keyFeatures: [
    { title: "A20 Pro in a compact phone.", body: "You get full Pro speed for editing, gaming and Apple Intelligence without carrying a big phone." },
    { title: "6.3-inch ProMotion display up to 120Hz.", body: "It is smooth and bright, and easy to use with one thumb on a matatu or walking through town." },
    { title: "Telephoto with 4x and 8x optical-quality zoom.", body: "The small Pro still zooms as far as the Pro Max, which is good for events, sport and kids on stage." },
    { title: "Variable-aperture 48MP main camera (ƒ/1.48 to ƒ/4.0).", body: "You control how much light comes in, from dim restaurants to bright midday sun." },
    { title: "Up to 36 hours of video playback.", body: "That is a full day of calls, maps, WhatsApp and video on one charge." },
    { title: "Fast USB-C and MagSafe charging.", body: "Reach up to 50% in about 15 minutes with a compatible adapter, or charge wirelessly with MagSafe and Qi." },
    { title: "IP68 and Crash Detection.", body: "Rated to 6 m for 30 minutes, and it can call for help after a severe car crash." },
  ],
  sections: (c) => [
    {
      id: "overview",
      heading: "Overview",
      paragraphs: [
        "Many buyers want Pro cameras and Pro speed but find the Max models too big. The iPhone 18 Pro is Apple's answer for 2026. It shares the A20 Pro chip and the 48MP Fusion camera trio with the iPhone 18 Pro Max, but has a 6.3-inch screen and weighs 211 g.",
        `Every size is new and sealed, in ${PRO_COLOURS}. Trade-in and Lipa Mdogo Mdogo are available on all of them.`,
      ],
      list: priceList(c),
    },
    {
      id: "design",
      heading: "Design and display",
      paragraphs: [
        "The iPhone 18 Pro uses a forged aluminium unibody, with Ceramic Shield 2 on the front and Ceramic Shield on the back. The 6.3-inch Super Retina XDR display has ProMotion up to 120Hz, so scrolling and games feel fluid, and the Dynamic Island can show up to three Live Activities at once.",
        "On the side is Camera Control, for capturing shots and adjusting settings without touching the screen. There is also the Action button, which you set for Silent, Translate, a Shortcut and more. Face ID unlocks the phone.",
      ],
    },
    {
      id: "performance",
      heading: "Performance",
      paragraphs: [
        "The A20 Pro chip has a dual 16-core Neural Engine, and a next-generation vapor chamber keeps it cool during long video edits, graphics-heavy games and Apple Intelligence tasks. In daily use, apps open quickly and the phone stays responsive when you switch between M-Pesa, WhatsApp, maps and the camera. It supports 5G on Kenyan networks that offer it.",
      ],
    },
    {
      id: "camera",
      heading: "Camera",
      paragraphs: [
        "There are three 48MP cameras on the back, and on the front the 18MP Center Stage camera keeps you centred on video calls and group selfies.",
      ],
      list: [
        "Main camera: 48MP Fusion with a variable aperture from ƒ/1.48 to ƒ/4.0, at 24 mm and 48 mm (1x and 2x). Open it up for low light, or close it down for sharper group shots and landscapes.",
        "Ultra Wide: 48MP at 13 mm (0.5x), which also shoots macro close-ups of food, flowers and product details.",
        "Telephoto: 48MP at 100 mm and 200 mm (4x and 8x optical quality), so you can fill the frame from the back of a hall or the stands at a match.",
      ],
    },
    {
      id: "battery",
      heading: "Battery and charging",
      paragraphs: [
        "Apple rates the iPhone 18 Pro at up to 36 hours of video playback. With a compatible USB-C adapter, wired charging reaches up to 50% in about 15 minutes, which is handy before you head out for the evening. MagSafe and Qi wireless charging are supported.",
        "The box includes a USB-C charge cable only. Add a 20W adapter or a MagSafe charger from our accessories range if you need one.",
      ],
    },
    whyBuy("iPhone 18 Pro"),
    inTheBox("iPhone 18 Pro"),
    kenyaTerms,
  ],
  specs: [
    { label: "Display", value: "6.3-inch Super Retina XDR, ProMotion up to 120Hz, Dynamic Island" },
    { label: "Chip", value: "A20 Pro, dual 16-core Neural Engine, next-generation vapor chamber" },
    { label: "Main camera", value: "48MP Fusion, variable aperture ƒ/1.48 to ƒ/4.0, 24/48 mm (1x/2x)" },
    { label: "Ultra Wide", value: "48MP Fusion Ultra Wide, 13 mm (0.5x/macro)" },
    { label: "Telephoto", value: "48MP Fusion Telephoto, 100/200 mm (4x/8x optical quality)" },
    { label: "Front camera", value: "18MP Center Stage" },
    { label: "Battery", value: "Up to 36 hours video playback (Apple claim)" },
    { label: "Charging", value: "USB-C, up to 50% in about 15 minutes with a compatible adapter; MagSafe and Qi wireless" },
    { label: "Cellular", value: "5G" },
    { label: "Controls", value: "Camera Control, Action button, Face ID" },
    { label: "Safety", value: "Crash Detection" },
    { label: "Build", value: "Forged aluminium unibody; Ceramic Shield 2 front; Ceramic Shield back" },
    { label: "Water resistance", value: "IP68 (6 m for 30 minutes)" },
    { label: "Weight", value: "211 g" },
    { label: "Colours", value: "Burgundy, Black, Glacier, Silver" },
    { label: "Software", value: "Apple Intelligence" },
    { label: "Storage", value: "256GB, 512GB" },
  ],
  faq: (c) => {
    const p17 = c.other("iphone-17-pro");
    const pm = c.other("iphone-18-pro-max");
    return [
      { question: "What is the price of the iPhone 18 Pro in Kenya?", answer: `The iPhone 18 Pro costs ${priceSentence(c)}, new and sealed at GadgetHub.` },
      { question: "Is the iPhone 18 Pro genuine and brand new?", answer: "Yes. GadgetHub is an Apple Authorised Reseller. Every iPhone 18 Pro is sealed, and its serial number is printed on your invoice." },
      { question: "Does the iPhone 18 Pro have a warranty?", answer: "Yes, 1 year. Keep your GadgetHub invoice for support." },
      { question: "Can I pay for the iPhone 18 Pro with M-Pesa?", answer: "Yes. You can pay by M-Pesa STK Push at checkout or by M-Pesa in store." },
      { question: "Can I get the iPhone 18 Pro on Lipa Mdogo Mdogo?", answer: `Yes. ${lipaExample(c, "256GB")} Shorter plans cost less.`.trim() },
      {
        question: "What is the difference between the iPhone 18 Pro and the iPhone 17 Pro?",
        answer: `Both have a 6.3-inch 120Hz display and three 48MP rear cameras. The iPhone 18 Pro adds the A20 Pro chip (the 17 Pro has the A19 Pro), longer video playback (up to 36 hours, against 33) and a variable-aperture main camera. The 17 Pro is a little lighter at 206 g, against 211 g.${otherPrices(p17) ? ` It costs ${otherPrices(p17)}.` : ""}`,
      },
      {
        question: "iPhone 18 Pro or iPhone 18 Pro Max: which should I buy?",
        answer: `They have the same chip and the same camera system. Choose the 18 Pro for a smaller, lighter phone (6.3 inches, 211 g, from ${kes(fromKes(c))}). Choose the Pro Max for a 6.9-inch screen and up to 45 hours of video playback${pm.newKes ? ` (from ${kes(pm.newKes)})` : ""}.`,
      },
      { question: "Do you deliver the iPhone 18 Pro outside Nairobi?", answer: "Yes, anywhere in Kenya by courier. We quote the fee and timeline on WhatsApp before you pay." },
      { question: "Which iPhone 18 Pro colours are available?", answer: `${PRO_COLOURS}. All four are available.` },
    ];
  },
  links: [
    { href: "/iphone/compare/iphone-18-pro-vs-iphone-17-pro", text: "iPhone 18 Pro vs iPhone 17 Pro" },
    { href: "/iphone/compare/iphone-18-pro-vs-iphone-18-pro-max", text: "iPhone 18 Pro or 18 Pro Max" },
    { href: "/iphone/iphone-18-pro-max", text: "See the bigger iPhone 18 Pro Max" },
    { href: "/accessories", text: "Cases and MagSafe chargers for iPhone 18 Pro" },
    { href: "/trade-in", text: "Trade in your old iPhone for an iPhone 18 Pro" },
  ],
  compareIds: ["iphone-17-pro", "iphone-18-pro-max"],
  storages: {
    "256GB": {
      title: "iPhone 18 Pro 256GB Price in Kenya | GadgetHub",
      metaDescription: (c) =>
        `iPhone 18 Pro 256GB for ${kes(c.price("256GB"))}, new and sealed with a 1-year warranty. Pay by M-Pesa or Lipa Mdogo Mdogo. Delivery across Kenya.`,
      h1: "Apple iPhone 18 Pro 256GB, New",
      intro: (c) =>
        `The iPhone 18 Pro 256GB costs ${kes(c.price("256GB"))} at GadgetHub, the lowest price for a new iPhone 18 Pro in our range. You still get the full Pro package: the A20 Pro chip, three 48MP cameras with 8x optical-quality zoom, and a 6.3-inch ProMotion display. It is in stock in all four colours (${PRO_COLOURS}), new and sealed with a 1-year warranty. Pay by M-Pesa or Lipa Mdogo Mdogo, then collect in Nairobi CBD or have it delivered.`,
      fit: () =>
        "It suits anyone moving up from an older iPhone who wants Pro cameras in a compact phone. 256GB holds your apps, chats and a large photo library, and you can keep adding to it if you use iCloud. If you film long 4K videos every week, the 512GB gives you more room.",
      faq: (c) => [
        { question: "How much is the iPhone 18 Pro 256GB in Kenya?", answer: `It costs ${kes(c.price("256GB"))}, new and sealed.`, replaces: /^How much is/ },
        { question: "What is the Lipa Mdogo Mdogo plan for the iPhone 18 Pro 256GB?", answer: `Pay a ${kes(plan6(c.price("256GB")).depositKes)} deposit, then ${kes(plan6(c.price("256GB")).monthlyKes)} a month for 6 months.`, replaces: /instalments\?$/ },
        { question: "Is there a 128GB iPhone 18 Pro?", answer: `We stock ${joinList(c.storages)}. Ask us on WhatsApp about other sizes.` },
        { question: "Can I collect the 256GB the same day?", answer: "If it is in stock, yes. Collect from our shop opposite the Hilton Hotel in Nairobi CBD.", replaces: /^Where can I buy/ },
      ],
      feedTitle: "Apple iPhone 18 Pro 256GB, New, Burgundy, Black, Glacier or Silver, A20 Pro Chip, 6.3-inch ProMotion, 5G",
      feedDescription:
        "Apple iPhone 18 Pro with 256GB of storage, sold new and sealed by GadgetHub in Nairobi, Kenya. Colours: Burgundy, Black, Glacier and Silver. The iPhone 18 Pro has a 6.3-inch Super Retina XDR display with ProMotion up to 120Hz and Dynamic Island. It is powered by the A20 Pro chip with a dual 16-core Neural Engine and a next-generation vapor chamber. The rear camera system includes a 48MP Fusion main camera with variable aperture from f/1.48 to f/4.0, a 48MP Fusion Ultra Wide camera at 13 mm with macro, and a 48MP Fusion Telephoto camera with 4x and 8x optical-quality zoom. The front camera is 18MP Center Stage. Camera Control, the Action button and Face ID are included. Apple rates battery life at up to 36 hours of video playback. Charging is through USB-C, reaching up to 50 percent in about 15 minutes with a compatible adapter, with MagSafe and Qi wireless charging supported. The phone supports 5G and Crash Detection and is rated IP68 to 6 metres for 30 minutes. Build: forged aluminium unibody, Ceramic Shield 2 front, Ceramic Shield back. Weight 211 g. In the box: iPhone 18 Pro, USB-C Charge Cable and documentation. 1-year warranty.",
    },
    "512GB": {
      title: "iPhone 18 Pro 512GB Price in Kenya | Buy in Nairobi",
      metaDescription: (c) =>
        `Buy the iPhone 18 Pro 512GB for ${kes(c.price("512GB"))}. New and sealed, room for 4K video, 1-year warranty, M-Pesa or Lipa Mdogo Mdogo, delivery in Kenya.`,
      h1: "Apple iPhone 18 Pro 512GB, New",
      intro: (c) =>
        `The iPhone 18 Pro 512GB costs ${kes(c.price("512GB"))} at GadgetHub. It is the compact Pro iPhone with twice the storage of the 256GB, for people who shoot a lot and don't want to keep clearing space. It has the A20 Pro chip, a variable-aperture 48MP main camera and up to 36 hours of video playback, in a 211 g body, in ${PRO_COLOURS}. New and sealed with a 1-year warranty, with delivery anywhere in Kenya.`,
      fit: () =>
        "Choose 512GB if your phone is also your camera for work: real estate walkthroughs, product shoots for your online shop, church services or family events. 4K clips take up space quickly, and 512GB lets you keep months of footage before you offload. It also leaves room for large games and offline maps for upcountry trips where the network is weak.",
      faq: (c) => {
        const diff = c.price("512GB") - c.price("256GB");
        return [
          { question: "What is the iPhone 18 Pro 512GB price in Kenya?", answer: `It is ${kes(c.price("512GB"))}, new and sealed at GadgetHub.`, replaces: /^How much is/ },
          { question: "How much deposit do I pay for the 512GB on Lipa Mdogo Mdogo?", answer: `The deposit is ${kes(plan6(c.price("512GB")).depositKes)}, then ${kes(plan6(c.price("512GB")).monthlyKes)} a month over 6 months. Shorter plans cost less.`, replaces: /instalments\?$/ },
          { question: "Is the 512GB worth the extra over the 256GB?", answer: `If you record a lot of video, yes.${c.price("256GB") && diff > 0 ? ` It costs ${kes(diff)} more than the 256GB, for twice the storage.` : ""}`, replaces: /^Should I buy the .* or / },
          { question: "Can it be delivered to me outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp first.", replaces: /^Do you deliver/ },
        ];
      },
      feedTitle: "Apple iPhone 18 Pro 512GB, New, Burgundy, Black, Glacier or Silver, A20 Pro, 48MP Pro Fusion Camera, 5G",
      feedDescription:
        "Apple iPhone 18 Pro with 512GB of storage, new and sealed, sold by GadgetHub in Nairobi, Kenya. Available in Burgundy, Black, Glacier and Silver. The 512GB capacity suits users who record a lot of 4K video or keep large photo, game and offline media libraries on the phone. Display: 6.3-inch Super Retina XDR with ProMotion up to 120Hz and Dynamic Island. Chip: A20 Pro with a dual 16-core Neural Engine and next-generation vapor chamber cooling. Rear cameras: 48MP Fusion main camera with variable aperture from f/1.48 to f/4.0 at 24 and 48 mm, 48MP Fusion Ultra Wide with macro, and 48MP Fusion Telephoto at 100 and 200 mm for 4x and 8x optical-quality zoom. Front camera: 18MP Center Stage. Controls: Camera Control, Action button and Face ID. Battery: up to 36 hours of video playback as rated by Apple. Charging: USB-C, up to 50 percent in about 15 minutes with a compatible adapter, plus MagSafe and Qi wireless. Connectivity: 5G. Safety: Crash Detection. IP68 water resistance to 6 metres for 30 minutes. Weight 211 g. In the box: iPhone 18 Pro, USB-C Charge Cable and documentation. 1-year warranty.",
    },
  },
};

// ---------------------------------------------------------------- iPhone Duo

const DUO_COLOURS = "Star White and Night Sky";

const duo: ModelEditorial = {
  seoTitle: "iPhone Duo Price in Kenya: Folding iPhone | GadgetHub",
  metaDescription: (c) =>
    `iPhone Duo, Apple's folding iPhone, from ${kes(fromKes(c))}. New, sealed, 1-year warranty. Pay by M-Pesa or Lipa Mdogo Mdogo; delivery across Kenya.`,
  h1: "Apple iPhone Duo, New Folding iPhone",
  intro: (c) =>
    `The iPhone Duo is Apple's folding iPhone, and GadgetHub has it in stock in Nairobi from ${kes(fromKes(c))}. Folded, it is a phone with a 5.4-inch display. Open it and you get a 7.6-inch screen for documents, spreadsheets, video and split-screen work. It runs on the A20 Pro chip, comes in ${DUO_COLOURS}, and is new and sealed with a 1-year warranty. Collect it in Nairobi CBD or get it delivered across Kenya.`,
  bestFor: "business owners, professionals and creators who want a phone and a small tablet in one device.",
  keyFeatures: [
    { title: "7.6-inch inner folding display with nano-texture.", body: "Close to a small tablet, for reading contracts, editing slides or watching a match, and the nano-texture finish cuts glare." },
    { title: "5.4-inch outer display.", body: "Calls, M-Pesa, WhatsApp and quick replies work without opening the phone." },
    { title: "A20 Pro chip with vapor cooling.", body: "The same chip as the iPhone 18 Pro models, so multitasking on the big screen stays smooth." },
    { title: "Grade 5 titanium frame and hinge cover.", body: "The parts that take the most stress on a folding phone are made of titanium." },
    { title: "48MP Dual Fusion camera system with Smart Take.", body: "Sharp photos, plus capture modes that help you get the shot first time." },
    { title: "Dual-battery system.", body: "Up to 44 hours of video playback on the outer display and up to 31 hours on the inner display (Apple claims)." },
    { title: "USB-C and MagSafe.", body: "Standard USB-C charging, and MagSafe cases and chargers snap into place." },
  ],
  sections: (c) => [
    {
      id: "overview",
      heading: "Overview",
      paragraphs: [
        "The iPhone Duo is the first folding iPhone and the most advanced iPhone GadgetHub stocks. It is for people who want a phone and a small tablet in one device: business owners, lawyers, consultants and creators who read and work on the move and would rather not carry an iPad as well.",
        `We sell it new and sealed, in two colours: ${DUO_COLOURS}.`,
      ],
      list: priceList(c),
    },
    {
      id: "design",
      heading: "Design and display",
      paragraphs: [
        "The frame and hinge cover are Grade 5 titanium. The front is Ceramic Shield 2 and the back is Ceramic Shield.",
        "Closed, you use the 5.4-inch Super Retina XDR outer display like a normal compact iPhone: one hand, quick tasks, pocket-friendly. Open, the 7.6-inch Super Retina XDR folding display gives you room to run two apps side by side, read a full page without zooming, and watch video on a far bigger screen than any other iPhone. The inner display also has a nano-texture finish, which reduces reflections in bright light.",
      ],
    },
    {
      id: "performance",
      heading: "Performance",
      paragraphs: [
        "The iPhone Duo uses the A20 Pro, the same chip as the iPhone 18 Pro and iPhone 18 Pro Max, and it is vapor-cooled for sustained Pro performance. On a folding phone that matters, because the big screen makes multitasking more likely: a video call on one side and notes on the other, or a spreadsheet next to your email.",
      ],
    },
    {
      id: "camera",
      heading: "Camera",
      paragraphs: [
        "The iPhone Duo has a 48MP Dual Fusion camera system. Smart Take and advanced capture modes are designed to help you get a well-timed, well-exposed shot without fiddling with settings. Because the phone folds, you can stand it partly open on a table for hands-free photos, group shots and video calls.",
      ],
    },
    {
      id: "battery",
      heading: "Battery and charging",
      paragraphs: [
        "The Duo has a dual-battery system for all-day power. Apple rates video playback at up to 44 hours on the outer display and up to 31 hours on the inner display. If you mostly use the outer screen and open it for longer tasks, you get through a full working day comfortably. It charges over USB-C and supports MagSafe.",
        "The box includes a USB-C charge cable but no power adapter.",
      ],
    },
    {
      ...whyBuy("iPhone Duo"),
      list: [
        `Try it first: a folding iPhone is a big purchase, so come into our shop at ${STORE.address} and see it before you decide.`,
        ...(whyBuy("iPhone Duo").list ?? []),
      ],
    },
    inTheBox("iPhone Duo"),
    kenyaTerms,
  ],
  specs: [
    { label: "Inner display", value: "7.6-inch Super Retina XDR folding display with nano-texture" },
    { label: "Outer display", value: "5.4-inch Super Retina XDR display" },
    { label: "Chip", value: "A20 Pro, vapor-cooled" },
    { label: "Rear camera", value: "48MP Dual Fusion camera system, Smart Take and advanced capture modes" },
    { label: "Battery", value: "Dual-battery system" },
    { label: "Video playback", value: "Up to 44 hours (outer display); up to 31 hours (inner display), Apple claims" },
    { label: "Port and charging", value: "USB-C; MagSafe" },
    { label: "Build", value: "Grade 5 titanium frame and hinge cover; Ceramic Shield 2 front; Ceramic Shield back" },
    { label: "Colours", value: "Star White, Night Sky" },
    { label: "Storage", value: "256GB, 512GB, 1TB" },
  ],
  faq: (c) => {
    const pm = c.other("iphone-18-pro-max");
    return [
      { question: "What is the price of the iPhone Duo in Kenya?", answer: `At GadgetHub the iPhone Duo costs ${priceSentence(c)}. All are new and sealed.` },
      { question: "Is the iPhone Duo Apple's foldable iPhone?", answer: "Yes. It folds from a 7.6-inch inner display down to a phone with a 5.4-inch outer display." },
      { question: "Is the iPhone Duo genuine and sealed?", answer: "Yes. GadgetHub is an Apple Authorised Reseller. Every iPhone Duo is new and sealed, and its serial number is printed on your invoice." },
      { question: "Does the iPhone Duo come with a warranty?", answer: "Yes, a 1-year warranty. Keep your GadgetHub invoice." },
      { question: "Can I buy the iPhone Duo on instalments?", answer: `Yes, with Lipa Mdogo Mdogo. ${lipaExample(c, "256GB")}`.trim() },
      { question: "Can I pay for the iPhone Duo with M-Pesa?", answer: "Yes, by M-Pesa STK Push at checkout or by M-Pesa in our shop." },
      {
        question: "What is the difference between the iPhone Duo and the iPhone 18 Pro Max?",
        answer: `Both run the A20 Pro chip. The iPhone Duo folds open to a 7.6-inch display and has a titanium frame, from ${kes(fromKes(c))}. The iPhone 18 Pro Max has a single 6.9-inch display, the triple 48MP Pro Fusion camera with 8x zoom and up to 45 hours of video playback${pm.newKes ? `, from ${kes(pm.newKes)}` : ""}.`,
      },
      { question: "Which colours does the iPhone Duo come in?", answer: `${DUO_COLOURS}. Both are available.` },
      { question: "Can I see the iPhone Duo before I buy?", answer: `Yes. Visit our shop at Norwich Union House, opposite the Hilton Hotel, Nairobi CBD. We're open ${STORE.hours}.` },
      { question: "Do you deliver the iPhone Duo outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay." },
    ];
  },
  links: [
    { href: "/iphone/compare/iphone-duo-vs-iphone-18-pro-max", text: "iPhone Duo vs iPhone 18 Pro Max" },
    { href: "/iphone/iphone-18-pro-max", text: "The iPhone 18 Pro Max, if you prefer a single screen" },
    { href: "/accessories", text: "iPhone Duo accessories and MagSafe chargers" },
    { href: "/lipa-mdogo-mdogo", text: "Pay for the iPhone Duo in instalments" },
    { href: "/locations", text: "Visit our Nairobi CBD shop to try the iPhone Duo" },
  ],
  compareIds: ["iphone-18-pro-max"],
  storages: {
    "256GB": {
      title: "iPhone Duo 256GB Price in Kenya | GadgetHub",
      metaDescription: (c) =>
        `iPhone Duo 256GB, Apple's folding iPhone, for ${kes(c.price("256GB"))}. New and sealed, 1-year warranty, M-Pesa or Lipa Mdogo Mdogo, delivery across Kenya.`,
      h1: "Apple iPhone Duo 256GB, New",
      intro: (c) =>
        `The iPhone Duo 256GB costs ${kes(c.price("256GB"))} at GadgetHub, the most affordable way into Apple's folding iPhone. You get the full Duo experience: a 7.6-inch inner display, a 5.4-inch outer display, the A20 Pro chip and a Grade 5 titanium frame. It is in stock in ${DUO_COLOURS}, new and sealed with a 1-year warranty. Pay by M-Pesa or Lipa Mdogo Mdogo, and collect in Nairobi CBD or have it delivered.`,
      fit: () =>
        "256GB is the right size if you will use the Duo mainly for email, documents, browsing and video calls, and keep photos backed up to iCloud. It gives you the big folding screen for the lowest price. Choose 512GB or 1TB if you plan to download a lot of films for travel or record long videos.",
      faq: (c) => [
        { question: "How much is the iPhone Duo 256GB in Kenya?", answer: `It costs ${kes(c.price("256GB"))}, new and sealed.`, replaces: /^How much is/ },
        { question: "What deposit do I pay for the iPhone Duo 256GB on Lipa Mdogo Mdogo?", answer: `${kes(plan6(c.price("256GB")).depositKes)}, then ${kes(plan6(c.price("256GB")).monthlyKes)} a month for 6 months.`, replaces: /instalments\?$/ },
        { question: "Is the 256GB Duo the same phone as the 1TB?", answer: "Yes. Only the storage differs. The screens, chip and camera are the same." },
        { question: "Which colours are available?", answer: `${DUO_COLOURS}.`, replaces: /^What colours/ },
      ],
      feedTitle: "Apple iPhone Duo 256GB, New, Star White or Night Sky, Folding iPhone, 7.6-inch Inner Display, A20 Pro",
      feedDescription:
        "Apple iPhone Duo with 256GB of storage, new and sealed, sold by GadgetHub in Nairobi, Kenya. The iPhone Duo is Apple's folding iPhone, available in Star White and Night Sky. It has a 7.6-inch Super Retina XDR folding inner display with nano-texture and a 5.4-inch Super Retina XDR outer display, so it can be used as a compact phone when closed and as a larger screen when open. It is powered by the A20 Pro chip and is vapor-cooled for sustained performance. The frame and hinge cover are made of Grade 5 titanium, with Ceramic Shield 2 on the front and Ceramic Shield on the back. The rear camera is a 48MP Dual Fusion camera system with Smart Take and advanced capture modes. A dual-battery system is rated by Apple at up to 44 hours of video playback on the outer display and up to 31 hours on the inner display. Charging is through USB-C, and MagSafe accessories are supported. In the box: iPhone Duo, USB-C Charge Cable and documentation. Includes a 1-year warranty from GadgetHub.",
    },
    "512GB": {
      title: "iPhone Duo 512GB Price in Kenya | Buy in Nairobi",
      metaDescription: (c) =>
        `Buy the iPhone Duo 512GB for ${kes(c.price("512GB"))} in Nairobi. New and sealed folding iPhone, 1-year warranty, M-Pesa and instalments, delivery across Kenya.`,
      h1: "Apple iPhone Duo 512GB, New",
      intro: (c) => {
        const diff = c.price("512GB") - c.price("256GB");
        return `The iPhone Duo 512GB costs ${kes(c.price("512GB"))} at GadgetHub${c.price("256GB") && diff > 0 ? `, double the storage of the 256GB for ${kes(diff)} more` : ""}. It is the size most heavy users will want, because a big screen invites big downloads: offline films, large PDFs, design files and games. You get the 7.6-inch folding display, the A20 Pro chip and the dual-battery system, in ${DUO_COLOURS}. It is new and sealed, with a 1-year warranty and delivery anywhere in Kenya.`;
      },
      fit: () =>
        "This size suits professionals who keep work files on the device and frequent travellers who load up on offline content before a flight from JKIA. It also suits anyone who wants the Duo to last several years without managing storage. 512GB gives you that headroom without the 1TB price.",
      faq: (c) => [
        { question: "What is the iPhone Duo 512GB price in Kenya?", answer: `It is ${kes(c.price("512GB"))}, new and sealed at GadgetHub.`, replaces: /^How much is/ },
        { question: "How much is the deposit for the 512GB on Lipa Mdogo Mdogo?", answer: `The deposit is ${kes(plan6(c.price("512GB")).depositKes)}, then ${kes(plan6(c.price("512GB")).monthlyKes)} a month over 6 months. Shorter plans cost less.`, replaces: /instalments\?$/ },
        { question: "Should I buy 512GB or 256GB?", answer: `If you download films, keep large files or shoot video, take 512GB. For mostly email and browsing, the 256GB${c.price("256GB") ? ` at ${kes(c.price("256GB"))}` : ""} is enough.`, replaces: /^Should I buy the .* or / },
        { question: "Do you deliver the 512GB outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay.", replaces: /^Do you deliver/ },
      ],
      feedTitle: "Apple iPhone Duo 512GB, New, Star White or Night Sky, Folding iPhone, A20 Pro, Grade 5 Titanium Frame",
      feedDescription:
        "Apple iPhone Duo with 512GB of storage, sold new and sealed by GadgetHub in Nairobi, Kenya. Colours: Star White and Night Sky. The 512GB capacity suits users who keep large documents, offline video and media libraries on the device. The iPhone Duo is a folding iPhone with a 7.6-inch Super Retina XDR inner display with nano-texture and a 5.4-inch Super Retina XDR outer display. It runs on the A20 Pro chip with vapor cooling for sustained performance. The design uses a Grade 5 titanium frame and hinge cover, a Ceramic Shield 2 front and a Ceramic Shield back. Camera: 48MP Dual Fusion camera system with Smart Take and advanced capture modes. Battery: dual-battery system with up to 44 hours of video playback on the outer display and up to 31 hours on the inner display, as rated by Apple. Port: USB-C, with MagSafe support. In the box: iPhone Duo, USB-C Charge Cable and documentation. 1-year warranty.",
    },
    "1TB": {
      title: "iPhone Duo 1TB Price in Kenya | GadgetHub Nairobi",
      metaDescription: (c) =>
        `iPhone Duo 1TB for ${kes(c.price("1TB"))}, Apple's folding iPhone with maximum storage. New and sealed, 1-year warranty, M-Pesa, delivery across Kenya.`,
      h1: "Apple iPhone Duo 1TB, New",
      intro: (c) =>
        `The iPhone Duo 1TB costs ${kes(c.price("1TB"))} at GadgetHub. It is the top configuration of Apple's folding iPhone, for buyers who want the most storage and never want to think about space. It has the same 7.6-inch nano-texture folding display, A20 Pro chip and titanium frame as the other sizes, with 1TB for files, footage and media, in ${DUO_COLOURS}. It is new and sealed with a 1-year warranty. See it in our Nairobi CBD shop or order for delivery across Kenya.`,
      fit: (c) =>
        `1TB is for executives and creators who run their work from the phone: full project folders, years of photos at full resolution, and a library of offline films and music for long trips. It is also the choice for anyone who wants to keep the Duo for years and never move files off it. If that isn't you, the 512GB${c.price("512GB") ? ` at ${kes(c.price("512GB"))}` : ""} covers most heavy users.`,
      faq: (c) => [
        { question: "How much is the iPhone Duo 1TB in Kenya?", answer: `It costs ${kes(c.price("1TB"))}, new and sealed at GadgetHub.`, replaces: /^How much is/ },
        { question: "Can I pay for the 1TB in instalments?", answer: `Yes. Pay a ${kes(plan6(c.price("1TB")).depositKes)} deposit, then ${kes(plan6(c.price("1TB")).monthlyKes)} a month over 6 months with Lipa Mdogo Mdogo.`, replaces: /instalments\?$/ },
        { question: "Is the 1TB genuine and sealed?", answer: "Yes. It is new and sealed from an Apple Authorised Reseller, with the serial number on your invoice.", replaces: /original\?$/ },
        { question: "Is there a 2TB iPhone Duo?", answer: `We currently stock ${joinList(c.storages)}. Ask us on WhatsApp about other sizes.` },
      ],
      feedTitle: "Apple iPhone Duo 1TB, New, Star White or Night Sky, Folding iPhone, 7.6-inch Nano-texture Display, A20 Pro",
      feedDescription:
        "Apple iPhone Duo with 1TB of storage, new and sealed, sold by GadgetHub in Nairobi, Kenya. Available in Star White and Night Sky. The 1TB capacity is the largest configuration stocked and suits users who store large work files, full-resolution photo libraries and offline media on the device. The iPhone Duo folds between a 5.4-inch Super Retina XDR outer display and a 7.6-inch Super Retina XDR inner folding display with nano-texture. It is powered by the A20 Pro chip, vapor-cooled for sustained performance. The frame and hinge cover are Grade 5 titanium, with a Ceramic Shield 2 front and a Ceramic Shield back. The rear camera is a 48MP Dual Fusion camera system with Smart Take and advanced capture modes. Apple rates the dual-battery system at up to 44 hours of video playback on the outer display and up to 31 hours on the inner display. It charges over USB-C and supports MagSafe accessories. In the box: iPhone Duo, USB-C Charge Cable and documentation. 1-year warranty.",
    },
  },
};

// ---------------------------------------------------------------- iPhone 17 series (New and Ex-UK)

/** Feed opening and closing by condition, around the model's spec body. */
function feed17(model: string, storage: string, colours: string, body: string, exUk: boolean): string {
  const open = exUk
    ? `Apple ${model} with ${storage} of storage, sold Ex-UK (UK-used) by GadgetHub in Nairobi, Kenya. Condition and warranty terms are stated on the GadgetHub invoice. Colours: ${colours}.`
    : `Apple ${model} with ${storage} of storage, sold new and sealed by GadgetHub in Nairobi, Kenya. Colours: ${colours}.`;
  return `${open} ${body} In the box: ${model}, USB-C Charge Cable and documentation.${exUk ? "" : " 1-year warranty."}`;
}

function lipaBoth(c: EditorialCtx, s: string): string {
  const n = c.price(s);
  const e = c.exUk(s);
  const bits = [
    n ? `new: a ${kes(plan6(n).depositKes)} deposit, then ${kes(plan6(n).monthlyKes)} a month for 6 months` : "",
    e ? `Ex-UK: a ${kes(plan6(e).depositKes)} deposit, then ${kes(plan6(e).monthlyKes)} a month for 6 months` : "",
  ].filter(Boolean);
  return bits.length ? `For the ${s}, ${bits.join("; ")}. Shorter plans cost less.` : "";
}

const newOrExUk = (c: EditorialCtx, name: string, s: string): SeoFaq => ({
  question: `Should I buy the ${name} ${s} new or Ex-UK?`,
  answer:
    c.price(s) && c.exUk(s)
      ? `New is sealed with a 1-year warranty for ${kes(c.price(s))}. Ex-UK is a UK-used unit for ${kes(c.exUk(s))}, saving ${kes(c.price(s) - c.exUk(s))}; its condition and warranty terms are on your invoice. Choose new for the full warranty, or Ex-UK to save.`
      : `We currently sell the ${s} ${c.price(s) ? "new" : "Ex-UK"} at ${kes(c.price(s) || c.exUk(s))}.`,
});

const I17_COLOURS = "Lavender, Mist Blue, Sage, White and Black";
const I17_BODY =
  "The iPhone 17 has a 6.3-inch Super Retina XDR display with ProMotion up to 120Hz, up to 3000 nits peak brightness and Dynamic Island. It runs on the A19 chip with a 5-core GPU and supports Apple Intelligence. The rear cameras are a 48MP Fusion Main camera with 2x optical-quality zoom and a 48MP Fusion Ultra Wide camera. The front camera is 18MP Center Stage with Dual Capture. Video records up to 4K at 60 fps in Dolby Vision. Camera Control and the Action button are included. Apple rates battery life at up to 30 hours of video playback. Charging is through USB-C, with MagSafe and Qi wireless support. Connectivity: 5G and Wi-Fi 7. Build: aluminium with a Ceramic Shield 2 front, IP68 water resistance to 6 metres for 30 minutes, 177 g.";

const i17: ModelEditorial = {
  seoTitle: "iPhone 17 Price in Kenya: New and Ex-UK | GadgetHub",
  metaDescription: (c) =>
    `iPhone 17 from ${kes(fromAny(c))}: ${both(c, c.storages[0])}. A19, 6.3-inch 120Hz display, 48MP cameras. M-Pesa, delivery across Kenya.`,
  h1: "Apple iPhone 17, New and Ex-UK",
  intro: (c) =>
    `The iPhone 17 is Apple's standard iPhone for 2025, and the first standard model with a 120Hz ProMotion display. At GadgetHub in Nairobi it costs ${c.storages.map((s) => `${both(c, s)} for ${s}`).join("; ")}. It has the A19 chip, two 48MP cameras and up to 30 hours of video playback, in ${I17_COLOURS}. New units are sealed with a 1-year warranty. Collect in Nairobi CBD, or we deliver across Kenya.`,
  bestFor: "everyday users who want a smooth 120Hz screen, strong cameras and all-day battery without paying for Pro.",
  keyFeatures: [
    { title: "ProMotion up to 120Hz on a standard iPhone.", body: "Scrolling, maps and games feel as smooth as on the Pro models." },
    { title: "Up to 3000 nits peak brightness.", body: "The 6.3-inch screen stays readable outdoors in the Nairobi midday sun." },
    { title: "A19 chip with a 5-core GPU.", body: "Fast for M-Pesa, WhatsApp, banking apps, games and Apple Intelligence." },
    { title: "48MP Fusion Main camera with 2x optical-quality zoom.", body: "Sharp everyday photos, and a clean 2x for portraits without a separate telephoto." },
    { title: "48MP Fusion Ultra Wide.", body: "Wide group shots, landscapes and interiors with real detail." },
    { title: "18MP Center Stage front camera with Dual Capture.", body: "Group selfies and video calls stay framed, and you can record front and back at once." },
    { title: "Up to 30 hours of video playback.", body: "A full day of calls, social media and streaming on one charge." },
  ],
  sections: (c) => {
    const p16 = c.other("iphone-16");
    return [
      {
        id: "overview",
        heading: "Overview",
        paragraphs: [
          `The iPhone 17 brings features that used to be Pro-only, such as the 120Hz ProMotion display, to Apple's standard iPhone. GadgetHub sells it in two conditions: new and sealed with a 1-year warranty, or Ex-UK (UK-used) for less. All five colours are available: ${I17_COLOURS}.`,
          `Moving up from an iPhone 16 or older, you get a bigger 6.3-inch screen (the iPhone 16 has 6.1 inches at 60Hz), a 48MP Ultra Wide instead of 12MP, and up to 30 hours of video instead of 22.${otherPrices(p16) ? ` The iPhone 16 costs ${otherPrices(p16)} if you want to spend less.` : ""}`,
        ],
        list: priceList(c),
      },
      {
        id: "design",
        heading: "Design and display",
        paragraphs: [
          "The iPhone 17 is built from aluminium and glass, with Ceramic Shield 2 on the front, and weighs 177 g. It is rated IP68, to 6 m for 30 minutes.",
          "The 6.3-inch Super Retina XDR display (2622×1206, 460 ppi) adjusts up to 120Hz, so text and video move smoothly, and it reaches up to 3000 nits peak brightness for outdoor use. The Dynamic Island shows Live Activities and alerts, and the side has Camera Control and the Action button, which you set for Silent, Translation, Shortcuts and more.",
        ],
      },
      {
        id: "performance",
        heading: "Performance",
        paragraphs: [
          "The A19 chip with a 5-core GPU keeps everyday apps, gaming and photo editing quick. Apple Intelligence features such as Writing Tools, Clean Up and visual intelligence run on the phone. 5G and Wi-Fi 7 keep downloads and video calls fast, and Face ID and Crash Detection are built in.",
        ],
      },
      {
        id: "camera",
        heading: "Camera",
        paragraphs: [
          "Video records up to 4K at 60 fps in Dolby Vision, with ultra-stabilised video for walking shots and matatu rides.",
        ],
        list: [
          "Main: 48MP Fusion, with 2x optical-quality zoom for portraits and closer shots.",
          "Ultra Wide: 48MP Fusion (24MP by default) for groups, landscapes and rooms.",
          "Front: 18MP Center Stage with flexible framing, group selfies and Dual Capture.",
        ],
      },
      {
        id: "battery",
        heading: "Battery and charging",
        paragraphs: [
          "Apple rates the iPhone 17 at up to 30 hours of video playback. It charges over USB-C and supports MagSafe and Qi wireless charging. Only a USB-C cable is in the box, so add an adapter if you need one.",
        ],
      },
      whyBuyBoth("iPhone 17"),
      inTheBox("iPhone 17"),
      kenyaTermsBoth,
    ];
  },
  specs: [
    { label: "Display", value: "6.3-inch Super Retina XDR, 2622×1206 (460 ppi), ProMotion up to 120Hz, up to 3000 nits peak, Dynamic Island" },
    { label: "Chip", value: "A19, 5-core GPU" },
    { label: "Main camera", value: "48MP Fusion Main, 2x optical-quality zoom" },
    { label: "Ultra Wide", value: "48MP Fusion Ultra Wide (24MP by default)" },
    { label: "Front camera", value: "18MP Center Stage, Dual Capture" },
    { label: "Video", value: "Up to 4K 60 fps Dolby Vision; ultra-stabilised video" },
    { label: "Battery", value: "Up to 30 hours video playback (Apple claim)" },
    { label: "Charging", value: "USB-C; MagSafe and Qi wireless" },
    { label: "Connectivity", value: "5G, Wi-Fi 7" },
    { label: "Controls", value: "Camera Control, Action button, Face ID" },
    { label: "Safety", value: "Crash Detection" },
    { label: "Build", value: "Aluminium and glass; Ceramic Shield 2 front" },
    { label: "Water resistance", value: "IP68 (6 m for 30 minutes)" },
    { label: "Weight", value: "177 g" },
    { label: "Colours", value: "Lavender, Mist Blue, Sage, White, Black" },
    { label: "Software", value: "Apple Intelligence" },
    { label: "Storage", value: "256GB" },
  ],
  faq: (c) => {
    const s = c.storages[0];
    const p18 = c.other("iphone-17-pro");
    return [
      { question: "What is the price of the iPhone 17 in Kenya?", answer: `At GadgetHub the iPhone 17 costs ${c.storages.map((x) => `${both(c, x)} for ${x}`).join("; ")}.` },
      newOrExUk(c, "iPhone 17", s),
      { question: "Is the iPhone 17 genuine?", answer: "Yes. GadgetHub is an Apple Authorised Reseller. New units are sealed with the serial number on your invoice; Ex-UK units are genuine UK-used iPhones." },
      { question: "Does the iPhone 17 come with a warranty?", answer: "New units have a 1-year warranty. Ex-UK condition and warranty terms are stated on your invoice." },
      { question: "Can I pay for the iPhone 17 by M-Pesa or in instalments?", answer: `Yes. Pay by M-Pesa STK Push at checkout or in store, or use Lipa Mdogo Mdogo. ${lipaBoth(c, s)}`.trim() },
      { question: "What is the difference between the iPhone 17 and the iPhone 16?", answer: "The iPhone 17 has a 6.3-inch 120Hz ProMotion display (the 16 has 6.1 inches at 60Hz), the A19 chip instead of the A18, a 48MP Ultra Wide instead of 12MP, and up to 30 hours of video playback instead of 22." },
      { question: "iPhone 17 or iPhone 17 Pro?", answer: `The 17 Pro adds the A19 Pro chip, a third 48MP Telephoto camera and up to 33 hours of video playback, in an aluminium unibody.${otherPrices(p18) ? ` It costs from ${otherPrices(p18)}.` : ""} Choose the iPhone 17 if you don't need the telephoto.` },
      { question: "Which colours does the iPhone 17 come in?", answer: `${I17_COLOURS}. All five are available.` },
      { question: "Do you deliver the iPhone 17 outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay. Delivery starts from KES 1,500." },
    ];
  },
  links: [
    { href: "/iphone/iphone-17-pro", text: "Compare with the iPhone 17 Pro" },
    { href: "/iphone/iphone-16", text: "iPhone 16 price in Kenya" },
    { href: "/accessories", text: "iPhone 17 cases, MagSafe chargers and adapters" },
    { href: "/lipa-mdogo-mdogo", text: "Buy the iPhone 17 on Lipa Mdogo Mdogo" },
    { href: "/trade-in", text: "Trade in your old iPhone for an iPhone 17" },
  ],
  compareIds: ["iphone-16", "iphone-17-pro"],
  storages: {
    "256GB": {
      title: "iPhone 17 256GB Price in Kenya, New and Ex-UK",
      metaDescription: (c) =>
        `iPhone 17 256GB: ${both(c, "256GB")} at GadgetHub. 120Hz display, A19, 48MP cameras. M-Pesa or Lipa Mdogo Mdogo, delivery in Kenya.`,
      h1: "Apple iPhone 17 256GB, New and Ex-UK",
      intro: (c) =>
        `The iPhone 17 256GB costs ${both(c, "256GB")} at GadgetHub. It gives you the 6.3-inch 120Hz ProMotion display, the A19 chip and two 48MP cameras, with 256GB for years of photos, apps and chats. Choose any of the five colours: ${I17_COLOURS}. New units are sealed with a 1-year warranty; Ex-UK terms are on your invoice. Pay by M-Pesa or Lipa Mdogo Mdogo and collect in Nairobi CBD or get it delivered.`,
      fit: () =>
        "256GB is the size most iPhone 17 buyers need. It holds thousands of photos, a good amount of 4K video, your apps and years of WhatsApp history, especially if you back up to iCloud. Take the Ex-UK unit if you want the same phone for less and are happy with a UK-used device.",
      faq: (c) => [
        { question: "How much is the iPhone 17 256GB in Kenya?", answer: `It is ${both(c, "256GB")} at GadgetHub in Nairobi CBD.`, replaces: /^How much is/ },
        { question: "Can I pay for the iPhone 17 256GB in instalments?", answer: `Yes, with Lipa Mdogo Mdogo. ${lipaBoth(c, "256GB")}`.trim(), replaces: /instalments\?$/ },
        { question: "Is there a 512GB iPhone 17?", answer: `We currently sell the iPhone 17 in ${joinList(c.storages)}. Ask us on WhatsApp about other sizes.` },
        { question: "Which colours are available for the 256GB?", answer: `All five: ${I17_COLOURS}.`, replaces: /^What colours/ },
      ],
      feedTitle: "Apple iPhone 17 256GB, New, Lavender, Mist Blue, Sage, White or Black, A19, 6.3-inch 120Hz ProMotion, 5G",
      feedDescription: feed17("iPhone 17", "256GB", I17_COLOURS, I17_BODY, false),
      feedExUkTitle: "Apple iPhone 17 256GB, Ex-UK (UK-used), Lavender, Mist Blue, Sage, White or Black, A19, 6.3-inch 120Hz",
      feedExUkDescription: feed17("iPhone 17", "256GB", I17_COLOURS, I17_BODY, true),
    },
  },
};

const PRO17_COLOURS = "Cosmic Orange, Deep Blue and Silver";
const pro17Body = (size: string, res: string, hours: number, grams: number) =>
  `It has a ${size} Super Retina XDR display (${res}, 460 ppi) with ProMotion up to 120Hz and Dynamic Island. It runs on the A19 Pro chip and supports Apple Intelligence. The rear camera system has three 48MP cameras: Fusion, Ultra Wide and Telephoto. The front camera is 18MP Center Stage. Camera Control and the Action button are included. Apple rates battery life at up to ${hours} hours of video playback. The port is USB-C (USB 3), with MagSafe support. Connectivity: 5G and Wi-Fi 7, with Face ID and Crash Detection. Build: aluminium unibody with Ceramic Shield 2, IP68 water resistance to 6 metres for 30 minutes, ${grams} g.`;
const PRO17_BODY = pro17Body("6.3-inch", "2622×1206", 33, 206);
const PM17_BODY = pro17Body("6.9-inch", "2868×1320", 39, 233);

function pro17Sections(c: EditorialCtx, o: { name: string; size: string; res: string; hours: number; grams: number; prevName: string; prevId: string; prevHours: number; nextId: string; nextName: string; nextHours: number }): EditorialSection[] {
  const prev = c.other(o.prevId);
  const next = c.other(o.nextId);
  return [
    {
      id: "overview",
      heading: "Overview",
      paragraphs: [
        `The ${o.name} is Apple's 2025 Pro iPhone${o.size === "6.9-inch" ? " in the big size" : " in the compact size"}: three 48MP cameras, the A19 Pro chip and a ${o.size} ProMotion display in an aluminium unibody. GadgetHub sells it new and sealed with a 1-year warranty, or Ex-UK (UK-used) for less, in ${PRO17_COLOURS}.`,
        `Since the ${o.nextName} arrived, the ${o.name} has become the value Pro: you keep three 48MP cameras and up to ${o.hours} hours of video for less.${otherPrices(next) ? ` The ${o.nextName} costs from ${otherPrices(next)}.` : ""}`,
      ],
      list: priceList(c),
    },
    {
      id: "design",
      heading: "Design and display",
      paragraphs: [
        `The aluminium unibody has Ceramic Shield 2 on the front, is rated IP68 (6 m for 30 minutes) and weighs ${o.grams} g. The ${o.size} Super Retina XDR display (${o.res}, 460 ppi) runs ProMotion up to 120Hz, so scrolling, games and video feel smooth, and the Dynamic Island keeps Live Activities in view.`,
        "Camera Control sits on the side for quick shots and settings, next to the Action button you set for Silent, Translate, a Shortcut and more.",
      ],
    },
    {
      id: "performance",
      heading: "Performance",
      paragraphs: [
        "The A19 Pro chip handles 4K editing, long gaming sessions and Apple Intelligence without slowing down. 5G and Wi-Fi 7 keep downloads and video calls quick, and the USB-C port runs at USB 3 speed, so moving large video files to a Mac or drive takes minutes rather than hours.",
      ],
    },
    {
      id: "camera",
      heading: "Camera",
      paragraphs: [
        `Every rear camera is 48MP, so detail holds up whether you shoot wide, normal or zoomed in. That is a step up from the ${o.prevName}, which has a 12MP telephoto. On the front, the 18MP Center Stage camera keeps you framed on video calls and group selfies.`,
      ],
      list: ["48MP Fusion main camera", "48MP Ultra Wide camera", "48MP Telephoto camera", "18MP Center Stage front camera"],
    },
    {
      id: "battery",
      heading: "Battery and charging",
      paragraphs: [
        `Apple rates the ${o.name} at up to ${o.hours} hours of video playback, against ${o.prevHours} on the ${o.prevName}.${otherPrices(prev) ? ` (The ${o.prevName} costs ${otherPrices(prev)}.)` : ""} It charges over USB-C and works with MagSafe chargers and cases. Only a USB-C cable is in the box.`,
      ],
    },
    whyBuyBoth(o.name),
    inTheBox(o.name),
    kenyaTermsBoth,
  ];
}

const proSpecs = (size: string, res: string, hours: number, grams: number): SeoSpec[] => [
  { label: "Display", value: `${size} Super Retina XDR, ${res} (460 ppi), ProMotion up to 120Hz, Dynamic Island` },
  { label: "Chip", value: "A19 Pro" },
  { label: "Rear cameras", value: "48MP Fusion; 48MP Ultra Wide; 48MP Telephoto" },
  { label: "Front camera", value: "18MP Center Stage" },
  { label: "Battery", value: `Up to ${hours} hours video playback (Apple claim)` },
  { label: "Port and charging", value: "USB-C (USB 3); MagSafe" },
  { label: "Connectivity", value: "5G, Wi-Fi 7" },
  { label: "Controls", value: "Camera Control, Action button, Face ID" },
  { label: "Safety", value: "Crash Detection" },
  { label: "Build", value: "Aluminium unibody; Ceramic Shield 2" },
  { label: "Water resistance", value: "IP68 (6 m for 30 minutes)" },
  { label: "Weight", value: `${grams} g` },
  { label: "Colours", value: "Cosmic Orange, Deep Blue, Silver" },
  { label: "Software", value: "Apple Intelligence" },
  { label: "Storage", value: "256GB, 512GB" },
];

function pro17Storages(name: string, body: string, short: string): Record<string, EditorialStorage> {
  return {
    "256GB": {
      title: `${name} 256GB Price in Kenya, New and Ex-UK`,
      metaDescription: (c) =>
        `${name} 256GB: ${both(c, "256GB")} at GadgetHub. A19 Pro, three 48MP cameras. M-Pesa or Lipa Mdogo Mdogo, delivery in Kenya.`,
      h1: `Apple ${name} 256GB, New and Ex-UK`,
      intro: (c) =>
        `The ${name} 256GB costs ${both(c, "256GB")} at GadgetHub. It is the lowest price into the ${name}, with the same A19 Pro chip, three 48MP cameras and ${short} ProMotion display as the 512GB. All three colours are available: ${PRO17_COLOURS}. New units are sealed with a 1-year warranty; Ex-UK terms are on your invoice. Pay by M-Pesa or Lipa Mdogo Mdogo, then collect in Nairobi CBD or have it delivered.`,
      fit: () =>
        "256GB suits most buyers: thousands of photos, a fair amount of 4K video, all your apps and years of chats, especially with iCloud backup. If you film long 4K videos every week, the 512GB gives you more room.",
      faq: (c) => [
        { question: `How much is the ${name} 256GB in Kenya?`, answer: `It is ${both(c, "256GB")} at GadgetHub in Nairobi CBD.`, replaces: /^How much is/ },
        { question: `Can I pay for the ${name} 256GB in instalments?`, answer: `Yes, with Lipa Mdogo Mdogo. ${lipaBoth(c, "256GB")}`.trim(), replaces: /instalments\?$/ },
        { question: `Is 256GB enough on the ${name}?`, answer: "For most people, yes. Choose 512GB if you shoot a lot of 4K video or keep large files offline." },
        { question: "Which colours are available for the 256GB?", answer: `All three: ${PRO17_COLOURS}.`, replaces: /^What colours/ },
      ],
      feedTitle: `Apple ${name} 256GB, New, Cosmic Orange, Deep Blue or Silver, A19 Pro, Three 48MP Cameras, ${short}, 5G`,
      feedDescription: feed17(name, "256GB", PRO17_COLOURS, body, false),
      feedExUkTitle: `Apple ${name} 256GB, Ex-UK (UK-used), Cosmic Orange, Deep Blue or Silver, A19 Pro, Three 48MP Cameras`,
      feedExUkDescription: feed17(name, "256GB", PRO17_COLOURS, body, true),
    },
    "512GB": {
      title: `${name} 512GB Price in Kenya | GadgetHub`,
      metaDescription: (c) =>
        `Buy the ${name} 512GB for ${both(c, "512GB")} in Nairobi. Room for 4K video, M-Pesa or Lipa Mdogo Mdogo, delivery across Kenya.`,
      h1: `Apple ${name} 512GB, New and Ex-UK`,
      intro: (c) => {
        const d = c.price("512GB") - c.price("256GB");
        return `The ${name} 512GB costs ${both(c, "512GB")} at GadgetHub.${c.price("256GB") && d > 0 ? ` New, that is ${kes(d)} more than the 256GB for twice the storage.` : ""} It is for people who film a lot, keep big photo libraries and don't want to keep clearing space. You get the A19 Pro chip, three 48MP cameras and the ${short} ProMotion display, in ${PRO17_COLOURS}. New units are sealed with a 1-year warranty, and we deliver anywhere in Kenya.`;
      },
      fit: () =>
        "Choose 512GB if your phone is also your work camera: events, product shoots for your online shop, church services or family occasions. 4K clips fill storage quickly, and 512GB lets you keep months of footage, large games and offline maps for upcountry trips.",
      faq: (c) => [
        { question: `What is the ${name} 512GB price in Kenya?`, answer: `It is ${both(c, "512GB")} at GadgetHub.`, replaces: /^How much is/ },
        { question: `Can I buy the ${name} 512GB on Lipa Mdogo Mdogo?`, answer: `Yes. ${lipaBoth(c, "512GB")}`.trim(), replaces: /instalments\?$/ },
        { question: "Should I get 512GB or 256GB?", answer: `Take 512GB if you shoot a lot of 4K video or keep large files offline.${c.storages.includes("256GB") ? ` The 256GB is ${both(c, "256GB")}.` : ""}`, replaces: /^Should I buy the .* or \d/ },
        { question: "Do you deliver the 512GB outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay.", replaces: /^Do you deliver/ },
      ],
      feedTitle: `Apple ${name} 512GB, New, Cosmic Orange, Deep Blue or Silver, A19 Pro, Three 48MP Cameras, ${short}, 5G`,
      feedDescription: feed17(name, "512GB", PRO17_COLOURS, body, false),
      feedExUkTitle: `Apple ${name} 512GB, Ex-UK (UK-used), Cosmic Orange, Deep Blue or Silver, A19 Pro, Three 48MP Cameras`,
      feedExUkDescription: feed17(name, "512GB", PRO17_COLOURS, body, true),
    },
  };
}

const pro17: ModelEditorial = {
  seoTitle: "iPhone 17 Pro Price in Kenya: New and Ex-UK | GadgetHub",
  metaDescription: (c) =>
    `iPhone 17 Pro from ${kes(fromAny(c))}. A19 Pro, three 48MP cameras, 6.3-inch ProMotion. New or Ex-UK, M-Pesa and delivery across Kenya.`,
  h1: "Apple iPhone 17 Pro, New and Ex-UK",
  intro: (c) =>
    `The iPhone 17 Pro puts three 48MP cameras and the A19 Pro chip in a 6.3-inch phone that fits one hand. At GadgetHub it costs ${c.storages.map((s) => `${both(c, s)} for ${s}`).join("; ")}. It comes in ${PRO17_COLOURS}, with up to 33 hours of video playback. New units are sealed with a 1-year warranty, and Ex-UK units save you money. Collect in Nairobi CBD, or we deliver across Kenya.`,
  bestFor: "photo and video users who want Pro cameras without the largest size.",
  keyFeatures: [
    { title: "Three 48MP cameras.", body: "Fusion, Ultra Wide and Telephoto are all 48MP, so zoomed shots keep their detail." },
    { title: "A19 Pro chip.", body: "Pro speed for 4K editing, gaming and Apple Intelligence." },
    { title: "6.3-inch ProMotion display up to 120Hz.", body: "Smooth and sharp at 460 ppi, in a size that works with one thumb." },
    { title: "Up to 33 hours of video playback.", body: "Six hours more than the iPhone 16 Pro, by Apple's figures." },
    { title: "Aluminium unibody with Ceramic Shield 2.", body: "A tough build, rated IP68 to 6 m for 30 minutes." },
    { title: "USB-C at USB 3 speed.", body: "Move long 4K clips to a computer or drive quickly." },
    { title: "Wi-Fi 7 and 5G.", body: "Fast downloads, backups and video calls." },
  ],
  sections: (c) =>
    pro17Sections(c, { name: "iPhone 17 Pro", size: "6.3-inch", res: "2622×1206", hours: 33, grams: 206, prevName: "iPhone 16 Pro", prevId: "iphone-16-pro", prevHours: 27, nextId: "iphone-18-pro", nextName: "iPhone 18 Pro", nextHours: 36 }),
  specs: proSpecs("6.3-inch", "2622×1206", 33, 206),
  faq: (c) => {
    const p18 = c.other("iphone-18-pro");
    const p16 = c.other("iphone-16-pro");
    const s = c.storages[0];
    return [
      { question: "What is the price of the iPhone 17 Pro in Kenya?", answer: `At GadgetHub the iPhone 17 Pro costs ${c.storages.map((x) => `${both(c, x)} for ${x}`).join("; ")}.` },
      newOrExUk(c, "iPhone 17 Pro", s),
      { question: "Is the iPhone 17 Pro genuine?", answer: "Yes. GadgetHub is an Apple Authorised Reseller. New units are sealed with the serial number on your invoice; Ex-UK units are genuine UK-used iPhones." },
      { question: "Does the iPhone 17 Pro have a warranty?", answer: "New units have a 1-year warranty. Ex-UK condition and warranty terms are stated on your invoice." },
      { question: "Can I pay for the iPhone 17 Pro in instalments?", answer: `Yes, with Lipa Mdogo Mdogo. ${lipaBoth(c, s)}`.trim() },
      { question: "What is the difference between the iPhone 17 Pro and the iPhone 18 Pro?", answer: `The iPhone 18 Pro has the newer A20 Pro chip, up to 36 hours of video playback (against 33) and a variable-aperture main camera. Both have a 6.3-inch 120Hz display and three 48MP cameras.${otherPrices(p18) ? ` The 18 Pro costs from ${otherPrices(p18)}.` : ""}` },
      { question: "What is the difference between the iPhone 17 Pro and the iPhone 16 Pro?", answer: `The 17 Pro has the A19 Pro instead of the A18 Pro, a 48MP Telephoto instead of 12MP, and up to 33 hours of video instead of 27.${otherPrices(p16) ? ` The 16 Pro costs ${otherPrices(p16)}.` : ""}` },
      { question: "Which colours does the iPhone 17 Pro come in?", answer: `${PRO17_COLOURS}. All three are available.` },
      { question: "Do you deliver the iPhone 17 Pro outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay." },
    ];
  },
  links: [
    { href: "/iphone/compare/iphone-17-pro-vs-iphone-18-pro", text: "iPhone 17 Pro vs iPhone 18 Pro" },
    { href: "/iphone/compare/iphone-17-pro-vs-iphone-17-pro-max", text: "iPhone 17 Pro or 17 Pro Max" },
    { href: "/iphone/iphone-17-pro-max", text: "See the bigger iPhone 17 Pro Max" },
    { href: "/accessories", text: "Cases and MagSafe chargers for iPhone 17 Pro" },
    { href: "/lipa-mdogo-mdogo", text: "Buy the iPhone 17 Pro on Lipa Mdogo Mdogo" },
  ],
  compareIds: ["iphone-18-pro", "iphone-16-pro"],
  storages: pro17Storages("iPhone 17 Pro", PRO17_BODY, "6.3-inch"),
};

const pm17: ModelEditorial = {
  seoTitle: "iPhone 17 Pro Max Price in Kenya: New and Ex-UK",
  metaDescription: (c) =>
    `iPhone 17 Pro Max from ${kes(fromAny(c))}. A19 Pro, three 48MP cameras, 6.9-inch display, 39-hour battery. New or Ex-UK, M-Pesa, delivery in Kenya.`,
  h1: "Apple iPhone 17 Pro Max, New and Ex-UK",
  intro: (c) =>
    `The iPhone 17 Pro Max is the big-screen Pro iPhone from 2025, with a 6.9-inch ProMotion display, three 48MP cameras and up to 39 hours of video playback. At GadgetHub it costs ${c.storages.map((s) => `${both(c, s)} for ${s}`).join("; ")}, in ${PRO17_COLOURS}. New units are sealed with a 1-year warranty, and Ex-UK units save you money. Collect in Nairobi CBD, or we deliver anywhere in Kenya.`,
  bestFor: "big-screen users who want the most battery and Pro cameras at a lower price than the newest Pro Max.",
  keyFeatures: [
    { title: "6.9-inch ProMotion display up to 120Hz.", body: "A big, sharp 2868×1320 screen for video, reading and games." },
    { title: "Up to 39 hours of video playback.", body: "Six hours more than the iPhone 16 Pro Max, by Apple's figures." },
    { title: "Three 48MP cameras.", body: "Fusion, Ultra Wide and Telephoto all at 48MP, for detail at every focal length." },
    { title: "A19 Pro chip.", body: "Fast for 4K editing, long gaming sessions and Apple Intelligence." },
    { title: "USB-C at USB 3 speed.", body: "Offload long 4K recordings to a computer or drive quickly." },
    { title: "Aluminium unibody, Ceramic Shield 2 and IP68.", body: "Built to handle daily knocks, rain and splashes." },
  ],
  sections: (c) =>
    pro17Sections(c, { name: "iPhone 17 Pro Max", size: "6.9-inch", res: "2868×1320", hours: 39, grams: 233, prevName: "iPhone 16 Pro Max", prevId: "iphone-16-pro-max", prevHours: 33, nextId: "iphone-18-pro-max", nextName: "iPhone 18 Pro Max", nextHours: 45 }),
  specs: proSpecs("6.9-inch", "2868×1320", 39, 233),
  faq: (c) => {
    const p18 = c.other("iphone-18-pro-max");
    const p16 = c.other("iphone-16-pro-max");
    const s = c.storages[0];
    return [
      { question: "What is the price of the iPhone 17 Pro Max in Kenya?", answer: `At GadgetHub the iPhone 17 Pro Max costs ${c.storages.map((x) => `${both(c, x)} for ${x}`).join("; ")}.` },
      newOrExUk(c, "iPhone 17 Pro Max", s),
      { question: "Is the iPhone 17 Pro Max genuine?", answer: "Yes. GadgetHub is an Apple Authorised Reseller. New units are sealed with the serial number on your invoice; Ex-UK units are genuine UK-used iPhones." },
      { question: "Does the iPhone 17 Pro Max have a warranty?", answer: "New units have a 1-year warranty. Ex-UK condition and warranty terms are stated on your invoice." },
      { question: "Can I buy the iPhone 17 Pro Max on instalments?", answer: `Yes, with Lipa Mdogo Mdogo. ${lipaBoth(c, s)}`.trim() },
      { question: "iPhone 17 Pro Max or iPhone 18 Pro Max?", answer: `The 18 Pro Max has the A20 Pro chip, up to 45 hours of video playback (against 39) and a variable-aperture main camera; the 17 Pro Max is lighter at 233 g against 249 g.${otherPrices(p18) ? ` The 18 Pro Max costs from ${otherPrices(p18)}.` : ""}` },
      { question: "What is the difference between the iPhone 17 Pro Max and the iPhone 16 Pro Max?", answer: `The 17 Pro Max has the A19 Pro instead of the A18 Pro, a 48MP Telephoto instead of 12MP, and up to 39 hours of video instead of 33.${otherPrices(p16) ? ` The 16 Pro Max costs ${otherPrices(p16)}.` : ""}` },
      { question: "Which colours does the iPhone 17 Pro Max come in?", answer: `${PRO17_COLOURS}. All three are available.` },
      { question: "Do you deliver the iPhone 17 Pro Max outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay." },
    ];
  },
  links: [
    { href: "/iphone/compare/iphone-17-pro-max-vs-iphone-18-pro-max", text: "iPhone 17 Pro Max vs iPhone 18 Pro Max" },
    { href: "/iphone/compare/iphone-17-pro-vs-iphone-17-pro-max", text: "iPhone 17 Pro or 17 Pro Max" },
    { href: "/iphone/iphone-18-pro-max", text: "See the newer iPhone 18 Pro Max" },
    { href: "/accessories", text: "iPhone 17 Pro Max cases and MagSafe chargers" },
    { href: "/trade-in", text: "Trade in your old iPhone for an iPhone 17 Pro Max" },
  ],
  compareIds: ["iphone-18-pro-max", "iphone-16-pro-max"],
  storages: pro17Storages("iPhone 17 Pro Max", PM17_BODY, "6.9-inch"),
};

// ---------------------------------------------------------------- iPhone 16 series (Ex-UK only)

const EX_TERMS =
  "Ex-UK means a UK-used iPhone. Condition and warranty terms are stated on your GadgetHub invoice, so ask us on WhatsApp before you buy.";

function whyBuyExUk(name: string): EditorialSection {
  return {
    id: "why-gadgethub",
    heading: "Why buy from GadgetHub",
    paragraphs: [TRUST],
    list: [
      `Genuine Apple: every ${name} we sell is a genuine UK-used iPhone, not a copy or a refurbished clone.`,
      `Clear terms: ${EX_TERMS}`,
      "Payment: M-Pesa STK Push at checkout, M-Pesa in store, or Lipa Mdogo Mdogo, our in-house plan: a 40% deposit, then the balance over 1 to 6 months.",
      `See it first: ${STORE.address}.`,
      "Delivery: anywhere in Kenya, from KES 1,500.",
      `Help: WhatsApp us on ${STORE.whatsapp} to confirm colour, condition and stock before you pay.`,
    ],
  };
}

const whatComes: EditorialSection = {
  id: "in-the-box",
  heading: "What comes with it",
  paragraphs: ["What is included with an Ex-UK unit can vary. We confirm exactly what comes with your phone on WhatsApp before you pay, and it is listed on your invoice."],
};

const kenyaTermsExUk: EditorialSection = {
  ...kenyaTerms,
  list: [
    ...(kenyaTerms.list ?? []).slice(0, 3),
    `Warranty: ${EX_TERMS}`,
    "Returns: report faulty, damaged or not-as-described items within 7 days of delivery, and transit damage within 48 hours with photos. Approved refunds are paid within 7 business days after inspection.",
  ],
};

const exList = (c: EditorialCtx) => c.storages.filter((s) => c.exUk(s) > 0);
const exSentence = (c: EditorialCtx) => joinList(exList(c).map((s) => `${kes(c.exUk(s))} for ${s}`));
const exFrom = (c: EditorialCtx) => fromExUk(c);
const exPriceList = (c: EditorialCtx) => exList(c).map((s) => `${s}: ${kes(c.exUk(s))} Ex-UK`);

function exLipa(c: EditorialCtx, s: string): string {
  const e = c.exUk(s);
  return e ? `For the ${s}, pay a ${kes(plan6(e).depositKes)} deposit, then ${kes(plan6(e).monthlyKes)} a month for 6 months. Shorter plans cost less.` : "";
}

function feed16(model: string, storage: string, colours: string, body: string): string {
  return `Apple ${model} with ${storage} of storage, sold Ex-UK (UK-used) by GadgetHub in Nairobi, Kenya. Condition, included items and warranty terms are stated on the GadgetHub invoice. Colours: ${colours}. ${body}`;
}

type I16 = {
  name: string; short: string; metaBit: string; colours: string; body: string; small: string; large: string;
  smallFit: string; largeFit: string; feedSmall: string; feedLarge: string;
};

function storages16(o: I16): Record<string, EditorialStorage> {
  const one = (s: string, fit: string, feedTitle: string, isSmall: boolean): EditorialStorage => ({
    title: `${o.name} ${s} Price in Kenya, Ex-UK | GadgetHub`,
    metaDescription: (c) =>
      `${o.name} ${s} Ex-UK for ${kes(c.exUk(s))} at GadgetHub. ${o.metaBit}. M-Pesa or Lipa Mdogo Mdogo, delivery in Kenya.`,
    h1: `Apple ${o.name} ${s}, Ex-UK`,
    intro: (c) => {
      const other = isSmall ? o.large : o.small;
      const d = Math.abs(c.exUk(other) - c.exUk(s));
      return `The ${o.name} ${s} costs ${kes(c.exUk(s))} Ex-UK at GadgetHub in Nairobi.${c.exUk(other) && d ? ` ${isSmall ? `It is the lowest price into the ${o.name}, ${kes(d)} less than the ${other}.` : `It doubles the storage of the ${other} for ${kes(d)} more.`}` : ""} ${o.short}, in ${o.colours}. Ex-UK means a UK-used unit; condition and warranty terms are on your invoice. Pay by M-Pesa or Lipa Mdogo Mdogo, and collect in Nairobi CBD or have it delivered.`;
    },
    fit: () => fit,
    faq: (c) => [
      { question: `How much is the ${o.name} ${s} in Kenya?`, answer: `It is ${kes(c.exUk(s))} Ex-UK at GadgetHub in Nairobi CBD.`, replaces: /^How much is/ },
      { question: `Can I pay for the ${o.name} ${s} in instalments?`, answer: `Yes, with Lipa Mdogo Mdogo. ${exLipa(c, s)}`.trim(), replaces: /instalments\?$/ },
      { question: `Is the ${o.name} ${s} new?`, answer: `No. We sell the ${o.name} Ex-UK: a genuine UK-used iPhone. Its condition and warranty terms are stated on your invoice, and we can share photos and battery health on WhatsApp before you pay.` },
      { question: `Which colours are available for the ${s}?`, answer: `The ${o.name} comes in ${o.colours}. Ex-UK colour stock changes, so we confirm yours on WhatsApp before you pay.`, replaces: /^What colours/ },
    ],
    feedTitle,
    feedDescription: feed16(o.name, s, o.colours, o.body),
    feedExUkTitle: feedTitle,
    feedExUkDescription: feed16(o.name, s, o.colours, o.body),
  });
  return {
    [o.small]: one(o.small, o.smallFit, o.feedSmall, true),
    [o.large]: one(o.large, o.largeFit, o.feedLarge, false),
  };
}

const I16_COLOURS = "Black, Pink, Teal, Ultramarine and White";
const I16_BODY =
  "The iPhone 16 has a 6.1-inch Super Retina XDR display (2556×1179, 460 ppi) with Dynamic Island. It runs on the A18 chip and supports Apple Intelligence. The rear cameras are a 48MP Fusion camera and a 12MP Ultra Wide camera; the front camera is 12MP TrueDepth. Camera Control and the Action button are included. Apple rates battery life at up to 22 hours of video playback for a new battery. Charging is through USB-C, with MagSafe support. Connectivity: 5G and Wi-Fi 7, with Face ID and Crash Detection. Build: aluminium frame with Ceramic Shield, IP68 water resistance to 6 metres for 30 minutes, 170 g.";

const i16: ModelEditorial = {
  seoTitle: "iPhone 16 Price in Kenya: Ex-UK 128GB, 256GB | GadgetHub",
  metaDescription: (c) =>
    `iPhone 16 Ex-UK from ${kes(exFrom(c))} at GadgetHub Nairobi. A18 chip, 48MP camera, Camera Control. M-Pesa or Lipa Mdogo Mdogo, delivery across Kenya.`,
  h1: "Apple iPhone 16, Ex-UK",
  intro: (c) =>
    `The iPhone 16 is a strong value iPhone for Kenya: the A18 chip, a 48MP Fusion camera, Camera Control and Apple Intelligence, for much less than a new model. GadgetHub sells it Ex-UK (UK-used) for ${exSentence(c)}, in ${I16_COLOURS}. Condition and warranty terms are on your invoice, and you can check the phone before you pay. Collect in Nairobi CBD, or we deliver across Kenya.`,
  bestFor: "buyers who want a recent iPhone with a 48MP camera and Apple Intelligence at an Ex-UK price.",
  keyFeatures: [
    { title: "A18 chip.", body: "Quick for WhatsApp, M-Pesa, banking apps, games and Apple Intelligence." },
    { title: "48MP Fusion camera.", body: "Sharp daylight and low-light photos, with a 12MP Ultra Wide for groups and landscapes." },
    { title: "Camera Control.", body: "A dedicated button to open the camera, shoot and adjust settings without touching the screen." },
    { title: "6.1-inch Super Retina XDR display with Dynamic Island.", body: "A comfortable one-hand size with a sharp 460 ppi screen." },
    { title: "Action button.", body: "Set it for Silent, a Shortcut, the torch and more." },
    { title: "USB-C, MagSafe and Wi-Fi 7.", body: "The same cable as your other devices, snap-on chargers and fast Wi-Fi." },
    { title: "IP68 water resistance.", body: "Rated to 6 m for 30 minutes, so rain and splashes are covered." },
  ],
  sections: (c) => {
    const p17 = c.other("iphone-17");
    const p15 = c.other("iphone-15");
    return [
      {
        id: "overview",
        heading: "Overview",
        paragraphs: [
          `The iPhone 16 arrived with Apple Intelligence, Camera Control and the A18 chip, and as an Ex-UK phone it is one of the most affordable ways to get them. GadgetHub sells it UK-used in ${joinList(exList(c))}, in ${I16_COLOURS}.`,
          `Compared with the iPhone 15, it adds the A18 chip (the 15 has the A16 Bionic), Camera Control, the Action button and up to 22 hours of video playback instead of 20.${otherPrices(p15) ? ` The iPhone 15 costs ${otherPrices(p15)}.` : ""}${otherPrices(p17) ? ` If you want the 120Hz screen, the iPhone 17 costs ${otherPrices(p17)}.` : ""}`,
        ],
        list: exPriceList(c),
      },
      {
        id: "design",
        heading: "Design and display",
        paragraphs: [
          "The iPhone 16 has an aluminium frame with Ceramic Shield on the front, weighs 170 g and is rated IP68 (6 m for 30 minutes). The 6.1-inch Super Retina XDR display (2556×1179, 460 ppi) runs at 60Hz and has the Dynamic Island for Live Activities and alerts.",
          "On the side are Camera Control and the Action button, which you set for Silent, a Shortcut, the torch and more.",
        ],
      },
      {
        id: "performance",
        heading: "Performance",
        paragraphs: [
          "The A18 chip keeps everyday apps, games and photo editing smooth and runs Apple Intelligence features on the phone. 5G and Wi-Fi 7 keep downloads and video calls fast, and Face ID and Crash Detection are built in.",
        ],
      },
      {
        id: "camera",
        heading: "Camera",
        paragraphs: [
          "The 48MP Fusion main camera takes detailed photos in daylight and dim rooms, and the 12MP Ultra Wide covers groups, landscapes and interiors. The 12MP TrueDepth front camera handles selfies and video calls, and Camera Control lets you shoot and adjust settings with one button.",
        ],
      },
      {
        id: "battery",
        heading: "Battery and charging",
        paragraphs: [
          "Apple rates the iPhone 16 at up to 22 hours of video playback with a new battery. On an Ex-UK unit, ask us for the battery health figure before you buy; it is checked before sale. The phone charges over USB-C and works with MagSafe chargers and cases.",
        ],
      },
      whyBuyExUk("iPhone 16"),
      whatComes,
      kenyaTermsExUk,
    ];
  },
  specs: [
    { label: "Condition", value: "Ex-UK (UK-used); terms on invoice" },
    { label: "Display", value: "6.1-inch Super Retina XDR, 2556×1179 (460 ppi), 60Hz, Dynamic Island" },
    { label: "Chip", value: "A18" },
    { label: "Rear cameras", value: "48MP Fusion; 12MP Ultra Wide" },
    { label: "Front camera", value: "12MP TrueDepth" },
    { label: "Battery", value: "Up to 22 hours video playback (Apple claim, new battery)" },
    { label: "Port and charging", value: "USB-C; MagSafe" },
    { label: "Connectivity", value: "5G, Wi-Fi 7" },
    { label: "Controls", value: "Camera Control, Action button, Face ID" },
    { label: "Safety", value: "Crash Detection" },
    { label: "Build", value: "Aluminium frame; Ceramic Shield" },
    { label: "Water resistance", value: "IP68 (6 m for 30 minutes)" },
    { label: "Weight", value: "170 g" },
    { label: "Colours", value: "Black, Pink, Teal, Ultramarine, White" },
    { label: "Software", value: "Apple Intelligence" },
    { label: "Storage", value: "128GB, 256GB" },
  ],
  faq: (c) => {
    const p17 = c.other("iphone-17");
    return [
      { question: "What is the price of the iPhone 16 in Kenya?", answer: `At GadgetHub the iPhone 16 costs ${exSentence(c)}, Ex-UK.` },
      { question: "Is the iPhone 16 at GadgetHub new?", answer: `No, we sell the iPhone 16 Ex-UK. ${EX_TERMS}` },
      { question: "Is the Ex-UK iPhone 16 genuine?", answer: "Yes. It is a genuine UK-used Apple iPhone from an Apple Authorised Reseller, and we can share its photos and battery health on WhatsApp." },
      { question: "Can I buy the iPhone 16 on Lipa Mdogo Mdogo?", answer: `Yes. ${exLipa(c, exList(c)[0] ?? "128GB")}`.trim() },
      { question: "Can I pay for the iPhone 16 by M-Pesa?", answer: "Yes, by M-Pesa STK Push at checkout or by M-Pesa in our shop." },
      { question: "What is the difference between the iPhone 16 and the iPhone 15?", answer: "The iPhone 16 has the A18 chip instead of the A16 Bionic, adds Camera Control and the Action button, supports Apple Intelligence and Wi-Fi 7, and is rated for up to 22 hours of video playback instead of 20." },
      { question: "iPhone 16 or iPhone 17?", answer: `The iPhone 17 adds a 6.3-inch 120Hz display, the A19 chip, a 48MP Ultra Wide and up to 30 hours of video.${otherPrices(p17) ? ` It costs ${otherPrices(p17)}.` : ""} The iPhone 16 is the lower-cost choice.` },
      { question: "Which colours does the iPhone 16 come in?", answer: `${I16_COLOURS}. Ex-UK colour stock changes, so we confirm yours on WhatsApp.` },
      { question: "Do you deliver the iPhone 16 outside Nairobi?", answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay. Delivery starts from KES 1,500." },
    ];
  },
  links: [
    { href: "/iphone/iphone-17", text: "Compare with the iPhone 17" },
    { href: "/iphone/iphone-16-pro", text: "iPhone 16 Pro Ex-UK price" },
    { href: "/accessories", text: "iPhone 16 cases, MagSafe chargers and adapters" },
    { href: "/lipa-mdogo-mdogo", text: "Buy the iPhone 16 on Lipa Mdogo Mdogo" },
    { href: "/trade-in", text: "Trade in your old iPhone for an iPhone 16" },
  ],
  compareIds: ["iphone-17", "iphone-15"],
  storages: storages16({
    name: "iPhone 16",
    short: "A18 chip, 48MP Fusion camera, Camera Control and a 6.1-inch display",
    metaBit: "A18 chip, 48MP camera, Camera Control",
    colours: I16_COLOURS,
    body: I16_BODY,
    small: "128GB",
    large: "256GB",
    smallFit: "128GB suits buyers who back photos up to iCloud or Google Photos and mostly use WhatsApp, social media, M-Pesa and streaming. If you film a lot of video or keep big games, take 256GB.",
    largeFit: "256GB is the comfortable size: years of photos, a good amount of video and all your apps without managing storage. It is the better pick if you plan to keep the phone for several years.",
    feedSmall: "Apple iPhone 16 128GB, Ex-UK (UK-used), Black, Pink, Teal, Ultramarine or White, A18 Chip, 48MP Camera, 5G",
    feedLarge: "Apple iPhone 16 256GB, Ex-UK (UK-used), Black, Pink, Teal, Ultramarine or White, A18 Chip, 48MP Camera, 5G",
  }),
};

const PRO16_COLOURS = "Black Titanium, Desert Titanium, Natural Titanium and White Titanium";
const pro16Body = (size: string, res: string, hours: number, grams: number) =>
  `It has a ${size} Super Retina XDR display (${res}, 460 ppi) with ProMotion at 120Hz and Dynamic Island. It runs on the A18 Pro chip and supports Apple Intelligence. The rear cameras are a 48MP Fusion camera, a 48MP Ultra Wide camera and a 12MP 5x Telephoto camera; the front camera is 12MP TrueDepth. Camera Control and the Action button are included. Apple rates battery life at up to ${hours} hours of video playback for a new battery. The port is USB-C (USB 3), with MagSafe support. Connectivity: 5G and Wi-Fi 7, with Face ID and Crash Detection. Build: titanium frame with Ceramic Shield, IP68 water resistance to 6 metres for 30 minutes, ${grams} g.`;

function pro16(o: {
  id: string; name: string; size: string; res: string; hours: number; grams: number;
  prevName: string; prevId: string; prevHours: number; prevChip: string; prevTele: string;
  nextName: string; nextId: string; nextHours: number;
  small: string; large: string; smallFit: string; largeFit: string; title: string; link: EditorialLink;
}): ModelEditorial {
  const body = pro16Body(o.size, o.res, o.hours, o.grams);
  return {
    seoTitle: o.title,
    metaDescription: (c) =>
      `${o.name} Ex-UK from ${kes(exFrom(c))}. A18 Pro, 5x Telephoto, ${o.size} 120Hz display, titanium. M-Pesa or Lipa Mdogo Mdogo, delivery in Kenya.`,
    h1: `Apple ${o.name}, Ex-UK`,
    intro: (c) =>
      `The ${o.name} gives you Pro cameras with a 5x Telephoto, the A18 Pro chip and a ${o.size} 120Hz ProMotion display in a titanium frame, at an Ex-UK price. GadgetHub sells it UK-used for ${exSentence(c)}, in ${PRO16_COLOURS}. Condition and warranty terms are on your invoice, and you can check the phone before you pay. Collect in Nairobi CBD, or we deliver across Kenya.`,
    bestFor: `buyers who want Pro cameras and a 5x zoom at an Ex-UK price${o.size === "6.9-inch" ? ", on a big screen" : ", in a compact size"}.`,
    keyFeatures: [
      { title: "12MP 5x Telephoto.", body: "Real optical zoom for stage shows, sport and wildlife." },
      { title: "48MP Fusion and 48MP Ultra Wide.", body: "Detailed main shots and sharp wide and macro-style shots." },
      { title: "A18 Pro chip.", body: "Pro speed for 4K editing, gaming and Apple Intelligence." },
      { title: `${o.size} ProMotion display at 120Hz.`, body: `Smooth scrolling and video on a sharp ${o.res} screen.` },
      { title: "Titanium frame with Ceramic Shield.", body: `Strong and light at ${o.grams} g, rated IP68.` },
      { title: `Up to ${o.hours} hours of video playback.`, body: "Apple's figure for a new battery; ask us for the battery health of your unit." },
      { title: "USB-C at USB 3 speed.", body: "Move long 4K clips to a computer or drive quickly." },
    ],
    sections: (c) => {
      const prev = c.other(o.prevId);
      const next = c.other(o.nextId);
      return [
        {
          id: "overview",
          heading: "Overview",
          paragraphs: [
            `The ${o.name} was Apple's 2024 Pro iPhone${o.size === "6.9-inch" ? " in the big size" : ""}, and as an Ex-UK phone it brings titanium, a 5x Telephoto and ProMotion within reach. GadgetHub sells it UK-used in ${joinList(exList(c))}, in ${PRO16_COLOURS}.`,
            `Against the ${o.prevName}, it has the A18 Pro instead of the ${o.prevChip}, a 48MP Ultra Wide instead of 12MP, Camera Control, and up to ${o.hours} hours of video instead of ${o.prevHours}.${otherPrices(prev) ? ` The ${o.prevName} costs ${otherPrices(prev)}.` : ""}`,
          ],
          list: exPriceList(c),
        },
        {
          id: "design",
          heading: "Design and display",
          paragraphs: [
            `The titanium frame with Ceramic Shield on the front keeps the ${o.name} strong at ${o.grams} g, and it is rated IP68 (6 m for 30 minutes). The ${o.size} Super Retina XDR display (${o.res}, 460 ppi) runs ProMotion at 120Hz, and the Dynamic Island keeps Live Activities in view. Camera Control and the Action button sit on the side.`,
          ],
        },
        {
          id: "performance",
          heading: "Performance",
          paragraphs: [
            "The A18 Pro chip handles 4K editing, long gaming sessions and Apple Intelligence comfortably. 5G and Wi-Fi 7 keep downloads fast, and the USB-C port runs at USB 3 speed for quick transfers of large video files. Face ID and Crash Detection are built in.",
          ],
        },
        {
          id: "camera",
          heading: "Camera",
          paragraphs: [
            `The ${o.name} has three rear cameras, and the 12MP TrueDepth front camera handles selfies and video calls. Compared with the ${o.prevName}'s ${o.prevTele} telephoto, the 48MP Ultra Wide is the big step up for wide and close-up shots.`,
          ],
          list: ["48MP Fusion main camera", "48MP Ultra Wide camera", "12MP 5x Telephoto camera", "12MP TrueDepth front camera"],
        },
        {
          id: "battery",
          heading: "Battery and charging",
          paragraphs: [
            `Apple rates the ${o.name} at up to ${o.hours} hours of video playback with a new battery. On an Ex-UK unit, ask us for the battery health figure before you buy. It charges over USB-C and works with MagSafe chargers and cases.${otherPrices(next) ? ` If you want a newer battery and three 48MP cameras, the ${o.nextName} (up to ${o.nextHours} hours) costs ${otherPrices(next)}.` : ""}`,
          ],
        },
        whyBuyExUk(o.name),
        whatComes,
        kenyaTermsExUk,
      ];
    },
    specs: [
      { label: "Condition", value: "Ex-UK (UK-used); terms on invoice" },
      { label: "Display", value: `${o.size} Super Retina XDR, ${o.res} (460 ppi), ProMotion 120Hz, Dynamic Island` },
      { label: "Chip", value: "A18 Pro" },
      { label: "Rear cameras", value: "48MP Fusion; 48MP Ultra Wide; 12MP 5x Telephoto" },
      { label: "Front camera", value: "12MP TrueDepth" },
      { label: "Battery", value: `Up to ${o.hours} hours video playback (Apple claim, new battery)` },
      { label: "Port and charging", value: "USB-C (USB 3); MagSafe" },
      { label: "Connectivity", value: "5G, Wi-Fi 7" },
      { label: "Controls", value: "Camera Control, Action button, Face ID" },
      { label: "Safety", value: "Crash Detection" },
      { label: "Build", value: "Titanium frame; Ceramic Shield" },
      { label: "Water resistance", value: "IP68 (6 m for 30 minutes)" },
      { label: "Weight", value: `${o.grams} g` },
      { label: "Colours", value: "Black Titanium, Desert Titanium, Natural Titanium, White Titanium" },
      { label: "Software", value: "Apple Intelligence" },
      { label: "Storage", value: `${o.small}, ${o.large}` },
    ],
    faq: (c) => {
      const next = c.other(o.nextId);
      return [
        { question: `What is the price of the ${o.name} in Kenya?`, answer: `At GadgetHub the ${o.name} costs ${exSentence(c)}, Ex-UK.` },
        { question: `Is the ${o.name} at GadgetHub new?`, answer: `No, we sell the ${o.name} Ex-UK. ${EX_TERMS}` },
        { question: `Is the Ex-UK ${o.name} genuine?`, answer: "Yes. It is a genuine UK-used Apple iPhone from an Apple Authorised Reseller, and we can share its photos and battery health on WhatsApp." },
        { question: `Can I buy the ${o.name} on Lipa Mdogo Mdogo?`, answer: `Yes. ${exLipa(c, exList(c)[0] ?? o.small)}`.trim() },
        { question: `Can I pay for the ${o.name} by M-Pesa?`, answer: "Yes, by M-Pesa STK Push at checkout or by M-Pesa in our shop." },
        { question: `What is the difference between the ${o.name} and the ${o.prevName}?`, answer: `The ${o.name} has the A18 Pro instead of the ${o.prevChip}, a 48MP Ultra Wide instead of 12MP, Camera Control, and up to ${o.hours} hours of video playback instead of ${o.prevHours}.` },
        { question: `${o.name} or ${o.nextName}?`, answer: `The ${o.nextName} has the A19 Pro, three 48MP cameras including the Telephoto, and up to ${o.nextHours} hours of video playback.${otherPrices(next) ? ` It costs ${otherPrices(next)}.` : ""} The ${o.name} is the lower-cost way to get a 5x zoom and titanium.` },
        { question: `Which colours does the ${o.name} come in?`, answer: `${PRO16_COLOURS}. Ex-UK colour stock changes, so we confirm yours on WhatsApp.` },
        { question: `Do you deliver the ${o.name} outside Nairobi?`, answer: "Yes, by courier anywhere in Kenya. We quote the fee and timeline on WhatsApp before you pay." },
      ];
    },
    links: [
      { href: `/iphone/${o.nextId}`, text: `Compare with the ${o.nextName}` },
      o.link,
      { href: "/accessories", text: `${o.name} cases and MagSafe chargers` },
      { href: "/lipa-mdogo-mdogo", text: `Buy the ${o.name} on Lipa Mdogo Mdogo` },
      { href: "/trade-in", text: `Trade in your old iPhone for an ${o.name}` },
    ],
    compareIds: [o.prevId, o.nextId],
    storages: storages16({
      name: o.name,
      short: `A18 Pro, a 5x Telephoto and a ${o.size} 120Hz display in titanium`,
      metaBit: `A18 Pro, 5x zoom, ${o.size} 120Hz, titanium`,
      colours: PRO16_COLOURS,
      body,
      small: o.small,
      large: o.large,
      smallFit: o.smallFit,
      largeFit: o.largeFit,
      feedSmall: `Apple ${o.name} ${o.small}, Ex-UK (UK-used), Titanium, A18 Pro, 5x Telephoto, ${o.size} 120Hz ProMotion, 5G`,
      feedLarge: `Apple ${o.name} ${o.large}, Ex-UK (UK-used), Titanium, A18 Pro, 5x Telephoto, ${o.size} 120Hz ProMotion, 5G`,
    }),
  };
}

const pro16m = pro16({
  id: "iphone-16-pro", name: "iPhone 16 Pro", size: "6.3-inch", res: "2622×1206", hours: 27, grams: 199,
  prevName: "iPhone 15 Pro", prevId: "iphone-15-pro", prevHours: 23, prevChip: "A17 Pro", prevTele: "12MP 3x",
  nextName: "iPhone 17 Pro", nextId: "iphone-17-pro", nextHours: 33,
  small: "128GB", large: "256GB",
  smallFit: "128GB suits buyers who back up to iCloud and mostly take photos and short clips. If you shoot a lot of 4K video with the Pro cameras, take 256GB.",
  largeFit: "256GB is the better fit for a Pro camera phone: room for 4K video, a big photo library and all your apps, for years.",
  title: "iPhone 16 Pro Price in Kenya: Ex-UK 128GB, 256GB",
  link: { href: "/iphone/iphone-16-pro-max", text: "See the bigger iPhone 16 Pro Max" },
});

const pm16 = pro16({
  id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", size: "6.9-inch", res: "2868×1320", hours: 33, grams: 227,
  prevName: "iPhone 15 Pro Max", prevId: "iphone-15-pro-max", prevHours: 29, prevChip: "A17 Pro", prevTele: "12MP 5x",
  nextName: "iPhone 17 Pro Max", nextId: "iphone-17-pro-max", nextHours: 39,
  small: "256GB", large: "512GB",
  smallFit: "256GB suits most Pro Max buyers: thousands of photos, plenty of 4K video and all your apps, especially with iCloud backup.",
  largeFit: "512GB is for people who film a lot of 4K, keep large offline libraries of films, music or games, or never want to delete anything.",
  title: "iPhone 16 Pro Max Price in Kenya: Ex-UK 256GB, 512GB",
  link: { href: "/iphone/iphone-16-pro", text: "See the compact iPhone 16 Pro" },
});

export const iphoneEditorial: Record<string, ModelEditorial> = {
  "iphone-16": i16,
  "iphone-16-pro": pro16m,
  "iphone-16-pro-max": pm16,
  "iphone-17": i17,
  "iphone-17-pro": pro17,
  "iphone-17-pro-max": pm17,
  "iphone-18-pro-max": proMax,
  "iphone-18-pro": pro,
  "iphone-duo": duo,
};

export function getEditorial(seoId: string): ModelEditorial | undefined {
  return iphoneEditorial[seoId];
}

const storageOrder = (s: string) => {
  const m = /^(\d+)\s*(GB|TB)$/i.exec(s);
  return m ? Number(m[1]) * (m[2].toUpperCase() === "TB" ? 1024 : 1) : 0;
};

/** Lowest listed New / Ex-UK price of a live product. */
export function listedFrom(p: PricedProduct | undefined): { newKes: number; exUkKes: number } {
  if (!p) return { newKes: 0, exUkKes: 0 };
  const rows = p.variants.map((v) => listedVariantPrices(p, v));
  const min = (xs: number[]) => (xs.length ? Math.min(...xs) : 0);
  return { newKes: min(rows.map((r) => r.newKes).filter((n) => n > 0)), exUkKes: min(rows.map((r) => r.exUkKes).filter((n) => n > 0)) };
}

/**
 * Context from a model already carrying live prices (`withLiveSeoPrices`) and a lookup of
 * other models' live products, by SEO id.
 */
export function editorialCtx(model: IphoneSeoModel, otherLive: (seoId: string) => PricedProduct | undefined): EditorialCtx {
  const byStorage = new Map(model.variants.map((v) => [v.storage.toUpperCase(), v.newKes]));
  const exByStorage = new Map(model.variants.map((v) => [v.storage.toUpperCase(), v.exUkKes]));
  const storages = model.variants
    .filter((v) => v.newKes > 0 || v.exUkKes > 0)
    .map((v) => v.storage)
    .sort((a, b) => storageOrder(a) - storageOrder(b));
  return {
    price: (s) => byStorage.get(s.toUpperCase()) ?? 0,
    exUk: (s) => exByStorage.get(s.toUpperCase()) ?? 0,
    storages,
    other: (id) => listedFrom(otherLive(id)),
  };
}

/** The model with the editorial title, description, intro, specs and FAQ swapped in. */
export function withEditorial(model: IphoneSeoModel, ed: ModelEditorial, c: EditorialCtx): IphoneSeoModel {
  if (!c.storages.length) return model;
  return {
    ...model,
    seoTitle: ed.seoTitle,
    metaDescription: ed.metaDescription(c),
    intro: ed.intro(c),
    bestFor: ed.bestFor,
    specs: ed.specs.map((s) => (s.label === "Storage" ? { ...s, value: c.storages.join(", ") } : s)),
    faq: ed.faq(c),
  };
}

/** Swap editorial FAQs into a generated storage-page FAQ: replace matching questions, append the rest. */
export function mergeStorageFaq(generated: SeoFaq[], extra: (SeoFaq & { replaces?: RegExp })[]): SeoFaq[] {
  const out = [...generated];
  const append: SeoFaq[] = [];
  for (const { replaces, ...f } of extra) {
    const i = replaces ? out.findIndex((g) => replaces.test(g.question)) : -1;
    if (i >= 0) out[i] = f;
    else append.push(f);
  }
  return [...out, ...append];
}
