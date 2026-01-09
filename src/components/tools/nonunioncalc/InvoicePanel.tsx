import React from "react";
import type {
  DayCalc,
  DayEntry,
  InvoiceMeta,
  InvoiceParty,
  LineItem,
} from "@/lib/nonUnionCalc";
import {
  cn,
  formatMoney,
  round2,
  safeNumber,
  todayISO,
  addDaysISO,
  formatDateShort,
} from "@/lib/nonUnionCalc";

type InvoiceRow = {
  description: string;
  qty?: string;
  rate?: string;
  amount: number;
};

function partyLines(p: InvoiceParty) {
  const lines: string[] = [];
  const name = p.name?.trim();
  if (name) lines.push(name);

  const a1 = p.address1?.trim();
  const a2 = p.address2?.trim();
  if (a1) lines.push(a1);
  if (a2) lines.push(a2);

  const city = p.city?.trim();
  const st = p.state?.trim();
  const zip = p.zip?.trim();
  const cityLine = [city, st, zip].filter(Boolean).join(", ").trim();
  if (cityLine) lines.push(cityLine);

  const email = p.email?.trim();
  const phone = p.phone?.trim();
  if (email) lines.push(email);
  if (phone) lines.push(phone);

  return lines.length ? lines : ["N/A"];
}

