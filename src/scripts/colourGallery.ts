/**
 * Colour-aware angle tabs for product pages (Watch, AirPods, TV & Home).
 * The tablist carries data-colour-views='{"colour":[{id,label,src,alt}]}'; tapping a
 * swatch rebuilds the tabs for that finish and shows its first angle, like iPhone pages.
 */
type Tab = { id: string; label: string; src: string; alt: string };

function showImage(img: HTMLImageElement, src: string, alt: string) {
  const picture = img.parentElement instanceof HTMLPictureElement ? img.parentElement : null;
  picture?.querySelectorAll("source").forEach((s) => s.remove());
  img.src = src;
  img.alt = alt;
}

export function initColourGallery(opts: { tablist: HTMLElement; img: HTMLImageElement; swatches: string }) {
  const { tablist, img, swatches } = opts;
  let views: Record<string, Tab[]> = {};
  try {
    views = JSON.parse(tablist.dataset.colourViews || "{}");
  } catch {
    return;
  }
  const template = tablist.querySelector<HTMLButtonElement>("button");
  const baseClass = template ? template.className.replace(/\bis-active\b/, "").trim() : "";

  function render(colour: string) {
    const tabs = views[colour];
    if (!tabs?.length) return;
    tablist.innerHTML = "";
    tabs.forEach((t, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.className = `${baseClass}${i === 0 ? " is-active" : ""}`.trim();
      b.dataset.tab = t.id;
      b.dataset.src = t.src;
      b.dataset.alt = t.alt;
      b.textContent = t.label;
      tablist.appendChild(b);
    });
    showImage(img, tabs[0].src, tabs[0].alt);
  }

  tablist.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-tab]");
    if (!btn) return;
    tablist.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    showImage(img, btn.dataset.src || img.src, btn.dataset.alt || img.alt);
  });

  document.querySelectorAll<HTMLElement>(swatches).forEach((sw) => {
    sw.addEventListener("click", () => {
      const colour = sw.dataset.colour || "";
      // after the page's own fade (≈180ms) so its src swap does not win
      window.setTimeout(() => render(colour), 190);
    });
  });
}
