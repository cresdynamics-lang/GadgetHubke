/** Apple Watch module — data, images, pricing, bands. */

export { watchConfig, watchBasePricesKes } from "./config";
export {
  colourLabel,
  colourHex,
  isLightColour,
  colourMaterial,
  watchColourMeta,
} from "./colours";
export {
  watchModels,
  getWatchModel,
  watchModelsByFamily,
  lowestWatchPrice,
  watchSubline,
  currentLineup,
  earlierModels,
  type WatchModel,
  type WatchFamily,
  type WatchMaterial,
  type WatchHealth,
  type WatchSafety,
} from "./models";
export {
  getWatchImage,
  defaultWatchColour,
  watchViewerTabs,
  relatedWatchModels,
  WATCH_PLACEHOLDER,
  type ResolvedWatchImage,
} from "./images";
export { formatKes, watchConfigurePrice, lipaMonthly, tradeInEstimate } from "./pricing";
export {
  productCases,
  productBands,
  overviewSrc,
  swatchSrcs,
  pageAsset,
  genKey,
} from "./manifest";
export {
  fitsBand,
  bandsForWatch,
  accessoriesForWatch,
  homeWatchAccessories,
  watchBands,
  watchAccessories,
  watchBuyingNotes,
  watchFaq,
  modelBandFamilies,
  type WatchBand,
  type WatchAccessory,
} from "./bands";
export {
  buildWatchSearchIndex,
  watchPopularSearches,
  normalizeWatchQuery,
  looksLikeWatchQuery,
  searchWatches,
  type WatchSearchHit,
} from "./search";
