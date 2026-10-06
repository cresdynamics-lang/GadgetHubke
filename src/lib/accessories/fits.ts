/**
 * Compatibility: pencilFits / keyboardFits.
 * Results: fits | note | no — with a one-line reason.
 * Owner: re-verify every rule on Apple's compatibility list before launch.
 */

import { accessories, getAccessory, type Accessory } from "./models";

export type FitResult = {
  status: "fits" | "note" | "no";
  reason: string;
  checkFinalSpecs: true;
};

function ipadMeta(id: string) {
  const lower = id.toLowerCase();
  return {
    isPro: /ipad-pro/.test(lower),
    isAir: /ipad-air/.test(lower),
    isMini: /ipad-mini/.test(lower),
    isStd: /^ipad-\d|^ipad-a16/.test(lower) || lower === "ipad-8" || lower === "ipad-9" || lower === "ipad-10" || lower === "ipad-a16",
    chip: lower.includes("m5")
      ? "M5"
      : lower.includes("m4")
        ? "M4"
        : lower.includes("m3")
          ? "M3"
          : lower.includes("m2")
            ? "M2"
            : lower.includes("m1")
              ? "M1"
              : lower.includes("a17")
                ? "A17"
                : lower.includes("a16")
                  ? "A16"
                  : "other",
    size13: /13|12-9|12\.9/.test(lower),
    size11: /11/.test(lower) && !/13/.test(lower),
    is10th: lower === "ipad-10",
    isA16: lower === "ipad-a16",
    isMini6: lower === "ipad-mini-6",
    isMiniA17: lower === "ipad-mini-a17-pro",
    isAir4: lower === "ipad-air-4",
    isAir5: lower === "ipad-air-5",
    isPro2018to2022:
      /ipad-pro-(11|12-9)-(2020|m1|m2)/.test(lower) ||
      /ipad-pro-11-2020|ipad-pro-12-9-2020/.test(lower),
    gen8or9: lower === "ipad-8" || lower === "ipad-9",
  };
}

function macIsAppleSilicon(id: string): boolean {
  // Catalog is Apple silicon only (M1–M5). Intel not in catalog — treat unknown as note.
  return /m[1-5]|apple.?silicon/i.test(id);
}

/** pencilFits(ipadModelId, pencilId) */
export function pencilFits(ipadModelId: string, pencilId: string): FitResult {
  const pencil = getAccessory(pencilId);
  if (!pencil || pencil.group !== "pencil") {
    return { status: "no", reason: "Unknown Pencil.", checkFinalSpecs: true };
  }
  const d = ipadMeta(ipadModelId);

  if (pencilId === "pencil-pro") {
    const ok =
      (d.isPro && (d.chip === "M4" || d.chip === "M5")) ||
      (d.isAir && (d.chip === "M2" || d.chip === "M3" || d.chip === "M4")) ||
      d.isMiniA17;
    if (ok) {
      return {
        status: "fits",
        reason: "Listed for Pencil Pro on supported iPad Pro M4+, Air M2+ and mini A17 Pro — check Apple's list.",
        checkFinalSpecs: true,
      };
    }
    return {
      status: "no",
      reason: "Pencil Pro does not fit this iPad per Apple's published list (check).",
      checkFinalSpecs: true,
    };
  }

  if (pencilId === "pencil-usbc") {
    // USB-C Pencil: many recent iPads — exclude only clear non-fits; flag check
    if (d.gen8or9) {
      return {
        status: "no",
        reason: "USB-C Pencil is not listed for this older Lightning iPad (check Apple's list).",
        checkFinalSpecs: true,
      };
    }
    if (d.isPro2018to2022 && d.chip !== "M2") {
      return {
        status: "note",
        reason: "Confirm USB-C Pencil support for this Pro generation on Apple's list.",
        checkFinalSpecs: true,
      };
    }
    return {
      status: "fits",
      reason: "USB-C Pencil is listed for many recent iPads — confirm this model on Apple's list.",
      checkFinalSpecs: true,
    };
  }

  if (pencilId === "pencil-2") {
    const ok =
      d.isPro2018to2022 ||
      d.isAir4 ||
      d.isAir5 ||
      d.isMini6 ||
      (d.isPro && (d.chip === "M1" || d.chip === "M2"));
    if (ok) {
      return {
        status: "fits",
        reason: "2nd-generation Pencil fits 2018–2022 Pro, Air 4/5 and mini 6 — check Apple's list.",
        checkFinalSpecs: true,
      };
    }
    return {
      status: "no",
      reason: "2nd-generation Pencil does not fit this iPad (use Pencil Pro or USB-C where listed).",
      checkFinalSpecs: true,
    };
  }

  if (pencilId === "pencil-1") {
    if (d.is10th || d.isA16) {
      return {
        status: "note",
        reason: "Fits with the USB-C to Apple Pencil adapter on iPad 10th gen and iPad A16 — check Apple's list.",
        checkFinalSpecs: true,
      };
    }
    if (d.gen8or9 || /ipad-[67]/.test(ipadModelId)) {
      return {
        status: "fits",
        reason: "1st-generation Pencil fits this Lightning iPad — check Apple's list.",
        checkFinalSpecs: true,
      };
    }
    return {
      status: "no",
      reason: "1st-generation Pencil does not fit this iPad without the correct adapter path (check).",
      checkFinalSpecs: true,
    };
  }

  return { status: "no", reason: "Unknown Pencil.", checkFinalSpecs: true };
}

