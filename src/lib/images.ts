/**
 * Owner-supplied pack imagery.
 * MacBook merchandising uses the real .jpg select shots under
 * Gadget_Hub_MacBook_1_Products_and_Colours/01_Product_photos/{MacBook_Air,MacBook_Pro}/…
 */

const ROOT = "/Gadget_Hub_Images";
const MAC1 = "/Gadget_Hub_MacBook_1_Products_and_Colours/01_Product_photos";

/** Confirmed .jpg select shots from the MacBook product pack (not .jpeg) */
export const macProductPhotos = {
  air13M3: {
    midnight: `${MAC1}/MacBook_Air/Air_13in_M3_2024/mba13-midnight-select-202402.jpg`,
    silver: `${MAC1}/MacBook_Air/Air_13in_M3_2024/mba13-silver-select-202402.jpg`,
    spaceGray: `${MAC1}/MacBook_Air/Air_13in_M3_2024/mba13-spacegray-select-202402.jpg`,
    starlight: `${MAC1}/MacBook_Air/Air_13in_M3_2024/mba13-starlight-select-202402.jpg`,
  },
  air13M4: {
    midnight: `${MAC1}/MacBook_Air/Air_13in_M4_2025/mba13-midnight-select-202503.jpg`,
    silver: `${MAC1}/MacBook_Air/Air_13in_M4_2025/mba13-silver-select-202503.jpg`,
    skyBlue: `${MAC1}/MacBook_Air/Air_13in_M4_2025/mba13-skyblue-select-202503.jpg`,
    starlight: `${MAC1}/MacBook_Air/Air_13in_M4_2025/mba13-starlight-select-202503.jpg`,
  },
  air15M2: {
    midnight: `${MAC1}/MacBook_Air/Air_15in_M2_2023/mba15-midnight-select-202306.jpg`,
    silver: `${MAC1}/MacBook_Air/Air_15in_M2_2023/mba15-silver-select-202306.jpg`,
    spaceGray: `${MAC1}/MacBook_Air/Air_15in_M2_2023/mba15-spacegray-select-202306.jpg`,
    starlight: `${MAC1}/MacBook_Air/Air_15in_M2_2023/mba15-starlight-select-202306.jpg`,
  },
  air15M4: {
    midnight: `${MAC1}/MacBook_Air/Air_15in_M4_2025/mba15-midnight-select-202503.jpg`,
    silver: `${MAC1}/MacBook_Air/Air_15in_M4_2025/mba15-silver-select-202503.jpg`,
    skyBlue: `${MAC1}/MacBook_Air/Air_15in_M4_2025/mba15-skyblue-select-202503.jpg`,
    starlight: `${MAC1}/MacBook_Air/Air_15in_M4_2025/mba15-starlight-select-202503.jpg`,
  },
  airM1Chassis: {
    gold: `${MAC1}/MacBook_Air/Air_2018-2020_chassis_(M1_2020_same_design)/macbook-air-gold-select-201810.jpg`,
    silver: `${MAC1}/MacBook_Air/Air_2018-2020_chassis_(M1_2020_same_design)/macbook-air-silver-select-201810.jpg`,
    spaceGray: `${MAC1}/MacBook_Air/Air_2018-2020_chassis_(M1_2020_same_design)/macbook-air-space-gray-select-201810.jpg`,
  },
  pro13M1: {
    silver: `${MAC1}/MacBook_Pro/Pro_13in_M1_2020/mbp-silver-select-202011.jpg`,
    spaceGray: `${MAC1}/MacBook_Pro/Pro_13in_M1_2020/mbp-spacegray-select-202011.jpg`,
  },
  pro13M2: {
    silver: `${MAC1}/MacBook_Pro/Pro_13in_M2_2022/mbp-silver-select-202206.jpg`,
    spaceGray: `${MAC1}/MacBook_Pro/Pro_13in_M2_2022/mbp-spacegray-select-202206.jpg`,
  },
  pro14M1: {
    silver: `${MAC1}/MacBook_Pro/Pro_14in_16in_M1_Pro_Max_2021/mbp14-silver-select-202110.jpg`,
    spaceGray: `${MAC1}/MacBook_Pro/Pro_14in_16in_M1_Pro_Max_2021/mbp14-spacegray-select-202110.jpg`,
  },
  pro14M2: {
    silver: `${MAC1}/MacBook_Pro/Pro_14in_16in_M2_Pro_Max_2023/mbp14-silver-select-202301.jpg`,
    spaceGray: `${MAC1}/MacBook_Pro/Pro_14in_16in_M2_Pro_Max_2023/mbp14-spacegray-select-202301.jpg`,
  },
  pro14M3: {
    silver: `${MAC1}/MacBook_Pro/Pro_14in_16in_M3_family_2023/mbp14-silver-select-202310.jpg`,
    spaceGray: `${MAC1}/MacBook_Pro/Pro_14in_16in_M3_family_2023/mbp14-spacegray-select-202310.jpg`,
  },
  pro14M4: {
    silver: `${MAC1}/MacBook_Pro/Pro_14in_16in_M4_family_2024/mbp14-silver-select-202410.jpg`,
    spaceBlack: `${MAC1}/MacBook_Pro/Pro_14in_16in_M4_family_2024/mbp14-spaceblack-select-202410.jpg`,
  },
  pro16M4: {
    silver: `${MAC1}/MacBook_Pro/Pro_14in_16in_M4_family_2024/mbp16-silver-select-202410.jpg`,
    spaceBlack: `${MAC1}/MacBook_Pro/Pro_14in_16in_M4_family_2024/mbp16-spaceblack-select-202410.jpg`,
  },
} as const;

