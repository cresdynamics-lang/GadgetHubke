/**
 * One-page branded invoice / receipt PDF (A4).
 * Always a single page: line items are clipped to the space above the
 * payment/paid box and footer; Gadget Hub shop details are always shown.
 */
import { publicFilePath } from "../public-file";
import fs from "node:fs";
import { PDFDocument, PDFPage, PDFString, rgb, StandardFonts } from "pdf-lib";
import { bagMetaLine, formatKes } from "../checkout/bag";
import { catalogAmount, dueTodayAmount, isLipa } from "../checkout/intent";
import type { CheckoutOrder } from "../checkout/types";
import { site } from "../site";
import { payUrl } from "./pay-link";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 40;
const FOOTER_H = 52;
const ACTION_BOX_H = 78;

const black = rgb(0.114, 0.114, 0.122);
const muted = rgb(0.42, 0.42, 0.45);
const line = rgb(0.86, 0.86, 0.89);
const paper = rgb(1, 1, 1);
const paidGreen = rgb(0.12, 0.48, 0.28);
const payBlue = rgb(0.07, 0.27, 0.67);

function nairobiDate(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Nairobi",
  }).format(d);
}

function addLink(page: PDFPage, x: number, y: number, w: number, h: number, url: string) {
  const annot = page.doc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [x, y, x + w, y + h],
    Border: [0, 0, 0],
    A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
  });
  page.node.addAnnot(page.doc.context.register(annot));
}

function logoPath() {
  return publicFilePath("/images/logo-mark.png") ?? publicFilePath("/images/logo.png") ?? "";
}

