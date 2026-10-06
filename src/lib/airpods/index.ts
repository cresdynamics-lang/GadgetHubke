/** AirPods module — data, images, pricing, accessories, search. */

export { airpodsConfig, airpodsBasePricesKes } from "./config";
export {
  colourLabel,
  colourHex,
  colourApprox,
  airpodsColourMeta,
  type AirpodsColourMeta,
} from "./colours";
export {
  airpodsModels,
  getAirpodsModel,
  airpodsModelsByFamily,
  lowestAirpodsPrice,
  airpodsSubline,
  hasAnc,
  hasHearing,
  type AirpodsModel,
  type AirpodsFamily,
  type NoiseControl,
  type CaseType,
} from "./models";
export {
  getAirpodsImage,
  resolveAirpodsKey,
  defaultAirpodsColour,
  airpodsViewerTabs,
  relatedAirpodsModels,
  AIRPODS_PLACEHOLDER,
  productKey,
  type ResolvedAirpodsImage,
} from "./images";
export { formatKes, airpodsConfigurePrice, lipaMonthly, tradeInEstimate } from "./pricing";
export {
  productEntry,
  gallerySrcs,
  heroSrc,
  earbudsSrc,
  caseSrc,
  maxColourSrc,
  swatchSrc,
  compareSrc,
  caseOverviewSrc,
  marketingSrc,
  pageAsset,
  pageAssetAliases,
  pageKey,
  airpodsManifest,
  type AirpodsManifest,
  type AirpodsProductKey,
} from "./manifest";
export {
  airpodsAccessories,
  accessoriesForAirpods,
  homeAirpodsAccessories,
  airpodsBuyingNotes,
  airpodsFaq,
  fits,
  type AirpodsAccessory,
} from "./accessories";
export {
  buildAirpodsSearchIndex,
  airpodsPopularSearches,
  normalizeAirpodsQuery,
  looksLikeAirpodsQuery,
  searchAirpods,
  searchMisses,
  logAirpodsSearchMiss,
  type AirpodsSearchHit,
} from "./search";
