/**
 * TV & Home accessories with fits(model, accessory).
 */

import type { TvHomeModel } from "./models";

export type TvHomeAccessory = {
  id: string;
  name: string;
  blurb: string;
  priceKes: number;
  category: "remote" | "cable" | "stand" | "power" | "care" | "third" | "cross";
  families?: Array<"Apple TV" | "HomePod" | "HomePod mini">;
  thirdParty?: boolean;
  href: string;
};

export const tvHomeAccessories: TvHomeAccessory[] = [
  {
    id: "siri-remote-usbc",
    name: "Siri Remote (USB-C)",
    blurb: "Replacement remote for newer Apple TV 4K.",
    priceKes: 8500,
    category: "remote",
    families: ["Apple TV"],
    href: "/tv-home/shop",
  },
  {
    id: "siri-remote-2",
    name: "Siri Remote (2nd generation)",
    blurb: "Lightning remote for earlier Apple TV 4K.",
    priceKes: 6500,
    category: "remote",
    families: ["Apple TV"],
    href: "/tv-home/shop",
  },
  {
    id: "hdmi-21",
    name: "HDMI 2.1 cable",
    blurb: "For 4K HDR from Apple TV to your TV.",
    priceKes: 3500,
    category: "cable",
    families: ["Apple TV"],
    href: "/shop/accessories",
  },
  {
    id: "ethernet-cable",
    name: "Ethernet cable",
    blurb: "For Wi-Fi + Ethernet Apple TV models.",
    priceKes: 1500,
    category: "cable",
    families: ["Apple TV"],
    href: "/shop/accessories",
  },
  {
    id: "homepod-stand",
    name: "HomePod stand / mount",
    blurb: "Third-party stand - owner to confirm stock.",
    priceKes: 4500,
    category: "stand",
    families: ["HomePod", "HomePod mini"],
    thirdParty: true,
    href: "/tv-home/shop",
  },
  {
    id: "homepod-mini-power",
    name: "HomePod mini power cable",
    blurb: "Spare power cable and adapter for mini.",
    priceKes: 2500,
    category: "power",
    families: ["HomePod mini"],
    href: "/tv-home/shop",
  },
  {
    id: "fabric-cover",
    name: "Fabric cover",
    blurb: "Third-party cover - owner to confirm.",
    priceKes: 2000,
    category: "third",
    families: ["HomePod", "HomePod mini"],
    thirdParty: true,
    href: "/tv-home/shop",
  },
  {
    id: "apple-care",
    name: "AppleCare+",
    blurb: "Extended coverage - owner to confirm pricing.",
    priceKes: 6000,
    category: "care",
    href: "/support",
  },
  {
    id: "cross-iphone",
    name: "iPhone",
    blurb: "Set up HomePod from your iPhone.",
    priceKes: 0,
    category: "cross",
    href: "/iphone",
  },
  {
    id: "cross-airpods",
    name: "AirPods",
    blurb: "Listen privately while the room plays.",
    priceKes: 0,
    category: "cross",
    href: "/airpods",
  },
];

export function fits(model: TvHomeModel, accessory: TvHomeAccessory): boolean {
  if (accessory.category === "cross") return true;
  if (accessory.families && !accessory.families.includes(model.family)) return false;
  if (accessory.id === "ethernet-cable" && !model.connections.some((c) => /ethernet/i.test(c)))
    return false;
  if (accessory.id === "siri-remote-usbc" && model.year < 2022) return false;
  if (accessory.id === "siri-remote-2" && model.year >= 2022 && model.family === "Apple TV")
    return model.year === 2021;
  return true;
}

export function accessoriesForTvHome(model: TvHomeModel): TvHomeAccessory[] {
  return tvHomeAccessories.filter((a) => fits(model, a));
}

export function homeTvHomeAccessories(): TvHomeAccessory[] {
  return tvHomeAccessories.filter((a) => a.category !== "cross").slice(0, 4);
}

export type TvHomeBundle = {
  id: string;
  name: string;
  blurb: string;
  modelIds: string[];
  stereoPair?: boolean;
};

