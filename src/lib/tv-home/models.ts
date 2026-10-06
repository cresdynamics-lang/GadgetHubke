/**
 * TV & Home catalog (Apple TV 4K, HomePod, HomePod mini).
 * Specs from Apple's published product pages. Owner: re-verify every figure
 * on apple.com before launch. Store null where unclear — show nothing rather than guess.
 */

import { tvHomeBasePricesKes } from "./config";

export type TvHomeFamily = "Apple TV" | "HomePod" | "HomePod mini";

export type TvHomeModel = {
  id: keyof typeof tvHomeBasePricesKes;
  name: string;
  family: TvHomeFamily;
  generation: string;
  year: number;
  chip: string | null;
  storageOptions: string[];
  defaultStorage: string;
  connections: string[];
  pictureFormats: string[];
  audioDetails: string | null;
  drivers: string | null;
  mics: number | null;
  roomSensing: boolean | null;
  sensors: string[];
  heightCm: number | null;
  weightG: number | null;
  colours: string[];
  defaultColour: string;
  boxContents: string[];
  setupNeeds: string;
  siri: boolean | null;
  homeHub: boolean | null;
  thread: boolean | null;
  matter: boolean | null;
  intercom: boolean | null;
  stereoPairCapable: boolean;
  dolbyVision: boolean | null;
  tagline: string;
  whoItSuits: string;
  whyChoose: [string, string, string];
  basePriceKes: number;
  isNew?: boolean;
  noImage?: boolean;
  overviewOnly?: boolean;
  checkFinalSpecs?: boolean;
  notes: string;
  pageFamily: "AppleTV" | "HomePod" | "HomePodMini" | "Landing";
};

function m(
  partial: Omit<TvHomeModel, "basePriceKes"> & { id: keyof typeof tvHomeBasePricesKes },
): TvHomeModel {
  return { ...partial, basePriceKes: tvHomeBasePricesKes[partial.id] };
}

