import React from "react";
import FieldLabel from "@/components/tools/nonunioncalc/FieldLabel";
import { Tooltip } from "@/components/tools/nonunioncalc/Tooltip";
import type { LineItem } from "@/lib/nonUnionCalc";
import {
  formatMoney,
  uid,
  safeNumber,
  round2,
  sumExpenses,
} from "@/lib/nonUnionCalc";

export default function InputsPanel({
  dayRateStr,
  setDayRateStr,
  baseHourly,
  milesStr,
  setMilesStr,
  mileageRateStr,
  setMileageRateStr,
  lineItems,
  setLineItems,
}: {
  dayRateStr: string;
  setDayRateStr: (v: string) => void;
  baseHourly: number;

  milesStr: string;
  setMilesStr: (v: string) => void;
  mileageRateStr: string;
  setMileageRateStr: (v: string) => void;

  lineItems: LineItem[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItem[]>>;
}) {
  function addLineItem() {
    setLineItems((prev) => [
      ...prev,
      { id: uid(), title: "", description: "", cost: "" },
    ]);
  }

  function removeLineItem(id: string) {
    setLineItems((prev) => prev.filter((x) => x.id !== id));
  }

  const expensesTotal = sumExpenses(lineItems);

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="text-base font-semibold text-white">Inputs</div>

      <div className="mt-4 space-y-5">
        <div>
          <FieldLabel
            title="Day rate"
            help="Guaranteed pay for 12 paid hours or less. Overtime begins only after 12 paid hours."
          />
          <input
            inputMode="decimal"
            value={dayRateStr}
            onChange={(e) => {
              const v = e.target.value;
              if (/^[0-9]*\.?[0-9]*$/.test(v)) setDayRateStr(v);
            }}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
            placeholder="300"
          />
          <div className="mt-2 text-xs text-white/60">
            Base hourly for OT:{" "}
            <Tooltip label="Used only to compute overtime beyond 12 hours. Day Rate ÷ 14 because a 12-hour day is priced as 14 weighted hours: 8 at 1.0x plus 4 at 1.5x.">
              <span className="font-semibold text-white/80">
                {baseHourly > 0 ? formatMoney(baseHourly) : "$0.00"}
              </span>
            </Tooltip>
            <span className="text-white/50"> per hour</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel title="Miles" help="Total reimbursable miles." />
            <input
              inputMode="decimal"
              value={milesStr}
              onChange={(e) => {
                const v = e.target.value;
                if (/^[0-9]*\.?[0-9]*$/.test(v)) setMilesStr(v);
              }}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
              placeholder="0"
            />
          </div>

          <div>
            <FieldLabel
              title="Rate per mile"
              help="Mileage reimbursement rate. 0.725/mi is standard in Texas"
            />
            <input
              inputMode="decimal"
              value={mileageRateStr}
              onChange={(e) => {
                const v = e.target.value;
                if (/^[0-9]*\.?[0-9]*$/.test(v)) setMileageRateStr(v);
              }}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
              placeholder="0.725"
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-white/80">
              Line items
            </div>
            <div className="text-xs text-white/60">
              Total:{" "}
              <span className="font-semibold text-white/80">
                {formatMoney(expensesTotal)}
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {lineItems.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3 text-xs text-white/60">
                Optional: add reimbursements or purchases (parking, expendables,
                rentals).
              </div>
            ) : null}

            {lineItems.map((it, idx) => (
              <div
                key={it.id}
                className="rounded-2xl border border-white/10 bg-black/25 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-white/70">
                    Line item {idx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLineItem(it.id)}
                    className="text-xs font-semibold text-white/60 hover:text-white"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  <div>
                    <FieldLabel title="Title" />
                    <input
                      value={it.title}
                      onChange={(e) =>
                        setLineItems((prev) =>
                          prev.map((x) =>
                            x.id === it.id
                              ? { ...x, title: e.target.value }
                              : x,
                          ),
                        )
                      }
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                      placeholder="Expense"
                    />
                  </div>

                  <div>
                    <FieldLabel title="Description" />
                    <input
                      value={it.description}
                      onChange={(e) =>
                        setLineItems((prev) =>
                          prev.map((x) =>
                            x.id === it.id
                              ? { ...x, description: e.target.value }
                              : x,
                          ),
                        )
                      }
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                      placeholder="Optional note"
                    />
                  </div>

                  <div>
                    <FieldLabel title="Cost" />
                    <input
                      inputMode="decimal"
                      value={it.cost}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^[0-9]*\.?[0-9]*$/.test(v)) {
                          setLineItems((prev) =>
                            prev.map((x) =>
                              x.id === it.id ? { ...x, cost: v } : x,
                            ),
                          );
                        }
                      }}
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/20"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              <span className="text-lg leading-none">+</span>
              Add line item
            </button>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/60">
              Tip: Line items appear on the invoice as expenses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
