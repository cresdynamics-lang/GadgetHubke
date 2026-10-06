/**
 * iPad accessories with fits(model, accessory) compatibility rules.
 */

import { pencilFits, keyboardFits } from "../accessories/fits";
import { keyboards as listAccessoryKeyboards } from "../accessories/models";
import type { IpadModel, PencilSupport, KeyboardSupport } from "./models";

const PENCIL_ACCESSORY_IDS: Record<string, string> = {
  "pencil-pro": "pencil-pro",
  "pencil-usbc": "pencil-usbc",
  "pencil-2nd": "pencil-2",
  "pencil-1st": "pencil-1",
};

function sharedKeyboardFits(model: IpadModel, accessory: IpadAccessory): boolean | null {
  if (accessory.category !== "keyboard") return null;
  if (accessory.id === "magic-folio") {
    return keyboardFits(model.id, "keyboard-folio").status !== "no";
  }
  if (accessory.id === "magic-kb-pro") {
    return listAccessoryKeyboards()
      .filter((k) => k.platform === "ipad" && k.id.includes("keyboard-ipad-pro"))
      .some((k) => keyboardFits(model.id, k.id).status !== "no");
  }
  if (accessory.id === "magic-kb-air") {
    return listAccessoryKeyboards()
      .filter((k) => k.platform === "ipad" && k.id.includes("keyboard-ipad-air"))
      .some((k) => keyboardFits(model.id, k.id).status !== "no");
  }
  return null;
}

export type IpadAccessory = {
  id: string;
  name: string;
  blurb: string;
  priceKes: number;
  category: "pencil" | "keyboard" | "case" | "protection" | "power" | "desk" | "cross";
  href: string;
  pencils?: PencilSupport[];
  keyboards?: KeyboardSupport[];
  families?: IpadModel["family"][];
  sizes?: number[];
  /** Model ids that explicitly fit */
  modelIds?: string[];
  /** Exclude model ids */
  excludeIds?: string[];
  requiresUsbC?: boolean;
};

const CATALOG: IpadAccessory[] = [
  {
    id: "pencil-pro",
    name: "Apple Pencil Pro",
    blurb: "Hover, squeeze, barrel roll. Magnetic charge.",
    priceKes: 18000,
    category: "pencil",
    href: "/accessories/pencil-pro",
    pencils: ["pro"],
  },
  {
    id: "pencil-usbc",
    name: "Apple Pencil (USB-C)",
    blurb: "Tilt and low latency. Charges over USB-C.",
    priceKes: 11000,
    category: "pencil",
    href: "/accessories/pencil-usbc",
    pencils: ["usb-c"],
  },
  {
    id: "pencil-2nd",
    name: "Apple Pencil (2nd generation)",
    blurb: "Magnetic attach and charge. Fits older Pro, Air and mini 6.",
    priceKes: 16000,
    category: "pencil",
    href: "/accessories/pencil-2",
    pencils: ["2nd"],
  },
  {
    id: "pencil-1st",
    name: "Apple Pencil (1st generation)",
    blurb: "Fits classic iPad and 10th gen / A16 with the right adapter.",
    priceKes: 14000,
    category: "pencil",
    href: "/accessories/pencil-1",
    pencils: ["1st"],
  },
  {
    id: "magic-kb-pro",
    name: "Magic Keyboard for iPad Pro",
    blurb: "Aluminium, trackpad, function row. Size-matched.",
    priceKes: 45000,
    category: "keyboard",
    href: "/accessories/magic-keyboard",
    keyboards: ["magic-pro"],
  },
  {
    id: "magic-kb-air",
    name: "Magic Keyboard for iPad Air",
    blurb: "Trackpad typing for Air sizes.",
    priceKes: 35000,
    category: "keyboard",
    href: "/accessories/magic-keyboard",
    keyboards: ["magic-air"],
  },
  {
    id: "magic-folio",
    name: "Magic Keyboard Folio",
    blurb: "Detachable keyboard + front protection for standard iPad.",
    priceKes: 28000,
    category: "keyboard",
    href: "/accessories/keyboard-folio",
    keyboards: ["magic-folio"],
  },
  {
    id: "smart-folio",
    name: "Smart Folio",
    blurb: "Front and back protection with stand angles.",
    priceKes: 12000,
    category: "case",
    href: "/accessories/cases",
  },
  {
    id: "paper-feel",
    name: "Paper-feel screen protector",
    blurb: "Matte writing feel for Pencil.",
    priceKes: 3500,
    category: "protection",
    href: "/accessories",
  },
  {
    id: "tempered-glass",
    name: "Tempered glass",
    blurb: "Clear drop protection for the display.",
    priceKes: 2500,
    category: "protection",
    href: "/accessories",
  },
  {
    id: "usbc-20w",
    name: "20W USB-C charger",
    blurb: "Everyday charge for USB-C iPads.",
    priceKes: 3500,
    category: "power",
    href: "/accessories/power-adapter-20w",
    requiresUsbC: true,
  },
  {
    id: "usbc-cable",
    name: "USB-C cable",
    blurb: "Charge and sync.",
    priceKes: 2500,
    category: "power",
    href: "/accessories/cable-usbc-60w-1m",
    requiresUsbC: true,
  },
  {
    id: "sleeve",
    name: "iPad sleeve",
    blurb: "Soft carry for bag days.",
    priceKes: 4500,
    category: "case",
    href: "/shop/accessories/cases",
  },
  {
    id: "stand",
    name: "Desktop stand",
    blurb: "Hands-free viewing and FaceTime.",
    priceKes: 6500,
    category: "desk",
    href: "/shop/accessories",
  },
  {
    id: "airpods-xsell",
    name: "AirPods",
    blurb: "Wireless audio for your iPad.",
    priceKes: 0,
    category: "cross",
    href: "/airpods",
  },
  {
    id: "mac-xsell",
    name: "MacBook",
    blurb: "When you need a full desktop OS.",
    priceKes: 0,
    category: "cross",
    href: "/mac",
  },
];