export const tvHomeModels: TvHomeModel[] = [
  m({
    id: "apple-tv-4k-3",
    name: "Apple TV 4K (3rd generation)",
    family: "Apple TV",
    generation: "4K 3rd",
    year: 2022,
    chip: "A15 Bionic",
    storageOptions: ["64 GB Wi-Fi", "128 GB Wi-Fi + Ethernet"],
    defaultStorage: "64 GB Wi-Fi",
    connections: ["HDMI 2.1", "Wi-Fi 6", "Bluetooth 5.0"],
    pictureFormats: ["4K", "HDR10+", "Dolby Vision", "Dolby Atmos"],
    audioDetails: "Dolby Atmos when the TV and content support it",
    drivers: null,
    mics: null,
    roomSensing: false,
    sensors: [],
    heightCm: null,
    weightG: null,
    colours: ["black"],
    defaultColour: "black",
    boxContents: ["Apple TV 4K", "Siri Remote (USB-C)", "Power cord"],
    setupNeeds: "TV with HDMI · Wi-Fi or Ethernet · HDMI cable sold separately (check)",
    siri: true,
    homeHub: true,
    thread: null,
    matter: null,
    intercom: false,
    stereoPairCapable: false,
    dolbyVision: true,
    tagline: "Cinema at home — on the TV you already own.",
    whoItSuits: "Movie nights, sports and anyone who wants 4K HDR apps in one box.",
    whyChoose: [
      "A15 Bionic with 4K, HDR10+ and Dolby Vision — check TV support.",
      "Siri Remote with USB-C in the box.",
      "Can work as a home hub for HomeKit and Matter accessories — confirm for Kenya.",
    ],
    isNew: true,
    checkFinalSpecs: true,
    notes: "Wi-Fi and Ethernet SKUs share the same store photos.",
    pageFamily: "AppleTV",
  }),
  m({
    id: "apple-tv-4k-3-ethernet",
    name: "Apple TV 4K (Wi-Fi + Ethernet)",
    family: "Apple TV",
    generation: "4K 3rd Ethernet",
    year: 2022,
    chip: "A15 Bionic",
    storageOptions: ["128 GB Wi-Fi + Ethernet"],
    defaultStorage: "128 GB Wi-Fi + Ethernet",
    connections: ["HDMI 2.1", "Wi-Fi 6", "Ethernet", "Bluetooth 5.0", "Thread"],
    pictureFormats: ["4K", "HDR10+", "Dolby Vision", "Dolby Atmos"],
    audioDetails: "Dolby Atmos when the TV and content support it",
    drivers: null,
    mics: null,
    roomSensing: false,
    sensors: [],
    heightCm: null,
    weightG: null,
    colours: ["black"],
    defaultColour: "black",
    boxContents: ["Apple TV 4K", "Siri Remote (USB-C)", "Power cord"],
    setupNeeds: "TV with HDMI · Ethernet recommended · HDMI cable sold separately",
    siri: true,
    homeHub: true,
    thread: true,
    matter: null,
    intercom: false,
    stereoPairCapable: false,
    dolbyVision: true,
    tagline: "Same picture — wired for a busier home hub.",
    whoItSuits: "Homes that want Ethernet and more storage for apps and games.",
    whyChoose: [
      "128 GB with Ethernet and Thread — check final specs.",
      "Same A15 picture stack as the Wi-Fi model.",
      "Sample price includes the Ethernet storage step.",
    ],
    isNew: true,
    checkFinalSpecs: true,
    notes: "Same product photos as Wi-Fi SKU.",
    pageFamily: "AppleTV",
  }),
  m({
    id: "homepod-2",
    name: "HomePod (2nd generation)",
    family: "HomePod",
    generation: "2nd",
    year: 2023,
    chip: "S7",
    storageOptions: [],
    defaultStorage: "",
    connections: ["Wi-Fi", "Bluetooth", "Thread"],
    pictureFormats: [],
    audioDetails: "Spatial Audio · room-sensing system",
    drivers: "High-excursion woofer · five-tweeter beamforming array",
    mics: 4,
    roomSensing: true,
    sensors: ["Temperature", "Humidity"],
    heightCm: null,
    weightG: null,
    colours: ["midnight", "white"],
    defaultColour: "midnight",
    boxContents: ["HomePod", "Power cord"],
    setupNeeds: "iPhone or iPad to set up",
    siri: true,
    homeHub: true,
    thread: true,
    matter: null,
    intercom: true,
    stereoPairCapable: true,
    dolbyVision: false,
    tagline: "Big sound that learns the room.",
    whoItSuits: "Living rooms and music lovers who want a full-size smart speaker.",
    whyChoose: [
      "S7 chip with room sensing and Spatial Audio — check final specs.",
      "Works as a smart home hub with Thread — confirm Matter in Kenya.",
      "Stereo pair two of the same model in one room.",
    ],
    isNew: true,
    checkFinalSpecs: true,
    notes: "Midnight and White finishes.",
    pageFamily: "HomePod",
  }),
  m({
    id: "homepod-mini",
    name: "HomePod mini",
    family: "HomePod mini",
    generation: "mini",
    year: 2021,
    chip: "S5",
    storageOptions: [],
    defaultStorage: "",
    connections: ["Wi-Fi", "Bluetooth", "Thread"],
    pictureFormats: [],
    audioDetails: "360-degree audio",
    drivers: "Full-range driver with two passive radiators",
    mics: null,
    roomSensing: null,
    sensors: [],
    heightCm: 8.4,
    weightG: 345,
    colours: ["midnight", "white", "blue", "orange", "yellow"],
    defaultColour: "midnight",
    boxContents: ["HomePod mini", "Power cord"],
    setupNeeds: "iPhone or iPad to set up",
    siri: true,
    homeHub: true,
    thread: true,
    matter: null,
    intercom: true,
    stereoPairCapable: true,
    dolbyVision: false,
    tagline: "Small speaker. Whole-home voice.",
    whoItSuits: "Kitchen, bedroom or a stereo pair on a budget.",
    whyChoose: [
      "Compact 360-degree audio with Siri and Intercom.",
      "Five finishes — confirm which colours are stocked.",
      "Thread hub support — check Matter availability.",
    ],
    isNew: true,
    checkFinalSpecs: true,
    notes: "Owner confirms stocked colours.",
    pageFamily: "HomePodMini",
  }),
  m({
    id: "apple-tv-4k-2",
    name: "Apple TV 4K (2nd generation)",
    family: "Apple TV",
    generation: "4K 2nd",
    year: 2021,
    chip: "A12 Bionic",
    storageOptions: ["32 GB", "64 GB"],
    defaultStorage: "64 GB",
    connections: ["HDMI", "Wi-Fi", "Ethernet", "Bluetooth"],
    pictureFormats: ["4K", "HDR10", "Dolby Vision", "Dolby Atmos"],
    audioDetails: "Dolby Atmos when supported",
    drivers: null,
    mics: null,
    roomSensing: false,
    sensors: [],
    heightCm: null,
    weightG: null,
    colours: ["black"],
    defaultColour: "black",
    boxContents: ["Apple TV 4K", "Siri Remote (2nd gen, Lightning)", "Power cord"],
    setupNeeds: "TV with HDMI · HDMI cable sold separately",
    siri: true,
    homeHub: true,
    thread: null,
    matter: null,
    intercom: false,
    stereoPairCapable: false,
    dolbyVision: true,
    tagline: "Also in stock — earlier 4K box.",
    whoItSuits: "Buyers who want 4K at a lower sample price.",
    whyChoose: [
      "A12 Bionic with 4K and Dolby Vision — check final specs.",
      "Siri Remote 2nd generation (Lightning).",
      "Overview image from Apple Support — check condition.",
    ],
    overviewOnly: true,
    checkFinalSpecs: true,
    notes: "Also in stock. Folder 05 overview only.",
    pageFamily: "AppleTV",
  }),
  m({
    id: "apple-tv-4k-1",
    name: "Apple TV 4K (1st generation)",
    family: "Apple TV",
    generation: "4K 1st",
    year: 2017,
    chip: "A10X Fusion",
    storageOptions: ["32 GB", "64 GB"],
    defaultStorage: "64 GB",
    connections: ["HDMI", "Wi-Fi", "Ethernet", "Bluetooth"],
    pictureFormats: ["4K", "HDR10", "Dolby Vision"],
    audioDetails: null,
    drivers: null,
    mics: null,
    roomSensing: false,
    sensors: [],
    heightCm: null,
    weightG: null,
    colours: ["black"],
    defaultColour: "black",
    boxContents: ["Apple TV 4K", "Siri Remote (1st gen)", "Power cord"],
    setupNeeds: "TV with HDMI",
    siri: true,
    homeHub: null,
    thread: false,
    matter: false,
    intercom: false,
    stereoPairCapable: false,
    dolbyVision: true,
    tagline: "Also in stock — check condition.",
    whoItSuits: "Tight budgets who accept an older 4K box.",
    whyChoose: [
      "Lowest 4K sample price in the shop.",
      "Overview image only.",
      "Confirm condition and remote generation on the invoice.",
    ],
    overviewOnly: true,
    checkFinalSpecs: true,
    notes: "Show only if stock exists.",
    pageFamily: "AppleTV",
  }),
  m({
    id: "apple-tv-hd",
    name: "Apple TV HD",
    family: "Apple TV",
    generation: "HD",
    year: 2015,
    chip: null,
    storageOptions: ["32 GB", "64 GB"],
    defaultStorage: "32 GB",
    connections: ["HDMI", "Wi-Fi", "Ethernet"],
    pictureFormats: ["HD"],
    audioDetails: null,
    drivers: null,
    mics: null,
    roomSensing: false,
    sensors: [],
    heightCm: null,
    weightG: null,
    colours: ["black"],
    defaultColour: "black",
    boxContents: ["Apple TV HD", "Siri Remote", "Power cord"],
    setupNeeds: "TV with HDMI",
    siri: true,
    homeHub: null,
    thread: false,
    matter: false,
    intercom: false,
    stereoPairCapable: false,
    dolbyVision: false,
    tagline: "Also in stock — HD only.",
    whoItSuits: "Basic streaming when 4K is not needed.",
    whyChoose: [
      "Lowest sample price.",
      "HD picture only — not 4K.",
      "Check condition carefully.",
    ],
    overviewOnly: true,
    checkFinalSpecs: true,
    notes: "Also in stock if available.",
    pageFamily: "AppleTV",
  }),
  m({
    id: "homepod-1",
    name: "HomePod (1st generation)",
    family: "HomePod",
    generation: "1st",
    year: 2018,
    chip: null,
    storageOptions: [],
    defaultStorage: "",
    connections: ["Wi-Fi", "Bluetooth"],
    pictureFormats: [],
    audioDetails: null,
    drivers: null,
    mics: null,
    roomSensing: null,
    sensors: [],
    heightCm: null,
    weightG: null,
    colours: ["white", "midnight"],
    defaultColour: "white",
    boxContents: ["HomePod", "Power cord"],
    setupNeeds: "iPhone or iPad to set up",
    siri: true,
    homeHub: null,
    thread: false,
    matter: false,
    intercom: null,
    stereoPairCapable: true,
    dolbyVision: false,
    tagline: "Also in stock — original HomePod.",
    whoItSuits: "Buyers watching the budget for big-room sound.",
    whyChoose: [
      "Lower sample price than HomePod 2.",
      "No store photo — text only.",
      "Confirm condition and battery/speaker health.",
    ],
    noImage: true,
    checkFinalSpecs: true,
    notes: "Image not available. Show only if stock exists.",
    pageFamily: "HomePod",
  }),
];

export function getTvHomeModel(id: string): TvHomeModel | undefined {
  return tvHomeModels.find((m) => m.id === id);
}

export function tvHomeModelsByFamily(family: TvHomeFamily): TvHomeModel[] {
  return tvHomeModels.filter((m) => m.family === family);
}

export function lowestTvHomePrice(family?: TvHomeFamily): number {
  const pool = family ? tvHomeModelsByFamily(family) : tvHomeModels;
  return Math.min(...pool.map((m) => m.basePriceKes));
}

export function tvHomeSubline(model: TvHomeModel): string {
  return `${model.generation} · ${model.chip || "check chip"} · ${model.year}`;
}

export function isSpeaker(model: TvHomeModel): boolean {
  return model.family === "HomePod" || model.family === "HomePod mini";
}

export function hasDolbyVision(model: TvHomeModel): boolean {
  return Boolean(model.dolbyVision);
}

export function isHomeHub(model: TvHomeModel): boolean {
  return Boolean(model.homeHub);
}
