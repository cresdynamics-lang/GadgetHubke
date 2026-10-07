/**
 * Apple Watch catalog (Series 6 - 12, SE, Ultra, Hermès, Nike, 2020 - 2026).
 * Specs from Apple's published compare page (apple.com/watch/compare).
 * Owner: re-verify every figure before launch. Cells marked checkFinalSpecs
 * or null stay uncertain - show nothing rather than guess.
 */

import { watchBasePricesKes } from "./config";

export type WatchFamily = "Series" | "SE" | "Ultra" | "Hermès" | "Nike";
export type WatchMaterial = "aluminum" | "titanium" | "ceramic" | "stainless";

export type WatchHealth = {
  ecg: boolean | null;
  irregularRhythm: boolean | null;
  highLowHeartRate: boolean | null;
  hypertension: boolean | null;
  sleepTracking: boolean | null;
  sleepApnea: boolean | null;
  sleepScore: boolean | null;
  vitals: boolean | null;
  wristTemperature: boolean | null;
  cycleTracking: boolean | null;
  bloodOxygen: boolean | null;
  lowCardioFitness: boolean | null;
};

export type WatchSafety = {
  emergencySos: boolean | null;
  fallDetection: boolean | null;
  crashDetection: boolean | null;
  internationalEmergency: boolean | null;
  siren: boolean | null;
  satelliteSos: boolean | null;
};

export type WatchModel = {
  id: keyof typeof watchBasePricesKes;
  name: string;
  family: WatchFamily;
  generation: string;
  year: number;
  seriesNumber?: number;
  caseSizesMm: number[];
  defaultCaseMm: number;
  materials: WatchMaterial[];
  colours: string[];
  defaultColour: string;
  displayType: string;
  alwaysOn: boolean | null;
  brightnessNits: number | null;
  chip: string | null;
  batteryHours: number | null;
  lowPowerHours: number | null;
  waterM: number;
  depthGaugeM: number | null;
  cellularAvailable: boolean;
  fiveG: boolean | null;
  dualFrequencyGps: boolean | null;
  health: WatchHealth;
  safety: WatchSafety;
  doubleTap: boolean | null;
  wristFlick: boolean | null;
  fastCharging: boolean | null;
  weightG: number | null;
  dimensionsMm: { w: number; h: number; d: number } | null;
  tagline: string;
  whoItSuits: string;
  whyChoose: [string, string, string];
  basePriceKes: number;
  isNew?: boolean;
  specialBandIncluded?: boolean;
  overviewOnly?: boolean;
  checkFinalSpecs?: boolean;
  notes: string;
  pageFamily: "Series" | "SE" | "Ultra" | "Hermès" | "Nike" | "Why" | "Kids";
};

const healthFull: WatchHealth = {
  ecg: true,
  irregularRhythm: true,
  highLowHeartRate: true,
  hypertension: true,
  sleepTracking: true,
  sleepApnea: true,
  sleepScore: true,
  vitals: true,
  wristTemperature: true,
  cycleTracking: true,
  bloodOxygen: true,
  lowCardioFitness: true,
};

const healthSeriesOlder: WatchHealth = {
  ...healthFull,
  hypertension: null,
  sleepApnea: null,
  sleepScore: null,
  vitals: null,
};

const healthSe: WatchHealth = {
  ecg: false,
  irregularRhythm: true,
  highLowHeartRate: true,
  hypertension: null,
  sleepTracking: true,
  sleepApnea: null,
  sleepScore: null,
  vitals: null,
  wristTemperature: false,
  cycleTracking: true,
  bloodOxygen: false,
  lowCardioFitness: true,
};

const safetyBase: WatchSafety = {
  emergencySos: true,
  fallDetection: true,
  crashDetection: true,
  internationalEmergency: true,
  siren: false,
  satelliteSos: null,
};

const safetyUltra: WatchSafety = {
  ...safetyBase,
  siren: true,
  satelliteSos: true,
};

function s(
  partial: Omit<WatchModel, "basePriceKes"> & { id: keyof typeof watchBasePricesKes },
): WatchModel {
  return {
    ...partial,
    basePriceKes: watchBasePricesKes[partial.id],
  };
}