function drawWrapped(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  color: ReturnType<typeof rgb>,
  maxWidth: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  let lineText = "";
  let cursor = y;
  for (const word of words) {
    const next = lineText ? `${lineText} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && lineText) {
      page.drawText(lineText, { x, y: cursor, size, font, color });
      cursor -= size + 2;
      lineText = word;
    } else {
      lineText = next;
    }
  }
  if (lineText) {
    page.drawText(lineText, { x, y: cursor, size, font, color });
    cursor -= size + 2;
  }
  return cursor;
}

export async function buildOrderPdf(
  order: CheckoutOrder,
  kind: "invoice" | "receipt",
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({ x: 0, y: 0, width, height, color: paper });
  page.drawRectangle({ x: 0, y: height - 72, width, height: 72, color: black });

  const logoFile = logoPath();
  if (logoFile) {
    try {
      const png = await doc.embedPng(fs.readFileSync(logoFile));
      page.drawImage(png, { x: MARGIN, y: height - 64, width: 48, height: 48 });
    } catch {
      /* text-only header */
    }
  }

  page.drawText(site.name, {
    x: MARGIN + 58,
    y: height - 34,
    size: 16,
    font: bold,
    color: paper,
  });
  page.drawText(site.legalName, {
    x: MARGIN + 58,
    y: height - 48,
    size: 9,
    font,
    color: rgb(0.78, 0.78, 0.8),
  });
  page.drawText(`${site.address} · ${site.phoneDisplay}`, {
    x: MARGIN + 58,
    y: height - 60,
    size: 8,
    font,
    color: rgb(0.7, 0.7, 0.72),
  });

  const lipa = isLipa(order);
  const kindLabel =
    kind === "receipt" ? (lipa ? "DEPOSIT RECEIPT" : "RECEIPT") : lipa ? "LIPA DEPOSIT" : "INVOICE";
  const kindWidth = bold.widthOfTextAtSize(kindLabel, 16);
  page.drawText(kindLabel, {
    x: width - MARGIN - kindWidth,
    y: height - 42,
    size: 16,
    font: bold,
    color: kind === "receipt" ? rgb(0.55, 0.9, 0.7) : paper,
  });

  let y = height - 92;
  const leftX = MARGIN;
  const rightX = width / 2 + 8;

  page.drawText("From", { x: leftX, y, size: 8, font: bold, color: muted });
  page.drawText("Bill to", { x: rightX, y, size: 8, font: bold, color: muted });
  y -= 13;

  const fromLines = [
    site.legalName,
    site.addressLines[0],
    site.addressLines[1],
    site.addressLines[2],
    `Tel / WhatsApp ${site.phoneDisplay}`,
    site.email,
    site.url.replace(/^https:\/\//, ""),
    site.hours.short,
  ];
  const billLines = [
    order.customer.name,
    order.customer.phone,
    order.customer.email,
    order.customer.fulfillment === "delivery"
      ? `Delivery · ${(order.customer.deliveryAddress || "Nairobi").slice(0, 60)}`
      : `Pickup · ${site.address}`,
    order.customer.notes ? `Note: ${order.customer.notes.slice(0, 60)}` : "",
  ].filter(Boolean);

  const blockTop = y;
  fromLines.forEach((t, i) => {
    page.drawText(t.slice(0, 42), {
      x: leftX,
      y: blockTop - i * 11,
      size: 8.5,
      font,
      color: black,
    });
  });
  billLines.forEach((t, i) => {
    page.drawText(String(t).slice(0, 42), {
      x: rightX,
      y: blockTop - i * 11,
      size: 8.5,
      font,
      color: black,
    });
  });

  y = blockTop - Math.max(fromLines.length, billLines.length) * 11 - 14;
  page.drawText(`No. ${order.id}`, { x: leftX, y, size: 10, font: bold, color: black });
  const issued = `Issued ${nairobiDate(order.createdAt)}`;
  page.drawText(issued, {
    x: width - MARGIN - font.widthOfTextAtSize(issued, 8.5),
    y,
    size: 8.5,
    font,
    color: muted,
  });

  // Fixed bottom regions so content never spills to a second page.
  const actionBoxY = FOOTER_H + 8;
  const totalsFloor = actionBoxY + ACTION_BOX_H + 16;
  const itemsCeiling = y - 18;

  y -= 18;
  page.drawRectangle({ x: MARGIN, y: y - 3, width: width - MARGIN * 2, height: 16, color: black });
  page.drawText("Item", { x: MARGIN + 8, y, size: 8, font: bold, color: paper });
  page.drawText("Qty", { x: 390, y, size: 8, font: bold, color: paper });
  page.drawText("Amount", {
    x: width - MARGIN - 8 - bold.widthOfTextAtSize("Amount", 8),
    y,
    size: 8,
    font: bold,
    color: paper,
  });

  y -= 18;
  const rowBudget = Math.max(0, itemsCeiling - totalsFloor - 70);
  const approxRowH = 26;
  const maxRows = Math.max(1, Math.min(order.items.length, Math.floor(rowBudget / approxRowH)));
  let drawn = 0;

  for (const item of order.items.slice(0, maxRows)) {
    if (y < totalsFloor + 36) break;
    const title = item.name.slice(0, 48);
    const meta = bagMetaLine(item).slice(0, 64);
    const rowTop = y;
    page.drawText(title, { x: MARGIN + 8, y: rowTop, size: 9, font: bold, color: black });
    if (meta) {
      y -= 10;
      page.drawText(meta, { x: MARGIN + 8, y, size: 7, font, color: muted });
    }
    page.drawText(String(item.qty), {
      x: 396,
      y: rowTop,
      size: 9,
      font,
      color: black,
    });
    const amt = formatKes(item.kes * item.qty);
    page.drawText(amt, {
      x: width - MARGIN - 8 - font.widthOfTextAtSize(amt, 9),
      y: rowTop,
      size: 9,
      font,
      color: black,
    });
    y -= 14;
    page.drawLine({
      start: { x: MARGIN, y: y + 6 },
      end: { x: width - MARGIN, y: y + 6 },
      thickness: 0.4,
      color: line,
    });
    drawn += 1;
  }

  const hidden = order.items.length - drawn;
  if (hidden > 0) {
    page.drawText(`+ ${hidden} more item(s) — full list in your email`, {
      x: MARGIN + 8,
      y,
      size: 8,
      font,
      color: muted,
    });
    y -= 12;
  }

  // Totals sit just above the action box.
  let totalsY = Math.max(y - 4, totalsFloor + (lipa ? 44 : 22));
  if (lipa && order.lipa) {
    const catalog = formatKes(catalogAmount(order));
    page.drawText("Device total", { x: MARGIN + 8, y: totalsY, size: 9, font, color: muted });
    page.drawText(catalog, {
      x: width - MARGIN - 8 - font.widthOfTextAtSize(catalog, 9),
      y: totalsY,
      size: 9,
      font,
      color: black,
    });
    totalsY -= 12;
    const remain = formatKes(order.lipa.remainingKes);
    page.drawText(`Remaining over ${order.lipa.months} ${order.lipa.months === 1 ? "month" : "months"}`, {
      x: MARGIN + 8,
      y: totalsY,
      size: 9,
      font,
      color: muted,
    });
    page.drawText(remain, {
      x: width - MARGIN - 8 - font.widthOfTextAtSize(remain, 9),
      y: totalsY,
      size: 9,
      font,
      color: black,
    });
    totalsY -= 14;
  }
  const totalLabel = lipa
    ? `Lipa Mdogo Mdogo deposit ${order.lipa?.depositPct || 40}% due today`
    : "Total (incl. VAT where applicable)";
  page.drawText(totalLabel, { x: MARGIN + 8, y: totalsY, size: 9, font, color: muted });
  const total = formatKes(dueTodayAmount(order));
  page.drawText(total, {
    x: width - MARGIN - 8 - bold.widthOfTextAtSize(total, 13),
    y: totalsY - 1,
    size: 13,
    font: bold,
    color: black,
  });

  const boxY = actionBoxY;
  const boxH = ACTION_BOX_H;
  if (kind === "invoice") {
    page.drawRectangle({
      x: MARGIN,
      y: boxY,
      width: width - MARGIN * 2,
      height: boxH,
      color: rgb(0.94, 0.96, 1),
      borderColor: payBlue,
      borderWidth: 1.2,
    });
    page.drawText(lipa ? "Pay this Lipa Mdogo Mdogo deposit" : "Pay this invoice", {
      x: MARGIN + 14,
      y: boxY + boxH - 20,
      size: 11,
      font: bold,
      color: payBlue,
    });
    page.drawText(
      lipa
        ? `Pay deposit ${total} with M-Pesa (not the full device price)`
        : `Pay ${total} with M-Pesa — funds settle to ${site.legalName} (Stanbic)`,
      {
        x: MARGIN + 14,
        y: boxY + boxH - 36,
        size: 8.5,
        font,
        color: black,
      },
    );
    const url = payUrl(order.id);
    const shown = url.length > 78 ? `${url.slice(0, 75)}…` : url;
    page.drawText(shown, {
      x: MARGIN + 14,
      y: boxY + 18,
      size: 8,
      font,
      color: payBlue,
    });
    addLink(page, MARGIN, boxY, width - MARGIN * 2, boxH, url);
  } else {
    page.drawRectangle({
      x: MARGIN,
      y: boxY,
      width: width - MARGIN * 2,
      height: boxH,
      color: rgb(0.9, 0.97, 0.93),
      borderColor: paidGreen,
      borderWidth: 1.2,
    });
    page.drawText(lipa ? "DEPOSIT PAID" : "PAID", {
      x: MARGIN + 14,
      y: boxY + boxH - 22,
      size: 16,
      font: bold,
      color: paidGreen,
    });
    const paidBits = [
      order.paidAt ? `Paid ${nairobiDate(order.paidAt)}` : "Payment received",
      order.paymentMethod === "mpesa" ? "M-Pesa" : "",
      order.paymentRef ? `Ref ${order.paymentRef}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
    page.drawText(paidBits.slice(0, 90), {
      x: MARGIN + 14,
      y: boxY + 28,
      size: 9,
      font,
      color: black,
    });
    page.drawText(
      lipa
        ? `Deposit received. Remaining ${formatKes(order.lipa?.remainingKes || 0)} after plan confirmation.`
        : `Keep this receipt with your device. ${site.warranty.years}-year warranty on new stock.`,
      {
        x: MARGIN + 14,
        y: boxY + 12,
        size: 8,
        font,
        color: muted,
      },
    );
  }

  const footer1 = `${site.legalName} · ${site.address}, ${site.location} · ${site.phoneDisplay} · ${site.email}`;
  drawWrapped(page, footer1, MARGIN, 34, 7, font, muted, width - MARGIN * 2);
  page.drawText("One-page computer-generated document. Prices in Kenyan Shillings (KES).", {
    x: MARGIN,
    y: 18,
    size: 7,
    font,
    color: muted,
  });

  if (doc.getPageCount() !== 1) {
    throw new Error("Order PDF must be exactly one page.");
  }

  return doc.save();
}

export function pdfFilename(order: CheckoutOrder, kind: "invoice" | "receipt") {
  const lipa = isLipa(order);
  const stem =
    kind === "receipt"
      ? lipa
        ? "LipaDepositReceipt"
        : "Receipt"
      : lipa
        ? "LipaDepositInvoice"
        : "Invoice";
  return `GadgetHub-${stem}-${order.id}.pdf`;
}
