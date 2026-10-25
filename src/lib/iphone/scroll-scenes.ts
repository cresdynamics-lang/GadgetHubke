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
  /** Omitted for image-only scenes. */
  videoLarge?: string;
  videoSmall?: string;
  start: string;
  end?: string;
  alt?: string;
  /** dark scenes get light text */
  tone: "dark" | "light" | "white";
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

/** Image-only scene from an Apple gallery image (no clip). */
function still(
  src: string,
  alt: string,
  copy: { eyebrow: string; title: string; body: string },
  tone: ScrollScene["tone"] = "white",
): ScrollScene {
  return { key: src, tone, ...copy, start: src, alt };
}

function pro17(modelId: "iphone-17-pro" | "iphone-17-pro-max"): ScrollScene[] {
  const m = getModel(modelId)!;
  const dir = modelId === "iphone-17-pro" ? "/iPhone-17-Pro/iphone-17pro" : "/iPhone-17-Pro-Max/iphone-17promax";
  const img = (n: number) => `${dir}-digitalmat-gallery-${n}-202509.webp`;
  return [
    still(img(1), `${m.name} in Silver, Cosmic Orange and Deep Blue`, {
      eyebrow: m.name,
      title: "Pro, in three bold finishes.",
      body: "Cosmic Orange, Deep Blue and Silver, with 256GB to start.",
    }),
    still(img(2), `${m.name} held in hand`, {
      eyebrow: "Display",
      title: `${m.displayInches}-inch ProMotion display.`,
      body: "Up to 120Hz for smooth scrolling, gaming and video.",
    }),
    still(img(4), `${m.name} camera close-up in Cosmic Orange`, {
      eyebrow: "Camera",
      title: "Three 48MP cameras.",
      body: "Fusion, Ultra Wide and Telephoto — sharp photos and Pro video from every lens.",
    }),
    still(img(3), `${m.name} in Deep Blue`, {
      eyebrow: "Performance",
      title: `${m.chip}.`,
      body: `Pro speed with up to ${m.batteryVideoHours} hours of video playback (Apple claim).`,
    }),
    still(img(5), `${m.name} in Silver, side profile`, {
      eyebrow: "Design",
      title: "Aluminium unibody.",
      body: "Ceramic Shield 2 on the front and IP68 water resistance.",
    }),
    still(img(6), `${m.name} with MagSafe cases`, {
      eyebrow: "Accessories",
      title: "Made for MagSafe.",
      body: "Snap on cases, chargers and wallets — all available at Gadget Hub.",
    }),
  ];
}