export default function InvoicePanel({
  totals,
  miles,
  mileageRate,
  lineItems,
  dayCalcs,
  meta,
  from,
  to,
  pdfUrl,
  setPdfUrl,
}: {
  totals: {
    laborTotal: number;
    otBeyond12Total: number;
    mileagePay: number;
    expensesTotal: number;
    grandTotal: number;
  };
  miles: number;
  mileageRate: number;
  lineItems: LineItem[];
  dayCalcs: Array<{ day: DayEntry; calc: DayCalc }>;
  meta: InvoiceMeta;
  from: InvoiceParty;
  to: InvoiceParty;

  pdfUrl: string | null;
  setPdfUrl: (url: string | null) => void;
}) {
  const invoiceDate = meta.invoiceDate?.trim()
    ? meta.invoiceDate.trim()
    : todayISO();
  const termsDays = Math.max(0, Math.floor(meta.termsDays || 0));
  const dueDate = addDaysISO(invoiceDate, termsDays);

  async function generateInvoicePdf() {
    const { jsPDF } = await import("jspdf");

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }

    const doc = new jsPDF({ unit: "pt", format: "letter" });

    const pageW = 612;
    const pageH = 792;
    const margin = 48;
    const contentW = pageW - margin * 2;

    const colorText = [20, 20, 20] as const;
    const colorMuted = [90, 90, 90] as const;
    const colorLine = [220, 220, 220] as const;
    const colorHeaderFill = [245, 245, 245] as const;

    const setText = (rgb: readonly [number, number, number]) =>
      doc.setTextColor(rgb[0], rgb[1], rgb[2]);

    const setLine = () =>
      doc.setDrawColor(colorLine[0], colorLine[1], colorLine[2]);

    const font = (size: number, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
    };

    const wrapLines = (text: string, maxW: number) =>
      (doc.splitTextToSize(text, maxW) as string[]) || [];

    const money = (n: number) => formatMoney(n);

    const drawHLine = (y: number) => {
      setLine();
      doc.setLineWidth(1);
      doc.line(margin, y, margin + contentW, y);
    };

    // Page background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, "F");
    setText(colorText);

    let y = margin;

    // Title
    font(20, true);
    doc.text("Invoice", margin, y);

    // Right details block
    const invNum = meta.invoiceNumber?.trim()
      ? meta.invoiceNumber.trim()
      : "N/A";
    const prodNameRaw = meta.productionName?.trim()
      ? meta.productionName.trim()
      : "";
    const termsLabel = termsDays === 0 ? "Due on receipt" : `Net ${termsDays}`;

    const detailsRows: Array<[string, string]> = [
      ["Invoice #", invNum],
      ["Invoice date", invoiceDate],
      ["Due date", dueDate],
      ["Terms", termsLabel],
    ];

    if (prodNameRaw) detailsRows.push(["Production", prodNameRaw]);

    const detailsXRight = margin + contentW;
    const labelW = 110;
    const valueW = 180;
    const rowH = 16;

    // Details start y aligned to title baseline
    let dy = y - 8;
    const detailsTop = dy;

    detailsRows.forEach(([k, v]) => {
      font(9, true);
      setText(colorMuted);
      doc.text(k, detailsXRight - (labelW + valueW), dy);
      font(9, false);
      setText(colorText);
      doc.text(v, detailsXRight - valueW, dy);
      dy += rowH;
    });

    const detailsBottom = dy;

    // Subtitle (wrapped, constrained to left area)
    const subtitleText =
      "Prepared for film production billing and reimbursement.";
    const rightBlockW = labelW + valueW;
    const subtitleMaxW = contentW - rightBlockW - 12;
    let subY = y + 22;

    font(10, false);
    setText(colorMuted);

    const subtitleLines = wrapLines(subtitleText, subtitleMaxW);
    subtitleLines.forEach((ln) => {
      doc.text(ln, margin, subY);
      subY += 14;
    });

    const subtitleBottom = subY;

    // Divider after whichever block ends lower
    const dividerY = Math.max(detailsBottom + 6, subtitleBottom + 6);
    y = dividerY;
    drawHLine(y);
    y += 18;

    // Parties
    const colGap = 24;
    const colW = (contentW - colGap) / 2;

    font(10, true);
    setText(colorMuted);
    doc.text("From", margin, y);
    doc.text("Bill To", margin + colW + colGap, y);

    y += 16;

    const fromLines = partyLines(from);
    const toLines = partyLines(to);

    const drawParty = (x: number, lines: string[]) => {
      let yy = y;
      lines.forEach((l, idx) => {
        if (idx === 0) {
          font(11, true);
          setText(colorText);
        } else {
          font(10, false);
          setText(colorText);
        }
        const parts = wrapLines(l, colW);
        parts.forEach((p) => {
          doc.text(p, x, yy);
          yy += 14;
        });
      });
      return yy;
    };

    const fromEnd = drawParty(margin, fromLines);
    const toEnd = drawParty(margin + colW + colGap, toLines);
    y = Math.max(fromEnd, toEnd) + 14;

    drawHLine(y);
    y += 18;

    // Build table rows
    const rows: InvoiceRow[] = [];

    dayCalcs.forEach((x, idx) => {
      if (!x.calc.ok) return;

      const dateShort = formatDateShort(x.day.date);
      const dayLabel = dateShort
        ? `Labor: Day ${idx + 1} (${dateShort})`
        : `Labor: Day ${idx + 1}`;

      const mealMin = safeNumber(x.day.mealMinutes);
      const details = `In ${x.day.inTime || "N/A"}, Out ${
        x.day.outTime || "N/A"
      }, Meal ${mealMin || 0} min, Paid ${round2(x.calc.paidHours)}h`;

      const amount = x.calc.dayPay;
      rows.push({
        description: `${dayLabel}\n${details}`,
        qty: "1",
        rate: money(amount),
        amount,
      });
    });

    const mileageAmount = totals.mileagePay;
    if (
      safeNumber(miles) > 0 &&
      safeNumber(mileageRate) > 0 &&
      mileageAmount > 0
    ) {
      rows.push({
        description: `Mileage\n${round2(safeNumber(miles))} miles @ ${money(
          safeNumber(mileageRate)
        )}/mi`,
        amount: mileageAmount,
      });
    }

    lineItems
      .filter((it) => safeNumber(it.cost) > 0)
      .forEach((it) => {
        const title = it.title?.trim() ? it.title.trim() : "Expense";
        const desc = it.description?.trim() ? it.description.trim() : "";
        rows.push({
          description: desc
            ? `Expense\n${title}\n${desc}`
            : `Expense\n${title}`,
          amount: safeNumber(it.cost),
        });
      });

    // Table geometry
    const tableX = margin;
    const tableW = contentW;

    const colDesc = Math.floor(tableW * 0.56);
    const colQty = Math.floor(tableW * 0.1);
    const colRate = Math.floor(tableW * 0.17);
    const colAmt = tableW - colDesc - colQty - colRate;

    const xDesc = tableX;
    const xQty = tableX + colDesc;
    const xRate = xQty + colQty;
    const xAmt = xRate + colRate;

    const headerH = 24;
    const rowPadY = 10;

    const ensurePage = (needed: number) => {
      if (y + needed <= pageH - margin) return;
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageW, pageH, "F");
      y = margin;
    };

    // Header
    ensurePage(120);

    doc.setFillColor(
      colorHeaderFill[0],
      colorHeaderFill[1],
      colorHeaderFill[2]
    );
    doc.rect(tableX, y, tableW, headerH, "F");
    setLine();
    doc.setLineWidth(1);
    doc.rect(tableX, y, tableW, headerH);

    font(9, true);
    setText(colorMuted);
    doc.text("Description", xDesc + 10, y + 16);
    doc.text("Qty", xQty + 10, y + 16);
    doc.text("Rate", xRate + 10, y + 16);
    doc.text("Amount", xAmt + 10, y + 16);

    y += headerH;

    // Rows
    rows.forEach((r) => {
      const descLines = wrapLines(r.description, colDesc - 20);
      const rowH = Math.max(28, descLines.length * 14 + rowPadY);

      ensurePage(rowH + 160);

      setLine();
      doc.rect(tableX, y, tableW, rowH);
      doc.line(xQty, y, xQty, y + rowH);
      doc.line(xRate, y, xRate, y + rowH);
      doc.line(xAmt, y, xAmt, y + rowH);

      font(9, false);
      setText(colorText);

      let ty = y + 18;
      descLines.forEach((dl) => {
        doc.text(dl, xDesc + 10, ty);
        ty += 14;
      });

      if (r.qty) doc.text(r.qty, xQty + 10, y + 18);
      if (r.rate) doc.text(r.rate, xRate + 10, y + 18);

      doc.text(money(r.amount), xAmt + 10, y + 18);

      y += rowH;
    });

    // Totals box
    y += 18;
    ensurePage(160);

    const boxW = 240;
    const boxX = margin + contentW - boxW;
    const boxH = 110;

    setLine();
    doc.rect(boxX, y, boxW, boxH);

    const left = boxX + 12;
    const right = boxX + boxW - 12;

    let ty = y + 22;

    const totalsLine = (label: string, value: string, bold = false) => {
      font(9, bold);
      setText(bold ? colorText : colorMuted);
      doc.text(label, left, ty);
      setText(colorText);
      doc.text(value, right, ty, { align: "right" });
      ty += 18;
    };

    totalsLine("Labor", money(totals.laborTotal));
    totalsLine("Mileage", money(totals.mileagePay));
    totalsLine("Expenses", money(totals.expensesTotal));

    setLine();
    const divY = ty - 10;
    doc.line(left, divY, right, divY);

    totalsLine("Total", money(totals.grandTotal), true);

    // No footer note (removed per request)

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  }

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-base font-semibold text-white">Invoice PDF</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={generateInvoicePdf}
            className="inline-flex items-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:opacity-90"
          >
            Generate invoice
          </button>
        </div>
      </div>

      {pdfUrl ? (
        <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/25">
          <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/70">
            PDF Preview
          </div>
          <iframe
            title="Invoice PDF Preview"
            src={pdfUrl}
            className="h-[720px] w-full"
          />
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
          Click “Generate invoice” to preview a PDF here, then download it.
        </div>
      )}
    </div>
  );
}
