import { iphoneSeoCatalog } from "./catalog";
import type { IphoneSeoModel } from "./types";

function listSeoModels(): IphoneSeoModel[] {
  return iphoneSeoCatalog;
}

export type IphoneSeriesHub = {
  slug: string;
  family: number;
  name: string;
  title: string;
  metaDescription: string;
  intro: string;
  models: IphoneSeoModel[];
};

const SERIES_INTROS: Record<number, string> = {
  11: "The iPhone 11 series is an affordable way into a modern iPhone in Nairobi. Compare 11, 11 Pro and 11 Pro Max starting prices, then open a model page for storage options.",
  12: "The iPhone 12 series adds OLED displays, 5G and MagSafe. Compare mini, 12, 12 Pro and 12 Pro Max starting prices at Gadget Hub.",
  13: "The iPhone 13 series covers mini through Pro Max. Compare live starting prices in Nairobi and open each model for storage and specs.",
  14: "The iPhone 14 series includes 14, 14 Plus, 14 Pro and 14 Pro Max. Compare starting prices in Kenya, then choose storage on the model page.",
  15: "The iPhone 15 series brings USB-C and updated cameras. Compare 15, 15 Plus, 15 Pro and 15 Pro Max starting prices at Gadget Hub.",
  16: "The iPhone 16 series includes 16e, 16, 16 Plus, 16 Pro and 16 Pro Max. Compare live starting prices, then open a model page to order.",
  17: "The iPhone 17 series includes 17e, 17, Air, 17 Pro and 17 Pro Max. Compare starting prices in Nairobi and open a model page for storage options.",
  18: "The iPhone 18 series includes iPhone 18 Pro, 18 Pro Max and the foldable iPhone Duo. Compare live starting prices in Nairobi, then open a model page to order.",
};

export function seriesSlug(family: number): string {
  return `iphone-${family}-series`;
}

export function listSeriesHubs(): IphoneSeriesHub[] {
  const byFamily = new Map<number, IphoneSeoModel[]>();
  for (const m of listSeoModels()) {
    const list = byFamily.get(m.family) ?? [];
    list.push(m);
    byFamily.set(m.family, list);
  }
  return [...byFamily.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([family, models]) => {
      const from = Math.min(...models.map((m) => m.fromKes));
      const name = `iPhone ${family} series`;
      return {
        slug: seriesSlug(family),
        family,
        name,
        title: `${name} Price in Kenya | Gadget Hub`,
        metaDescription: `Compare every ${name} model at Gadget Hub Nairobi. From KES ${from.toLocaleString("en-KE")}. Pay in full or Lipa Mdogo Mdogo.`,
        intro: SERIES_INTROS[family] ?? `Compare ${name} models and starting prices at Gadget Hub, Norwich House.`,
        models: models.sort((a, b) => a.fromKes - b.fromKes || a.name.localeCompare(b.name)),
      };
    });
}

export function getSeriesHub(slug: string): IphoneSeriesHub | undefined {
  return listSeriesHubs().find((s) => s.slug === slug);
}

export function seriesHubForModel(model: IphoneSeoModel): IphoneSeriesHub {
  return listSeriesHubs().find((s) => s.family === model.family)!;
}
