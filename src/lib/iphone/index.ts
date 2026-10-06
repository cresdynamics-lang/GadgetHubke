/** iPhone 11–16 shop module — data, images, pricing. Mac category can mirror this later. */

export { iphoneConfig } from "./config";
export {
  colourMetaByKey,
  colourLabel,
  colourHex,
  isLightColour,
  type ColourMeta,
} from "./colours";
export {
  imageManifest,
  OVERVIEW_ONLY_MODELS,
  TEXT_ONLY_COLOURS,
  type IphoneView,
  type ModelImageEntry,
} from "./manifest";
export {
  getImage,
  availableViews,
  availableColours,
  textOnlyColours,
  isOverviewOnly,
  defaultColourForModel,
  PLACEHOLDER_SRC,
  type ResolvedImage,
} from "./images";
export {
  models,
  getModel,
  modelsByFamily,
  modelSubline,
  isLatestTag,
  isValueTag,
  type IphoneModel,
  type IphoneTier,
} from "./models";
export { storagePrices, formatKes, lipaMonthly, tradeInEstimate } from "./pricing";
export {
  accessoriesFor,
  buyingNotes,
  relatedModels,
  type FitAccessory,
} from "./accessories";
export {
  buildIphoneSearchIndex,
  searchIphones,
  normalizeQuery,
  iphonePopularSearches,
  type IphoneSearchHit,
} from "./search";
