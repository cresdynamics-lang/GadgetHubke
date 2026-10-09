/**
 * Watch bands + accessories with fitsBand() size-family rules.
 * confirm Ultra band cross-fit against Apple's fit guide.
 */

import type { WatchModel } from "./models";

export type BandSizeFamily = "small" | "large" | "ultra";

export type WatchBand = {
  id: string;
  name: string;
  blurb: string;
  priceKes: number;
  colours: string[];
  sizeFamilies: BandSizeFamily[];
  ultraOnly?: boolean;
  nike?: boolean;
  hermes?: boolean;
  href: string;
};

export type WatchAccessory = {
  id: string;
  name: string;
  blurb: string;
  priceKes: number;
  category: "charger" | "cable" | "adapter" | "stand" | "protector" | "case" | "travel" | "cross";
  /** Series 6+ use magnetic charger */
  fromSeries?: number;
  href: string;
};

export function caseSizeFamily(mm: number): BandSizeFamily {
  if (mm >= 49) return "ultra";
  if (mm >= 42) return "large"; // 42/44/45/46
  return "small"; // 38/40/41/42 - note 42 appears in both Apple families; we treat 42 as large when model default is 42+
}

/** Apple's dual listing: 42 mm sits in both small and large families depending on generation. */
export function modelBandFamilies(model: WatchModel): BandSizeFamily[] {
  const mm = model.defaultCaseMm;
  if (mm >= 49) return ["ultra", "large"];
  if (mm >= 44) return ["large"];
  if (mm === 42) return ["small", "large"];
  return ["small"];
}

export function fitsBand(model: WatchModel, band: WatchBand): boolean {
  const families = modelBandFamilies(model);
  if (band.ultraOnly) {
    // Ultra-only bands fit 49 mm; larger bands of the 42 - 46 mm family
    return families.includes("ultra") || families.includes("large");
  }
  return band.sizeFamilies.some((f) => families.includes(f));
}

export const watchBands: WatchBand[] = [
  { id: "sport-band", name: "Sport Band", blurb: "Fluoroelastomer. Everyday and swim.", priceKes: 6500, colours: ["Black", "White", "Midnight"], sizeFamilies: ["small", "large"], href: "/watch/shop?band=sport-band" },
  { id: "sport-loop", name: "Sport Loop", blurb: "Soft, breathable hook-and-loop.", priceKes: 6500, colours: ["Black", "Pride", "Midnight"], sizeFamilies: ["small", "large"], href: "/watch/shop?band=sport-loop" },
  { id: "solo-loop", name: "Solo Loop", blurb: "Stretch silicone, no clasp.", priceKes: 6500, colours: ["Black", "White"], sizeFamilies: ["small", "large"], href: "/watch/shop?band=solo-loop" },
  { id: "braided-solo", name: "Braided Solo Loop", blurb: "Soft braided texture.", priceKes: 12000, colours: ["Pride", "Black"], sizeFamilies: ["small", "large"], href: "/watch/shop?band=braided-solo" },
  { id: "milanese", name: "Milanese Loop", blurb: "Magnetic stainless mesh.", priceKes: 18000, colours: ["Silver", "Gold", "Graphite"], sizeFamilies: ["small", "large"], href: "/watch/shop?band=milanese" },
  { id: "link-bracelet", name: "Link Bracelet", blurb: "Machined stainless links.", priceKes: 55000, colours: ["Silver", "Gold"], sizeFamilies: ["small", "large"], href: "/watch/shop?band=link-bracelet" },
  { id: "modern-buckle", name: "Modern Buckle", blurb: "Leather with magnetic closure.", priceKes: 22000, colours: ["Brown", "Black"], sizeFamilies: ["small", "large"], href: "/watch/shop?band=modern-buckle" },
  { id: "leather-link", name: "Leather Link", blurb: "Soft leather magnetic tabs.", priceKes: 18000, colours: ["Umber", "Ink"], sizeFamilies: ["small", "large"], href: "/watch/shop?band=leather-link" },
  { id: "nike-sport-band", name: "Nike Sport Band", blurb: "Perforated Nike design.", priceKes: 6500, colours: ["Black", "Pure Platinum"], sizeFamilies: ["small", "large"], nike: true, href: "/watch/shop?band=nike-sport-band" },
  { id: "nike-sport-loop", name: "Nike Sport Loop", blurb: "Nike woven loop.", priceKes: 6500, colours: ["Black", "Summit White"], sizeFamilies: ["small", "large"], nike: true, href: "/watch/shop?band=nike-sport-loop" },
  { id: "trail-loop", name: "Trail Loop", blurb: "Ultra trail - soft and adjustable.", priceKes: 14000, colours: ["Blue/Black", "Orange/Beige"], sizeFamilies: ["ultra", "large"], ultraOnly: true, href: "/watch/shop?band=trail-loop" },
  { id: "alpine-loop", name: "Alpine Loop", blurb: "Ultra alpine - titanium G-hook.", priceKes: 14000, colours: ["Blue", "Olive", "Orange"], sizeFamilies: ["ultra", "large"], ultraOnly: true, href: "/watch/shop?band=alpine-loop" },
  { id: "ocean-band", name: "Ocean Band", blurb: "Ultra ocean - titanium buckle, swim.", priceKes: 14000, colours: ["Blue", "Orange", "White"], sizeFamilies: ["ultra", "large"], ultraOnly: true, href: "/watch/shop?band=ocean-band" },
  { id: "hermes-band", name: "Hermès Band", blurb: "Hermès leather - special edition.", priceKes: 45000, colours: ["Noir", "Gold"], sizeFamilies: ["small", "large", "ultra"], hermes: true, href: "/watch/shop?band=hermes-band" },
];

