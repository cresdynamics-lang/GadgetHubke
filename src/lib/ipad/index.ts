/** iPad Pro / Air / mini / standard module — data, images, pricing. */

export { ipadConfig, ipadBasePricesKes } from "./config";
export {
  colourLabel,
  colourHex,
  isLightColour,
  normaliseColourToken,
  ipadColourMeta,
} from "./colours";
export {
  ipadModels,
  getIpadModel,
  ipadModelsByFamily,
  lowestIpadPrice,
  ipadSubline,
  supportsPencilPro,
  type IpadModel,
  type IpadFamily,
  type IpadChipGen,
  type PencilSupport,
  type KeyboardSupport,
} from "./models";
export {
  getIpadImage,
  defaultIpadColour,
  ipadViewerTabs,
  ipadLidFrames,
  relatedIpadModels,
  IPAD_PLACEHOLDER,
  type ResolvedIpadImage,
} from "./images";
export {
  formatKes,
  ipadConfigurePrice,
  lipaMonthly,
  tradeInEstimate,
} from "./pricing";
export {
  productSrc,
  overviewSrc,
  pageAsset,
  gallerySrcs,
  missingStoreShot,
} from "./manifest";
export {
  fits,
  accessoriesForIpad,
  homeIpadAccessories,
  pencilCatalog,
  keyboardCatalog,
  ipadBuyingNotes,
  ipadFaq,
  type IpadAccessory,
} from "./accessories";
export {
  buildIpadSearchIndex,
  ipadPopularSearches,
  normalizeIpadQuery,
  looksLikeIpadQuery,
  searchIpads,
  type IpadSearchHit,
} from "./search";
