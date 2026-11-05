/** Drives every components/DevicePicker on the page. Fires "gh:device" whenever the choice changes. */
import type { DeviceOption, DeviceVariantOption } from "../lib/device-options";

export type PickedDevice = {
  productId: string;
  variantKey: string;
  colour: string;
  channel: "new" | "ex-uk";
  /** 0 when this exact choice is out of stock. */
  priceKes: number;
  summary: string;
  name: string;
  /** Storage or version, empty when the model has only one. */
  size: string;
  /** False only on a picker that lets sold-out options be chosen. */
  available: boolean;
};

const kes = (n: number) => `KES ${n.toLocaleString("en-KE")}`;

const channelName = (channel: string) => (channel === "ex-uk" ? "Ex-UK" : "New");

function colourInStock(product: DeviceOption, colour: string, channel: string) {
  const stock = product.colourStock;
  if (!stock || !colour) return true;
  return (channel === "ex-uk" ? stock.exUk : stock.new).includes(colour);
}

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
  const notify = root.hasAttribute("data-picker-notify");
  if (!priceKes && !notify) return null;
  const size = variant.label === "Standard" ? "" : variant.label;
  return {
    name: product.name,
    size,
    available: Boolean(priceKes) && colourInStock(product, colour, channel),
    productId: product.id,
    variantKey: variant.key,
    colour,
    channel,
    priceKes,
    summary: [product.name, size, colour, channelName(channel)].filter(Boolean).join(" · "),
  };
}

function start(root: HTMLElement) {
  const options: DeviceOption[] = JSON.parse(root.querySelector("[data-device-options]")?.textContent || "[]");
  const productEl = root.querySelector<HTMLSelectElement>("[data-picker-product]");
  const variantEl = root.querySelector<HTMLSelectElement>("[data-picker-variant]");
  const colourEl = root.querySelector<HTMLSelectElement>("[data-picker-colour]");
  const priceEl = root.querySelector<HTMLElement>("[data-picker-price]");
  const noticeEl = root.querySelector<HTMLElement>("[data-picker-notice]");
  const notify = root.hasAttribute("data-picker-notify");
  const channels = [...root.querySelectorAll<HTMLInputElement>("[data-picker-channel]")];
  if (!productEl || !variantEl || !colourEl) return;

  const price = (v: DeviceVariantOption | undefined, channel: string) => (channel === "ex-uk" ? v?.exUkKes : v?.newKes) ?? 0;

  /** Why this choice cannot be bought right now, and what is open instead. Empty when it can. */
  function unavailableText(product: DeviceOption | undefined, variant: DeviceVariantOption | undefined, channel: string) {
    if (!product) return "";
    const colour = colourEl!.value;
    const open = (ch: string) =>
      variant ? price(variant, ch) > 0 && colourInStock(product, colour, ch) : product.variants.some((v) => price(v, ch) > 0);
    if (open(channel)) return "";
    const size = variant && variant.label !== "Standard" ? variant.label : "";
    const subject = [product.name, size, colour, channelName(channel)].filter(Boolean).join(" · ");
    const other = channel === "ex-uk" ? "new" : "ex-uk";
    const otherKes = price(variant, other);
    const instead = !open(other) ? "" : ` It is available ${channelName(other)}${otherKes ? ` at ${kes(otherKes)}` : ""}.`;
    return `${subject} is not available at the moment.${instead} Choose another phone, storage or colour, or tap Proceed on WhatsApp and we will help you find the closest match.`;
  }

  function syncPrice() {
    const product = options.find((o) => o.id === productEl!.value);
    const variant = product?.variants.find((v) => v.key === variantEl!.value);
    // Only offer New or Ex-UK when this exact option is sold that way.
    if (!notify) {
      channels.forEach((input) => {
        input.disabled = variant ? !price(variant, input.value) : false;
      });
      if (variant && channels.find((c) => c.checked)?.disabled) {
        const open = channels.find((c) => !c.disabled);
        if (open) open.checked = true;
      }
    }
    const channel = channels.find((c) => c.checked)?.value ?? "new";
    const notice = notify ? unavailableText(product, variant, channel) : "";
    if (noticeEl) {
      noticeEl.hidden = !notice;
      noticeEl.textContent = notice;
    }
    const kesNow = notice ? 0 : price(variant, channel);
    if (priceEl) {
      priceEl.hidden = !kesNow;
      priceEl.textContent = kesNow ? `${channelName(channel)} price: ${kes(kesNow)}` : "";
    }
    root.dispatchEvent(new CustomEvent("gh:device", { bubbles: true }));
  }

  productEl.addEventListener("change", () => {
    const product = options.find((o) => o.id === productEl.value);
    const variants = product?.variants ?? [];
    const out = (soldOut: boolean) => (notify && soldOut ? " (not available)" : "");
    fill(variantEl, variants.map((v) => ({ value: v.key, label: v.label + out(!v.newKes && !v.exUkKes) })), "Select one");
    root.querySelector<HTMLElement>("[data-picker-variant-field]")!.hidden = variants.length === 1 && variants[0].label === "Standard";
    const colours = product?.colours ?? [];
    const stock = product?.colourStock;
    fill(
      colourEl,
      colours.map((c) => ({ value: c, label: c + out(Boolean(stock) && !stock!.new.includes(c) && !stock!.exUk.includes(c)) })),
      "Select a colour",
    );
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
