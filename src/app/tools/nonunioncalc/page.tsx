"use client";

import { useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

import InputsPanel from "@/components/tools/nonunioncalc/InputsPanel";
import DaysPanel from "@/components/tools/nonunioncalc/DaysPanel";
import TotalsPanel from "@/components/tools/nonunioncalc/TotalsPanel";
import InvoiceInfoPanel from "@/components/tools/nonunioncalc/InvoiceInfoPanel";
import InvoicePanel from "@/components/tools/nonunioncalc/InvoicePanel";

import {
  DayEntry,
  LineItem,
  InvoiceMeta,
  InvoiceParty,
  calcDay,
  computeBaseHourly,
  safeNumber,
  sumExpenses,
  sumMileage,
  sumLabor,
  todayISO,
  uid,
} from "@/lib/nonUnionCalc";

export default function NonUnionCrewCalculatorPage() {
  // Calculator inputs
  const [dayRateStr, setDayRateStr] = useState<string>("");
  const [milesStr, setMilesStr] = useState<string>("");
  const [mileageRateStr, setMileageRateStr] = useState<string>("0.725");

  const dayRate = safeNumber(dayRateStr);
  const miles = safeNumber(milesStr);
  const mileageRate = safeNumber(mileageRateStr);

  const [days, setDays] = useState<DayEntry[]>([
    { id: uid(), date: "", inTime: "", outTime: "", mealMinutes: "" },
  ]);

  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  // Invoice info (kept separate so calculator can be used first)
  const [from, setFrom] = useState<InvoiceParty>({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [to, setTo] = useState<InvoiceParty>({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [meta, setMeta] = useState<InvoiceMeta>({
    invoiceNumber: "",
    invoiceDate: todayISO(),
    productionName: "",
    termsDays: 30,
  });

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const baseHourly = useMemo(() => computeBaseHourly(dayRate), [dayRate]);

  const dayCalcs = useMemo(() => {
    return days.map((d) => ({
      day: d,
      calc: calcDay({
        dayRate,
        baseHourly,
        inTime: d.inTime,
        outTime: d.outTime,
        mealMinutes: safeNumber(d.mealMinutes),
      }),
    }));
  }, [days, baseHourly, dayRate]);

  const expensesTotal = useMemo(() => sumExpenses(lineItems), [lineItems]);

  const totals = useMemo(() => {
    const laborTotal = sumLabor(dayCalcs.map((x) => x.calc.dayPay));
    const otBeyond12Total = dayCalcs.reduce(
      (acc, x) => acc + x.calc.otBeyond12Pay,
      0,
    );
    const mileagePay = sumMileage(miles, mileageRate);
    const grandTotal = laborTotal + mileagePay + expensesTotal;

    return {
      laborTotal,
      otBeyond12Total,
      mileagePay,
      expensesTotal,
      grandTotal,
    };
  }, [dayCalcs, miles, mileageRate, expensesTotal]);

  return (
    <div className="film-grain relative flex min-h-screen flex-col overflow-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-52 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.85)]" />
      </div>

      <Header />

      <main className="relative z-10 flex-1">
        <section>
          <div className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-6 sm:pt-14">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Non-Union Crew Calculator and Invoicing
                </h1>
                <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  Educational
                </span>
              </div>

              <p className="max-w-3xl text-pretty text-base text-white/70 sm:text-lg">
                Calculating pay in this industry is weird. Day rate is
                guaranteed for 12 paid hours or less. Overtime begins after 12
                paid hours. Use this tool to calculate everything and generate
                an invoice.
              </p>

              <div>
                <Link
                  href="/tools"
                  className="inline-flex items-center rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  ← Back to Tools
                </Link>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {/* Calculator first */}
              <InputsPanel
                dayRateStr={dayRateStr}
                setDayRateStr={setDayRateStr}
                baseHourly={baseHourly}
                milesStr={milesStr}
                setMilesStr={setMilesStr}
                mileageRateStr={mileageRateStr}
                setMileageRateStr={setMileageRateStr}
                lineItems={lineItems}
                setLineItems={setLineItems}
              />

              <DaysPanel
                days={days}
                setDays={setDays}
                dayCalcs={dayCalcs}
                dayRate={dayRate}
                baseHourly={baseHourly}
              />

              <TotalsPanel
                totals={totals}
                miles={miles}
                mileageRate={mileageRate}
              />

              {/* Invoice info second */}
              <InvoiceInfoPanel
                meta={meta}
                setMeta={setMeta}
                from={from}
                setFrom={setFrom}
                to={to}
                setTo={setTo}
              />

              {/* PDF last */}
              <InvoicePanel
                totals={totals}
                miles={miles}
                mileageRate={mileageRate}
                lineItems={lineItems}
                dayCalcs={dayCalcs}
                meta={meta}
                from={from}
                to={to}
                pdfUrl={pdfUrl}
                setPdfUrl={setPdfUrl}
              />

              <div className="h-10" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