/** keyboardFits(deviceModelId, keyboardId) — iPad or Mac */
export function keyboardFits(deviceModelId: string, keyboardId: string): FitResult {
  const kb = getAccessory(keyboardId);
  if (!kb || kb.group !== "keyboard") {
    return { status: "no", reason: "Unknown keyboard.", checkFinalSpecs: true };
  }

  const isMac = /macbook|imac|mac-mini|mac-studio|mac-pro|^mac/.test(deviceModelId);

  if (kb.platform === "mac" || (kb.platform === "both" && isMac)) {
    if (!isMac) {
      return {
        status: "no",
        reason: "This is a Mac Magic Keyboard — not the iPad Magic Keyboard. Use Bluetooth on iPad only as a plain keyboard, not as a recommended iPad fit.",
        checkFinalSpecs: true,
      };
    }
    if (kb.touchId) {
      if (macIsAppleSilicon(deviceModelId)) {
        return {
          status: "fits",
          reason: "Magic Keyboard with Touch ID works on Apple silicon Macs — check Apple's list.",
          checkFinalSpecs: true,
        };
      }
      return {
        status: "note",
        reason: "Keyboard pairs over Bluetooth, but Touch ID will not work on Intel Macs.",
        checkFinalSpecs: true,
      };
    }
    return {
      status: "fits",
      reason: "Magic Keyboard works with any Mac over Bluetooth.",
      checkFinalSpecs: true,
    };
  }

  // iPad keyboards
  if (isMac) {
    return {
      status: "no",
      reason: "This Magic Keyboard is for iPad, not Mac.",
      checkFinalSpecs: true,
    };
  }

  const d = ipadMeta(deviceModelId);

  if (keyboardId === "keyboard-ipad-pro-11") {
    if (d.isPro && d.size11 && (d.chip === "M4" || d.chip === "M5")) {
      return { status: "fits", reason: "Fits iPad Pro 11-inch M4 and later — check.", checkFinalSpecs: true };
    }
    return { status: "no", reason: "Only for iPad Pro 11-inch M4 and later.", checkFinalSpecs: true };
  }
  if (keyboardId === "keyboard-ipad-pro-13") {
    if (d.isPro && d.size13 && (d.chip === "M4" || d.chip === "M5")) {
      return { status: "fits", reason: "Fits iPad Pro 13-inch M4 and later — check.", checkFinalSpecs: true };
    }
    return { status: "no", reason: "Only for iPad Pro 13-inch M4 and later.", checkFinalSpecs: true };
  }
  if (keyboardId === "keyboard-ipad-air-11") {
    if (d.isAir && d.size11 && ["M2", "M3", "M4"].includes(d.chip)) {
      return { status: "fits", reason: "Fits iPad Air 11-inch M2 and later — check.", checkFinalSpecs: true };
    }
    return { status: "no", reason: "Only for iPad Air 11-inch M2 and later.", checkFinalSpecs: true };
  }
  if (keyboardId === "keyboard-ipad-air-13") {
    if (d.isAir && d.size13 && ["M2", "M3", "M4"].includes(d.chip)) {
      return { status: "fits", reason: "Fits iPad Air 13-inch M2 and later — check.", checkFinalSpecs: true };
    }
    return { status: "no", reason: "Only for iPad Air 13-inch M2 and later.", checkFinalSpecs: true };
  }
  if (keyboardId === "keyboard-folio") {
    if (d.is10th || d.isA16) {
      return { status: "fits", reason: "Fits iPad 10th generation and iPad A16 — check.", checkFinalSpecs: true };
    }
    return { status: "no", reason: "Magic Keyboard Folio fits iPad 10th gen and A16 only.", checkFinalSpecs: true };
  }

  return { status: "no", reason: "No rule for this pair — check Apple's list.", checkFinalSpecs: true };
}

