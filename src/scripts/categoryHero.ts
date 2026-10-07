/**
 * Single-clock CategoryHero playback.
 * Opacity/transform only. No mount/unmount of scenes.
 */

export type CategoryHeroOptions = {
  root: HTMLElement;
  sceneCount: number;
  sceneMs?: number;
  crossfadeMs?: number;
  colourSwapMs?: number;
  phoneMaxScenes?: number;
  phoneMq?: string;
};

type SceneLayer = HTMLElement;

const DEFAULT_SCENE_MS = 4000;
const DEFAULT_CROSSFADE_MS = 900;
const DEFAULT_COLOUR_MS = 800;

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function saveDataOn() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(c?.saveData);
}

/** Crossfade weight for scene i at time t within a loop of length loopMs. */
function sceneOpacity(
  t: number,
  index: number,
  sceneMs: number,
  crossfadeMs: number,
  sceneCount: number,
): number {
  const loopMs = sceneMs * sceneCount;
  const start = index * sceneMs;
  const end = start + sceneMs;
  // wrap time
  const tt = ((t % loopMs) + loopMs) % loopMs;

  // Active solid window: start .. end - crossfade
  // Fade in: start - crossfade .. start (from previous)
  // Fade out: end - crossfade .. end

  const fadeInStart = start - crossfadeMs;
  // Handle wrap for scene 0: fade-in starts near end of loop
  if (index === 0) {
    // Scene 0 solid: 0 .. sceneMs - crossfade
    // Fade out: sceneMs - crossfade .. sceneMs
    // Fade in from loop end: loopMs - crossfade .. loopMs / 0
    if (tt >= 0 && tt < sceneMs - crossfadeMs) return 1;
    if (tt >= sceneMs - crossfadeMs && tt < sceneMs) {
      return 1 - (tt - (sceneMs - crossfadeMs)) / crossfadeMs;
    }
    if (tt >= loopMs - crossfadeMs) {
      return (tt - (loopMs - crossfadeMs)) / crossfadeMs;
    }
    return 0;
  }

  if (tt >= start && tt < end - crossfadeMs) return 1;
  if (tt >= end - crossfadeMs && tt < end) {
    return 1 - (tt - (end - crossfadeMs)) / crossfadeMs;
  }
  if (tt >= fadeInStart && tt < start) {
    return (tt - fadeInStart) / crossfadeMs;
  }
  return 0;
}

function activeSceneIndex(t: number, sceneMs: number, sceneCount: number): number {
  const loopMs = sceneMs * sceneCount;
  const tt = ((t % loopMs) + loopMs) % loopMs;
  return Math.min(sceneCount - 1, Math.floor(tt / sceneMs));
}

function sceneLocalProgress(t: number, sceneMs: number, sceneCount: number, index: number): number {
  const loopMs = sceneMs * sceneCount;
  const tt = ((t % loopMs) + loopMs) % loopMs;
  const start = index * sceneMs;
  if (tt < start || tt >= start + sceneMs) return 0;
  return (tt - start) / sceneMs;
}

