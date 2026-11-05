/** Live device choices for the forms, with colours named as customers know them. */
import { colourMetaByKey } from "./iphone/colours";
import { ipadColourMeta } from "./ipad/colours";
import { macColourMeta } from "./mac/colours";
import { watchColourMeta } from "./watch/colours";
import { airpodsColourMeta } from "./airpods/colours";
import { tvHomeColourMeta } from "./tv-home/colours";
import { livePricedCatalog } from "./pricing/live";
import { deviceOptions, lipaDeviceOptions } from "./device-options";
import { filterColours } from "./listing-offers";
import { products } from "./products";

const squash = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, "");

// Some image folders name a colour "cosmicorange", others "cosmic-orange".
const names = new Map(
  [tvHomeColourMeta, airpodsColourMeta, watchColourMeta, macColourMeta, ipadColourMeta, colourMetaByKey].flatMap((meta) =>
    Object.entries(meta).map(([key, { label }]) => [squash(key), label] as const),
  ),
);

function colourName(key: string) {
  return names.get(squash(key)) ?? key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function liveDeviceOptions(skipGroups: readonly string[] = []) {
  const catalog = await livePricedCatalog();
  // The shop iPhones (18 Pro, Duo and so on) and MacBook Pro keep their finishes on the product itself.
  const finishes = (id: string) => {
    const labels = products.find((p) => p.id === id)?.colors.map((c) => c.label) ?? [];
    return filterColours(labels, catalog.find((p) => p.id === id)?.coloursInStock);
  };
  return deviceOptions(catalog, skipGroups, colourName).map((o) =>
    o.colours.length ? o : { ...o, colours: finishes(o.id) },
  );
}

/** Every option on the site, sold out or not, for the Lipa form. */
export async function liveLipaDeviceOptions() {
  const catalog = await livePricedCatalog();
  return lipaDeviceOptions(catalog, colourName).map((o) => {
    if (o.colours.length) return o;
    const row = catalog.find((p) => p.id === o.id);
    const labels = products.find((p) => p.id === o.id)?.colors.map((c) => c.label) ?? [];
    const exUkTicks = row?.exUkColoursInStock?.length ? row.exUkColoursInStock : row?.coloursInStock;
    return {
      ...o,
      colours: labels,
      colourStock: { new: filterColours(labels, row?.coloursInStock), exUk: filterColours(labels, exUkTicks) },
    };
  });
}