/** Apple Newsroom launch photos for iPhone 11–16e (one set per family, shared by mini / Plus / Max). */
type NewsroomScene = [tone: ScrollScene["tone"], eyebrow: string, title: string, body: string, alt: string];
const NEWSROOM: Record<string, NewsroomScene[]> = {
  "iphone-11": [
    ["white", "iPhone 11", "Six colours.", "Purple, yellow, green, black, white and (PRODUCT)RED.", "iPhone 11 in six colours"],
    ["white", "Durability", "Water resistant.", "IP68 rated, up to 2 m for 30 minutes (Apple claim).", "iPhone 11 phones splashed with water"],
    ["dark", "Camera", "Night mode.", "Brighter, clearer photos in low light — introduced on iPhone 11.", "Night mode photo comparison shot on iPhone 11"],
    ["light", "Camera", "Ultra Wide camera.", "Fit more in: landscapes, groups and tight spaces.", "Ultra Wide landscape photo shot on iPhone 11"],
    ["light", "Camera", "Portrait mode.", "Background blur for people — and pets.", "Portrait mode photo of a dog shot on iPhone 11"],
  ],
  "iphone-11-pro": [
    ["dark", "iPhone 11 Pro", "Triple-camera system.", "Wide, Ultra Wide and Telephoto, powered by the A13 Bionic chip.", "iPhone 11 Pro triple camera in Midnight Green"],
    ["white", "Finishes", "Four finishes.", "Midnight Green, Space Grey, Silver and Gold.", "iPhone 11 Pro in four finishes"],
    ["dark", "Design", "Textured matte glass.", "A matte glass back in a stainless steel frame.", "iPhone 11 Pro matte glass back close-up"],
    ["dark", "Performance", "A13 Bionic.", "Fast, efficient performance for photos, games and apps.", "Game running on iPhone 11 Pro"],
    ["light", "Camera", "Ultra Wide.", "Wider shots for groups, travel and architecture.", "Ultra Wide photo shot on iPhone 11 Pro"],
    ["dark", "Camera", "Night mode.", "Low-light photos without a flash.", "Night mode comparison shot on iPhone 11 Pro"],
  ],
  "iphone-12": [
    ["white", "iPhone 12", "A new flat-edge design.", "Ceramic Shield front and aluminium edges, with 5G.", "iPhone 12 front and back in red"],
    ["white", "Colours", "Bold colours.", "Blue, green, black, white and (PRODUCT)RED.", "iPhone 12 in blue"],
    ["white", "Display", "Super Retina XDR.", "An OLED display on the standard iPhone.", "iPhone 12 Super Retina XDR display"],
    ["white", "Durability", "IP68 water resistance.", "Up to 6 m for 30 minutes (Apple claim).", "iPhone 12 splashed with water"],
    ["white", "Camera", "Dual-camera system.", "Wide and Ultra Wide, with Night mode on both.", "iPhone 12 dual camera in black"],
  ],
  "iphone-12-pro": [
    ["dark", "iPhone 12 Pro", "5G and the A14 Bionic.", "A Pro camera system in a stainless steel design.", "iPhone 12 Pro in Pacific Blue"],
    ["dark", "Design", "Stainless steel.", "Gold, silver, graphite and Pacific Blue.", "iPhone 12 Pro in gold"],
    ["dark", "Finishes", "Pacific Blue.", "A deep blue with a polished steel band.", "iPhone 12 Pro in Pacific Blue, side view"],
    ["white", "Camera", "Pro camera system.", "Wide, Ultra Wide and Telephoto with a LiDAR Scanner.", "iPhone 12 Pro camera system"],
    ["dark", "Camera", "Night mode.", "Clean low-light photos, now on the Ultra Wide too.", "Night mode photo shot on iPhone 12 Pro"],
  ],
  "iphone-13": [
    ["white", "iPhone 13", "A15 Bionic, brighter display.", "And longer battery life than iPhone 12.", "iPhone 13 in pink"],
    ["white", "Colours", "Five colours.", "Pink, blue, midnight, starlight and (PRODUCT)RED.", "iPhone 13 in five colours"],
    ["white", "Display", "Super Retina XDR.", "Brighter outdoors for maps, video and photos.", "iPhone 13 display"],
    ["dark", "Camera", "Better low-light photos.", "A larger Wide sensor captures more light.", "Low-light portrait shot on iPhone 13"],
    ["dark", "Video", "Cinematic mode.", "Video that shifts focus automatically, like a film.", "Cinematic mode video on iPhone 13"],
  ],
  "iphone-13-pro": [
    ["white", "iPhone 13 Pro", "ProMotion, at last.", "A 120Hz display and the A15 Bionic chip.", "iPhone 13 Pro in Sierra Blue"],
    ["white", "Finishes", "Four finishes.", "Sierra Blue, Graphite, Gold and Silver.", "iPhone 13 Pro in four finishes"],
    ["white", "Camera", "Pro camera system.", "Telephoto, Wide and Ultra Wide cameras.", "iPhone 13 Pro camera system"],
    ["dark", "Camera", "Night skies.", "Night mode on every camera.", "Night sky photo shot on iPhone 13 Pro"],
    ["dark", "Camera", "Macro photography.", "Get as close as 2 cm with the Ultra Wide camera.", "Macro photo shot on iPhone 13 Pro"],
  ],
  "iphone-14": [
    ["white", "iPhone 14 and 14 Plus", "Two sizes.", "6.1 and 6.7 inches, with the A15 Bionic chip.", "iPhone 14 and iPhone 14 Plus in hand"],
    ["white", "Colours", "Five colours.", "Midnight, purple, starlight, blue and (PRODUCT)RED.", "iPhone 14 in five colours"],
    ["white", "Camera", "A bigger main camera.", "Better photos in low light.", "iPhone 14 dual camera close-up"],
    ["light", "Camera", "Sharper selfies.", "The TrueDepth front camera now has autofocus.", "Selfie shot on iPhone 14"],
    ["dark", "Camera", "Portraits.", "More detail in mid- to low-light photos.", "Portrait photo shot on iPhone 14"],
  ],
  "iphone-14-pro": [
    ["dark", "iPhone 14 Pro", "Dynamic Island.", "Plus the Always-On display and a 48MP Main camera.", "iPhone 14 Pro in Deep Purple"],
    ["white", "Finishes", "Space Black.", "Also in Silver, Gold and Deep Purple.", "iPhone 14 Pro in Space Black"],
    ["white", "Camera", "48MP Main camera.", "Detail you can crop into.", "iPhone 14 Pro camera system"],
    ["dark", "Camera", "Macro.", "Close-up shots from the Ultra Wide camera.", "Macro photo shot on iPhone 14 Pro"],
    ["dark", "Camera", "Low light.", "Cleaner photos when the lights go down.", "Low-light photo shot on iPhone 14 Pro"],
  ],
  "iphone-15": [
    ["white", "iPhone 15", "Dynamic Island and USB-C.", "Now on the standard iPhone.", "iPhone 15 in pink"],
    ["white", "Colours", "Five colours.", "Black, blue, green, yellow and pink.", "iPhone 15 in five colours"],
    ["white", "Design", "Colour-infused glass.", "A matte back with contoured edges.", "iPhone 15 front and back"],
    ["light", "Camera", "48MP Main camera.", "High-resolution photos and a 2× Telephoto option.", "48MP landscape photo shot on iPhone 15"],
    ["light", "Camera", "Next-generation portraits.", "Turn photos into portraits after you take them.", "Portrait photo of a dog shot on iPhone 15"],
  ],
  "iphone-15-pro": [
    ["dark", "iPhone 15 Pro", "Titanium.", "With the A17 Pro chip and the Action button.", "iPhone 15 Pro in Natural Titanium"],
    ["dark", "Finishes", "Four titanium finishes.", "Natural, Blue, White and Black Titanium.", "iPhone 15 Pro in four finishes"],
    ["dark", "Camera", "Pro camera system.", "48MP Main, Ultra Wide and Telephoto.", "iPhone 15 Pro camera system"],
    ["dark", "Design", "Lighter in the hand.", "An aerospace-grade titanium frame.", "iPhone 15 Pro titanium side"],
    ["light", "Camera", "Telephoto.", "5× on iPhone 15 Pro Max, 3× on iPhone 15 Pro.", "Telephoto photo of a swimmer shot on iPhone 15 Pro Max"],
  ],
  "iphone-16": [
    ["white", "iPhone 16", "Camera Control and A18.", "Built for Apple Intelligence.", "iPhone 16 in ultramarine"],
    ["white", "Colours", "Five bold colours.", "Black, white, pink, teal and ultramarine.", "iPhone 16 in five colours"],
    ["white", "Camera Control", "Click, slide, shoot.", "Open the camera with a click and slide to zoom.", "Using Camera Control on iPhone 16"],
    ["light", "Camera", "Macro photography.", "The Ultra Wide camera focuses up close.", "Macro photo of a frog shot on iPhone 16"],
    ["dark", "Camera", "48MP Fusion camera.", "Sharp detail with a 2× Telephoto option.", "Photo shot on iPhone 16 Fusion camera"],
  ],
  "iphone-16-pro": [
    ["dark", "iPhone 16 Pro", "Bigger displays, A18 Pro.", "6.3 and 6.9 inches with the thinnest borders on an iPhone at launch.", "iPhone 16 Pro in Desert Titanium"],
    ["dark", "Finishes", "Four titanium finishes.", "Desert, Natural, White and Black Titanium.", "iPhone 16 Pro in four finishes"],
    ["dark", "Camera", "Pro camera system.", "48MP Fusion, 48MP Ultra Wide and 5× Telephoto.", "iPhone 16 Pro camera system"],
    ["dark", "Camera", "48MP Ultra Wide.", "Macro and wide shots in high resolution.", "Macro photo shot on iPhone 16 Pro"],
    ["light", "Camera", "Photographic Styles.", "Fine-tune the look of every photo.", "Portrait shot on iPhone 16 Pro"],
  ],
  "iphone-16e": [
    ["white", "iPhone 16e", "A18 and a 48MP camera.", "In a 6.1-inch design.", "iPhone 16e front and back"],
    ["white", "Colours", "Black and white.", "Two matte finishes.", "iPhone 16e in black and white"],
    ["white", "Charging", "USB-C.", "The same cable as your Mac and iPad.", "iPhone 16e with USB-C cable"],
    ["light", "Camera", "48MP Fusion camera.", "Detailed photos with 2× Telephoto quality.", "Photo shot on iPhone 16e"],
    ["dark", "Camera", "Night mode.", "Clearer photos in low light.", "Night mode photo shot on iPhone 16e"],
  ],
};
const NEWSROOM_FAMILY: Record<string, string> = {
  "iphone-11": "iphone-11", "iphone-11-pro": "iphone-11-pro", "iphone-11-pro-max": "iphone-11-pro",
  "iphone-12": "iphone-12", "iphone-12-mini": "iphone-12", "iphone-12-pro": "iphone-12-pro", "iphone-12-pro-max": "iphone-12-pro",
  "iphone-13": "iphone-13", "iphone-13-mini": "iphone-13", "iphone-13-pro": "iphone-13-pro", "iphone-13-pro-max": "iphone-13-pro",
  "iphone-14": "iphone-14", "iphone-14-plus": "iphone-14", "iphone-14-pro": "iphone-14-pro", "iphone-14-pro-max": "iphone-14-pro",
  "iphone-15": "iphone-15", "iphone-15-plus": "iphone-15", "iphone-15-pro": "iphone-15-pro", "iphone-15-pro-max": "iphone-15-pro",
  "iphone-16": "iphone-16", "iphone-16-plus": "iphone-16", "iphone-16-pro": "iphone-16-pro", "iphone-16-pro-max": "iphone-16-pro",
  "iphone-16e": "iphone-16e",
};