export function fitsLabel(result: FitResult): string {
  if (result.status === "fits") return "Fits";
  if (result.status === "note") return "Fits, but …";
  return "Does not fit";
}

export function accessoriesThatFitDevice(
  deviceModelId: string,
  group?: "pencil" | "keyboard" | "mouse" | "trackpad" | "power" | "cases",
): Accessory[] {
  return accessories.filter((a) => {
    if (group && a.group !== group) return false;
    if (a.stocked === false) return false;
    if (a.group === "pencil") return pencilFits(deviceModelId, a.id).status !== "no";
    if (a.group === "keyboard") return keyboardFits(deviceModelId, a.id).status !== "no";
    if (a.group === "mouse" || a.group === "trackpad") {
      return pointerFits(deviceModelId, a.id).status !== "no";
    }
    if (a.group === "cases") return caseFits(deviceModelId, a.id).status === "fits";
    if (a.group === "power") {
      return chargerAdvice(deviceModelId).some((x) => x.productId === a.id);
    }
    return false;
  });
}

/**
 * pointerFits(deviceModelId, productId) — Magic Mouse / Magic Trackpad.
 * Owner: re-verify every macOS / iPadOS / Windows / Android rule on Apple's lists before launch.
 */
export function pointerFits(deviceModelId: string, productId: string): FitResult {
  const product = getAccessory(productId);
  if (!product || (product.group !== "mouse" && product.group !== "trackpad")) {
    return { status: "no", reason: "Unknown pointer.", checkFinalSpecs: true };
  }

  const id = deviceModelId.toLowerCase();

  if (id === "windows-pc" || id === "windows") {
    return {
      status: "note",
      reason: "Works as a basic Bluetooth pointer on Windows; surface gestures do not work — check.",
      checkFinalSpecs: true,
    };
  }

  if (id === "android" || id === "android-phone" || id === "android-tablet") {
    // Owner choice: note for tablet-like, no for phone — use note with clear reason.
    if (id === "android-phone") {
      return {
        status: "note",
        reason: "May pair as a basic Bluetooth pointer on some Android phones; gestures do not work — check.",
        checkFinalSpecs: true,
      };
    }
    return {
      status: "note",
      reason: "May work as a basic Bluetooth pointer on Android; gestures do not work — check.",
      checkFinalSpecs: true,
    };
  }

  if (/iphone/.test(id)) {
    return {
      status: "note",
      reason: "iPhone pointer support is limited — confirm with the shop / Apple's list.",
      checkFinalSpecs: true,
    };
  }

  if (/macbook|imac|mac-mini|mac-studio|mac-pro|^mac|intel-mac/.test(id)) {
    return {
      status: "fits",
      reason: "Works over Bluetooth with Macs that meet Apple's macOS minimum — check Apple's list.",
      checkFinalSpecs: true,
    };
  }

  if (/ipad/.test(id)) {
    // iPadOS 13.4+ for supported iPads — older Lightning-only 8th/9th may still work; flag check
    if (/ipad-[67]$|ipad-mini-[45]|ipad-air-[123]$/.test(id)) {
      return {
        status: "note",
        reason: "Older iPad — confirm it runs a supported iPadOS for pointer use; gestures limited.",
        checkFinalSpecs: true,
      };
    }
    return {
      status: "note",
      reason: "Works as a pointer on supported iPads (iPadOS 13.4+); Mac gestures are limited on iPad — check.",
      checkFinalSpecs: true,
    };
  }

  return {
    status: "no",
    reason: "Device not in the shop list — check Apple's compatibility list.",
    checkFinalSpecs: true,
  };
}