export function initCategoryHero(opts: CategoryHeroOptions) {
  const root = opts.root;
  const fullCount = opts.sceneCount;
  const sceneMs = opts.sceneMs ?? DEFAULT_SCENE_MS;
  const crossfadeMs = opts.crossfadeMs ?? DEFAULT_CROSSFADE_MS;
  const colourMs = opts.colourSwapMs ?? DEFAULT_COLOUR_MS;
  const phoneMax = opts.phoneMaxScenes ?? 3;
  const phoneMq = window.matchMedia(opts.phoneMq ?? "(max-width: 47.99rem)");

  const stage = root.querySelector<HTMLElement>("[data-ch-stage]");
  const layers = Array.from(root.querySelectorAll<SceneLayer>("[data-ch-scene]"));
  const titleEl = root.querySelector<HTMLElement>("[data-ch-title]");
  const subtitleEl = root.querySelector<HTMLElement>("[data-ch-subtitle]");
  const liveEl = root.querySelector<HTMLElement>("[data-ch-live]");
  const segments = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-ch-seg]"));
  const pauseBtn = root.querySelector<HTMLButtonElement>("[data-ch-pause]");
  const fills = Array.from(root.querySelectorAll<HTMLElement>("[data-ch-fill]"));

  const titles = layers.map((l) => l.dataset.title || "");
  const subtitles = layers.map((l) => l.dataset.subtitle || "");

  let sceneCount = fullCount;
  let elapsed = 0;
  let lastTs: number | null = null;
  let playing = true;
  let visible = true;
  let tabVisible = true;
  let raf = 0;
  let lastScene = -1;
  let stillMode = prefersReducedMotion() || (phoneMq.matches && saveDataOn());
  let colourTimer = 0;
  let colourIndex = 0;

  const syncSceneCount = () => {
    const next = phoneMq.matches ? Math.min(phoneMax, fullCount) : fullCount;
    if (next === sceneCount) return;
    const loopWas = sceneMs * sceneCount;
    const progress = loopWas ? (elapsed % loopWas) / loopWas : 0;
    sceneCount = next;
    elapsed = progress * sceneMs * sceneCount;
    root.dataset.sceneCount = String(sceneCount);
    segments.forEach((seg, i) => {
      seg.hidden = i >= sceneCount;
    });
    layers.forEach((layer, i) => {
      layer.hidden = i >= sceneCount;
    });
  };

  const setPlaying = (on: boolean) => {
    playing = on;
    root.dataset.playing = on ? "true" : "false";
    if (pauseBtn) {
      pauseBtn.setAttribute("aria-pressed", on ? "false" : "true");
      pauseBtn.setAttribute("aria-label", on ? "Pause hero" : "Play hero");
      pauseBtn.textContent = on ? "Pause" : "Play";
    }
  };

  const revealTitle = (text: string) => {
    if (!titleEl) return;
    titleEl.replaceChildren();
    if (stillMode) {
      titleEl.textContent = text;
      return;
    }
    const words = text.split(/\s+/).filter(Boolean);
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "ch__word";
      span.textContent = word + (i < words.length - 1 ? "\u00a0" : "");
      titleEl.appendChild(span);
      window.setTimeout(() => span.classList.add("is-on"), 90 * i);
    });
    if (subtitleEl) {
      subtitleEl.classList.remove("is-on");
      window.setTimeout(
        () => subtitleEl.classList.add("is-on"),
        90 * words.length + 300,
      );
    }
  };

  const updateColourSwap = (layer: HTMLElement, localT: number) => {
    const swaps = layer.querySelectorAll<HTMLElement>("[data-ch-swap]");
    if (swaps.length < 2) return;
    const idx = Math.floor(localT / colourMs) % swaps.length;
    if (idx === colourIndex && colourTimer) return;
    colourIndex = idx;
    colourTimer = 1;
    swaps.forEach((el, i) => {
      el.style.opacity = i === idx ? "1" : "0";
    });
    const name = swaps[idx]?.dataset.colour;
    if (name && subtitleEl && lastScene === Number(layer.dataset.index)) {
      subtitleEl.textContent = name;
    }
  };

  const applyMotion = (layer: HTMLElement, opacity: number, localProgress: number) => {
    const motion = layer.dataset.motion || "push-in";
    const img = layer.querySelector<HTMLElement>("[data-ch-motion]");
    if (!img) return;

    const active = opacity > 0.02;
    img.style.willChange = active && !stillMode ? "transform, opacity" : "auto";

    if (stillMode) {
      img.style.transform = "none";
      img.style.opacity = "1";
      return;
    }

    const p = clamp(localProgress, 0, 1);
    // Progress within the scene's visible window including fade-in
    let transform = "translate3d(0,0,0) scale(1)";
    let imgOpacity = 1;
    const tilt = Number(layer.dataset.tilt || "2");

    switch (motion) {
      case "push-in":
        transform = `translate3d(0,0,0) scale(${1 + 0.08 * p})`;
        break;
      case "zoom-out":
        transform = `translate3d(0,0,0) scale(${1.08 - 0.08 * p})`;
        break;
      case "pan":
        transform = `translate3d(${-3 * p}%,0,0) scale(1.03)`;
        break;
      case "rise":
      case "rise-tilt":
      case "rise-from-below": {
        const riseT = clamp(p / (1000 / DEFAULT_SCENE_MS), 0, 1);
        const y = 40 * (1 - riseT);
        const rot = motion === "rise-tilt" ? tilt * (1 - riseT) : 0;
        imgOpacity = riseT;
        transform = `translate3d(0,${y}px,0) rotate(${rot}deg) scale(1)`;
        break;
      }
      case "slide-right": {
        const t = clamp(p / 0.35, 0, 1);
        transform = `translate3d(${60 * (1 - t)}px,0,0)`;
        imgOpacity = t;
        break;
      }
      case "slide-left": {
        const t = clamp(p / 0.35, 0, 1);
        transform = `translate3d(${-60 * (1 - t)}px,0,0)`;
        imgOpacity = t;
        break;
      }
      case "tilt":
      case "tilt-8": {
        const t = clamp(p / 0.4, 0, 1);
        const deg = motion === "tilt-8" ? 8 : tilt;
        transform = `rotate(${deg * (1 - t)}deg)`;
        imgOpacity = 0.4 + 0.6 * t;
        break;
      }
      case "drift-down": {
        const t = clamp(p / 0.4, 0, 1);
        transform = `translate3d(0,${-48 * (1 - t)}px,0)`;
        imgOpacity = t;
        break;
      }
      case "colour-swap":
        transform = "translate3d(0,0,0) scale(1)";
        updateColourSwap(layer, p * sceneMs);
        break;
      default:
        break;
    }

    img.style.transform = transform;
    if (motion !== "push-in" && motion !== "zoom-out" && motion !== "pan" && motion !== "colour-swap") {
      img.style.opacity = String(imgOpacity);
    } else if (motion !== "colour-swap") {
      img.style.opacity = "1";
    }

    const glow = layer.querySelector<HTMLElement>("[data-ch-glow]");
    if (glow && !stillMode) {
      const breathe = 0.08 + 0.04 * Math.sin(p * Math.PI * 2);
      glow.style.opacity = String(breathe);
    }
  };

  const paint = () => {
    syncSceneCount();
    const loopMs = sceneMs * sceneCount;

    if (stillMode) {
      layers.forEach((layer, i) => {
        layer.style.opacity = i === Math.max(0, lastScene) || (lastScene < 0 && i === 0) ? "1" : "0";
        layer.style.pointerEvents = "none";
        applyMotion(layer, i === 0 ? 1 : 0, 0);
      });
      fills.forEach((f, i) => {
        f.style.transform = `scaleX(${i === Math.max(0, lastScene) ? 1 : i < Math.max(0, lastScene) ? 1 : 0})`;
      });
      return;
    }

    const idx = activeSceneIndex(elapsed, sceneMs, sceneCount);
    if (idx !== lastScene) {
      lastScene = idx;
      revealTitle(titles[idx] || "");
      if (subtitleEl) {
        subtitleEl.textContent = subtitles[idx] || "";
        subtitleEl.classList.remove("is-on");
      }
      if (liveEl) liveEl.textContent = titles[idx] || "";
      root.dataset.activeScene = String(idx);
      colourIndex = -1;
    }

    layers.forEach((layer, i) => {
      if (i >= sceneCount) {
        layer.style.opacity = "0";
        return;
      }
      const op = sceneOpacity(elapsed, i, sceneMs, crossfadeMs, sceneCount);
      layer.style.opacity = String(op);
      const local = sceneLocalProgress(elapsed, sceneMs, sceneCount, i);
      // When fading in, local may be 0 - use time since fade-in start for motion
      let motionP = local;
      if (op > 0 && local === 0) {
        // in crossfade-in from previous scene end
        motionP = 0;
      }
      applyMotion(layer, op, motionP);
    });

    fills.forEach((f, i) => {
      if (i >= sceneCount) {
        f.style.transform = "scaleX(0)";
        return;
      }
      if (i < idx) f.style.transform = "scaleX(1)";
      else if (i > idx) f.style.transform = "scaleX(0)";
      else {
        const local = sceneLocalProgress(elapsed, sceneMs, sceneCount, i);
        f.style.transform = `scaleX(${clamp(local, 0, 1)})`;
      }
    });

    void loopMs;
  };

  const tick = (ts: number) => {
    if (lastTs == null) lastTs = ts;
    const dt = ts - lastTs;
    lastTs = ts;
    if (playing && visible && tabVisible && !stillMode) {
      elapsed += dt;
    }
    paint();
    raf = requestAnimationFrame(tick);
  };

  const jumpTo = (index: number) => {
    const i = clamp(index, 0, sceneCount - 1);
    elapsed = i * sceneMs;
    lastScene = -1;
    colourIndex = -1;
    if (stillMode) {
      lastScene = i;
      layers.forEach((layer, j) => {
        layer.style.opacity = j === i ? "1" : "0";
      });
      revealTitle(titles[i] || "");
      if (subtitleEl) {
        subtitleEl.textContent = subtitles[i] || "";
        subtitleEl.classList.add("is-on");
      }
      if (liveEl) liveEl.textContent = titles[i] || "";
      fills.forEach((f, j) => {
        f.style.transform = `scaleX(${j <= i ? 1 : 0})`;
      });
    }
  };

  // Wait for scene 1 image before starting clock hard
  const poster = layers[0]?.querySelector("img");
  const start = () => {
    syncSceneCount();
    segments.forEach((seg, i) => {
      seg.hidden = i >= sceneCount;
    });
    if (stillMode) {
      jumpTo(0);
      setPlaying(false);
      paint();
      return;
    }
    setPlaying(true);
    lastTs = null;
    raf = requestAnimationFrame(tick);
  };

  if (poster && !poster.complete) {
    poster.addEventListener("load", start, { once: true });
    poster.addEventListener("error", start, { once: true });
  } else {
    start();
  }

  segments.forEach((seg) => {
    seg.addEventListener("click", () => {
      const i = Number(seg.dataset.chSeg);
      if (Number.isFinite(i)) jumpTo(i);
    });
  });

  pauseBtn?.addEventListener("click", () => {
    if (stillMode) return;
    setPlaying(!playing);
  });

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = (entry?.intersectionRatio ?? 0) >= 0.25;
    },
    { threshold: [0, 0.25, 0.5, 1] },
  );
  io.observe(root);

  const onVis = () => {
    tabVisible = document.visibilityState === "visible";
  };
  document.addEventListener("visibilitychange", onVis);

  phoneMq.addEventListener("change", () => {
    stillMode = prefersReducedMotion() || (phoneMq.matches && saveDataOn());
    syncSceneCount();
    if (stillMode) {
      setPlaying(false);
      jumpTo(Math.min(lastScene < 0 ? 0 : lastScene, sceneCount - 1));
    }
  });

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
  };
}
