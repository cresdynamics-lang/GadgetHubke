/** MacBook Air + Pro module - data, images, pricing. */

export { macConfig, macBasePricesKes } from "./config";
export {
  colourLabel,
  colourHex,
  isLightColour,
  normaliseColourToken,
  macColourMeta,
} from "./colours";
export {
  macModels,
  getMacModel,
  macModelsByFamily,
  macModelsByChip,
  macSubline,
  lowestMacPrice,
  type MacModel,
  type MacFamily,
  type MacChipGen,
} from "./models";
export {
  getMacImage,
  defaultMacColour,
  macViewerTabs,
  macLidFrames,
  relatedMacModels,
  MAC_PLACEHOLDER,
  type ResolvedMacImage,
} from "./images";
export {
  formatKes,
  macConfigurePrice,
  lipaMonthly,
  tradeInEstimate,
} from "./pricing";
export {
  productColoursFor,
  overviewSrc,
  pageAsset,
  sizeComparisonSrc,
  missingStoreShot,
} from "./manifest";
export {
  accessoriesForMac,
  homeMacAccessories,
  macBuyingNotes,
  macFaq,
  type MacAccessory,
} from "./accessories";
export {
  macCompareCard,
  macCompareRows,
  honestMacDifference,
  rowIsDifferent,
  type MacCompareCard,
  type MacCompareRow,
} from "./compare";
export {
  buildMacSearchIndex,
  searchMacs,
  normalizeMacQuery,
  looksLikeMacQuery,
  macPopularSearches,
  type MacSearchHit,
} from "./search";