export function fits(model: IpadModel, accessory: IpadAccessory): boolean {
  const pencilId = PENCIL_ACCESSORY_IDS[accessory.id];
  if (pencilId) {
    return pencilFits(model.id, pencilId).status !== "no";
  }
  const sharedKb = sharedKeyboardFits(model, accessory);
  if (sharedKb !== null) return sharedKb;

  if (accessory.excludeIds?.includes(model.id)) return false;
  if (accessory.modelIds?.length && !accessory.modelIds.includes(model.id)) return false;
  if (accessory.families?.length && !accessory.families.includes(model.family)) return false;
  if (accessory.sizes?.length && !accessory.sizes.includes(model.screenInches)) return false;
  if (accessory.requiresUsbC && !model.ports.some((p) => /USB-C|Thunderbolt/i.test(p))) {
    return false;
  }
  if (accessory.pencils?.length) {
    return accessory.pencils.some((p) => model.pencils.includes(p));
  }
  if (accessory.keyboards?.length) {
    return accessory.keyboards.some((k) => model.keyboards.includes(k));
  }
  return true;
}

export function accessoriesForIpad(model: IpadModel): IpadAccessory[] {
  return CATALOG.filter((a) => fits(model, a));
}

export function homeIpadAccessories(): IpadAccessory[] {
  return CATALOG.filter((a) => a.category !== "cross").slice(0, 8);
}

export function pencilCatalog(): IpadAccessory[] {
  return CATALOG.filter((a) => a.category === "pencil");
}

export function keyboardCatalog(): IpadAccessory[] {
  return CATALOG.filter((a) => a.category === "keyboard");
}

