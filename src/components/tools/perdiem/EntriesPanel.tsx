"use client";

import React, { useMemo, useState } from "react";
import type { Entry } from "@/lib/perDiem";
import { formatDateShort, money } from "@/lib/perDiem";

export default function EntriesPanel({
  entries,
  warnings,
}: {
  entries: Entry[];
  warnings: string[];
}) {
  const [showWarnings, setShowWarnings] = useState(true);

  const totalPerDiem = useMemo(() => {
    return entries.reduce((acc, e) => acc + (e.amount || 0), 0);
  }, [entries]);

  const grouped = useMemo(() => {
    // Group by personName + job
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const key = `${e.personName}||${e.job}`;
      const arr = map.get(key) || [];
      arr.push(e);
      map.set(key, arr);
    }

    const groups = Array.from(map.entries()).map(([key, arr]) => {
      arr.sort((a, b) => a.date.localeCompare(b.date));
      const [personName, job] = key.split("||");
      const total = arr.reduce((acc, x) => acc + x.amount, 0);
      return { personName, job, total, items: arr };
    });

    groups.sort((a, b) => a.personName.localeCompare(b.personName));
    return groups;
  }, [entries]);

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-white">Entries</div>
          <div className="mt-1 text-sm text-white/70">
            These are the final rows that will print on cards.
          </div>
        </div>
        <div className="text-xs font-semibold text-white/60">
          Total entries: {entries.length}
        </div>
      </div>

      {warnings.length ? (
        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-white">
              Warnings ({warnings.length})
            </div>
            <button
              type="button"
              onClick={() => setShowWarnings((v) => !v)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 hover:bg-white/10"
            >
              {showWarnings ? "Hide" : "Show"}
            </button>
          </div>
          {showWarnings ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
              {warnings.slice(0, 50).map((w, i) => (
                <li key={i}>{w}</li>
              ))}
              {warnings.length > 50 ? (
                <li className="text-white/60">Showing first 50 warnings.</li>
              ) : null}
            </ul>
          ) : null}
        </div>
      ) : null}

      {grouped.length ? (
        <div className="mt-4 space-y-4">
          {grouped.map((g) => (
            <div
              key={`${g.personName}-${g.job}`}
              className="overflow-hidden rounded-2xl border border-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-sm font-semibold text-white">
                  {g.personName}
                  <span className="ml-2 text-xs font-semibold text-white/60">
                    Job {g.job}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white/70">
                  Total: {money(g.total)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0 text-xs font-semibold text-white/70">
                <div className="border-b border-white/5 px-4 py-2">Date</div>
                <div className="border-b border-white/5 px-4 py-2">Amount</div>
              </div>

              {g.items.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-2 gap-0 border-b border-white/5 px-4 py-2 text-sm text-white last:border-b-0"
                >
                  <div>{formatDateShort(e.date)}</div>
                  <div>{money(e.amount)}</div>
                </div>
              ))}
            </div>
          ))}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-white">
                Total Per Diem
              </div>
              <div className="text-lg font-semibold text-white">
                {money(totalPerDiem)}
              </div>
            </div>
            <div className="mt-1 text-xs text-white/60">
              Quick glance total for the producer.
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
          Add batches with job, amount, dates, and people to generate entries.
        </div>
      )}
    </div>
  );
}
