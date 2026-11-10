/**
 * One indexable page per iPhone storage option (/iphone/<model>/<storage>), so Google
 * can show "iPhone 18 Pro Max 256GB" and "iPhone 18 Pro Max 512GB" as the separate
 * phones they are, each with its own price, colours and questions.
 *
 * Everything here is worked out from live prices, the colour list and Apple-verified
 * specs. Nothing is typed per variant, so a price change in admin rewrites every page.
 */
import { lipaPlan } from "../../pricing/lipa.ts";
import type { SeoFaq, SeoSpec } from "./types.ts";

export type StorageOption = {
  storage: string;
  slug: string;
  sheetId: string;
  /** 0 when New is not listed for this storage. */
  newKes: number;
  /** 0 when Ex-UK is not listed for this storage. */
  exUkKes: number;
  inStock: boolean;
};

export type ColourOption = {
  key: string;
  label: string;
  hex: string;
  /** null when admin has not ticked colours, so stock per colour is unknown. */
  inStock: boolean | null;
};

export type CopySection = { id: string; heading: string; paragraphs: string[]; list?: string[] };

export type StorageCopy = {
  title: string;
  h1: string;
  metaDescription: string;
  /** Short facts in one place, the form search engines and AI assistants quote. */
  glance: { label: string; value: string }[];
  sections: CopySection[];
  faq: SeoFaq[];
};

/** Shop facts the copy quotes (from site.ts), passed in so this file stays pure. */
export type StoreFacts = {
  line: string;
  phone: string;
  hours: string;
  warrantyYears: number;
  returnDays: number;
  deliveryFromKes: number;
  /** "10 November 2026" */
  checkedOn: string;
};

const kes = (n: number) => `KES ${Math.round(n).toLocaleString("en-KE")}`;

/** "256GB" → "256gb", "1TB" → "1tb". */
export function storageSlug(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, "");
}

/** Bytes-free size in GB, for ordering and price per gigabyte. */
export function storageGb(label: string): number {
  const m = /^(\d+(?:\.\d+)?)\s*(GB|TB)$/i.exec(label.trim());
  if (!m) return 0;
  return Number(m[1]) * (m[2].toUpperCase() === "TB" ? 1024 : 1);
}

export function storagePath(modelId: string, storage: string): string {
  return `/iphone/${modelId}/${storageSlug(storage)}`;
}

