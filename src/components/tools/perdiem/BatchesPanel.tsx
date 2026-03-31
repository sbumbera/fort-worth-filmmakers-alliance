"use client";

import React, { useMemo, useRef, useState } from "react";
import type { Batch, Person } from "@/lib/perDiem";
import {
  makeNewBatchPrefilled,
  parseDatesFromTextarea,
  formatDateShort,
} from "@/lib/perDiem";

function joinDatesShort(dates: string[]): string {
  if (!dates?.length) return "None";
  return dates.map((d) => formatDateShort(d)).join(", ");
}

export default function BatchesPanel({
  people,
  batches,
  setBatches,
}: {
  people: Person[];
  batches: Batch[];
  setBatches: (next: Batch[]) => void;
}) {
  const [datesTextById, setDatesTextById] = useState<Record<string, string>>(
    {},
  );

  const peopleById = useMemo(() => {
    const m = new Map<string, Person>();
    for (const p of people) m.set(p.id, p);
    return m;
  }, [people]);

  function createBatch() {
    const prev = batches.length ? batches[batches.length - 1] : undefined;
    const next = makeNewBatchPrefilled(prev);
    setBatches([...batches, next]);
  }

  function removeBatch(id: string) {
    setBatches(batches.filter((b) => b.id !== id));
  }

  function updateBatch(id: string, patch: Partial<Batch>) {
    setBatches(batches.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function togglePerson(batch: Batch, personId: string) {
    const has = batch.personIds.includes(personId);
    const personIds = has
      ? batch.personIds.filter((x) => x !== personId)
      : [...batch.personIds, personId];
    updateBatch(batch.id, { personIds });
  }

  function checkAll(batch: Batch) {
    updateBatch(batch.id, { personIds: people.map((p) => p.id) });
  }

  function uncheckAll(batch: Batch) {
    updateBatch(batch.id, { personIds: [] });
  }

  function setDatesText(batch: Batch, value: string) {
    setDatesTextById((prev) => ({ ...prev, [batch.id]: value }));
  }

  function initDatesText(batch: Batch) {
    if (datesTextById[batch.id] != null) return;
    const seed = batch.dates?.length ? batch.dates.join("\n") : "";
    setDatesTextById((prev) => ({ ...prev, [batch.id]: seed }));
  }

  // Debounced syncing: textarea -> batch.dates
  const syncTimers = useRef<
    Record<string, ReturnType<typeof setTimeout> | undefined>
  >({});

  function setDatesTextLive(batch: Batch, value: string) {
    setDatesText(batch, value);

    const prev = syncTimers.current[batch.id];
    if (prev) clearTimeout(prev);

    syncTimers.current[batch.id] = setTimeout(() => {
      const dates = parseDatesFromTextarea(value);
      updateBatch(batch.id, { dates });
    }, 200);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-white">Batches</div>
          <div className="mt-1 text-sm text-white/70">
            New batch auto-fills job and dates from the previous batch; edit
            anytime.
          </div>
        </div>
      </div>

      {batches.length ? (
        <div className="mt-4 space-y-4">
          {batches.map((b, idx) => {
            initDatesText(b);
            const selectedNames = b.personIds
              .map((id) => peopleById.get(id)?.name)
              .filter(Boolean) as string[];

            return (
              <div
                key={b.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Batch {idx + 1}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Dates: {joinDatesShort(b.dates)}; People:{" "}
                      {b.personIds.length}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeBatch(b.id)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-xs font-semibold text-white/70">
                      Job number
                    </div>
                    <input
                      value={b.job}
                      onChange={(e) =>
                        updateBatch(b.id, { job: e.target.value })
                      }
                      placeholder="123"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-white/70">
                      Amount
                    </div>
                    <input
                      value={b.amountStr}
                      onChange={(e) =>
                        updateBatch(b.id, { amountStr: e.target.value })
                      }
                      placeholder="20"
                      inputMode="decimal"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
                    />
                    <div className="mt-1 text-[11px] text-white/50">
                      Enter number only, example: 20 or 500
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-white/70">
                      Dates (ISO or M/D/YYYY)
                    </div>
                    <textarea
                      value={datesTextById[b.id] ?? ""}
                      onChange={(e) => setDatesTextLive(b, e.target.value)}
                      rows={3}
                      placeholder={"2026-03-01\n2026-03-02"}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
                    />
                    <div className="mt-1 text-[11px] text-white/50">
                      Dates apply automatically while you type.
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-white/70">
                      People in this batch
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => checkAll(b)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
                      >
                        Check all
                      </button>
                      <button
                        type="button"
                        onClick={() => uncheckAll(b)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
                      >
                        Uncheck all
                      </button>
                    </div>
                  </div>

                  {people.length ? (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {people.map((p) => {
                        const checked = b.personIds.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white hover:bg-black/30"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePerson(b, p.id)}
                              className="h-4 w-4 accent-white"
                            />
                            <span className="truncate">{p.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/70">
                      Add people first.
                    </div>
                  )}

                  {selectedNames.length ? (
                    <div className="mt-3 text-xs text-white/60">
                      Selected: {selectedNames.join(", ")}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}

          {/* New batch button at bottom */}
          <div className="pt-2">
            <button
              type="button"
              onClick={createBatch}
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:opacity-90"
            >
              New batch
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
          Click “New batch” to start.
        </div>
      )}
    </div>
  );
}