export const watchModels: WatchModel[] = [
  // -- Current lineup --
  s({
    id: "watch-s12-42",
    name: "Apple Watch Series 12 42mm",
    family: "Series",
    generation: "Series 12",
    year: 2026,
    seriesNumber: 12,
    caseSizesMm: [42],
    defaultCaseMm: 42,
    materials: ["aluminum", "titanium", "ceramic"],
    colours: ["dark-bronze", "light-gold", "black", "space-gray", "radiant-gold", "natural", "pearl-white", "night-blue"],
    defaultColour: "black",
    displayType: "Always-On Retina wide-angle OLED",
    alwaysOn: true,
    brightnessNits: null,
    chip: null,
    batteryHours: null,
    lowPowerHours: null,
    waterM: 50,
    depthGaugeM: null,
    cellularAvailable: true,
    fiveG: null,
    dualFrequencyGps: null,
    health: healthFull,
    safety: safetyBase,
    doubleTap: true,
    wristFlick: true,
    fastCharging: true,
    weightG: 39.5,
    dimensionsMm: { w: 42, h: 36, d: 9.7 },
    tagline: "The everyday watch that looks after you.",
    whoItSuits: "Anyone who wants the newest Series health features in a lighter case.",
    whyChoose: [
      "Newest Series display and sensors in a compact 42 mm case.",
      "Aluminum, titanium or ceramic - pick finish and price.",
      "Pairs with every current Sport Band and Sport Loop family.",
    ],
    isNew: true,
    checkFinalSpecs: true,
    notes: "Current aluminum GPS base. Check brightness, chip, battery and charging before launch.",
    pageFamily: "Series",
  }),
  s({
    id: "watch-s12-46",
    name: "Apple Watch Series 12 46mm",
    family: "Series",
    generation: "Series 12",
    year: 2026,
    seriesNumber: 12,
    caseSizesMm: [46],
    defaultCaseMm: 46,
    materials: ["aluminum", "titanium", "ceramic"],
    colours: ["dark-bronze", "light-gold", "black", "space-gray", "radiant-gold", "natural", "pearl-white", "night-blue"],
    defaultColour: "black",
    displayType: "Always-On Retina wide-angle OLED",
    alwaysOn: true,
    brightnessNits: null,
    chip: null,
    batteryHours: null,
    lowPowerHours: null,
    waterM: 50,
    depthGaugeM: 6,
    cellularAvailable: true,
    fiveG: null,
    dualFrequencyGps: null,
    health: healthFull,
    safety: safetyBase,
    doubleTap: true,
    wristFlick: true,
    fastCharging: true,
    weightG: 45,
    dimensionsMm: { w: 46, h: 40, d: 9.7 },
    tagline: "Bigger screen. Same Series health story.",
    whoItSuits: "People who want the largest Series face and easiest readability.",
    whyChoose: [
      "46 mm case for a larger Always-On display.",
      "Ceramic Night Blue reaches about 52.9 g - confirm before launch.",
      "Same health and safety features as 42 mm Series 12.",
    ],
    isNew: true,
    checkFinalSpecs: true,
    notes: "Case about 46 × 40 × 9.7 mm; ceramic about 9.85 mm. Check specs.",
    pageFamily: "Series",
  }),
  s({
    id: "watch-ultra-4",
    name: "Apple Watch Ultra 4",
    family: "Ultra",
    generation: "Ultra 4",
    year: 2026,
    caseSizesMm: [49],
    defaultCaseMm: 49,
    materials: ["titanium"],
    colours: ["natural", "black"],
    defaultColour: "natural",
    displayType: "Always-On Retina LTPO OLED",
    alwaysOn: true,
    brightnessNits: 3000,
    chip: null,
    batteryHours: null,
    lowPowerHours: null,
    waterM: 100,
    depthGaugeM: 40,
    cellularAvailable: true,
    fiveG: null,
    dualFrequencyGps: true,
    health: healthFull,
    safety: safetyUltra,
    doubleTap: true,
    wristFlick: true,
    fastCharging: true,
    weightG: 63,
    dimensionsMm: { w: 49, h: 44, d: 12 },
    tagline: "Built for the deep end.",
    whoItSuits: "Runners, divers and anyone who wants the brightest, longest-lasting Watch.",
    whyChoose: [
      "Brightest Ultra-class display - flag 3000 nits as check.",
      "100 m water resistance with depth gauge and siren.",
      "Action button and dual-frequency GPS for trail and open water.",
    ],
    isNew: true,
    checkFinalSpecs: true,
    notes: "About 49 × 44 × 12 mm, ~63 g. Check battery hours and charging.",
    pageFamily: "Ultra",
  }),
  s({
    id: "watch-se3-40",
    name: "Apple Watch SE 3 40mm",
    family: "SE",
    generation: "SE 3",
    year: 2025,
    caseSizesMm: [40],
    defaultCaseMm: 40,
    materials: ["aluminum"],
    colours: ["midnight", "starlight"],
    defaultColour: "midnight",
    displayType: "Retina LTPO OLED",
    alwaysOn: null,
    brightnessNits: 1000,
    chip: null,
    batteryHours: null,
    lowPowerHours: null,
    waterM: 50,
    depthGaugeM: null,
    cellularAvailable: true,
    fiveG: null,
    dualFrequencyGps: false,
    health: healthSe,
    safety: safetyBase,
    doubleTap: null,
    wristFlick: null,
    fastCharging: null,
    weightG: 30,
    dimensionsMm: { w: 40, h: 34, d: 10.7 },
    tagline: "Essential Watch. Lower price.",
    whoItSuits: "First Watch buyers, kids and anyone watching the budget.",
    whyChoose: [
      "Most affordable current Apple Watch.",
      "Core safety and activity tracking without the Series price.",
      "Always-On status on SE 3 - check final specs.",
    ],
    isNew: true,
    checkFinalSpecs: true,
    notes: "Check Always-On, chip, battery and health feature list before launch.",
    pageFamily: "SE",
  }),
  s({
    id: "watch-se3-44",
    name: "Apple Watch SE 3 44mm",
    family: "SE",
    generation: "SE 3",
    year: 2025,
    caseSizesMm: [44],
    defaultCaseMm: 44,
    materials: ["aluminum"],
    colours: ["midnight", "starlight"],
    defaultColour: "midnight",
    displayType: "Retina LTPO OLED",
    alwaysOn: null,
    brightnessNits: 1000,
    chip: null,
    batteryHours: null,
    lowPowerHours: null,
    waterM: 50,
    depthGaugeM: null,
    cellularAvailable: true,
    fiveG: null,
    dualFrequencyGps: false,
    health: healthSe,
    safety: safetyBase,
    doubleTap: null,
    wristFlick: null,
    fastCharging: null,
    weightG: 33,
    dimensionsMm: { w: 44, h: 38, d: 10.7 },
    tagline: "Essential Watch. Larger face.",
    whoItSuits: "Budget buyers who prefer a larger display.",
    whyChoose: [
      "44 mm SE 3 for easier reading.",
      "About 33 g Wi-Fi aluminum.",
      "Same SE feature set as 40 mm - check final specs.",
    ],
    isNew: true,
    checkFinalSpecs: true,
    notes: "Case about 44 × 38 × 10.7 mm.",
    pageFamily: "SE",
  }),

  // -- Series 11 - 6 --
  ...([
    ["watch-s11-42", "Series 11", 2025, 11, 42, ["jet-black", "rose-gold", "silver", "space-gray", "natural", "gold", "slate"], 45, { w: 42, h: 36, d: 9.7 }],
    ["watch-s11-46", "Series 11", 2025, 11, 46, ["jet-black", "rose-gold", "silver", "space-gray", "natural", "gold", "slate"], 50, { w: 46, h: 40, d: 9.7 }],
    ["watch-s10-42", "Series 10", 2024, 10, 42, ["jet-black", "rose-gold", "silver", "natural", "gold", "slate"], 40, { w: 42, h: 36, d: 9.7 }],
    ["watch-s10-46", "Series 10", 2024, 10, 46, ["jet-black", "rose-gold", "silver", "natural", "gold", "slate"], 45, { w: 46, h: 40, d: 9.7 }],
  ] as const).map(([id, gen, year, num, size, colours, weight, dim]) =>
    s({
      id: id as keyof typeof watchBasePricesKes,
      name: `Apple Watch ${gen} ${size}mm`,
      family: "Series",
      generation: gen,
      year,
      seriesNumber: num,
      caseSizesMm: [size],
      defaultCaseMm: size,
      materials: ["aluminum", "titanium"],
      colours: [...colours],
      defaultColour: colours[0],
      displayType: "Always-On Retina OLED",
      alwaysOn: true,
      brightnessNits: 2000,
      chip: null,
      batteryHours: 18,
      lowPowerHours: 36,
      waterM: 50,
      depthGaugeM: size >= 45 ? 6 : null,
      cellularAvailable: true,
      fiveG: null,
      dualFrequencyGps: null,
      health: healthSeriesOlder,
      safety: safetyBase,
      doubleTap: true,
      wristFlick: num >= 10,
      fastCharging: true,
      weightG: weight,
      dimensionsMm: dim,
      tagline: `${gen} - still a strong everyday Watch.`,
      whoItSuits: "Buyers who want recent Series features without the newest price.",
      whyChoose: [
        `Also in stock - ${gen} ${size} mm.`,
        "Always-On display and core health sensors.",
        "Check battery health on older units before you buy.",
      ],
      checkFinalSpecs: true,
      notes: "Also in stock. Confirm condition and Apple's compare figures.",
      pageFamily: "Series",
    }),
  ),

  ...([
    ["watch-s9-41", "Series 9", 2023, 9, 41, ["midnight", "starlight", "silver", "pink", "red", "ss-silver", "ss-gold", "ss-graphite"], ["aluminum", "stainless"] as WatchMaterial[], 32, { w: 41, h: 35, d: 10.7 }],
    ["watch-s9-45", "Series 9", 2023, 9, 45, ["midnight", "starlight", "silver", "pink", "red", "ss-silver", "ss-gold", "ss-graphite"], ["aluminum", "stainless"] as WatchMaterial[], 36, { w: 45, h: 38, d: 10.7 }],
    ["watch-s8-41", "Series 8", 2022, 8, 41, ["midnight", "starlight", "silver", "red", "ss-silver", "ss-gold", "ss-graphite"], ["aluminum", "stainless"] as WatchMaterial[], 28, { w: 41, h: 35, d: 10.7 }],
    ["watch-s8-45", "Series 8", 2022, 8, 45, ["midnight", "starlight", "silver", "red", "ss-silver", "ss-gold", "ss-graphite"], ["aluminum", "stainless"] as WatchMaterial[], 32, { w: 45, h: 38, d: 10.7 }],
    ["watch-s7-41", "Series 7", 2021, 7, 41, ["midnight", "starlight", "green", "blue", "red", "ss-silver", "ss-gold", "ss-graphite"], ["aluminum", "stainless", "titanium"] as WatchMaterial[], 24, { w: 41, h: 35, d: 10.7 }],
    ["watch-s7-45", "Series 7", 2021, 7, 45, ["midnight", "starlight", "green", "blue", "red", "ss-silver", "ss-gold", "ss-graphite"], ["aluminum", "stainless", "titanium"] as WatchMaterial[], 28, { w: 45, h: 38, d: 10.7 }],
    ["watch-s6-40", "Series 6", 2020, 6, 40, ["space-gray", "silver", "gold", "blue", "red", "ss-silver", "ss-gold", "ss-graphite", "natural"], ["aluminum", "stainless", "titanium"] as WatchMaterial[], 18, { w: 40, h: 34, d: 10.4 }],
    ["watch-s6-44", "Series 6", 2020, 6, 44, ["space-gray", "silver", "gold", "blue", "red", "ss-silver", "ss-gold", "ss-graphite", "natural"], ["aluminum", "stainless", "titanium"] as WatchMaterial[], 22, { w: 44, h: 38, d: 10.4 }],
  ] as const).map(([id, gen, year, num, size, colours, materials, weight, dim]) =>
    s({
      id: id as keyof typeof watchBasePricesKes,
      name: `Apple Watch ${gen} ${size}mm`,
      family: "Series",
      generation: gen,
      year,
      seriesNumber: num,
      caseSizesMm: [size],
      defaultCaseMm: size,
      materials: [...materials],
      colours: [...colours],
      defaultColour: colours[0],
      displayType: num >= 7 ? "Always-On Retina OLED" : "Always-On Retina OLED",
      alwaysOn: true,
      brightnessNits: num >= 9 ? 2000 : num >= 7 ? 1000 : 1000,
      chip: null,
      batteryHours: 18,
      lowPowerHours: null,
      waterM: 50,
      depthGaugeM: null,
      cellularAvailable: true,
      fiveG: false,
      dualFrequencyGps: false,
      health: { ...healthSeriesOlder, bloodOxygen: num >= 6, wristTemperature: num >= 8 },
      safety: { ...safetyBase, crashDetection: num >= 8 },
      doubleTap: num >= 9,
      wristFlick: false,
      fastCharging: num >= 7,
      weightG: weight,
      dimensionsMm: dim,
      tagline: `${gen} - also in stock.`,
      whoItSuits: "Value buyers who accept an older generation with condition notes.",
      whyChoose: [
        "Lower sample price than current Series.",
        "Confirm battery health and screen on the invoice.",
        "Overview-only photos for Series 6 - 8.",
      ],
      overviewOnly: num <= 8,
      checkFinalSpecs: true,
      notes: "Also in stock. Overview image only for Series 6 - 8. Check condition.",
      pageFamily: "Series",
    }),
  ),

  // -- SE 1 / 2 --
  ...([
    ["watch-se2-40", "SE 2", 2022, 40],
    ["watch-se2-44", "SE 2", 2022, 44],
    ["watch-se1-40", "SE", 2020, 40],
    ["watch-se1-44", "SE", 2020, 44],
  ] as const).map(([id, gen, year, size]) =>
    s({
      id: id as keyof typeof watchBasePricesKes,
      name: `Apple Watch ${gen} ${size}mm`,
      family: "SE",
      generation: gen,
      year,
      caseSizesMm: [size],
      defaultCaseMm: size,
      materials: ["aluminum"],
      colours: ["midnight", "starlight", "silver"],
      defaultColour: "midnight",
      displayType: "Retina LTPO OLED",
      alwaysOn: false,
      brightnessNits: 1000,
      chip: null,
      batteryHours: 18,
      lowPowerHours: null,
      waterM: 50,
      depthGaugeM: null,
      cellularAvailable: true,
      fiveG: false,
      dualFrequencyGps: false,
      health: healthSe,
      safety: { ...safetyBase, crashDetection: year >= 2022 },
      doubleTap: false,
      wristFlick: false,
      fastCharging: false,
      weightG: size === 40 ? 27 : 33,
      dimensionsMm: size === 40 ? { w: 40, h: 34, d: 10.7 } : { w: 44, h: 38, d: 10.7 },
      tagline: "Entry Watch - check condition.",
      whoItSuits: "Tightest budgets and first-time Watch buyers.",
      whyChoose: [
        "Lowest sample prices in the shop.",
        "No Always-On on older SE models.",
        "Confirm battery health before collect.",
      ],
      overviewOnly: true,
      checkFinalSpecs: true,
      notes: "Overview only. Check condition on older SE.",
      pageFamily: "SE",
    }),
  ),

  // -- Ultra 1 - 3 --
  ...([
    ["watch-ultra-3", "Ultra 3", 2025, ["natural", "black"]],
    ["watch-ultra-2", "Ultra 2", 2023, ["natural", "black"]],
    ["watch-ultra-1", "Ultra", 2022, ["natural"]],
  ] as const).map(([id, gen, year, colours]) =>
    s({
      id: id as keyof typeof watchBasePricesKes,
      name: `Apple Watch ${gen}`,
      family: "Ultra",
      generation: gen,
      year,
      caseSizesMm: [49],
      defaultCaseMm: 49,
      materials: ["titanium"],
      colours: [...colours],
      defaultColour: colours[0],
      displayType: "Always-On Retina LTPO OLED",
      alwaysOn: true,
      brightnessNits: year >= 2023 ? 3000 : 2000,
      chip: null,
      batteryHours: 36,
      lowPowerHours: 60,
      waterM: 100,
      depthGaugeM: 40,
      cellularAvailable: true,
      fiveG: null,
      dualFrequencyGps: true,
      health: healthSeriesOlder,
      safety: safetyUltra,
      doubleTap: year >= 2023,
      wristFlick: year >= 2025,
      fastCharging: true,
      weightG: 61,
      dimensionsMm: { w: 49, h: 44, d: 14.4 },
      tagline: `${gen} - adventure class.`,
      whoItSuits: "Outdoor athletes who do not need Ultra 4.",
      whyChoose: [
        "49 mm titanium with Action button lineage.",
        "100 m water resistance and siren.",
        year === 2022 ? "Ultra 1 is overview-only photography." : "Still a strong Ultra for trails and open water.",
      ],
      overviewOnly: year === 2022,
      checkFinalSpecs: true,
      notes: year === 2022 ? "Overview only for Ultra 1." : "Also in stock. Check battery claim.",
      pageFamily: "Ultra",
    }),
  ),

  // -- Hermès --
  s({
    id: "watch-s12-hermes-42",
    name: "Apple Watch Series 12 Hermès 42mm",
    family: "Hermès",
    generation: "Series 12 Hermès",
    year: 2026,
    seriesNumber: 12,
    caseSizesMm: [42],
    defaultCaseMm: 42,
    materials: ["titanium"],
    colours: ["natural", "radiant-gold"],
    defaultColour: "natural",
    displayType: "Always-On Retina wide-angle OLED",
    alwaysOn: true,
    brightnessNits: null,
    chip: null,
    batteryHours: null,
    lowPowerHours: null,
    waterM: 50,
    depthGaugeM: null,
    cellularAvailable: true,
    fiveG: null,
    dualFrequencyGps: null,
    health: healthFull,
    safety: safetyBase,
    doubleTap: true,
    wristFlick: true,
    fastCharging: true,
    weightG: null,
    dimensionsMm: { w: 42, h: 36, d: 9.7 },
    tagline: "Series 12 with Hermès exclusivity.",
    whoItSuits: "Buyers who want the Hermès band and watch faces.",
    whyChoose: [
      "Special band included - Hermès pack.",
      "Same Series 12 insides with premium finish.",
      "Price premium reflects the Hermès band.",
    ],
    isNew: true,
    specialBandIncluded: true,
    checkFinalSpecs: true,
    notes: "Special band included. Price premium line on the card.",
    pageFamily: "Hermès",
  }),
  s({
    id: "watch-s12-hermes-46",
    name: "Apple Watch Series 12 Hermès 46mm",
    family: "Hermès",
    generation: "Series 12 Hermès",
    year: 2026,
    seriesNumber: 12,
    caseSizesMm: [46],
    defaultCaseMm: 46,
    materials: ["titanium"],
    colours: ["natural", "radiant-gold"],
    defaultColour: "natural",
    displayType: "Always-On Retina wide-angle OLED",
    alwaysOn: true,
    brightnessNits: null,
    chip: null,
    batteryHours: null,
    lowPowerHours: null,
    waterM: 50,
    depthGaugeM: 6,
    cellularAvailable: true,
    fiveG: null,
    dualFrequencyGps: null,
    health: healthFull,
    safety: safetyBase,
    doubleTap: true,
    wristFlick: true,
    fastCharging: true,
    weightG: null,
    dimensionsMm: { w: 46, h: 40, d: 9.7 },
    tagline: "Larger Hermès Series 12.",
    whoItSuits: "Premium buyers who prefer the 46 mm face.",
    whyChoose: [
      "Special band included.",
      "46 mm Hermès edition.",
      "Ask for available Hermès band colours in store.",
    ],
    isNew: true,
    specialBandIncluded: true,
    checkFinalSpecs: true,
    notes: "Special band included.",
    pageFamily: "Hermès",
  }),
  s({
    id: "watch-ultra-4-hermes",
    name: "Apple Watch Ultra 4 Hermès",
    family: "Hermès",
    generation: "Ultra 4 Hermès",
    year: 2026,
    caseSizesMm: [49],
    defaultCaseMm: 49,
    materials: ["titanium"],
    colours: ["natural", "black"],
    defaultColour: "natural",
    displayType: "Always-On Retina LTPO OLED",
    alwaysOn: true,
    brightnessNits: 3000,
    chip: null,
    batteryHours: null,
    lowPowerHours: null,
    waterM: 100,
    depthGaugeM: 40,
    cellularAvailable: true,
    fiveG: null,
    dualFrequencyGps: true,
    health: healthFull,
    safety: safetyUltra,
    doubleTap: true,
    wristFlick: true,
    fastCharging: true,
    weightG: 63,
    dimensionsMm: { w: 49, h: 44, d: 12 },
    tagline: "Ultra capability. Hermès finish.",
    whoItSuits: "Adventure buyers who also want Hermès leather.",
    whyChoose: [
      "Special band included.",
      "Full Ultra 4 hardware.",
      "Highest sample price in the Watch shop.",
    ],
    isNew: true,
    specialBandIncluded: true,
    checkFinalSpecs: true,
    notes: "Special band included.",
    pageFamily: "Hermès",
  }),

  // -- Nike --
  ...([
    ["watch-s9-nike-41", "Series 9 Nike", 2023, 9, 41],
    ["watch-s9-nike-45", "Series 9 Nike", 2023, 9, 45],
    ["watch-s8-nike-41", "Series 8 Nike", 2022, 8, 41],
    ["watch-s8-nike-45", "Series 8 Nike", 2022, 8, 45],
    ["watch-s7-nike-41", "Series 7 Nike", 2021, 7, 41],
    ["watch-s7-nike-45", "Series 7 Nike", 2021, 7, 45],
    ["watch-s6-nike-40", "Series 6 Nike", 2020, 6, 40],
    ["watch-s6-nike-44", "Series 6 Nike", 2020, 6, 44],
  ] as const).map(([id, gen, year, num, size]) =>
    s({
      id: id as keyof typeof watchBasePricesKes,
      name: `Apple Watch ${gen} ${size}mm`,
      family: "Nike",
      generation: gen,
      year,
      seriesNumber: num,
      caseSizesMm: [size],
      defaultCaseMm: size,
      materials: ["aluminum"],
      colours: ["midnight", "starlight", "silver", "space-gray"],
      defaultColour: "midnight",
      displayType: "Always-On Retina OLED",
      alwaysOn: true,
      brightnessNits: num >= 9 ? 2000 : 1000,
      chip: null,
      batteryHours: 18,
      lowPowerHours: null,
      waterM: 50,
      depthGaugeM: null,
      cellularAvailable: true,
      fiveG: false,
      dualFrequencyGps: false,
      health: healthSeriesOlder,
      safety: { ...safetyBase, crashDetection: num >= 8 },
      doubleTap: num >= 9,
      wristFlick: false,
      fastCharging: num >= 7,
      weightG: null,
      dimensionsMm: null,
      tagline: "Nike edition - special band included.",
      whoItSuits: "Runners who want Nike Sport Band or Loop in the box.",
      whyChoose: [
        "Special band included - Nike Sport Band or Loop.",
        "Same Series hardware for that generation.",
        "Overview photos for older Nike editions.",
      ],
      specialBandIncluded: true,
      overviewOnly: num <= 8,
      checkFinalSpecs: true,
      notes: "Special band included. Check condition on older Nike models.",
      pageFamily: "Nike",
    }),
  ),
];

export function getWatchModel(id: string): WatchModel | undefined {
  return watchModels.find((m) => m.id === id);
}

export function watchModelsByFamily(family: WatchFamily): WatchModel[] {
  return watchModels.filter((m) => m.family === family);
}

export function lowestWatchPrice(family?: WatchFamily): number {
  const pool = family ? watchModelsByFamily(family) : watchModels;
  return Math.min(...pool.map((m) => m.basePriceKes));
}

export function watchSubline(model: WatchModel): string {
  const size = `${model.defaultCaseMm} mm`;
  const mat = model.materials[0];
  return `${model.generation} · ${size} · ${mat}`;
}

export function currentLineup(): WatchModel[] {
  return watchModels.filter((m) => m.isNew || m.year >= 2025);
}

export function earlierModels(): WatchModel[] {
  return watchModels.filter((m) => !m.isNew && m.year < 2025);
}