function joinList(items: string[], word = "and"): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} ${word} ${items.at(-1)}`;
}

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const countWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

/** Plain description of a swatch colour, worked out from the site's own swatch hex. */
export function toneName(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "";
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (l < 0.16 && s < 0.35) return "black";
  if (s < 0.12) return l > 0.82 ? "very light grey" : l > 0.55 ? "light grey" : l > 0.3 ? "grey" : "dark grey";
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  const hue =
    h < 15 || h >= 345 ? "red"
    : h < 40 ? "orange"
    : h < 65 ? (l > 0.6 ? "gold" : "yellow")
    : h < 170 ? "green"
    : h < 195 ? "teal"
    : h < 250 ? "blue"
    : h < 290 ? "purple"
    : "pink";
  const shade = l < 0.36 ? "deep " : l > 0.72 ? "pale " : "";
  return `${shade}${hue}`;
}

/** Who a storage size suits. General guidance by size; ProRes is only mentioned on Pro models. */
function storageFit(storage: string, modelName: string): string {
  const gb = storageGb(storage);
  const pro = /\bPro\b/.test(modelName);
  if (gb <= 128)
    return `${storage} suits someone who backs photos up to iCloud or Google Photos and mostly uses WhatsApp, social media, M-Pesa and banking apps, and streaming. Filming a lot of 4K video will fill it quickly.`;
  if (gb <= 256)
    return `${storage} is the size most buyers choose: room for years of photos, a fair amount of 4K video and all the usual apps, without paying for space you may never use.`;
  if (gb <= 512)
    return `${storage} is for people who film a lot of 4K video, keep large offline libraries of music, films or games, or keep a phone for many years and never want to delete anything.`;
  if (gb <= 1024)
    return `${storage} is for creators: long 4K${pro ? " and ProRes" : ""} recordings, a big photo library kept on the phone, and work files, with space to spare.`;
  return `${storage} is the most storage on any iPhone we sell, for professional ${pro ? "ProRes " : ""}video and very large libraries kept on the phone itself.`;
}

function priceOf(o: StorageOption) {
  return o.newKes || o.exUkKes;
}

/** Title, description, narrative sections and questions for one storage page. */
export function storageCopy(input: {
  modelName: string;
  modelId: string;
  option: StorageOption;
  options: StorageOption[];
  colours: ColourOption[];
  specs: SeoSpec[];
  exUkLabel: string;
  exUkWarranty: string;
  store: StoreFacts;
}): StorageCopy {
  const { modelName, option, colours, specs, exUkLabel, exUkWarranty, store } = input;
  const storeLine = store.line;
  const options = [...input.options].sort((a, b) => storageGb(a.storage) - storageGb(b.storage));
  const name = `${modelName} ${option.storage}`;
  const price = priceOf(option);
  const onlyExUk = !option.newKes && option.exUkKes > 0;
  const idx = options.findIndex((o) => o.slug === option.slug);
  const smaller = idx > 0 ? options[idx - 1] : undefined;
  const larger = idx >= 0 && idx < options.length - 1 ? options[idx + 1] : undefined;
  const colourNames = colours.map((c) => c.label);
  const plan6 = lipaPlan(price, 40, 6);
  const plan3 = lipaPlan(price, 40, 3);

  const title = `${name} Price in Kenya, ${kes(price)} | Gadget Hub`;
  const condition = onlyExUk ? exUkLabel : "sealed new";
  const metaDescription = [
    `${name}, ${condition}, ${kes(price)} in Nairobi.`,
    colourNames.length ? `${joinList(colourNames, "or")}.` : "",
    `Lipa Mdogo Mdogo from a ${kes(plan6.depositKes)} deposit. Trade-in accepted at Gadget Hub, Norwich Union House.`,
  ]
    .filter(Boolean)
    .join(" ");

  const sections: CopySection[] = [];

  // 1. Price and stock.
  const pricePara = [
    onlyExUk
      ? `The ${name} costs ${kes(option.exUkKes)} at Gadget Hub as ${exUkLabel}. ${exUkWarranty}`
      : `The ${name} costs ${kes(option.newKes)} sealed new at Gadget Hub, ${storeLine}.`,
  ];
  if (option.newKes && option.exUkKes)
    pricePara.push(
      `The same ${option.storage} model is also available as ${exUkLabel} for ${kes(option.exUkKes)}, which is ${kes(option.newKes - option.exUkKes)} less than new. ${exUkWarranty}`,
    );
  pricePara.push(
    option.inStock
      ? `It is on our shelf now. Message us on WhatsApp to reserve ${colours.length ? "your colour" : "one"} and we will confirm it before you pay.`
      : `It is out of stock right now. Message us on WhatsApp and we will tell you when the next ${option.storage} units arrive.`,
  );
  if (colours.length > 1) pricePara.push(`Every colour costs the same at ${option.storage}.`);
  sections.push({ id: "price", heading: `${name} price in Kenya`, paragraphs: pricePara });

  // 2. Who this storage is for, and how it compares with its neighbours.
  const fit = [storageFit(option.storage, modelName)];
  if (options.length === 1) fit.push(`${option.storage} is the only storage size we list for the ${modelName} right now.`);
  else if (!smaller) fit.push(`${option.storage} is the smallest storage we sell for the ${modelName}, and the lowest price into this model.`);
  else if (!larger) fit.push(`${option.storage} is the largest storage we sell for the ${modelName}.`);
  else fit.push(`${option.storage} sits between the ${smaller.storage} and ${larger.storage} versions of the ${modelName}.`);
  if (larger) {
    const diff = priceOf(larger) - price;
    const times = storageGb(larger.storage) / storageGb(option.storage);
    if (diff > 0)
      fit.push(
        `Moving up to ${larger.storage} costs ${kes(diff)} more (${kes(priceOf(larger))}) and gives you ${times === 2 ? "twice" : `${times} times`} the space.`,
      );
  }
  if (smaller) {
    const diff = price - priceOf(smaller);
    if (diff > 0)
      fit.push(`If you do not need ${option.storage}, the ${smaller.storage} version is ${kes(priceOf(smaller))}, which saves you ${kes(diff)}.`);
  }
  const gb = storageGb(option.storage);
  if (gb) fit.push(`At ${kes(price)}, you pay about ${kes(price / gb)} per gigabyte of storage.`);
  sections.push({ id: "storage", heading: `Is ${option.storage} right for you?`, paragraphs: fit });

  // 3. Colours.
  if (colours.length) {
    const known = colours.filter((c) => c.inStock !== null);
    const list = colours.map((c) => {
      const tone = toneName(c.hex);
      const stock = c.inStock === null ? "" : c.inStock ? " In stock." : " Not in stock right now, ask us for the next delivery.";
      return `${c.label}: ${tone ? `a ${tone} finish.` : "Apple finish."}${stock}`;
    });
    sections.push({
      id: "colours",
      heading: `${name} colours`,
      paragraphs: [
        `The ${name} comes in ${countWord(colours.length)} colour${colours.length === 1 ? "" : "s"}: ${joinList(colourNames)}. Tap a colour above to see it from every angle.`,
        known.length
          ? `Colour stock changes daily, so we confirm the exact colour on WhatsApp before you pay.`
          : `Tell us your colour on WhatsApp and we will confirm it is available before you pay.`,
      ],
      list,
    });
  }

  // 4. What every unit has (Apple-verified specs).
  const specList = specs
    .filter((s) => s.label !== "Storage")
    .map((s) => `${s.label}: ${s.value}`);
  specList.push(`Storage: ${option.storage}`);
  // Only claim matching hardware when Apple's spec sheet is in hand for this model.
  const verified = specs.some((s) => s.label !== "Storage");
  sections.push({
    id: "specs",
    heading: `What you get with the ${name}`,
    paragraphs: [
      verified
        ? `Every ${modelName} has the same display, chip and cameras whatever storage you choose. Storage is the only difference between the ${joinList(options.map((o) => o.storage))} versions, and it cannot be upgraded later, so pick the size you will need for as long as you keep the phone.`
        : `Apple has not published a full spec sheet for the ${modelName} that we can quote yet. Storage cannot be upgraded later, so pick the size you will need for as long as you keep the phone, and ask us on WhatsApp for anything else you want to check.`,
    ],
    list: specList,
  });

  // 5. Paying over time and trading in.
  if (price > 0)
    sections.push({
      id: "pay",
      heading: `Buy the ${name} with Lipa Mdogo Mdogo or a trade-in`,
      paragraphs: [
        `With Lipa Mdogo Mdogo you pay a ${kes(plan6.depositKes)} deposit (40%) today and take the phone home, then ${kes(plan6.monthlyKes)} a month for 6 months, ${kes(plan6.totalKes)} in total. Over 3 months it is ${kes(plan3.monthlyKes)} a month, ${kes(plan3.totalKes)} in total. Shorter plans cost less overall.`,
        `You can also trade in your current iPhone, iPad or Mac. Tell us its model, storage and condition and we take its value off the ${kes(price)}.`,
      ],
    });

  // Questions people type into Google about this exact phone.
  const faq: SeoFaq[] = [
    {
      question: `How much is the ${name} in Kenya?`,
      answer: onlyExUk
        ? `The ${name} is ${kes(option.exUkKes)} at Gadget Hub as ${exUkLabel}.`
        : `The ${name} is ${kes(option.newKes)} sealed new at Gadget Hub in Nairobi CBD${option.exUkKes ? `, or ${kes(option.exUkKes)} as ${exUkLabel}` : ""}.`,
    },
  ];
  if (colours.length)
    faq.push({
      question: `What colours does the ${name} come in?`,
      answer: `${joinList(colourNames)}. All ${colours.length === 1 ? "of it costs" : "colours cost"} ${kes(price)} at ${option.storage}.`,
    });
  if (larger || smaller) {
    const other = larger ?? smaller!;
    const diff = Math.abs(priceOf(other) - price);
    faq.push({
      question: `Should I buy the ${modelName} ${option.storage} or ${other.storage}?`,
      answer: `${storageFit(option.storage, modelName)} The ${other.storage} version is ${kes(priceOf(other))}, ${kes(diff)} ${priceOf(other) > price ? "more" : "less"}.`,
    });
  }
  if (price > 0)
    faq.push({
      question: `Can I pay for the ${name} in instalments?`,
      answer: `Yes. Pay ${kes(plan6.depositKes)} today, then ${kes(plan6.monthlyKes)} a month for 6 months with Lipa Mdogo Mdogo, or choose 1 to 5 months.`,
    });
  faq.push({
    question: `Where can I buy the ${name} in Nairobi?`,
    answer: `At Gadget Hub, ${storeLine}. Open ${store.hours}. Order on WhatsApp on ${store.phone} for delivery or collect in store.`,
  });
  faq.push({
    question: `Is the ${name} at Gadget Hub original?`,
    answer: option.newKes
      ? `Yes. Gadget Hub is an Apple Authorised Reseller. New units are sealed in the box with a ${store.warrantyYears}-year warranty and a Gadget Hub invoice.`
      : `Yes. It is a genuine Apple iPhone. ${exUkWarranty}`,
  });
  faq.push({
    question: `Do you deliver the ${name} outside Nairobi?`,
    answer: `Yes, we deliver across Kenya. Delivery starts from ${kes(store.deliveryFromKes)} and the exact fee depends on your town. If it arrives faulty or damaged, tell us within ${store.returnDays} days.`,
  });
  if (option.newKes && option.exUkKes)
    faq.push({
      question: `Should I buy the ${name} new or Ex-UK?`,
      answer: `New is sealed with a ${store.warrantyYears}-year warranty for ${kes(option.newKes)}. Ex-UK is a UK-used unit for ${kes(option.exUkKes)}, saving ${kes(option.newKes - option.exUkKes)}. ${exUkWarranty}`,
    });

  const glance = [
    { label: "Phone", value: name },
    ...(option.newKes ? [{ label: "Price, sealed new", value: kes(option.newKes) }] : []),
    ...(option.exUkKes ? [{ label: `Price, ${exUkLabel}`, value: kes(option.exUkKes) }] : []),
    ...(colours.length ? [{ label: "Colours", value: joinList(colourNames) }] : []),
    { label: "Stock", value: option.inStock ? "In stock in Nairobi" : "Out of stock, ask for the next delivery" },
    ...(price > 0 ? [{ label: "Lipa Mdogo Mdogo", value: `${kes(plan6.depositKes)} deposit, then ${kes(plan6.monthlyKes)} a month for 6 months` }] : []),
    ...(option.newKes ? [{ label: "Warranty", value: `${store.warrantyYears}-year warranty on new units` }] : []),
    { label: "Shop", value: `Gadget Hub, ${storeLine}` },
    { label: "Order", value: `WhatsApp or call ${store.phone}, ${store.hours}` },
    { label: "Price checked", value: store.checkedOn },
  ];

  return { title, h1: name, metaDescription, glance, sections, faq };
}
