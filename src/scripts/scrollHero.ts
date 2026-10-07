/**
 * Sticky scroll hero: start/end frame crossfade + scale.
 * Avoids WAAPI fill:forwards so scroll can own opacity.
 */
export type ScrollHeroOptions = {
  root: string;
  start?: string;
  end?: string;
  copy?: string;
  cta?: string;
  /** Fade copy out while scrolling (default false - keep copy readable). */
  fadeCopy?: boolean;
};

export function initScrollHero(opts: ScrollHeroOptions): void {
  const root = document.querySelector(opts.root);
  const start = document.querySelector(opts.start ?? "[data-hero-start]");
  const end = document.querySelector(opts.end ?? "[data-hero-end]");
  const copy = opts.copy ? document.querySelector(opts.copy) : null;
  const cta = opts.cta ? document.querySelector(opts.cta) : document.querySelector("[data-hero-cta]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 47.99rem)").matches;

  if (!(end instanceof HTMLElement) || !(start instanceof HTMLElement)) {
    if (cta instanceof HTMLElement) cta.style.opacity = "1";
    return;
  }

  const play = (p: number) => {
    const t = Math.min(1, Math.max(0, p));
    end.style.opacity = String(t);
    start.style.opacity = String(1 - t);
    const s = 0.94 + t * 0.06;
    start.style.transform = `scale(${s})`;
    end.style.transform = `scale(${s})`;
    if (opts.fadeCopy && copy instanceof HTMLElement) {
      // Soft fade after mid-scroll so copy doesn’t vanish on first wheel
      copy.style.opacity = String(t < 0.35 ? 1 : Math.max(0.15, 1 - (t - 0.35) / 0.65));
    }
    if (cta instanceof HTMLElement) cta.style.opacity = "1";
  };

  if (reduce) {
    play(1);
    return;
  }

  // Intro without fill:forwards - scroll can take over cleanly
  let intro = 0;
  const introStart = performance.now();
  const introMs = 1200;
  const tickIntro = (now: number) => {
    intro = Math.min(1, (now - introStart) / introMs);
    // Ease out cubic
    const e = 1 - (1 - intro) ** 3;
    play(e * 0.35);
    if (intro < 1) requestAnimationFrame(tickIntro);
  };
  requestAnimationFrame(tickIntro);

  if (mobile || !root) {
    // Finish to a readable mid state on mobile
    window.setTimeout(() => play(0.55), introMs + 40);
    return;
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = root.getBoundingClientRect();
      const total = Math.max(1, (root as HTMLElement).offsetHeight - window.innerHeight);
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      // Blend intro floor with scroll progress
      const p = Math.max(intro * 0.35, scrolled / total);
      play(p);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
