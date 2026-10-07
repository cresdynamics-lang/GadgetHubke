/**
 * MacBook compare rows, honest-difference summary, and payload for modal/page.
 */

import { macConfig } from "./config";
import { colourLabel } from "./colours";
import { getMacImage, defaultMacColour } from "./images";
import type { MacModel } from "./models";
import { formatKes } from "./pricing";

export type MacCompareRow = {
  group: string;
  label: string;
  values: string[];
};

export type MacCompareCard = {
  id: string;
  name: string;
  href: string;
  price: number;
  priceLabel: string;
  imageSrc: string;
  imageAlt: string;
  chip: string;
  family: string;
  year: number;
  screen: string;
  battery: string;
  weight: string;
  memory: string;
  storage: string;
  display: string;
  brightness: string;
  refresh: string;
  ports: string;
  camera: string;
  speakers: string;
  cooling: string;
  thickness: string;
  colours: string;
  externalDisplays: string;
  wifi: string;
};

export function macCompareCard(model: MacModel): MacCompareCard {
  const colour = defaultMacColour(model);
  const img = getMacImage(model.id, colour, "product", model.name);
  const thickness = macConfig.thicknessMm[model.thicknessKey];
  return {
    id: model.id,
    name: model.name,
    href: `/mac/${model.id}`,
    price: model.basePriceKes,
    priceLabel: formatKes(model.basePriceKes),
    imageSrc: img.src,
    imageAlt: img.alt,
    chip: model.chip,
    family: model.family,
    year: model.year,
    screen: `${model.screenInches}″`,
    battery: `${model.batteryVideoHours} h video`,
    weight: `${model.weightKg} kg`,
    memory: `${model.memoryOptionsGb.join(" / ")} GB`,
    storage: model.storageOptions.join(" / "),
    display: `${model.display.diagonal}″ ${model.display.panel} · ${model.display.resolution}`,
    brightness: model.display.peakHdrNits
      ? `${model.display.brightnessNits} / ${model.display.peakHdrNits} peak HDR nits`
      : `${model.display.brightnessNits} nits`,
    refresh: model.display.promotion
      ? `ProMotion up to ${model.display.refreshHz}Hz`
      : `${model.display.refreshHz}Hz`,
    ports: model.ports.join(", "),
    camera: model.camera,
    speakers: model.speakers,
    cooling: model.fanless ? "Fanless" : "Active fan",
    thickness: `About ${thickness} mm`,
    colours: model.colours.map(colourLabel).join(", "),
    externalDisplays: model.externalDisplays,
    wifi: model.wifi,
  };
}

export function macCompareRows(cards: MacCompareCard[]): MacCompareRow[] {
  if (!cards.length) return [];
  const col = <K extends keyof MacCompareCard>(key: K) => cards.map((c) => String(c[key]));
  return [
    { group: "Chip", label: "Chip", values: col("chip") },
    { group: "Chip", label: "Cooling", values: col("cooling") },
    { group: "Memory", label: "Memory options", values: col("memory") },
    { group: "Memory", label: "Storage options", values: col("storage") },
    { group: "Display", label: "Screen", values: col("display") },
    { group: "Display", label: "Brightness", values: col("brightness") },
    { group: "Display", label: "Refresh", values: col("refresh") },
    { group: "Battery", label: "Video playback", values: col("battery") },
    { group: "Ports", label: "Ports", values: col("ports") },
    { group: "Ports", label: "External displays", values: col("externalDisplays") },
    { group: "Ports", label: "Wi-Fi", values: col("wifi") },
    { group: "Camera", label: "Camera", values: col("camera") },
    { group: "Camera", label: "Speakers", values: col("speakers") },
    { group: "Size and weight", label: "Size", values: col("screen") },
    { group: "Size and weight", label: "Weight", values: col("weight") },
    { group: "Size and weight", label: "Thickness", values: col("thickness") },
    { group: "Price", label: "From (sample)", values: col("priceLabel") },
  ];
}

/** Short paragraph: the 2 - 3 things that actually change between the set. */
export function honestMacDifference(models: MacModel[]): string {
  if (models.length < 2) {
    return "Pick at least two MacBooks to see what truly differs.";
  }

  const points: string[] = [];
  const families = new Set(models.map((m) => m.family));
  const chips = new Set(models.map((m) => m.chip));
  const sizes = new Set(models.map((m) => m.screenInches));
  const years = models.map((m) => m.year);
  const batteries = models.map((m) => m.batteryVideoHours);
  const weights = models.map((m) => m.weightKg);
  const prices = models.map((m) => m.basePriceKes);
  const panels = new Set(models.map((m) => m.display.panel));
  const promotions = models.some((m) => m.display.promotion) && models.some((m) => !m.display.promotion);
  const cooling = models.some((m) => m.fanless) && models.some((m) => !m.fanless);

  if (families.size > 1) {
    points.push(
      "Air is fanless and lighter; Pro adds active cooling, more ports, and (on 14″/16″) an XDR display.",
    );
  }
  if (chips.size > 1) {
    points.push(`Chip tiers differ: ${[...chips].join(" vs ")}.`);
  }
  if (sizes.size > 1) {
    points.push(`Screen size is the easy choice: ${[...sizes].map((s) => `${s}″`).join(" vs ")}.`);
  }
  if (promotions || panels.size > 1) {
    points.push("Display class changes - Liquid Retina vs Liquid Retina XDR / ProMotion where present.");
  }
  if (cooling && families.size === 1) {
    points.push("Cooling differs: some stay silent (fanless), others use a fan under load.");
  }
  if (Math.max(...batteries) - Math.min(...batteries) >= 2) {
    points.push(
      `Battery claims range from ${Math.min(...batteries)} to ${Math.max(...batteries)} hours of video (Apple figures).`,
    );
  }
  if (Math.max(...weights) - Math.min(...weights) >= 0.2) {
    points.push(`Weight spans ${Math.min(...weights)}-${Math.max(...weights)} kg.`);
  }
  if (Math.max(...years) - Math.min(...years) >= 2) {
    points.push("Age gap matters for support - check Apple’s macOS list; older machines need a condition check.");
  }
  if (Math.max(...prices) - Math.min(...prices) >= 30000) {
    points.push(
      `Sample price gap is about ${formatKes(Math.max(...prices) - Math.min(...prices))} between the cheapest and dearest here.`,
    );
  }

  if (!points.length) {
    return "These MacBooks are close. Look at memory and storage options, then try both in the shop.";
  }

  return points.slice(0, 3).join(" ");
}

export function rowIsDifferent(row: MacCompareRow): boolean {
  return new Set(row.values).size > 1;
}
