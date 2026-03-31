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
  guaranteedHours,
}: {
  days: DayEntry[];
  setDays: React.Dispatch<React.SetStateAction<DayEntry[]>>;
  dayCalcs: Array<{ day: DayEntry; calc: DayCalc }>;
  dayRate: number;
  baseHourly: number;
  guaranteedHours: number;
}) {
  function addDay() {
    setDays((prev) => [
      ...prev,
      {
        id: uid(),
        date: "",
        inTime: "",
        outTime: "",
        lunchStart: "",
        lunchEnd: "",
      },
    ]);
  }

  function removeDay(id: string) {
    setDays((prev) => prev.filter((d) => d.id !== id));
  }

  const dayOneXHours = Math.min(8, guaranteedHours);
  const dayOnePointFiveHours = Math.max(0, guaranteedHours - dayOneXHours);

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
            calc.ok && calc.paidHours > guaranteedHours && baseHourly > 0;

          const oneXPay = baseHourly > 0 ? baseHourly * dayOneXHours : 0;
          const onePointFivePay =
            baseHourly > 0 ? baseHourly * 1.5 * dayOnePointFiveHours : 0;

          const twoXHours = calc.ok ? calc.otBeyondGuaranteedHours : 0;
          const twoXPay = calc.ok ? calc.otBeyondGuaranteedPay : 0;

          const dayTotal = calc.ok ? calc.dayPay : 0;

          const inPreview = to12HourPreview(day.inTime);
          const outPreview = to12HourPreview(day.outTime);
          const lunchStartPreview = to12HourPreview(day.lunchStart);
          const lunchEndPreview = to12HourPreview(day.lunchEnd);

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

              <div className="mt-3 grid gap-3 sm:grid-cols-5">
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
                          d.id === day.id ? { ...d, date: e.target.value } : d,
                        ),
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
                          d.id === day.id
                            ? { ...d, inTime: e.target.value }
                            : d,
                        ),
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
                    title="Lunch start"
                    help="Optional. If used, lunch end is also required."
                  />
                  <input
                    type="time"
                    value={day.lunchStart}
                    onChange={(e) =>
                      setDays((prev) =>
                        prev.map((d) =>
                          d.id === day.id
                            ? { ...d, lunchStart: e.target.value }
                            : d,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  />
                  {lunchStartPreview ? (
                    <div className="mt-1 text-[11px] text-white/50">
                      {lunchStartPreview}
                    </div>
                  ) : null}
                </div>

                <div className="sm:col-span-1">
                  <FieldLabel
                    title="Lunch end"
                    help="Optional. If used, lunch start is also required."
                  />
                  <input
                    type="time"
                    value={day.lunchEnd}
                    onChange={(e) =>
                      setDays((prev) =>
                        prev.map((d) =>
                          d.id === day.id
                            ? { ...d, lunchEnd: e.target.value }
                            : d,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                  />
                  {lunchEndPreview ? (
                    <div className="mt-1 text-[11px] text-white/50">
                      {lunchEndPreview}
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
                            : d,
                        ),
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
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/75">
                {calc.ok ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        Paid hours:{" "}
                        <span className="font-semibold text-white">
                          {round2(calc.paidHours)}h
                        </span>
                      </div>
                      <div>
                        Day total:{" "}
                        <span className="font-semibold text-white">
                          {formatMoney(dayTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-white/60">
                      Guaranteed: {guaranteedHours}h · Lunch deducted:{" "}
                      {round2(calc.lunchMinutes / 60)}h
                    </div>

                    {showBreakdown ? (
                      <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                          Pay breakdown
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <Tooltip label="First segment at 1.0x. This is part of the guaranteed day rate.">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-white/60">
                                1.0x ({dayOneXHours}h)
                              </span>
                              <span className="font-semibold text-white/90">
                                {formatMoney(oneXPay)}
                              </span>
                            </div>
                          </Tooltip>

                          <Tooltip label="Second segment at 1.5x. This is part of the guaranteed day rate.">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-white/60">
                                1.5x ({dayOnePointFiveHours}h)
                              </span>
                              <span className="font-semibold text-white/90">
                                {formatMoney(onePointFivePay)}
                              </span>
                            </div>
                          </Tooltip>

                          <Tooltip label="Hours after the guaranteed day are paid at 2.0x and are the only hours labeled OT.">
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
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {calc.errors.length ? (
                      calc.errors.map((err) => (
                        <div key={err} className="text-white/60">
                          {err}
                        </div>
                      ))
                    ) : (
                      <div className="text-white/60">
                        Enter valid In and Out times to calculate.
                      </div>
                    )}
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
