/** TV & Home module — data, images, pricing, accessories, search. */

export { tvHomeConfig, tvHomeBasePricesKes } from "./config";
export { colourLabel, colourHex, tvHomeColourMeta, type TvHomeColourMeta } from "./colours";
export {
  tvHomeModels,
  getTvHomeModel,
  tvHomeModelsByFamily,
  lowestTvHomePrice,
  tvHomeSubline,
  isSpeaker,
  hasDolbyVision,
  isHomeHub,
  type TvHomeModel,
  type TvHomeFamily,
} from "./models";
export {
  getTvHomeImage,
  defaultTvHomeColour,
  tvHomeViewerTabs,
  relatedTvHomeModels,
  TV_HOME_PLACEHOLDER,
  swatchSrc,
  type ResolvedTvHomeImage,
  type TvHomeViewerTab,
} from "./images";
export {
  productEntry,
  gallerySrcs,
  heroSrc,
  overviewSrc,
  pageAsset,
  pageAssetAliases,
  tvHomeManifest,
  type TvHomeManifest,
} from "./manifest";
export { formatKes, tvHomeConfigurePrice, lipaMonthly, tradeInEstimate } from "./pricing";
export {
  tvHomeAccessories,
  accessoriesForTvHome,
  homeTvHomeAccessories,
  tvHomeBuyingNotes,
  tvHomeFaq,
  tvHomeBundles,
  fits,
  type TvHomeAccessory,
  type TvHomeBundle,
} from "./accessories";
export {
  buildTvHomeSearchIndex,
  tvHomePopularSearches,
  normalizeTvHomeQuery,
  looksLikeTvHomeQuery,
  searchTvHome,
  searchMisses,
  logTvHomeSearchMiss,
  type TvHomeSearchHit,
} from "./search";
