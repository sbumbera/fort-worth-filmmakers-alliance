import React from "react";
import type {
  DayCalc,
  DayEntry,
  InvoiceMeta,
  InvoiceParty,
  LineItem,
} from "@/lib/nonUnionCalc";
import {
  formatMoney,
  round2,
  safeNumber,
  todayISO,
  addDaysISO,
  formatDateShort,
} from "@/lib/nonUnionCalc";

type LaborInvoiceRow = {
  kind: "labor";
  dayLabel: string;
  start: string;
  lunchStart: string;
  lunchEnd: string;
  end: string;
  regular: number;
  overtime: number;
  amount: number;
};

type SimpleInvoiceRow = {
  kind: "simple";
  description: string;
  amount: number;
};

type DividerInvoiceRow = {
  kind: "divider";
};

type InvoiceRow = LaborInvoiceRow | SimpleInvoiceRow | DividerInvoiceRow;

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

function displayTime(value: string) {
  return value?.trim() ? value.trim() : "—";
}

function formatMileageRate(rate: number) {
  const safe = safeNumber(rate);
  if (safe <= 0) return "0";
  return safe.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
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

  const termsDaysRaw = Number(meta.termsDays);
  const hasTerms = Number.isFinite(termsDaysRaw) && termsDaysRaw >= 0;
  const termsDays = hasTerms ? Math.floor(termsDaysRaw) : -1;
  const dueDate = hasTerms ? addDaysISO(invoiceDate, termsDays) : "";
  const termsLabel = !hasTerms
    ? ""
    : termsDays === 0
      ? "Due on receipt"
      : `Net ${termsDays}`;

  async function generateInvoicePdf() {
    const { jsPDF } = await import("jspdf");

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }

    const doc = new jsPDF({ unit: "pt", format: "letter" });

    const pageW = 612;
    const pageH = 792;
    const margin = 36;
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

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, "F");
    setText(colorText);

    let y = margin;

    font(20, true);
    doc.text("Invoice", margin, y);

    const invNum = meta.invoiceNumber?.trim()
      ? meta.invoiceNumber.trim()
      : "N/A";
    const prodNameRaw = meta.productionName?.trim()
      ? meta.productionName.trim()
      : "";
    const jobNumberRaw = meta.jobNumber?.trim() ? meta.jobNumber.trim() : "";

    const detailsRows: Array<[string, string]> = [
      ["Invoice #", invNum],
      ["Invoice date", invoiceDate],
    ];

    if (hasTerms) {
      detailsRows.push(["Due date", dueDate], ["Terms", termsLabel]);
    }

    if (prodNameRaw) detailsRows.push(["Production", prodNameRaw]);
    if (jobNumberRaw) detailsRows.push(["Job #", jobNumberRaw]);
    if (meta.guaranteedHours > 0) {
      detailsRows.push(["Guaranteed day", `${meta.guaranteedHours} hours`]);
    }

    const detailsXRight = margin + contentW;
    const labelW = 110;
    const valueW = 180;
    const rowH = 16;

    let dy = y - 8;
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

    const subtitleText = meta.notes?.trim() || "";
    const rightBlockW = labelW + valueW;
    const subtitleMaxW = contentW - rightBlockW - 12;
    let subY = y + 22;

    font(10, false);
    setText(colorMuted);

    if (subtitleText) {
      const subtitleLines = wrapLines(subtitleText, subtitleMaxW);
      subtitleLines.forEach((ln) => {
        doc.text(ln, margin, subY);
        subY += 14;
      });
    }

    const subtitleBottom = subtitleText ? subY : y + 10;

    const dividerY = Math.max(detailsBottom + 6, subtitleBottom + 6);
    y = dividerY;
    drawHLine(y);
    y += 18;

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

    const rows: InvoiceRow[] = [];

    dayCalcs.forEach((x, idx) => {
      if (!x.calc.ok) return;

      const dateShort = formatDateShort(x.day.date);
      const dayLabel = dateShort
        ? `Day ${idx + 1} (${dateShort})`
        : `Day ${idx + 1}`;

      rows.push({
        kind: "labor",
        dayLabel,
        start: displayTime(x.day.inTime),
        lunchStart: displayTime(x.day.lunchStart),
        lunchEnd: displayTime(x.day.lunchEnd),
        end: displayTime(x.day.outTime),
        regular: x.calc.regularPay,
        overtime: x.calc.otBeyondGuaranteedPay,
        amount: x.calc.dayPay,
      });
    });

    const mileageAmount = totals.mileagePay;
    const expenseItems = lineItems.filter((it) => safeNumber(it.cost) > 0);
    const hasExtras =
      (safeNumber(miles) > 0 &&
        safeNumber(mileageRate) > 0 &&
        mileageAmount > 0) ||
      expenseItems.length > 0;

    if (hasExtras) {
      rows.push({ kind: "divider" });
    }

    if (
      safeNumber(miles) > 0 &&
      safeNumber(mileageRate) > 0 &&
      mileageAmount > 0
    ) {
      rows.push({
        kind: "simple",
        description: `Mileage: ${round2(safeNumber(miles))} miles @ ${formatMileageRate(
          safeNumber(mileageRate),
        )}/mi`,
        amount: mileageAmount,
      });
    }

    expenseItems.forEach((it) => {
      const title = it.title?.trim() ? it.title.trim() : "Expense";
      const desc = it.description?.trim() ? it.description.trim() : "";
      rows.push({
        kind: "simple",
        description: desc ? `${title}: ${desc}` : title,
        amount: safeNumber(it.cost),
      });
    });

    const tableX = margin;
    const tableW = contentW;

    const columns = [
      { key: "day", label: "Day", width: 88 },
      { key: "start", label: "Start", width: 52 },
      { key: "lunchStart", label: "Lunch In", width: 60 },
      { key: "lunchEnd", label: "Lunch Out", width: 64 },
      { key: "end", label: "End", width: 52 },
      { key: "regular", label: "Regular", width: 66 },
      { key: "ot", label: "OT", width: 54 },
      { key: "total", label: "Total", width: 64 },
    ] as const;

    const headerH = 24;
    const rowPadY = 8;

    const xPositions: number[] = [];
    let runningX = tableX;
    columns.forEach((col) => {
      xPositions.push(runningX);
      runningX += col.width;
    });

    const ensurePage = (needed: number) => {
      if (y + needed <= pageH - margin) return;
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageW, pageH, "F");
      y = margin;
    };

    const drawTableHeader = () => {
      doc.setFillColor(
        colorHeaderFill[0],
        colorHeaderFill[1],
        colorHeaderFill[2],
      );
      doc.rect(tableX, y, tableW, headerH, "F");
      setLine();
      doc.setLineWidth(1);
      doc.rect(tableX, y, tableW, headerH);

      for (let i = 1; i < xPositions.length; i += 1) {
        doc.line(xPositions[i], y, xPositions[i], y + headerH);
      }

      font(8, true);
      setText(colorMuted);
      columns.forEach((col, idx) => {
        doc.text(col.label, xPositions[idx] + 6, y + 16);
      });

      y += headerH;
    };

    ensurePage(120);
    drawTableHeader();

    rows.forEach((r) => {
      if (r.kind === "labor") {
        const dayLines = wrapLines(r.dayLabel, columns[0].width - 12);
        const rowHeight = Math.max(26, dayLines.length * 12 + rowPadY);

        ensurePage(rowHeight + 160);
        if (y + rowHeight > pageH - margin) {
          drawTableHeader();
        }

        setLine();
        doc.rect(tableX, y, tableW, rowHeight);
        for (let i = 1; i < xPositions.length; i += 1) {
          doc.line(xPositions[i], y, xPositions[i], y + rowHeight);
        }

        font(8, false);
        setText(colorText);

        let lineY = y + 16;
        dayLines.forEach((line) => {
          doc.text(line, xPositions[0] + 6, lineY);
          lineY += 12;
        });

        doc.text(r.start, xPositions[1] + 6, y + 16);
        doc.text(r.lunchStart, xPositions[2] + 6, y + 16);
        doc.text(r.lunchEnd, xPositions[3] + 6, y + 16);
        doc.text(r.end, xPositions[4] + 6, y + 16);
        doc.text(money(r.regular), xPositions[5] + 6, y + 16);
        doc.text(money(r.overtime), xPositions[6] + 6, y + 16);
        doc.text(money(r.amount), xPositions[7] + 6, y + 16);

        y += rowHeight;
        return;
      }

      if (r.kind === "divider") {
        const dividerHeight = 18;

        ensurePage(dividerHeight + 160);
        if (y + dividerHeight > pageH - margin) {
          drawTableHeader();
        }

        setLine();
        doc.line(
          tableX,
          y + dividerHeight / 2,
          tableX + tableW,
          y + dividerHeight / 2,
        );
        y += dividerHeight;
        return;
      }

      const descMaxW = xPositions[7] - tableX - 12;
      const descLines = wrapLines(r.description, descMaxW);
      const rowHeight = Math.max(24, descLines.length * 12 + rowPadY);

      ensurePage(rowHeight + 160);
      if (y + rowHeight > pageH - margin) {
        drawTableHeader();
      }

      setLine();
      doc.rect(tableX, y, tableW, rowHeight);
      doc.line(xPositions[7], y, xPositions[7], y + rowHeight);

      font(8, false);
      setText(colorText);

      let lineY = y + 16;
      descLines.forEach((line) => {
        doc.text(line, tableX + 6, lineY);
        lineY += 12;
      });

      doc.text(money(r.amount), xPositions[7] + 6, y + 16);

      y += rowHeight;
    });

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

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-white">Invoice PDF</div>
          <div className="mt-1 text-sm text-white/60">
            Generate a PDF invoice using your days, mileage, expenses, terms,
            notes, production name, and job number.
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={generateInvoicePdf}
            className="inline-flex items-center rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Generate PDF
          </button>

          {pdfUrl ? (
            <a
              href={pdfUrl}
              download={`invoice-${meta.invoiceNumber?.trim() || "draft"}.pdf`}
              className="inline-flex items-center rounded-2xl border border-white/12 bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              Download PDF
            </a>
          ) : null}
        </div>
      </div>

      {pdfUrl ? (
        <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white">
          <iframe
            src={pdfUrl}
            title="Invoice PDF Preview"
            className="h-[900px] w-full"
          />
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm text-white/50">
          Generate the invoice to preview it here before downloading.
        </div>
      )}
    </div>
  );
}