export const ghImages = {
  iphone: {
    proBlue: `${ROOT}/01_iPhones/iphone_pro-3cam_blue_angle.jpg`,
    proSilver: `${ROOT}/01_iPhones/iphone_pro-3cam_silver_back-and-side.jpg`,
    cam2Pink: `${ROOT}/01_iPhones/iphone_2cam_pink_angle.jpg`,
    cam2Teal: `${ROOT}/01_iPhones/iphone_2cam_teal_back-lower.jpg`,
    cam2Blue: `${ROOT}/01_iPhones/iphone_2cam_blue_angle.jpg`,
    cam2Green: `${ROOT}/01_iPhones/iphone_2cam_green_back-and-side.jpg`,
    lineup: `${ROOT}/01_iPhones/iphone_lineup_five-colours.jpg`,
    thinSide: `${ROOT}/01_iPhones/iphone_thin-side-view_with-finger.jpg`,
    fanColours: `${ROOT}/01_iPhones/iphone_fan-of-colours_side.png`,
    singleCamPink: `${ROOT}/01_iPhones/iphone_single-camera_pink-stack.png`,
  },
  accessories: {
    magsafeCharger: `${ROOT}/02_Cases_and_Accessories/accessory_magsafe-charger_with-wallet-case.jpg`,
    casesMagSafe: `${ROOT}/02_Cases_and_Accessories/case_ultramarine-black-clear_magsafe.jpg`,
    casesSilicone: `${ROOT}/02_Cases_and_Accessories/case_cream-green-blue_silicone-strap.jpg`,
    batteryPack: `${ROOT}/02_Cases_and_Accessories/accessory_magsafe-battery-pack.jpg`,
    crossbody: `${ROOT}/02_Cases_and_Accessories/accessory_crossbody-strap.jpg`,
    airtag: `${ROOT}/02_Cases_and_Accessories/accessory_airtag.png`,
    applePencil: `${ROOT}/02_Cases_and_Accessories/accessory_apple-pencil_with-ipads.png`,
  },
  duo: {
    foldTop: `${ROOT}/03_iPhone_Duo_foldable/duo_fold-top_library-screen.jpg`,
    openCamera: `${ROOT}/03_iPhone_Duo_foldable/duo_open-camera-screen.jpg`,
    standCase: `${ROOT}/03_iPhone_Duo_foldable/duo_stand-case_dark-green.jpg`,
  },
  mac: {
    air: macProductPhotos.air13M4.skyBlue,
    air13M3: macProductPhotos.air13M3.midnight,
    air13M4: macProductPhotos.air13M4.skyBlue,
    air15M2: macProductPhotos.air15M2.starlight,
    air15M4: macProductPhotos.air15M4.midnight,
    pro: macProductPhotos.pro14M4.spaceBlack,
    pro13M2: macProductPhotos.pro13M2.spaceGray,
    pro14M3: macProductPhotos.pro14M3.silver,
    pro14M4: macProductPhotos.pro14M4.spaceBlack,
    pro16M4: macProductPhotos.pro16M4.spaceBlack,
    neo: `${ROOT}/04_Mac/macbook-neo_yellow_in-hand.png`,
    imac: `${ROOT}/04_Mac/imac_colour-range.png`,
    mini: `${ROOT}/04_Mac/mac-mini_in-hand.jpg`,
  },
  ipad: {
    air: "/Gadget_Hub_iPad_1_Product_photos/01_Product_photos/iPad_Air_11in_and_13in_M2_M3_M4_(same_design)/ipad-air-select-11in-wifi-blue-202405.jpg",
    pro: "/Gadget_Hub_iPad_1_Product_photos/01_Product_photos/iPad_Pro_11in_and_13in_M4_M5_(same_design)/ipad-pro-11-select-wificell-spaceblack-202405.jpg",
    mini: "/Gadget_Hub_iPad_1_Product_photos/01_Product_photos/iPad_mini_A17_Pro_2024/ipad-mini-select-wifi-spacegray-202410.jpg",
  },
  watchAirPods: {
    watch:
      "/Gadget_Hub_Watch_1_Product_photos_and_swatches_part1/01_Product_photos/Series_12_2026/s12-case-unselect-gallery-1-202609.jpg",
    airpodsPro:
      "/Gadget_Hub_AirPods_1_Product_photos_cases_and_compare/01_Product_photos/AirPods_4_and_Pro_2_(2024)/airpods-pro-2-hero-select-202409.jpg",
    airpodsFamily: `${ROOT}/06_Watch_and_AirPods/airpods_family.jpg`,
    airpods4:
      "/Gadget_Hub_AirPods_1_Product_photos_cases_and_compare/01_Product_photos/AirPods_4_and_Pro_2_(2024)/airpods-4-hero-select-202409.jpg",
    airpodsMax: `${ROOT}/06_Watch_and_AirPods/airpods-max_colourful.png`,
  },
  logo: `${ROOT}/07_Logo/gadget-hub-logo_supplied.jpg`,
} as const;
