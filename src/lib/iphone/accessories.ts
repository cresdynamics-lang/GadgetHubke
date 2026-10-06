/**
 * Accessories that fit a given iPhone model (sample prices).
 */

import type { IphoneModel } from "./models";

export type FitAccessory = {
  id: string;
  name: string;
  blurb: string;
  priceKes: number;
  requiresMagSafe?: boolean;
  port?: "usb-c" | "lightning" | "any";
  multiCameraOnly?: boolean;
};

const CATALOG: FitAccessory[] = [
  {
    id: "magsafe-case",
    name: "MagSafe clear case",
    blurb: "Protection with MagSafe align",
    priceKes: 4999,
    requiresMagSafe: true,
  },
  {
    id: "magsafe-charger",
    name: "MagSafe charger",
    blurb: "Snap-on wireless charge",
    priceKes: 7999,
    requiresMagSafe: true,
  },
  {
    id: "usbc-cable",
    name: "USB-C to USB-C cable",
    blurb: "For USB-C iPhones",
    priceKes: 2999,
    port: "usb-c",
  },
  {
    id: "lightning-cable",
    name: "USB-C to Lightning cable",
    blurb: "For Lightning iPhones",
    priceKes: 2999,
    port: "lightning",
  },
  {
    id: "screen-protector",
    name: "Screen protector",
    blurb: "Fits this display size",
    priceKes: 2499,
    port: "any",
  },
  {
    id: "20w-adapter",
    name: "20W power adapter",
    blurb: "Fast charge brick",
    priceKes: 3499,
    port: "any",
  },
  {
    id: "lens-protector",
    name: "Camera lens protector",
    blurb: "For multi-camera models",
    priceKes: 1999,
    multiCameraOnly: true,
  },
];

export function accessoriesFor(model: IphoneModel): FitAccessory[] {
  const isUsbC = model.port.startsWith("USB-C");
  return CATALOG.filter((a) => {
    if (a.requiresMagSafe && !model.magsafe) return false;
    if (a.multiCameraOnly && model.rearCameras.length < 2) return false;
    if (a.port === "usb-c" && !isUsbC) return false;
    if (a.port === "lightning" && isUsbC) return false;
    return true;
  });
}

export function buyingNotes(model: IphoneModel): { title: string; body: string }[] {
  const isUsbC = model.port.startsWith("USB-C");
  const who =
    model.tier === "Pro" || model.tier === "Pro Max"
      ? "Best if you film, want zoom, and a smoother ProMotion screen."
      : model.tier === "mini"
        ? "Best if pocketability matters most."
        : "A strong everyday pick for most people.";

  return [
    {
      title: "Charging",
      body: isUsbC
        ? "This model uses USB-C. Bring a USB-C cable and adapter."
        : "This model uses Lightning. Use a USB-C to Lightning cable with a compatible adapter.",
    },
    {
      title: "MagSafe",
      body: model.magsafe
        ? "MagSafe is supported - cases and chargers snap into place."
        : "No MagSafe on this model. Use a regular cable or Qi wireless pad where supported.",
    },
    {
      title: "Who it suits",
      body: who,
    },
    {
      title: "Check before buying",
      body:
        model.family <= 12
          ? "Confirm battery health and serial number on the invoice. For 12 and older, also check iCloud status."
          : "Confirm battery health figure and serial number on the invoice.",
    },
  ];
}

/** Related models: same-tier adjacent gens + same-gen siblings */
export function relatedModels(model: IphoneModel, all: IphoneModel[]): IphoneModel[] {
  const siblings = all.filter((m) => m.family === model.family && m.id !== model.id);
  const prev = all.find((m) => m.family === model.family - 1 && m.tier === model.tier);
  const next = all.find((m) => m.family === model.family + 1 && m.tier === model.tier);
  const out: IphoneModel[] = [];
  if (prev) out.push(prev);
  if (next) out.push(next);
  for (const s of siblings) {
    if (!out.find((x) => x.id === s.id)) out.push(s);
  }
  return out.slice(0, 6);
}
