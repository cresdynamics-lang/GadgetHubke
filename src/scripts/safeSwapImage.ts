/**
 * Swap an <img> src without leaving opacity stuck at 0 (bfcache / aborted loads).
 */
export function safeSwapImage(
  img: HTMLImageElement,
  src: string,
  opts: { alt?: string; animate?: boolean; reduceMotion?: boolean; onApplied?: () => void } = {},
) {
  const { alt, animate = true, reduceMotion = false, onApplied } = opts;

  const apply = () => {
    img.src = src;
    if (alt) img.alt = alt;
    img.style.opacity = "1";
    onApplied?.();
  };

  if (!src || !animate || reduceMotion) {
    apply();
    return;
  }

  img.style.opacity = "0";
  const pre = new Image();
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    apply();
  };

  pre.onload = () => window.setTimeout(finish, 160);
  pre.onerror = finish;
  pre.src = src;
  if (pre.complete) window.setTimeout(finish, 160);
  window.setTimeout(finish, 700);
}

/** Repair product images after bfcache restore / aborted fades. */
export function repairProductImages(root: ParentNode = document) {
  root.querySelectorAll<HTMLImageElement>(
    "[data-viewer-img], .istage__img, .mstage__img, .wstage__img, .icard__img-alt, [data-icard-alt], [data-mcard-alt]",
  ).forEach((img) => {
    if (img.style.opacity === "0" || getComputedStyle(img).opacity === "0") {
      img.style.opacity = "1";
    }
  });
}