export const tvHomeBundles: TvHomeBundle[] = [
  {
    id: "atv-mini-pair",
    name: "Apple TV 4K + HomePod mini pair",
    blurb: "Movies on the big screen, music in the room.",
    modelIds: ["apple-tv-4k-3", "homepod-mini"],
    stereoPair: false,
  },
  {
    id: "mini-stereo",
    name: "Two HomePod minis - stereo pair",
    blurb: "Same model, same room, wider sound.",
    modelIds: ["homepod-mini"],
    stereoPair: true,
  },
];

export function tvHomeBuyingNotes(model: TvHomeModel): { title: string; body: string }[] {
  const notes: { title: string; body: string }[] = [];
  if (model.family === "Apple TV") {
    notes.push({
      title: "Which TV it needs",
      body: "Apple TV needs an HDMI input. 4K HDR only shows on a TV that supports those formats. Check your TV.",
    });
    notes.push({
      title: "Wi-Fi vs Ethernet",
      body: model.connections.includes("Ethernet") || model.id.includes("ethernet")
        ? "This SKU includes Ethernet. 64 GB Wi-Fi is enough for most; 128 GB suits many apps and games."
        : "Wi-Fi model - Ethernet SKU is a separate option with more storage.",
    });
    notes.push({
      title: "Which remote",
      body: model.year >= 2022
        ? "USB-C Siri Remote in the box for 3rd gen."
        : "Earlier remotes (Lightning or 1st gen) - check the invoice.",
    });
  } else {
    notes.push({
      title: "HomePod vs HomePod mini",
      body:
        model.family === "HomePod"
          ? "Full-size sound for larger rooms and music first. Higher sample price."
          : "Compact for kitchen, bedroom or stereo pairs. Lower sample price.",
    });
    notes.push({
      title: "Stereo pair",
      body: model.stereoPairCapable
        ? "Two of the same model, in the same room, set as a stereo pair."
        : "Stereo pair not listed for this model.",
    });
  }
  notes.push(
    {
      title: "Compatibility",
      body: "Apple TV needs a TV with HDMI. HomePod works best with iPhone and Apple Music. Check Apple's list for exact requirements.",
    },
    {
      title: "Services and region",
      body: "Apple TV+ and Apple Music need subscriptions. Availability of services and Siri features varies by country - owner confirms for Kenya.",
    },
    {
      title: "Condition and power",
      body: model.year <= 2018
        ? "Older model - invoice shows condition. Check plugs and cables in the box."
        : "Sealed stock - serial on the invoice. Check box contents for the correct power cable.",
    },
    {
      title: "Authenticity",
      body: "Sealed and serial on the invoice. Check coverage on Apple's own site.",
    },
    {
      title: "Set-up service",
      body: "We set up your Apple TV or HomePod, sign in with your Apple ID, and test it before you collect. Fee - owner to confirm.",
    },
  );
  return notes;
}

export function tvHomeFaq(): { q: string; a: string }[] {
  return [
    { q: "Which one should I get?", a: "Movies and streaming → Apple TV 4K. Big-room music → HomePod. Kitchen, bedroom or budget → HomePod mini. Use the quiz." },
    { q: "Does the Apple TV include a TV?", a: "No. You need your own TV with an HDMI input." },
    { q: "Do I need a 4K TV?", a: "For the full 4K HDR picture, yes. Apple TV still works on HD TVs at lower resolution." },
    { q: "Can I use HomePod with Android?", a: "Limited. Check Apple's guide - HomePod works best with iPhone and Apple services." },
    { q: "Can two HomePod minis make a stereo pair?", a: "Yes - two of the same model in the same room." },
    { q: "Is HomePod a smart home hub?", a: "Current HomePod and mini can act as hubs where Thread/Matter are supported - confirm for Kenya." },
    { q: "Do I need an iPhone?", a: "HomePod needs an iPhone or iPad to set up. Apple TV can be set up from an iPhone or with the remote." },
    { q: "What do I get with the invoice?", a: "Sealed device, serial on the invoice, and the items listed in the box. Warranty wording - owner to confirm." },
  ];
}
