/**
 * Keep category landing/shop scroll (and optional gen filter) across back-navigation.
 */
export function bindLandingViewState(opts: {
  storageKey: string;
  gridSelector: string;
  genButtonSelector?: string;
  itemSelector?: string;
  /** When false, only scroll is restored (shop pages with URL filters). */
  withGenFilter?: boolean;
}) {
  const {
    storageKey,
    gridSelector,
    genButtonSelector = "[data-gen]",
    itemSelector = "[data-chip-gen]",
    withGenFilter = true,
  } = opts;

  const genKey = `${storageKey}:gen`;
  const scrollKey = `${storageKey}:scroll`;
  const grid = document.querySelector(gridSelector);
  if (!grid) return;

  function applyGen(gen: string) {
    if (!withGenFilter) return;
    document.querySelectorAll(genButtonSelector).forEach((b) => {
      if (!(b instanceof HTMLElement)) return;
      const active = (b.getAttribute("data-gen") || "") === gen;
      b.classList.toggle("is-active", active);
    });
    grid.querySelectorAll(itemSelector).forEach((li) => {
      if (!(li instanceof HTMLElement)) return;
      li.hidden = gen !== "all" && li.getAttribute("data-chip-gen") !== gen;
    });
  }

  function saveScroll() {
    try {
      sessionStorage.setItem(scrollKey, String(Math.round(window.scrollY)));
    } catch {
      /* private mode */
    }
  }

  function restore() {
    if (withGenFilter) {
      let gen = "all";
      try {
        gen = sessionStorage.getItem(genKey) || "all";
      } catch {
        gen = "all";
      }
      applyGen(gen);
    }

    let y = 0;
    try {
      y = Number(sessionStorage.getItem(scrollKey) || "0");
    } catch {
      y = 0;
    }
    if (Number.isFinite(y) && y > 0) {
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
  }

  if (withGenFilter) {
    document.querySelectorAll(genButtonSelector).forEach((btn) => {
      if (!(btn instanceof HTMLElement) || btn.dataset.landingBound === "1") return;
      btn.dataset.landingBound = "1";
      btn.addEventListener("click", () => {
        const gen = btn.getAttribute("data-gen") || "all";
        try {
          sessionStorage.setItem(genKey, gen);
        } catch {
          /* ignore */
        }
        applyGen(gen);
      });
    });
  }

  grid.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest("a[href]")) saveScroll();
  });

  window.addEventListener("pagehide", saveScroll);
  window.addEventListener("pageshow", restore);
  restore();
}
