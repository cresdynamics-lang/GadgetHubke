/**
 * Owner-supplied / pack imagery under public/Gadget_Hub_Images.
 * Prefer these over inventing or mismatching product photos.
 * See public/Gadget_Hub_Images/READ_ME.txt for licensing notes.
 */

const ROOT = "/Gadget_Hub_Images";

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
    air: `${ROOT}/04_Mac/macbook-air_open_light-blue.jpg`,
    pro: `${ROOT}/04_Mac/macbook-pro_dark.jpg`,
    neo: `${ROOT}/04_Mac/macbook-neo_yellow_in-hand.png`,
    imac: `${ROOT}/04_Mac/imac_colour-range.png`,
    mini: `${ROOT}/04_Mac/mac-mini_in-hand.jpg`,
  },
  ipad: {
    air: `${ROOT}/05_iPad/ipad-air_blue.jpg`,
    pro: `${ROOT}/05_iPad/ipad-pro_black.jpg`,
    mini: `${ROOT}/05_iPad/ipad-mini_with-pencil_in-hands.png`,
  },
  watchAirPods: {
    watch: `${ROOT}/06_Watch_and_AirPods/apple-watch_three-styles.jpg`,
    airpodsPro: `${ROOT}/06_Watch_and_AirPods/airpods-pro.jpg`,
    airpodsFamily: `${ROOT}/06_Watch_and_AirPods/airpods_family.jpg`,
    airpods4: `${ROOT}/06_Watch_and_AirPods/airpods-4.png`,
    airpodsMax: `${ROOT}/06_Watch_and_AirPods/airpods-max_colourful.png`,
  },
  logo: `${ROOT}/07_Logo/gadget-hub-logo_supplied.jpg`,
} as const;
