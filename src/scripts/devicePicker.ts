/** Drives every components/DevicePicker on the page. Fires "gh:device" whenever the choice changes. */
import type { DeviceOption, DeviceVariantOption } from "../lib/device-options";

export type PickedDevice = {
  productId: string;
  variantKey: string;
  colour: string;
  channel: "new" | "ex-uk";
  priceKes: number;
  summary: string;
};

const kes = (n: number) => `KES ${n.toLocaleString("en-KE")}`;

function fill(select: HTMLSelectElement, rows: { value: string; label: string }[], placeholder: string) {
  select.replaceChildren();
  if (rows.length > 1 || !rows.length) {
    const first = new Option(placeholder, "", true, true);
    first.disabled = true;
    select.add(first);
  }
  rows.forEach((row) => select.add(new Option(row.label, row.value)));
  if (rows.length === 1) select.value = rows[0].value;
  select.disabled = !rows.length;
}

/** The current choice, or null until every field is filled in. */
export function readPicker(root: Element): PickedDevice | null {
  const options: DeviceOption[] = JSON.parse(root.querySelector("[data-device-options]")?.textContent || "[]");
  const value = (selector: string) => root.querySelector<HTMLSelectElement>(selector)?.value ?? "";
  const product = options.find((o) => o.id === value("[data-picker-product]"));
  const variant = product?.variants.find((v) => v.key === value("[data-picker-variant]"));
  if (!product || !variant) return null;
  const colour = value("[data-picker-colour]");
  if (product.colours.length && !colour) return null;
  const channel = root.querySelector<HTMLInputElement>("[data-picker-channel]:checked")?.value === "ex-uk" ? "ex-uk" : "new";
  const priceKes = channel === "ex-uk" ? variant.exUkKes : variant.newKes;
  if (!priceKes) return null;
  const size = variant.label === "Standard" ? "" : variant.label;
  return {
    productId: product.id,
    variantKey: variant.key,
    colour,
    channel,
    priceKes,
    summary: [product.name, size, colour, channel === "ex-uk" ? "Ex-UK" : "New"].filter(Boolean).join(" · "),
  };
}

function start(root: HTMLElement) {
  const options: DeviceOption[] = JSON.parse(root.querySelector("[data-device-options]")?.textContent || "[]");
  const productEl = root.querySelector<HTMLSelectElement>("[data-picker-product]");
  const variantEl = root.querySelector<HTMLSelectElement>("[data-picker-variant]");
  const colourEl = root.querySelector<HTMLSelectElement>("[data-picker-colour]");
  const priceEl = root.querySelector<HTMLElement>("[data-picker-price]");
  const channels = [...root.querySelectorAll<HTMLInputElement>("[data-picker-channel]")];
  if (!productEl || !variantEl || !colourEl) return;

  const price = (v: DeviceVariantOption | undefined, channel: string) => (channel === "ex-uk" ? v?.exUkKes : v?.newKes) ?? 0;

  function syncPrice() {
    const product = options.find((o) => o.id === productEl!.value);
    const variant = product?.variants.find((v) => v.key === variantEl!.value);
    // Only offer New or Ex-UK when this exact option is sold that way.
    channels.forEach((input) => {
      input.disabled = variant ? !price(variant, input.value) : false;
    });
    if (variant && channels.find((c) => c.checked)?.disabled) {
      const open = channels.find((c) => !c.disabled);
      if (open) open.checked = true;
    }
    const channel = channels.find((c) => c.checked)?.value ?? "new";
    const kesNow = price(variant, channel);
    if (priceEl) {
      priceEl.hidden = !kesNow;
      priceEl.textContent = kesNow ? `${channel === "ex-uk" ? "Ex-UK" : "New"} price: ${kes(kesNow)}` : "";
    }
    root.dispatchEvent(new CustomEvent("gh:device", { bubbles: true }));
  }

  productEl.addEventListener("change", () => {
    const product = options.find((o) => o.id === productEl.value);
    const variants = product?.variants ?? [];
    fill(variantEl, variants.map((v) => ({ value: v.key, label: v.label })), "Select one");
    root.querySelector<HTMLElement>("[data-picker-variant-field]")!.hidden = variants.length === 1 && variants[0].label === "Standard";
    const colours = product?.colours ?? [];
    fill(colourEl, colours.map((c) => ({ value: c, label: c })), "Select a colour");
    colourEl.required = colours.length > 0;
    root.querySelector<HTMLElement>("[data-picker-colour-field]")!.hidden = !colours.length;
    syncPrice();
  });
  variantEl.addEventListener("change", syncPrice);
  colourEl.addEventListener("change", syncPrice);
  channels.forEach((input) => input.addEventListener("change", syncPrice));
}

export function initDevicePickers() {
  document.querySelectorAll<HTMLElement>("[data-device-picker]").forEach((root) => {
    if (root.dataset.pickerReady) return;
    root.dataset.pickerReady = "1";
    start(root);
  });
}

/**
 * Open a tab now, while the tap still counts, and point it at WhatsApp once the
 * request is saved. Browsers block a new tab opened after waiting on the network.
 */
export function holdWhatsAppTab() {
  const tab = window.open("about:blank", "_blank");
  return (url: string) => {
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.href = url;
    }
  };
}
