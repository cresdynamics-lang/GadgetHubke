/**
 * One-page branded invoice / receipt PDF (A4).
 */
import fs from "node:fs";
import path from "node:path";
import { PDFDocument, PDFPage, PDFString, rgb, StandardFonts } from "pdf-lib";
import { bagMetaLine, formatKes } from "../checkout/bag";
import { catalogAmount, dueTodayAmount, isLipa } from "../checkout/intent";
import type { CheckoutOrder } from "../checkout/types";
import { site } from "../site";
import { payUrl } from "./pay-link";

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
  const mark = path.join(process.cwd(), "public/images/logo-mark.png");
  const full = path.join(process.cwd(), "public/images/logo.png");
  if (fs.existsSync(mark)) return mark;
  if (fs.existsSync(full)) return full;
  return "";
}

export async function buildOrderPdf(
  order: CheckoutOrder,
  kind: "invoice" | "receipt",
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const margin = 40;
  let y = height - margin;

  page.drawRectangle({ x: 0, y: 0, width, height, color: paper });
  page.drawRectangle({ x: 0, y: height - 72, width, height: 72, color: black });

  const logoFile = logoPath();
  if (logoFile) {
    try {
      const png = await doc.embedPng(fs.readFileSync(logoFile));
      page.drawImage(png, { x: margin, y: height - 64, width: 48, height: 48 });
    } catch {
      /* text-only header */
    }
  }

  page.drawText(site.name, {
    x: margin + 58,
    y: height - 38,
    size: 16,
    font: bold,
    color: paper,
  });
  page.drawText(site.legalName, {
    x: margin + 58,
    y: height - 54,
    size: 9,
    font,
    color: rgb(0.78, 0.78, 0.8),
  });

  const lipa = isLipa(order);
  const kindLabel =
    kind === "receipt" ? (lipa ? "DEPOSIT RECEIPT" : "RECEIPT") : lipa ? "LIPA DEPOSIT" : "INVOICE";
  const kindWidth = bold.widthOfTextAtSize(kindLabel, 18);
  page.drawText(kindLabel, {
    x: width - margin - kindWidth,
    y: height - 42,
    size: 18,
    font: bold,
    color: kind === "receipt" ? rgb(0.55, 0.9, 0.7) : paper,
  });

  y = height - 96;
  const leftX = margin;
  const rightX = width / 2 + 8;

  page.drawText("From", { x: leftX, y, size: 9, font: bold, color: muted });
  page.drawText("Bill to", { x: rightX, y, size: 9, font: bold, color: muted });
  y -= 16;

  const fromLines = [
    site.legalName,
    ...site.addressLines,
    `Tel ${site.phoneDisplay}`,
    `WhatsApp ${site.phoneDisplay}`,
    site.email,
    site.url.replace(/^https:\/\//, ""),
    site.hours.short,
  ];
  const billLines = [
    order.customer.name,
    order.customer.phone,
    order.customer.email,
    order.customer.fulfillment === "delivery" ? "Delivery · Nairobi" : `Pickup · ${site.address}`,
    order.customer.notes ? `Note: ${order.customer.notes}` : "",
  ].filter(Boolean);

  const blockTop = y;
  fromLines.forEach((t, i) => {
    page.drawText(t, { x: leftX, y: blockTop - i * 12, size: 9, font, color: black });
  });
  billLines.forEach((t, i) => {
    page.drawText(String(t).slice(0, 48), {
      x: rightX,
      y: blockTop - i * 12,
      size: 9,
      font,
      color: black,
    });
  });

  y = blockTop - Math.max(fromLines.length, billLines.length) * 12 - 18;
  page.drawText(`No. ${order.id}`, { x: leftX, y, size: 10, font: bold, color: black });
  const issued = `Issued ${nairobiDate(order.createdAt)}`;
  page.drawText(issued, {
    x: width - margin - font.widthOfTextAtSize(issued, 9),
    y,
    size: 9,
    font,
    color: muted,
  });

  y -= 22;
  page.drawRectangle({ x: margin, y: y - 4, width: width - margin * 2, height: 18, color: black });
  page.drawText("Item", { x: margin + 8, y, size: 8, font: bold, color: paper });
  page.drawText("Qty", { x: 390, y, size: 8, font: bold, color: paper });
  page.drawText("Amount", {
    x: width - margin - 8 - bold.widthOfTextAtSize("Amount", 8),
    y,
    size: 8,
    font: bold,
    color: paper,
  });

  y -= 20;
  const rows = order.items.slice(0, 10);
  for (const item of rows) {
    const title = item.name.slice(0, 52);
    const meta = bagMetaLine(item).slice(0, 70);
    page.drawText(title, { x: margin + 8, y, size: 9, font: bold, color: black });
    if (meta) {
      y -= 11;
      page.drawText(meta, { x: margin + 8, y, size: 7.5, font, color: muted });
    }
    page.drawText(String(item.qty), { x: 396, y: y + (meta ? 11 : 0), size: 9, font, color: black });
    const amt = formatKes(item.kes * item.qty);
    page.drawText(amt, {
      x: width - margin - 8 - font.widthOfTextAtSize(amt, 9),
      y: y + (meta ? 11 : 0),
      size: 9,
      font,
      color: black,
    });
    y -= 16;
    page.drawLine({
      start: { x: margin, y: y + 8 },
      end: { x: width - margin, y: y + 8 },
      thickness: 0.4,
      color: line,
    });
  }
  if (order.items.length > 10) {
    page.drawText(`+ ${order.items.length - 10} more item(s) on this order`, {
      x: margin + 8,
      y,
      size: 8,
      font,
      color: muted,
    });
    y -= 14;
  }

  y -= 6;
  if (lipa && order.lipa) {
    const catalog = formatKes(catalogAmount(order));
    page.drawText("Device total", { x: margin + 8, y, size: 9, font, color: muted });
    page.drawText(catalog, {
      x: width - margin - 8 - font.widthOfTextAtSize(catalog, 9),
      y,
      size: 9,
      font,
      color: black,
    });
    y -= 14;
    const remain = formatKes(order.lipa.remainingKes);
    page.drawText(`Remaining over ${order.lipa.months} months`, {
      x: margin + 8,
      y,
      size: 9,
      font,
      color: muted,
    });
    page.drawText(remain, {
      x: width - margin - 8 - font.widthOfTextAtSize(remain, 9),
      y,
      size: 9,
      font,
      color: black,
    });
    y -= 16;
  }
  const totalLabel = lipa
    ? `Lipa Mdogo Mdogo deposit ${order.lipa?.depositPct || 40}% due today`
    : "Total (incl. VAT where applicable)";
  page.drawText(totalLabel, { x: margin + 8, y, size: 10, font, color: muted });
  const total = formatKes(dueTodayAmount(order));
  page.drawText(total, {
    x: width - margin - 8 - bold.widthOfTextAtSize(total, 14),
    y: y - 2,
    size: 14,
    font: bold,
    color: black,
  });

  y -= 36;
  if (kind === "invoice") {
    const boxH = 78;
    const boxY = Math.max(88, y - boxH);
    page.drawRectangle({
      x: margin,
      y: boxY,
      width: width - margin * 2,
      height: boxH,
      color: rgb(0.94, 0.96, 1),
      borderColor: payBlue,
      borderWidth: 1.2,
    });
    page.drawText(lipa ? "Pay this Lipa Mdogo Mdogo deposit" : "Pay this invoice", {
      x: margin + 14,
      y: boxY + boxH - 20,
      size: 11,
      font: bold,
      color: payBlue,
    });
    page.drawText(
      lipa
        ? `Click to pay deposit ${total} with M-Pesa (not the full device price)`
        : `Click to pay ${total} with M-Pesa on gadgethubke.com`,
      {
        x: margin + 14,
        y: boxY + boxH - 36,
        size: 9,
        font,
        color: black,
      },
    );
    const url = payUrl(order.id);
    const shown = url.length > 78 ? `${url.slice(0, 75)}…` : url;
    page.drawText(shown, {
      x: margin + 14,
      y: boxY + 18,
      size: 8,
      font,
      color: payBlue,
    });
    addLink(page, margin, boxY, width - margin * 2, boxH, url);
  } else {
    const boxH = 70;
    const boxY = Math.max(88, y - boxH);
    page.drawRectangle({
      x: margin,
      y: boxY,
      width: width - margin * 2,
      height: boxH,
      color: rgb(0.9, 0.97, 0.93),
      borderColor: paidGreen,
      borderWidth: 1.2,
    });
    page.drawText(lipa ? "DEPOSIT PAID" : "PAID", {
      x: margin + 14,
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
      x: margin + 14,
      y: boxY + 24,
      size: 9,
      font,
      color: black,
    });
    page.drawText(
      lipa
        ? `Deposit received. Remaining ${formatKes(order.lipa?.remainingKes || 0)} after plan confirmation.`
        : "Keep this receipt with your device. 1-year warranty on new stock.",
      {
        x: margin + 14,
        y: boxY + 10,
        size: 8,
        font,
        color: muted,
      },
    );
  }

  page.drawText(
    `${site.legalName} · ${site.address}, ${site.location} · ${site.phoneDisplay} · ${site.email}`,
    {
      x: margin,
      y: 48,
      size: 7.5,
      font,
      color: muted,
    },
  );
  page.drawText("This is a computer-generated document. Prices in Kenyan Shillings.", {
    x: margin,
    y: 36,
    size: 7.5,
    font,
    color: muted,
  });

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