export const watchAccessories: WatchAccessory[] = [
  { id: "mag-fast-charger", name: "Magnetic Fast Charger", blurb: "USB-C magnetic charger for Series 6 and later.", priceKes: 4500, category: "charger", fromSeries: 6, href: "/shop/accessories/power" },
  { id: "usb-c-cable", name: "USB-C Charging Cable", blurb: "Spare cable for the magnetic puck.", priceKes: 2500, category: "cable", fromSeries: 6, href: "/shop/accessories/power" },
  { id: "20w-adapter", name: "20W USB-C Adapter", blurb: "Wall adapter for faster top-ups.", priceKes: 3500, category: "adapter", href: "/shop/accessories/power" },
  { id: "charging-stand", name: "Charging Stand", blurb: "Nightstand dock for Watch.", priceKes: 5500, category: "stand", fromSeries: 6, href: "/shop/accessories/power" },
  { id: "screen-protector", name: "Screen Protector", blurb: "Clear film sized to case family.", priceKes: 1500, category: "protector", href: "/shop/accessories/cases" },
  { id: "bumper-case", name: "Case with Bumper", blurb: "Protective bumper for training.", priceKes: 2500, category: "case", href: "/shop/accessories/cases" },
  { id: "travel-case", name: "Travel Case", blurb: "Hard case for Watch and bands.", priceKes: 4000, category: "travel", href: "/shop/accessories/cases" },
  { id: "cross-iphone", name: "iPhone cases", blurb: "Match your Watch with an iPhone case.", priceKes: 0, category: "cross", href: "/shop/accessories/cases" },
  { id: "cross-airpods", name: "AirPods", blurb: "Workouts with Watch + AirPods.", priceKes: 0, category: "cross", href: "/airpods" },
];

export function bandsForWatch(model: WatchModel): WatchBand[] {
  return watchBands.filter((b) => fitsBand(model, b));
}

export function accessoriesForWatch(model: WatchModel): WatchAccessory[] {
  const series = model.seriesNumber || (model.family === "Ultra" ? 10 : model.family === "SE" ? 6 : 6);
  return watchAccessories.filter((a) => {
    if (a.fromSeries != null && series < a.fromSeries) return false;
    return true;
  });
}

export function homeWatchAccessories(): WatchAccessory[] {
  return watchAccessories.filter((a) => a.category !== "cross").slice(0, 4);
}

export function watchBuyingNotes(model: WatchModel): { title: string; body: string }[] {
  return [
    {
      title: "Which case size",
      body: `This model is ${model.defaultCaseMm} mm. Smaller cases favour comfort on a slim wrist; larger cases favour readability. Use the wrist guide - check Apple's size guide before launch.`,
    },
    {
      title: "Material",
      body: `${model.materials.join(", ")} available. Aluminum is lightest and lowest price; titanium and ceramic (where offered) raise scratch resistance and sample price.`,
    },
    {
      title: "GPS or Cellular",
      body: model.cellularAvailable
        ? `Cellular adds KES 9,000 sample. Worth it if you leave the iPhone at home for runs or kids. ${"Cellular needs a carrier plan - ask about eSIM in Kenya."}`
        : "GPS only on this listing.",
    },
    {
      title: "Which band fits",
      body: "Bands fit size families (38/40/41/42, 42/44/45/46, 49 Ultra). A wrong band is the most common regret - we only show bands that fit this case.",
    },
    {
      title: "Battery honesty",
      body: model.batteryHours
        ? `Apple claims up to ${model.batteryHours} hours - not a promise. Heavy GPS use drains faster.`
        : "Battery hours follow Apple's published claim.",
    },
    {
      title: "Compatibility",
      body: "Apple Watch needs an iPhone. Check Apple's list for your iPhone and watchOS. Do not assume how many updates this model still gets.",
    },
    {
      title: "Condition check",
      body: model.year <= 2022
        ? "Older model - battery health and screen condition shown on the invoice."
        : "Sealed stock - serial on the invoice.",
    },
    {
      title: "Sealed and verifiable",
      body: "Sealed and serial on the invoice. Check coverage on Apple's own site after you collect.",
    },
    {
      title: "Warranty and support",
      body: "New devices include a 1-year warranty. Keep your invoice for support.",
    },
    {
      title: "Set-up and pairing",
      body: "We pair your watch with your iPhone, set up bands and watch faces, and test before you collect. Set-up fees vary and are confirmed when you engage with us.",
    },
  ];
}

export function watchFaq(): { q: string; a: string }[] {
  return [
    { q: "Which Apple Watch should I get?", a: "Series 12 for everyday health; Ultra 4 for adventure and longest battery; SE 3 for the lowest current price. Use the quiz on the Watch page." },
    { q: "Do I need Cellular?", a: "Only if you leave your iPhone behind for runs, kids or travel. It needs a carrier plan - ask us about eSIM in Kenya." },
    { q: "Does it work with Android?", a: "No. Apple Watch needs an iPhone." },
    { q: "Does it come with a band?", a: "Yes - the band in the pack. Extra bands are sold separately. Hermès and Nike editions include a special band." },
    { q: "Which bands fit my watch?", a: "Bands fit by case-size family. The product page only lists bands that fit." },
    { q: "How long does the battery last?", a: "Apple publishes an hours claim per model. Heavy GPS use drains faster." },
    { q: "Can I swim with it?", a: "Series and SE are swim-proof to 50 m. Ultra is 100 m with a depth gauge. Hot water and diving beyond the rating are not covered." },
    { q: "Is an older model still worth buying?", a: "Yes if the price and condition work - check battery health on Series 6 - 8, SE 1 - 2 and Ultra 1." },
    { q: "What do I get with the invoice?", a: "Sealed device, serial number on the invoice, and the band in the pack. New devices include a 1-year warranty." },
  ];
}
