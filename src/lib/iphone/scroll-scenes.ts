/**
 * Apple-style scroll scenes for iPhone model pages: a short clip that plays when
 * the scene scrolls into view, with Apple's start / end frames as poster and fallback.
 * Media: public/Gadget_Hub_iPhone_Scroll_Scenes/<pack>/<key>-{large,small}.mp4, -{start,end}.webp
 * Captions are ours, written from catalog facts.
 */
import { getModel } from "./models";

export type ScrollScene = {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  videoLarge: string;
  videoSmall?: string;
  start: string;
  end?: string;
  /** dark scenes get light text */
  tone: "dark" | "light";
};

const ROOT = "/Gadget_Hub_iPhone_Scroll_Scenes";

function scene(
  pack: string,
  key: string,
  tone: ScrollScene["tone"],
  copy: { eyebrow: string; title: string; body: string },
  opts: { small?: boolean; end?: boolean } = {},
): ScrollScene {
  const base = `${ROOT}/${pack}/${key}`;
  return {
    key,
    tone,
    ...copy,
    videoLarge: `${base}-large.mp4`,
    videoSmall: opts.small === false ? undefined : `${base}-small.mp4`,
    start: `${base}-start.webp`,
    end: opts.end === false ? undefined : `${base}-end.webp`,
  };
}

function pro18(modelId: "iphone-18-pro" | "iphone-18-pro-max"): ScrollScene[] {
  const m = getModel(modelId)!;
  const p = "iphone-18-pro";
  return [
    scene(p, "hero", "dark", {
      eyebrow: m.name,
      title: "The newest Pro iPhone.",
      body: `${m.chip}, the 48MP Pro Fusion camera system and a ${m.displayInches}-inch ProMotion display.`,
    }),
    scene(p, "camera", "dark", {
      eyebrow: "Camera",
      title: "48MP Pro Fusion camera system.",
      body: "Sharp low-light photos and Pro video — the phone people in Nairobi film events, content and client work on.",
    }),
    scene(p, "zoom", "light", {
      eyebrow: "Telephoto",
      title: "Get close from far away.",
      body: "Up to 8× zoom on the telephoto for stage shows, wildlife and match days.",
    }),
    scene(p, "chip", "dark", {
      eyebrow: "Performance",
      title: `${m.chip}.`,
      body: "Apple's newest Pro chip, kept cool for long gaming, editing and filming sessions.",
    }),
    scene(p, "battery", "dark", {
      eyebrow: "Battery",
      title: "Built for long days.",
      body: `Up to ${m.batteryVideoHours} hours of video playback (Apple claim) — fewer trips to the socket.`,
    }),
    scene(p, "colours", "dark", {
      eyebrow: "Finishes",
      title: "Pick your finish.",
      body: "See every colour from every angle in the gallery above, then choose storage and pay by M-Pesa.",
    }),
  ];
}

const scenesById: Record<string, () => ScrollScene[]> = {
  "iphone-18-pro": () => pro18("iphone-18-pro"),
  "iphone-18-pro-max": () => pro18("iphone-18-pro-max"),
  "iphone-17": () => [
    scene("iphone-17", "hero", "light", {
      eyebrow: "iPhone 17",
      title: "ProMotion comes to iPhone 17.",
      body: "A 6.3-inch display that refreshes up to 120Hz, the A19 chip and 256GB to start.",
    }, { small: false, end: false }),
    scene("iphone-17", "display", "light", {
      eyebrow: "Display",
      title: "Brighter, smoother, tougher.",
      body: "Ceramic Shield 2 on the front helps the screen shrug off daily drops and scratches.",
    }),
    scene("iphone-17", "front-camera", "light", {
      eyebrow: "Front camera",
      title: "18MP Center Stage.",
      body: "Group selfies and video calls widen automatically so everyone fits in the shot.",
    }),
    scene("iphone-17", "dual-capture", "light", {
      eyebrow: "Video",
      title: "Front and back, at once.",
      body: "Dual Capture records both cameras together — made for vlogs, TikTok and reaction videos.",
    }),
    scene("iphone-17", "chip", "light", {
      eyebrow: "Performance and battery",
      title: "A19 chip.",
      body: "Fast for gaming and editing, with up to 30 hours of video playback (Apple claim).",
    }),
  ],
  "iphone-air": () => [
    scene("iphone-air", "hero", "light", {
      eyebrow: "iPhone Air",
      title: "The thinnest iPhone ever.",
      body: "165 g, a 6.5-inch ProMotion display and the A19 Pro chip.",
    }),
    scene("iphone-air", "design", "light", {
      eyebrow: "Design",
      title: "Titanium, made thin.",
      body: "A titanium frame keeps iPhone Air strong at this thickness.",
    }),
    scene("iphone-air", "front-camera", "light", {
      eyebrow: "Front camera",
      title: "18MP Center Stage.",
      body: "Selfies and calls that widen to fit everyone, even when you hold the phone upright.",
    }),
    scene("iphone-air", "chip", "light", {
      eyebrow: "Performance",
      title: "A19 Pro inside.",
      body: "Pro-level speed in the lightest current iPhone.",
    }),
    scene("iphone-air", "selfie", "light", {
      eyebrow: "Camera",
      title: "Selfies that look like you.",
      body: "Better framing and detail from the new front camera.",
    }),
  ],
  "iphone-17e": () => [
    scene("iphone-17e", "hero", "light", {
      eyebrow: "iPhone 17e",
      title: "The current generation, for less.",
      body: "A19 chip, the 48MP Fusion camera and a 6.1-inch display.",
    }),
    scene("iphone-17e", "design", "light", {
      eyebrow: "Design",
      title: "Built for every day.",
      body: "IP68 water resistance and a durable design for life in and out of Nairobi.",
    }),
    scene("iphone-17e", "camera", "light", {
      eyebrow: "Camera",
      title: "48MP Fusion camera.",
      body: "Detailed photos, portraits and video from one capable camera.",
    }),
    scene("iphone-17e", "performance", "light", {
      eyebrow: "Performance",
      title: "A19 chip.",
      body: "Fast, efficient and ready for Apple Intelligence.",
    }),
    scene("iphone-17e", "magsafe", "light", {
      eyebrow: "MagSafe",
      title: "Snap on, charge up.",
      body: "Works with MagSafe chargers, wallets and stands.",
    }),
  ],
};

export function scrollScenesFor(modelId: string): ScrollScene[] {
  return scenesById[modelId]?.() ?? [];
}
