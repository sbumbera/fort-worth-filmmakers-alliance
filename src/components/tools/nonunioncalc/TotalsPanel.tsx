import React from "react";
import { Tooltip } from "@/components/tools/nonunioncalc/Tooltip";
import { formatMoney, round2, safeNumber } from "@/lib/nonUnionCalc";

export default function TotalsPanel({
  totals,
  miles,
  mileageRate,
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
}) {
  const baseLabor = Math.max(0, totals.laborTotal - totals.otBeyond12Total);
  const otLabor = Math.max(0, totals.otBeyond12Total);
  const totalLabor = totals.laborTotal;

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="text-base font-semibold text-white">Totals</div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs font-semibold text-white/70">Labor</div>

          <div className="mt-2 space-y-2 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <Tooltip label="Labor pay within the guaranteed day rate (includes the 1.0x and 1.5x portions of the first 12 paid hours).">
                <span className="text-white/60">Base labor</span>
              </Tooltip>
              <span className="font-semibold text-white">
                {formatMoney(baseLabor)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <Tooltip label="Overtime labor is only the 2.0x hours after 12 paid hours.">
                <span className="text-white/60">OT labor</span>
              </Tooltip>
              <span className="font-semibold text-white">
                {formatMoney(otLabor)}
              </span>
            </div>

            <div className="h-px w-full bg-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-white/60">Total labor</span>
              <span className="font-semibold text-white">
                {formatMoney(totalLabor)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs font-semibold text-white/70">Mileage</div>
          <div className="mt-2 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span className="text-white/60">
                {round2(safeNumber(miles))} mi @{" "}
                {formatMoney(safeNumber(mileageRate))}/mi
              </span>
              <span className="font-semibold text-white">
                {formatMoney(totals.mileagePay)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs font-semibold text-white/70">Expenses</div>
          <div className="mt-2 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Line items total</span>
              <span className="font-semibold text-white">
                {formatMoney(totals.expensesTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tooltip label="Grand total is total labor plus mileage plus expenses.">
            <div className="text-sm font-semibold text-white/80">
              Grand total
            </div>
          </Tooltip>
          <div className="text-lg font-semibold text-white">
            {formatMoney(totals.grandTotal)}
          </div>
        </div>
      </div>
    </div>
  );
}