/**
 * caseFits — exact model only. No "fits with note" for cases.
 * Owner: re-verify every folder-to-model mapping on apple.com before launch.
 */
export function caseFits(deviceModelId: string, caseFamilyId: string): FitResult {
  const product = getAccessory(caseFamilyId);
  if (!product || product.group !== "cases") {
    return { status: "no", reason: "Unknown case.", checkFinalSpecs: true };
  }

  const fits = product.fitsDeviceIds || [];
  if (product.subgroup === "strap") {
    return {
      status: "no",
      reason: "Strap-to-case pairing is owner-to-confirm — ask us which cases take this strap.",
      checkFinalSpecs: true,
    };
  }

  const id = normalizeDeviceId(deviceModelId);
  if (!fits.length) {
    return {
      status: "no",
      reason: "Fit list not confirmed for this item — ask the shop.",
      checkFinalSpecs: true,
    };
  }

  if (fits.includes(id)) {
    const label = product.fitsModels?.[0] || product.name;
    return {
      status: "fits",
      reason: `Made for ${label} only.`,
      checkFinalSpecs: true,
    };
  }

  const madeFor = (product.fitsModels || fits).join(", ");
  const asked = humanDevice(id);
  return {
    status: "no",
    reason: `This case is made for ${madeFor}, not ${asked}.`,
    checkFinalSpecs: true,
  };
}

function normalizeDeviceId(raw: string): string {
  const id = raw.toLowerCase().replace(/_/g, "-");
  if (id === "iphone-air" || id === "iphoneair") return "iphone-air";
  if (/iphone-17-pro-max/.test(id)) return "iphone-17-pro-max";
  if (/iphone-17-pro/.test(id)) return "iphone-17-pro";
  if (/iphone-17e/.test(id)) return "iphone-17e";
  if (/iphone-17$/.test(id) || id === "iphone-17") return "iphone-17";
  if (/iphone-18-pro-max/.test(id)) return "iphone-18-pro-max";
  if (/iphone-18-pro/.test(id)) return "iphone-18-pro";
  if (/ipad-air-11.*m4|ipad-air-11-m4/.test(id)) return "ipad-air-11-m4";
  if (/ipad-air-13.*m4|ipad-air-13-m4/.test(id)) return "ipad-air-13-m4";
  if (/ipad-pro-11.*m5|ipad-pro-11-m5/.test(id)) return "ipad-pro-11-m5";
  if (/ipad-pro-13.*m5|ipad-pro-13-m5/.test(id)) return "ipad-pro-13-m5";
  if (/ipad-mini.*a17|ipad-mini-a17/.test(id)) return "ipad-mini-a17-pro";
  if (/ipad-a16|ipad-11th|^ipad-a16$/.test(id)) return "ipad-a16";
  return id;
}

function humanDevice(id: string): string {
  return id.replace(/-/g, " ");
}

export type ChargerAdviceItem = {
  productId: string;
  role: "recommended" | "optional" | "note";
  reason: string;
  checkFinalSpecs: true;
};

/**
 * chargerAdvice(deviceModelId) — recommended adapters/cables/MagSafe.
 * Never invent charge times. Owner: re-verify every wattage on apple.com.
 */
