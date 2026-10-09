/**
 * AirPods accessories with fits(model, accessory).
 */

import type { AirpodsModel } from "./models";

export type AirpodsAccessory = {
  id: string;
  name: string;
  blurb: string;
  priceKes: number;
  category: "tips" | "case" | "charger" | "cable" | "lanyard" | "pouch" | "care" | "cross";
  families?: Array<"AirPods" | "Pro" | "Max">;
  href: string;
};

export const airpodsAccessories: AirpodsAccessory[] = [
  { id: "pro-tips", name: "Replacement ear tips", blurb: "Silicone tips for Pro models.", priceKes: 3500, category: "tips", families: ["Pro"], href: "/shop/accessories" },
  { id: "smart-case", name: "Smart Case", blurb: "Folding case for AirPods Max.", priceKes: 8500, category: "case", families: ["Max"], href: "/shop/accessories/cases" },
  { id: "wireless-charger", name: "Wireless charger", blurb: "Qi pad for wireless cases.", priceKes: 5500, category: "charger", href: "/shop/accessories/power" },
  { id: "magsafe-charger", name: "MagSafe charger", blurb: "MagSafe puck for MagSafe cases.", priceKes: 6500, category: "charger", families: ["Pro", "AirPods"], href: "/shop/accessories/power" },
  { id: "usb-c-cable", name: "USB-C cable", blurb: "Spare USB-C charging cable.", priceKes: 2500, category: "cable", href: "/shop/accessories/power" },
  { id: "protective-case", name: "Protective case", blurb: "Soft case for earbuds case.", priceKes: 2500, category: "case", families: ["AirPods", "Pro"], href: "/shop/accessories/cases" },
  { id: "lanyard", name: "Lanyard", blurb: "Loop for Pro MagSafe case.", priceKes: 1500, category: "lanyard", families: ["Pro"], href: "/shop/accessories" },
  { id: "travel-pouch", name: "Travel pouch", blurb: "Soft pouch for Max or earbuds.", priceKes: 3000, category: "pouch", href: "/shop/accessories" },
  { id: "apple-care", name: "AppleCare+", blurb: "Extended coverage — ask us for pricing.", priceKes: 8000, category: "care", href: "/support" },
  { id: "cross-iphone", name: "iPhone cases", blurb: "Match your phone to your AirPods.", priceKes: 0, category: "cross", href: "/shop/accessories/cases" },
  { id: "cross-watch", name: "Apple Watch", blurb: "Workouts with Watch + AirPods.", priceKes: 0, category: "cross", href: "/watch" },
];

export function fits(model: AirpodsModel, accessory: AirpodsAccessory): boolean {
  if (accessory.category === "cross") return true;
  if (accessory.families && !accessory.families.includes(model.family)) return false;
  if (accessory.id === "pro-tips" && model.family !== "Pro") return false;
  if (accessory.id === "smart-case" && model.family !== "Max") return false;
  if (accessory.id === "magsafe-charger" && !model.caseTypes.includes("magsafe") && !model.caseTypes.includes("wireless"))
    return false;
  if (accessory.id === "wireless-charger" && !model.caseTypes.includes("wireless") && !model.caseTypes.includes("magsafe"))
    return false;
  return true;
}

export function accessoriesForAirpods(model: AirpodsModel): AirpodsAccessory[] {
  return airpodsAccessories.filter((a) => fits(model, a));
}

export function homeAirpodsAccessories(): AirpodsAccessory[] {
  return airpodsAccessories.filter((a) => a.category !== "cross").slice(0, 4);
}

export function airpodsBuyingNotes(model: AirpodsModel): { title: string; body: string }[] {
  return [
    {
      title: "In-ear or over-ear",
      body:
        model.type === "over-ear"
          ? "Over-ear Max for isolation and long sessions. Heavier to carry."
          : "In-ear for pockets and the gym. Pro tips seal better than open-fit AirPods.",
    },
    {
      title: "Which noise control",
      body: `Modes on this model: ${model.noiseModes.join(", ")}. ANC and Adaptive drain battery faster than Off.`,
    },
    {
      title: "Fit",
      body:
        model.family === "Pro"
          ? "Tips matter for Pro. Try sizes in the shop - hygiene note on demo tips."
          : model.family === "Max"
            ? "Cushions and headband fit vary. Come in and try a pair."
            : "Open-fit AirPods sit without tips - try for comfort on calls.",
    },
    {
      title: "Compatibility",
      body: "Works best with iPhone, iPad, Mac, Apple Watch and Apple TV. Works with Android as ordinary Bluetooth headphones, with fewer features. Check Apple's list for software requirements.",
    },
    {
      title: "Battery honesty",
      body: model.batterySingleHours
        ? `Apple claims up to ${model.batterySingleHours} h single charge - not a promise. ANC and loud volume drain faster.`
        : "Battery hours . Batteries wear out; replacement is through Apple.",
    },
    {
      title: "Case and charging",
      body: `Case types: ${model.caseTypes.join(", ")}. Use the case table on the page for chargers that fit.`,
    },
    {
      title: "Condition check",
      body: model.year <= 2022
        ? "Older model - invoice shows condition and battery state."
        : "Sealed stock - serial on the invoice.",
    },
    {
      title: "Authenticity",
      body: "Counterfeit AirPods are common. Ours are sealed and the serial number is on the invoice. Check the serial on Apple's coverage page.",
    },
    {
      title: "Warranty and set-up",
      body: "We pair with your iPhone, set up Find My and test noise control before collect. New devices include a 1-year warranty. Set-up fees vary and are confirmed when you engage with us.",
    },
  ];
}

export function airpodsFaq(): { q: string; a: string }[] {
  return [
    { q: "Which AirPods should I get?", a: "Pro 3 for quiet commute and hearing features; AirPods 5 for open-fit everyday; Max 2 for over-ear music and flights. Use the quiz." },
    { q: "Do AirPods work with Android?", a: "Yes as Bluetooth headphones, with fewer features. They work best with Apple devices." },
    { q: "Are my AirPods real?", a: "Buy sealed with the serial on the invoice, then check coverage on Apple's site." },
    { q: "Pro 3 or AirPods 5?", a: "Pro 3 seals with tips and stronger ANC. AirPods 5 are open-fit and usually cheaper." },
    { q: "Is Max worth the price?", a: "If you want over-ear comfort and ANC for long sessions - yes for many listeners. Otherwise Pro is enough." },
    { q: "How long does the battery last?", a: "Apple publishes hours per model. ANC drains faster." },
    { q: "Can the battery be replaced?", a: "Through Apple service - not a DIY swap." },
    { q: "Do they work with my iPhone?", a: "Yes on supported iPhone models. Check Apple's list for the exact features you want." },
    { q: "Can I use one earbud?", a: "Yes on in-ear models - Automatic Ear Detection pauses when you remove them (where supported)." },
    { q: "What do I get with the invoice?", a: "Sealed device, serial on the invoice, and the case in the pack. New devices include a 1-year warranty." },
  ];
}
