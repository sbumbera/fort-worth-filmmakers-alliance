"use client";

import React from "react";
import type { PerDiemCard } from "@/lib/perDiem";
import { formatDateShort, money } from "@/lib/perDiem";

export default function PerDiemPreviewCard({ card }: { card: PerDiemCard }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs font-semibold text-white/70">
        RECEIVED OF PER DIEM
      </div>

      <div className="mt-2 text-sm text-white">
        <span className="text-white/60">TO:</span> {card.personName}
      </div>

      <div className="mt-1 text-sm text-white">
        <span className="text-white/60">JOB:</span> {card.job}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-3 bg-white/[0.03] text-xs font-semibold text-white/70">
          <div className="px-3 py-2">DATE</div>
          <div className="px-3 py-2">AMOUNT</div>
          <div className="px-3 py-2">INITIALS</div>
        </div>
        {card.rows.map((r) => (
          <div
            key={r.dateISO}
            className="grid grid-cols-3 border-t border-white/5 text-sm text-white"
          >
            <div className="px-3 py-2">{formatDateShort(r.dateISO)}</div>
            <div className="px-3 py-2">{money(r.amount)}</div>
            <div className="px-3 py-2 text-white/40"> </div>
          </div>
        ))}
        <div className="grid grid-cols-3 border-t border-white/10 bg-white/[0.03] text-sm font-semibold text-white">
          <div className="px-3 py-2 text-white/70">TOTAL</div>
          <div className="px-3 py-2">{money(card.total)}</div>
          <div className="px-3 py-2" />
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs text-white/60">
        <div className="flex items-center justify-between">
          <span>RECEIVED BY</span>
          <span className="ml-3 inline-block w-40 border-b border-white/15" />
        </div>
        <div className="flex items-center justify-between">
          <span>APPROVED BY</span>
          <span className="ml-3 inline-block w-40 border-b border-white/15" />
        </div>
      </div>
    </div>
  );
}