export function chargerAdvice(deviceModelId: string): ChargerAdviceItem[] {
  const id = deviceModelId.toLowerCase();
  const out: ChargerAdviceItem[] = [];

  if (/iphone/.test(id)) {
    out.push({
      productId: "power-adapter-20w",
      role: "recommended",
      reason: "20W or higher USB-C adapter for iPhone — confirm Apple's recommended wattage.",
      checkFinalSpecs: true,
    });
    out.push({
      productId: "cable-usbc-60w-1m",
      role: "recommended",
      reason: "USB-C charge cable to pair with the adapter — check.",
      checkFinalSpecs: true,
    });
    if (!/iphone-[678]|iphone-x|iphone-11(?!\d)/.test(id)) {
      out.push({
        productId: "magsafe-charger-1m",
        role: "optional",
        reason: "MagSafe Charger for magnetic wireless charging on supported models — check.",
        checkFinalSpecs: true,
      });
    }
    return out;
  }

  if (/ipad/.test(id)) {
    const watt = /pro.*13|ipad-pro-13/.test(id) ? "power-adapter-35w-dual" : "power-adapter-20w";
    out.push({
      productId: watt,
      role: "recommended",
      reason: "Adapter wattage Apple recommends for this iPad — owner must confirm.",
      checkFinalSpecs: true,
    });
    out.push({
      productId: "cable-usbc-60w-1m",
      role: "recommended",
      reason: "USB-C charge cable — check.",
      checkFinalSpecs: true,
    });
    return out;
  }

  if (/macbook-air|mba/.test(id)) {
    out.push({
      productId: "power-adapter-70w",
      role: "recommended",
      reason: "70W-class adapter commonly paired with MacBook Air — confirm your SKU.",
      checkFinalSpecs: true,
    });
    out.push({
      productId: "cable-magsafe3-2m",
      role: "recommended",
      reason: "USB-C to MagSafe 3 cable for Macs with MagSafe 3 — check.",
      checkFinalSpecs: true,
    });
    out.push({
      productId: "cable-usbc-60w-1m",
      role: "optional",
      reason: "USB-C charge cable as an alternate path — check power rating vs adapter.",
      checkFinalSpecs: true,
    });
    return out;
  }

  if (/macbook-pro-16|mbp-16|16-inch/.test(id)) {
    out.push({
      productId: "power-adapter-140w",
      role: "recommended",
      reason: "140W adapter for many 16-inch MacBook Pro configs — confirm.",
      checkFinalSpecs: true,
    });
    out.push({
      productId: "cable-magsafe3-2m",
      role: "recommended",
      reason: "MagSafe 3 cable when the Mac has MagSafe 3 — check.",
      checkFinalSpecs: true,
    });
    out.push({
      productId: "cable-usbc-240w-2m",
      role: "optional",
      reason: "240W USB-C charge cable for high-power USB-C charging — check.",
      checkFinalSpecs: true,
    });
    return out;
  }

  if (/macbook-pro|mbp|macbook/.test(id)) {
    out.push({
      productId: "power-adapter-96w",
      role: "recommended",
      reason: "96W-class adapter for many 14-inch MacBook Pro configs — confirm your model.",
      checkFinalSpecs: true,
    });
    out.push({
      productId: "cable-magsafe3-2m",
      role: "recommended",
      reason: "USB-C to MagSafe 3 for MagSafe 3 ports — check.",
      checkFinalSpecs: true,
    });
    return out;
  }

  if (/watch|apple-watch/.test(id)) {
    out.push({
      productId: "watch-magnetic-charger-1m",
      role: "recommended",
      reason: "Apple Watch Magnetic Fast Charger to USB-C — confirm Watch model support.",
      checkFinalSpecs: true,
    });
    return out;
  }

  if (/airpods/.test(id)) {
    out.push({
      productId: "power-adapter-20w",
      role: "note",
      reason: "See the AirPods section for wireless / USB-C charging notes — not duplicated here.",
      checkFinalSpecs: true,
    });
    return out;
  }

  return [
    {
      productId: "power-adapter-20w",
      role: "note",
      reason: "Device not in the advice list — check Apple's compatibility list or ask us.",
      checkFinalSpecs: true,
    },
  ];
}

/** Gentle note when cable rating is below adapter wattage. */
export function pairingNote(adapterId: string, cableId: string): FitResult | null {
  const adapter = getAccessory(adapterId);
  const cable = getAccessory(cableId);
  if (!adapter || !cable) return null;
  const watts = adapter.wattage;
  const rating = cable.powerRatingW;
  if (watts == null || rating == null) return null;
  if (rating < watts) {
    return {
      status: "note",
      reason: `This ${rating}W cable is rated below the ${watts}W adapter — charging may be limited. Check Apple's guidance.`,
      checkFinalSpecs: true,
    };
  }
  return null;
}

export function fitsLabelExtended(result: FitResult | { role: string }): string {
  if ("role" in result) {
    if (result.role === "recommended") return "Recommended";
    if (result.role === "optional") return "Optional";
    return "Note";
  }
  return fitsLabel(result);
}
