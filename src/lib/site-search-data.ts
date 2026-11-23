/**
 * Site search data (indexes, accessory lists), served as JSON by /api/search-index.
 * Loaded by the browser only when search opens, so product pages do not carry it.
 */
import { iphoneLiveId, isShownOnWebsite, livePricedCatalog } from "./pricing/live";
import { listedFromKes } from "./listing-offers";
import {
  buildIphoneSearchIndex,
  iphonePopularSearches,
  iphoneConfig,
  models,
  accessoriesFor,
} from "./iphone";
import {
  buildMacSearchIndex,
  macPopularSearches,
  accessoriesForMac,
  macModels,
} from "./mac";
import {
  buildIpadSearchIndex,
  ipadPopularSearches,
  accessoriesForIpad,
  ipadModels,
} from "./ipad";
import {
  buildWatchSearchIndex,
  watchPopularSearches,
  accessoriesForWatch,
  watchModels,
} from "./watch";
import {
  buildAirpodsSearchIndex,
  airpodsPopularSearches,
  accessoriesForAirpods,
  airpodsModels,
} from "./airpods";
import {
  buildTvHomeSearchIndex,
  tvHomePopularSearches,
  accessoriesForTvHome,
  tvHomeModels,
} from "./tv-home";
import {
  buildAccessoriesSearchIndex,
  accessoriesPopularSearches,
} from "./accessories";

const phoneIndex = buildIphoneSearchIndex();
const macIndex = buildMacSearchIndex();
const ipadIndex = buildIpadSearchIndex();
const watchIndex = buildWatchSearchIndex();
const airpodsIndex = buildAirpodsSearchIndex();
const tvHomeIndex = buildTvHomeSearchIndex();
const accessoriesIndex = buildAccessoriesSearchIndex();
const waPhone = iphoneConfig.whatsapp;
const popular = [
  ...iphonePopularSearches.slice(0, 2),
  ...macPopularSearches.slice(0, 2),
  ...ipadPopularSearches.slice(0, 1),
  ...watchPopularSearches.slice(0, 1),
  ...airpodsPopularSearches.slice(0, 1),
  ...tvHomePopularSearches.slice(0, 1),
  ...accessoriesPopularSearches.slice(0, 2),
];
const phoneAcc = Object.fromEntries(
  models.map((m) => [
    m.id,
    accessoriesFor(m).map((a) => ({
      id: a.id,
      name: a.name,
      blurb: a.blurb,
      priceKes: a.priceKes,
    })),
  ]),
);
const macAcc = Object.fromEntries(
  macModels.map((m) => [
    m.id,
    accessoriesForMac(m)
      .filter((a) => a.category !== "cross")
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        name: a.name,
        blurb: a.blurb,
        priceKes: a.priceKes,
      })),
  ]),
);
const ipadAcc = Object.fromEntries(
  ipadModels.map((m) => [
    m.id,
    accessoriesForIpad(m)
      .filter((a) => a.category !== "cross")
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        name: a.name,
        blurb: a.blurb,
        priceKes: a.priceKes,
      })),
  ]),
);
const watchAcc = Object.fromEntries(
  watchModels.map((m) => [
    m.id,
    accessoriesForWatch(m)
      .filter((a) => a.category !== "cross")
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        name: a.name,
        blurb: a.blurb,
        priceKes: a.priceKes,
      })),
  ]),
);
const airpodsAcc = Object.fromEntries(
  airpodsModels.map((m) => [
    m.id,
    accessoriesForAirpods(m)
      .filter((a) => a.category !== "cross")
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        name: a.name,
        blurb: a.blurb,
        priceKes: a.priceKes,
      })),
  ]),
);
const tvHomeAcc = Object.fromEntries(
  tvHomeModels.map((m) => [
    m.id,
    accessoriesForTvHome(m)
      .filter((a) => a.category !== "cross")
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        name: a.name,
        blurb: a.blurb,
        priceKes: a.priceKes,
      })),
  ]),
);

// Search offers only what is on the live list.
async function liveFilter() {
  const catalog = await livePricedCatalog();
  const offList = new Set(catalog.filter((p) => !isShownOnWebsite(p)).map((p) => p.id));
  const byId = new Map(catalog.map((p) => [p.id, p]));
  return {
    onLiveList: (item: { id: string }) => !offList.has(iphoneLiveId(item.id)),
    /** The same live from-price as the menu and product pages. */
    livePrice: <T extends { id: string; priceKes?: number }>(item: T): T => {
      const live = byId.get(iphoneLiveId(item.id));
      const kes = live ? listedFromKes(live) : 0;
      return kes > 0 && "priceKes" in item ? { ...item, priceKes: kes } : item;
    },
    tvListed: tvHomeModels.some((m) => !offList.has(m.id)),
  };
}

/** True when at least one TV & Home product is on sale (the search panel shows its link). */
export async function tvHomeListed() {
  return (await liveFilter()).tvListed;
}


export async function siteSearchData() {
  const { onLiveList, livePrice } = await liveFilter();
  return {
    phoneIndex: phoneIndex.filter(onLiveList).map(livePrice),
    macIndex: macIndex.filter(onLiveList).map(livePrice),
    ipadIndex: ipadIndex.filter(onLiveList).map(livePrice),
    watchIndex: watchIndex.filter(onLiveList).map(livePrice),
    airpodsIndex: airpodsIndex.filter(onLiveList).map(livePrice),
    tvHomeIndex: tvHomeIndex.filter(onLiveList).map(livePrice),
    accessoriesIndex: accessoriesIndex.filter(onLiveList).map(livePrice),
    phoneAcc,
    macAcc,
    ipadAcc,
    watchAcc,
    airpodsAcc,
    tvHomeAcc,
  };
}