function newsroomScenes(modelId: string): ScrollScene[] {
  const fam = NEWSROOM_FAMILY[modelId];
  const list = fam ? NEWSROOM[fam] : undefined;
  if (!list) return [];
  return list.map(([tone, eyebrow, title, body, alt], i) =>
    still(`${ROOT}/newsroom/${fam}/${i + 1}.webp`, alt, { eyebrow, title, body }, tone),
  );
}

const duoImg = (n: number) => `/iPhone-Duo/iphone-duo-digitalmat-gallery-${n}-202609.webp`;

const scenesById: Record<string, () => ScrollScene[]> = {
  "iphone-17-pro": () => pro17("iphone-17-pro"),
  "iphone-17-pro-max": () => pro17("iphone-17-pro-max"),
  "iphone-duo": () => [
    still(duoImg(1), "iPhone Duo folded and open", {
      eyebrow: "iPhone Duo",
      title: "An iPhone that unfolds.",
      body: "Fold it to phone size, open it for a much bigger screen.",
    }),
    still(duoImg(2), "iPhone Duo open in two hands", {
      eyebrow: "Open",
      title: "A big screen for apps.",
      body: "Open it up for reading, maps, video and two apps side by side.",
    }),
    still(duoImg(3), "iPhone Duo half-folded on a table playing a workout video", {
      eyebrow: "Half-folded",
      title: "It stands on its own.",
      body: "Half-fold it on a table for video calls, workouts and Netflix.",
    }),
    still(duoImg(4), "iPhone Duo dual camera close-up", {
      eyebrow: "Camera",
      title: "Dual camera.",
      body: "Ask us on WhatsApp for full camera details before you buy.",
    }),
    still(duoImg(6), "iPhone Duo in a case with a stand", {
      eyebrow: "Accessories",
      title: "Cases that stand it up.",
      body: "Ask about cases and chargers when you order.",
    }),
  ],
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
  return scenesById[modelId]?.() ?? newsroomScenes(modelId);
}
