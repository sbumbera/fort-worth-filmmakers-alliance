"use client";

import React from "react";
import type { Entry } from "@/lib/perDiem";
import {
  formatDateShort,
  groupEntriesIntoCards,
  money,
  round2,
} from "@/lib/perDiem";

export default function PerDiemPrintPanel({
  entries,
  pdfUrl,
  setPdfUrl,
  productionName,
  setProductionName,
}: {
  entries: Entry[];
  pdfUrl: string | null;
  setPdfUrl: (url: string | null) => void;

  productionName: string;
  setProductionName: (v: string) => void;
}) {
  async function generatePerDiemPdf() {
    const { jsPDF } = await import("jspdf");

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }

    const cards = groupEntriesIntoCards(entries);

    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pageW = 612;
    const pageH = 792;

    // Normal grid (keep your clean layout)
    const margin = 28;
    const gap = 18;
    const cols = 2;
    const rows = 2;

    const cardW = (pageW - margin * 2 - gap * (cols - 1)) / cols;
    const cardH = (pageH - margin * 2 - gap * (rows - 1)) / rows;

    const ROWS_PER_CARD = 6;

    const colorText = [20, 20, 20] as const;
    const colorMuted = [90, 90, 90] as const;
    const colorLine = [200, 200, 200] as const;
    const colorHeaderFill = [246, 246, 246] as const;

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

    const paintPage = () => {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageW, pageH, "F");
      setText(colorText);
    };

    const newPage = () => {
      doc.addPage();
      paintPage();
    };

    paintPage();

    type CardType = ReturnType<typeof groupEntriesIntoCards>[number];

    // Draw card: identical look to your clean version, but parameterized to support overflow
    const drawCard = (
      x: number,
      y: number,
      cw: number,
      ch: number,
      card: CardType,
      gridRows: number,
      rowsToRender: Array<{ dateISO: string; amount: number }>,
    ) => {
      const pad = 14;
      const innerX = x + pad;
      const innerY = y + pad;
      const innerW = cw - pad * 2;
      const innerBottom = y + ch - pad;

      // Outer border
      setLine();
      doc.setLineWidth(1);
      doc.rect(x, y, cw, ch);

      // Header content
      let cy = innerY;

      font(14, true);
      setText(colorText);
      doc.text("RECEIVED OF PER DIEM", innerX, cy + 14);

      cy += 32;

      font(10, true);
      setText(colorMuted);
      doc.text("TO:", innerX, cy);

      font(13, true);
      setText(colorText);
      doc.text(
        wrapLines(card.personName, innerW - 40)[0] || " ",
        innerX + 32,
        cy,
      );

      cy += 20;

      font(10, true);
      setText(colorMuted);
      doc.text("FOR:", innerX, cy);

      font(12, false);
      setText(colorText);
      const forText = (productionName || "").trim() || " ";
      doc.text(wrapLines(forText, innerW - 48)[0] || " ", innerX + 40, cy);

      cy += 20;

      font(10, true);
      setText(colorMuted);
      doc.text("JOB:", innerX, cy);

      font(13, true);
      setText(colorText);
      // IMPORTANT: do not show N/A; keep it blank if missing
      const jobText = String(card.job || "").trim();
      doc.text(jobText || " ", innerX + 40, cy);

      // Table layout
      const tableX = innerX;
      const tableW = innerW;

      const tableHeaderH = 28;
      const totalRowH = 30;

      let rowH = 26;

      const sigBlockH = 54;
      const gapAfterTotal = 12;
      const sigLineGap = 22;

      const colDate = Math.floor(tableW * 0.44);
      const colAmt = Math.floor(tableW * 0.26);
      const colInit = tableW - colDate - colAmt;

      const xDate = tableX;
      const xAmt = tableX + colDate;
      const xInit = xAmt + colAmt;

      const tableTop = cy + 30;

      // For overflow cards: compute rowH so ALL rows fit cleanly (no bleed)
      // For normal cards: gridRows = 6, this behaves like your baseline.
      const fixedH = tableHeaderH + totalRowH + gapAfterTotal + sigBlockH;
      const availableH = innerBottom - tableTop;

      // Pick a row height that fits all rows; clamp to keep it readable
      const ideal = Math.floor((availableH - fixedH) / Math.max(1, gridRows));
      rowH = Math.min(26, Math.max(14, ideal));

      // If still tight (rare), shrink a bit more (never below 12)
      const requiredHeight = () =>
        tableHeaderH + gridRows * rowH + totalRowH + gapAfterTotal + sigBlockH;

      while (requiredHeight() > availableH && rowH > 12) rowH -= 1;

      // Draw header row
      let ty = tableTop;

      doc.setFillColor(
        colorHeaderFill[0],
        colorHeaderFill[1],
        colorHeaderFill[2],
      );
      doc.rect(tableX, ty, tableW, tableHeaderH, "F");

      setLine();
      doc.rect(tableX, ty, tableW, tableHeaderH);
      doc.line(xAmt, ty, xAmt, ty + tableHeaderH);
      doc.line(xInit, ty, xInit, ty + tableHeaderH);

      font(11, true);
      setText(colorMuted);
      doc.text("DATE", xDate + 10, ty + 18);
      doc.text("AMOUNT", xAmt + 10, ty + 18);
      doc.text("INITIALS", xInit + 10, ty + 18);

      ty += tableHeaderH;

      font(12, false);
      setText(colorText);

      const bodyFontSize = 12;

      // jsPDF uses baseline positioning, so this centers text vertically even when rowH is small.
      const rowTextY = (rowTop: number) =>
        rowTop + rowH / 2 + bodyFontSize * 0.35;

      font(12, false);
      setText(colorText);

      // Render gridRows rows. Only print text when row has real data.
      for (let i = 0; i < gridRows; i++) {
        setLine();
        doc.rect(tableX, ty, tableW, rowH);
        doc.line(xAmt, ty, xAmt, ty + rowH);
        doc.line(xInit, ty, xInit, ty + rowH);

        const r = rowsToRender[i];
        if (r && r.dateISO && r.amount > 0) {
          doc.text(formatDateShort(r.dateISO), xDate + 10, rowTextY(ty));
          doc.text(money(r.amount), xAmt + 10, rowTextY(ty));
        }
        // else: blank row, no text

        ty += rowH;
      }

      // Total row
      doc.setFillColor(
        colorHeaderFill[0],
        colorHeaderFill[1],
        colorHeaderFill[2],
      );
      doc.rect(tableX, ty, tableW, totalRowH, "F");

      setLine();
      doc.rect(tableX, ty, tableW, totalRowH);
      doc.line(xAmt, ty, xAmt, ty + totalRowH);
      doc.line(xInit, ty, xInit, ty + totalRowH);

      font(13, true);
      setText(colorMuted);
      doc.text("TOTAL", xDate + 10, ty + 20);

      setText(colorText);
      doc.text(money(round2(card.total)), xAmt + 10, ty + 20);

      // Signature placement (same as your clean version)
      const tableBottom = ty + totalRowH;
      const sigTopFromTable = tableBottom + gapAfterTotal;
      const sigTopFromBottom = innerBottom - sigBlockH;
      const sigTop = Math.max(sigTopFromTable, sigTopFromBottom);

      const sigX = innerX;
      const sigRight = innerX + innerW;
      const lineW = Math.min(300, innerW);
      const lineX1 = sigRight - lineW;

      let sy = sigTop + 16;

      font(11, true);
      setText(colorMuted);
      doc.text("RECEIVED BY", sigX, sy);
      setLine();
      doc.line(lineX1, sy + 3, sigRight, sy + 3);

      sy += sigLineGap;

      doc.text("APPROVED BY", sigX, sy);
      setLine();
      doc.line(lineX1, sy + 3, sigRight, sy + 3);
    };

    // Split cards into normal vs overflow (overflow means more than 6 date rows)
    const normalCards = cards.filter((c) => c.rows.length <= ROWS_PER_CARD);
    const overflowCards = cards.filter((c) => c.rows.length > ROWS_PER_CARD);

    // Render normal cards first: unchanged 2x2 layout
    if (!cards.length) {
      font(12, true);
      setText(colorText);
      doc.text("No entries to print.", margin, margin + 20);
    } else {
      for (let i = 0; i < normalCards.length; i++) {
        if (i > 0 && i % (cols * rows) === 0) newPage();

        const slot = i % (cols * rows);
        const r = Math.floor(slot / cols);
        const c = slot % cols;

        const x = margin + c * (cardW + gap);
        const y = margin + r * (cardH + gap);

        const rowsToRender = normalCards[i].rows.slice(0, ROWS_PER_CARD);

        drawCard(
          x,
          y,
          cardW,
          cardH,
          normalCards[i],
          ROWS_PER_CARD,
          rowsToRender,
        );
      }

      // Render overflow cards last: cards only, no labels, no titles
      if (overflowCards.length) {
        // Start overflow on a fresh page
        newPage();

        // Full-width cards, 2 per page (top and bottom)
        const ovMargin = 28;
        const ovGap = 18;

        const ovCardW = pageW - ovMargin * 2;
        const ovCardH = (pageH - ovMargin * 2 - ovGap) / 2;

        for (let i = 0; i < overflowCards.length; i++) {
          if (i > 0 && i % 2 === 0) newPage();

          const slot = i % 2;
          const x = ovMargin;
          const y = ovMargin + slot * (ovCardH + ovGap);

          // No cap: render all rows for this person
          const rowsToRender = overflowCards[i].rows;

          drawCard(
            x,
            y,
            ovCardW,
            ovCardH,
            overflowCards[i],
            rowsToRender.length,
            rowsToRender,
          );
        }
      }
    }

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  }

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-white">Per Diem PDF</div>
          <div className="mt-1 text-sm text-white/70">
            Normal cards print first (6 rows). Anyone over 6 prints last as
            full-width cards; cards only, no extra labels.
          </div>
        </div>
        <button
          type="button"
          onClick={generatePerDiemPdf}
          className="inline-flex items-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:opacity-90"
        >
          Generate per diem PDF
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-xs font-semibold text-white/70">
          Production name (optional, prints on FOR line)
        </div>
        <input
          value={productionName}
          onChange={(e) => setProductionName(e.target.value)}
          placeholder="Production name"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
        />
      </div>

      {pdfUrl ? (
        <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/25">
          <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold text-white/70">
            PDF Preview
          </div>
          <iframe
            title="Per Diem PDF Preview"
            src={pdfUrl}
            className="h-[720px] w-full"
          />
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
          Click “Generate per diem PDF” to preview a PDF here.
        </div>
      )}
    </div>
  );
}