export function ipadBuyingNotes(model: IpadModel): { title: string; body: string }[] {
  const sizeLine =
    model.family === "mini"
      ? "8.3″ is for bags, beds and one-hand reading."
      : model.screenInches >= 13 || model.screenInches >= 12.9
        ? "The larger size is better for drawing, split apps and replacing a laptop with a keyboard."
        : "11″ (or near) balances carry and screen for most people.";

  return [
    { title: "Which size", body: sizeLine },
    {
      title: "Storage",
      body: "128 GB suits everyday apps and photos. 256–512 GB for offline video and art files. 1 TB+ for heavy creative libraries.",
    },
    {
      title: "Memory",
      body:
        model.memoryGb[0] >= 12
          ? `${model.memoryGb[0]} GB helps Stage Manager and creative apps.`
          : "8 GB is the floor for modern multitasking; more helps Stage Manager.",
    },
    {
      title: "Cellular",
      body: model.cellular
        ? "Wi-Fi + Cellular is worth it if you leave the house without hotspotting a phone. Many newer models use eSIM."
        : "This listing is Wi-Fi focused — ask about cellular stock.",
    },
    {
      title: "Pencil and keyboard",
      body: `Works with: ${model.pencils.map(pencilLabel).join(", ")}. Keyboards: ${model.keyboards.map(kbLabel).join(", ") || "none officially listed"}. Buying the wrong Pencil is the biggest regret — check before you pay.`,
    },
    {
      title: "Age and support",
      body: "We do not promise how many iPadOS updates a model will get. Check Apple’s list for this chip.",
    },
    {
      title: model.year <= 2022 ? "Condition check" : "Sealed and verifiable",
      body:
        model.year <= 2022
          ? "For 2020–2022 stock, battery health and screen condition are shown on the invoice."
          : "Sealed and serial on the invoice. Check coverage on Apple’s own site.",
    },
    {
      title: "Warranty and set-up",
      body: "Cover terms and set-up fee are owner to confirm. We can restore an old iPad or iPhone and install apps before collect.",
    },
  ];
}

function pencilLabel(p: PencilSupport): string {
  const map: Record<PencilSupport, string> = {
    pro: "Apple Pencil Pro",
    "usb-c": "Apple Pencil (USB-C)",
    "2nd": "Apple Pencil (2nd gen)",
    "1st": "Apple Pencil (1st gen)",
  };
  return map[p];
}

function kbLabel(k: KeyboardSupport): string {
  const map: Record<KeyboardSupport, string> = {
    "magic-pro": "Magic Keyboard (Pro)",
    "magic-air": "Magic Keyboard (Air)",
    "magic-folio": "Magic Keyboard Folio",
    "smart-keyboard": "Smart Keyboard",
    none: "none",
  };
  return map[k];
}

export function ipadFaq(): { q: string; a: string }[] {
  return [
    {
      q: "Which iPad should I get?",
      a: "Draw and edit seriously → Pro or Air with Pencil Pro. School and notes → Air or iPad (A16). Travel and reading → mini. Tightest budget → older standard iPad with a condition check.",
    },
    {
      q: "Do I need cellular?",
      a: "Only if you want data without a phone hotspot. Many buyers stay on Wi-Fi and save the cellular step.",
    },
    {
      q: "Does it come with a Pencil?",
      a: "No. Apple Pencil is a separate purchase. We show only Pencils that fit the model you pick.",
    },
    {
      q: "Which Pencil fits my iPad?",
      a: "Use the Pencil checker on the product page or ask on WhatsApp with your model name. Pro and recent Air/mini take Pencil Pro; older models take 2nd gen or 1st gen.",
    },
    {
      q: "Can an iPad replace my laptop?",
      a: "For notes, browsing, media and light Office work with a keyboard — often yes. Desktop-only software may not run. Be honest about what you need.",
    },
    {
      q: "How much storage do I need?",
      a: "Start at 128 GB if you stream. Jump to 256 GB+ if you keep lots of photos, offline shows or large drawing files.",
    },
    {
      q: "Is the older iPad still worth buying?",
      a: "Yes for kids and light use if the price and condition are right. Check battery health and iPadOS support on Apple’s list.",
    },
    {
      q: "Can I upgrade memory later?",
      a: "No. Memory is built in. Pick enough now.",
    },
    {
      q: "What do I get with the invoice?",
      a: "Sealed device, serial number on the invoice, and sample pricing until stock is entered in the admin. Warranty wording is owner to confirm.",
    },
  ];
}

export { CATALOG as ipadAccessoryCatalog };
