import React from "react";
import {
  DayEntry,
  DayCalc,
  formatDateShort,
  uid,
  formatMoney,
  round2,
} from "@/lib/nonUnionCalc";
import FieldLabel from "@/components/tools/nonunioncalc/FieldLabel";
import { Tooltip } from "@/components/tools/nonunioncalc/Tooltip";

function to12HourPreview(hhmm: string) {
  if (!/^\d{2}:\d{2}$/.test(hhmm)) return "";
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return "";

  const suffix = h >= 12 ? "PM" : "AM";
  const h12raw = h % 12;
  const h12 = h12raw === 0 ? 12 : h12raw;
  const mm = String(m).padStart(2, "0");
  return `${h12}:${mm} ${suffix}`;
}

export default function DaysPanel({
  days,
  setDays,
  dayCalcs,
  dayRate,
  baseHourly,
}: {
  days: DayEntry[];
  setDays: React.Dispatch<React.SetStateAction<DayEntry[]>>;
  dayCalcs: Array<{ day: DayEntry; calc: DayCalc }>;
  dayRate: number;
  baseHourly: number;
}) {
  function addDay() {
    setDays((prev) => [
      ...prev,
      { id: uid(), date: "", inTime: "", outTime: "", mealMinutes: "" },
    ]);
  }

  function removeDay(id: string) {
    setDays((prev) => prev.filter((d) => d.id !== id));
  }

  // Display breakdown constants
  const dayOneXHours = 8;
  const dayOnePointFiveHours = 4;

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="text-base font-semibold text-white">Days</div>

      <div className="mt-4 space-y-4">
        {dayCalcs.map(({ day, calc }, idx) => {
          const dateLabel = formatDateShort(day.date);
          const header = dateLabel
            ? `Day ${idx + 1} · ${dateLabel}`
            : `Day ${idx + 1}`;

          const showBreakdown =
            calc.ok && calc.paidHours > 12 && baseHourly > 0;

          const oneXPay = baseHourly > 0 ? baseHourly * dayOneXHours : 0;
          const onePointFivePay =
            baseHourly > 0 ? baseHourly * 1.5 * dayOnePointFiveHours : 0;

          const twoXHours = calc.ok ? calc.otBeyond12Hours : 0;
          const twoXPay = calc.ok ? calc.otBeyond12Pay : 0;

          const dayTotal = calc.ok ? calc.dayPay : 0;

          const inPreview = to12HourPreview(day.inTime);
          const outPreview = to12HourPreview(day.outTime);

          return (
            <div
              key={day.id}
              className="rounded-3xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white/85">
                  {header}
                </div>
                {days.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeDay(day.id)}
                    className="text-xs font-semibold text-white/60 hover:text-white"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                <div className="sm:col-span-1">
                  <FieldLabel
                    title="Date"
                    help="Optional, but recommended for record keeping."
                  />
                  <input
                    type="date"
                    value={day.date}
                    onChange={(e) =>
                      setDays((prev) =>
                        prev.map((d) =>
                          d.id === day.id ? { ...d, date: e.target.value } : d
                        )
                      )
                    }
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  />
                </div>

                <div className="sm:col-span-1">
                  <FieldLabel
                    title="In"
                    help="Call time. Use the picker for the easiest entry."
                  />
                  <input
                    type="time"
                    value={day.inTime}
                    onChange={(e) =>
                      setDays((prev) =>
                        prev.map((d) =>
                          d.id === day.id ? { ...d, inTime: e.target.value } : d
                        )
                      )
                    }
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  />
                  {inPreview ? (
                    <div className="mt-1 text-[11px] text-white/50">
                      {inPreview}
                    </div>
                  ) : null}
                </div>

                <div className="sm:col-span-1">
                  <FieldLabel
                    title="Out"
                    help="Wrap time. If it crosses midnight, we handle it."
                  />
                  <input
                    type="time"
                    value={day.outTime}
                    onChange={(e) =>
                      setDays((prev) =>
                        prev.map((d) =>
                          d.id === day.id
                            ? { ...d, outTime: e.target.value }
                            : d
                        )
                      )
                    }
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  />
                  {outPreview ? (
                    <div className="mt-1 text-[11px] text-white/50">
                      {outPreview}
                    </div>
                  ) : null}
                </div>

                <div className="sm:col-span-1">
                  <FieldLabel
                    title="Meal (minutes)"
                    help="Unpaid meal time subtracted from total."
                  />
                  <input
                    inputMode="numeric"
                    value={day.mealMinutes}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^[0-9]*$/.test(v)) {
                        setDays((prev) =>
                          prev.map((d) =>
                            d.id === day.id ? { ...d, mealMinutes: v } : d
                          )
                        );
                      }
                    }}
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/75">
                {calc.ok ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <Tooltip label="Paid hours = (Out - In) minus meal time.">
                        <div>
                          <span className="text-white/60">Paid hours:</span>{" "}
                          <span className="font-semibold text-white/90">
                            {calc.paidHours.toFixed(2)}h
                          </span>
                        </div>
                      </Tooltip>

                      <div>
                        <span className="text-white/60">Day total:</span>{" "}
                        <span className="font-semibold text-white/90">
                          {formatMoney(dayTotal)}
                        </span>
                      </div>
                    </div>

                    {!showBreakdown ? (
                      <Tooltip label="For 12 paid hours or less, pay is the guaranteed day rate.">
                        <div className="text-sm">
                          <span className="text-white/60">Pay:</span>{" "}
                          <span className="font-semibold text-white/90">
                            Guaranteed day rate
                          </span>
                          {dayRate > 0 ? (
                            <span className="text-white/60">
                              {" "}
                              ({formatMoney(dayRate)})
                            </span>
                          ) : null}
                        </div>
                      </Tooltip>
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                        <div className="mb-2 text-xs font-semibold text-white/70">
                          Breakdown (only 2.0 is OT)
                        </div>

                        <div className="grid gap-2 sm:grid-cols-3">
                          <Tooltip label="First 8 hours at 1.0x. This is part of the guaranteed day rate.">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-white/60">
                                1.0x ({dayOneXHours}h)
                              </span>
                              <span className="font-semibold text-white/90">
                                {formatMoney(oneXPay)}
                              </span>
                            </div>
                          </Tooltip>

                          <Tooltip label="Next 4 hours at 1.5x. This is part of the guaranteed day rate.">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-white/60">
                                1.5x ({dayOnePointFiveHours}h)
                              </span>
                              <span className="font-semibold text-white/90">
                                {formatMoney(onePointFivePay)}
                              </span>
                            </div>
                          </Tooltip>

                          <Tooltip label="Hours after 12 are paid at 2.0x and are the only hours labeled OT.">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-white/60">
                                2.0x OT ({round2(twoXHours)}h)
                              </span>
                              <span className="font-semibold text-white/90">
                                {formatMoney(twoXPay)}
                              </span>
                            </div>
                          </Tooltip>
                        </div>

                        <div className="mt-2 text-xs text-white/60">
                          Total = day rate ({formatMoney(dayRate)}) + OT (
                          {formatMoney(twoXPay)})
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-white/60">
                    Enter valid In and Out times to calculate.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addDay}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          <span className="text-lg leading-none">+</span>
          Add Day
        </button>
      </div>
    </div>
  );
}
