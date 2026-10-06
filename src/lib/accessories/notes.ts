/**
 * Buying notes, FAQ, quiz helpers for Accessories.
 */

import type { Accessory } from "./models";
import { accessories, pencils, keyboards } from "./models";
import { pencilFits, keyboardFits } from "./fits";

export function accessoryBuyingNotes(product: Accessory): { title: string; body: string }[] {
  const notes: { title: string; body: string }[] = [];
  if (product.group === "pencil") {
    notes.push({
      title: "Which Pencil",
      body: "Pro has squeeze, barrel roll and Find My. USB-C has no pressure sensitivity. 2nd gen and Pro charge magnetically. 1st gen needs Lightning or an adapter on USB-C iPads.",
    });
  } else if (product.group === "mouse" || product.group === "trackpad") {
    notes.push({
      title: product.group === "mouse" ? "Magic Mouse" : "Magic Trackpad",
      body:
        product.group === "mouse"
          ? "Swipe and scroll on the surface — charging port is on the underside. Works with Mac and supported iPads over Bluetooth; gestures are limited on iPad."
          : "Force Touch and the full Mac gesture set on a large glass surface. USB-C port on the back edge — confirm charging while in use.",
    });
  } else if (product.group === "power") {
    notes.push({
      title: "Power",
      body: "Match the adapter to the device. Too weak works but is slower. Do not mix a low-rated cable with a high-rated adapter. No charge-time claims on this site.",
    });
    notes.push({
      title: "Plug shape",
      body: "Photos may show a different plug from the one in your box. We confirm the plug before you collect.",
    });
  } else if (product.group === "cases") {
    notes.push({
      title: "Fit",
      body: "Cases are made for one exact model. Tell us your iPhone or iPad and we check before you pay.",
    });
    notes.push({
      title: "MagSafe",
      body: "MagSafe cases work with MagSafe chargers on supported iPhones — check. Strap pairing is owner-to-confirm.",
    });
  } else {
    notes.push({
      title: "Which keyboard",
      body: "Match the exact iPad size and chip, or pick a Mac keyboard. Thickness, trackpad and price differ — use the finder.",
    });
  }
  notes.push(
    {
      title: "Fit",
      body: "A wrong accessory is the most common regret. Tell us your exact iPad or Mac model and we check before you pay.",
    },
    {
      title: "Age and support",
      body: "Older accessories work with older devices; check Apple's list. Do not assume software support length.",
    },
    {
      title: "Authenticity",
      body: "Counterfeit Pencils and keyboards exist. Ours are sealed with the serial on the invoice. Check coverage on Apple's site.",
    },
    {
      title: "Set-up",
      body: "We pair your Pencil or keyboard and test it before you collect. Fee — owner to confirm.",
    },
  );
  return notes;
}

export function accessoryFaq(): { q: string; a: string }[] {
  return [
    { q: "Which Apple Pencil works with my iPad?", a: "Use the finder on this site, then confirm on Apple's compatibility list. Pencil Pro needs newer Pro, Air and mini models." },
    { q: "Which case fits my iPhone?", a: "Cases are made for one exact model. An iPhone 17 case does not fit iPhone 17 Pro. Use the Cases finder." },
    { q: "Does the iPhone 17 case fit the 17 Pro?", a: "No. Each Silicone and Clear case is model-specific." },
    { q: "Which charger is right for my iPhone?", a: "A 20W or higher USB-C adapter with a USB-C cable, plus optional MagSafe on supported models — check Apple's list. No charge-time claims here." },
    { q: "Can I use a MacBook charger on my iPhone?", a: "USB-C MacBook adapters can charge an iPhone; match cable and confirm with the shop. Wattage above need is fine; too low is slower." },
    { q: "What is MagSafe?", a: "Magnetic alignment for charging and accessories on supported iPhones and MagSafe cases — check." },
    { q: "Do cases work with MagSafe chargers?", a: "MagSafe cases are designed to work with MagSafe chargers — confirm for your model." },
    { q: "Which cable do I need for my MacBook?", a: "Use the Power finder. MagSafe 3 Macs need the USB-C to MagSafe 3 cable; USB-C charging needs a cable rated for the adapter." },
    { q: "Do you stock other brands?", a: "Not yet. We stock Apple's own cases and chargers. Ask on WhatsApp about Belkin, Anker, Spigen and similar." },
    { q: "Does my iPad come with a Pencil?", a: "No. The Pencil is sold separately." },
    { q: "Which Magic Keyboard fits my iPad?", a: "Pro, Air and Folio keyboards each fit specific iPads. Use the finder — Pro keyboards do not fit Air." },
    { q: "What do I get with the invoice?", a: "Sealed accessory, serial on the invoice. Warranty wording — owner to confirm." },
  ];
}

export function quizRecommend(answers: {
  use: "draw" | "type" | "both";
  device: string;
  budget: "low" | "mid" | "high";
}): { product: Accessory; reason: string }[] {
  const out: { product: Accessory; reason: string }[] = [];
  const isMac = /macbook|mac/.test(answers.device);

  if (answers.use === "draw" || answers.use === "both") {
    if (!isMac) {
      const pro = pencils().find((p) => p.id === "pencil-pro")!;
      const usbc = pencils().find((p) => p.id === "pencil-usbc")!;
      const fitPro = pencilFits(answers.device, "pencil-pro");
      if (fitPro.status === "fits" && answers.budget !== "low") {
        out.push({ product: pro, reason: "Drawing on a supported iPad — Pencil Pro." });
      } else {
        const fitUsb = pencilFits(answers.device, "pencil-usbc");
        if (fitUsb.status !== "no") out.push({ product: usbc, reason: fitUsb.reason });
        const p1 = pencils().find((p) => p.id === "pencil-1")!;
        const fit1 = pencilFits(answers.device, "pencil-1");
        if (fit1.status !== "no" && answers.budget === "low") {
          out.push({ product: p1, reason: fit1.reason });
        }
      }
    }
  }

  if (answers.use === "type" || answers.use === "both") {
    if (isMac) {
      const tid = keyboards().find((k) => k.id === "keyboard-mac-touchid")!;
      out.push({ product: tid, reason: keyboardFits(answers.device, tid.id).reason });
    } else {
      for (const k of keyboards().filter((x) => x.platform === "ipad")) {
        const fit = keyboardFits(answers.device, k.id);
        if (fit.status === "fits") {
          out.push({ product: k, reason: fit.reason });
          break;
        }
      }
    }
  }

  return out.slice(0, 3);
}

export const ACC_PENCIL_ROOT = "Accesories/ACC_Apple_Pencil_images";
export const ACC_KEYBOARD_ROOT = "Accesories/ACC_Magic_Keyboard_images";
