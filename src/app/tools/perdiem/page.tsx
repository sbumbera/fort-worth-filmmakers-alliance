"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

import PeoplePanel from "@/components/tools/perdiem/PeoplePanel";
import BatchesPanel from "@/components/tools/perdiem/BatchesPanel";
import EntriesPanel from "@/components/tools/perdiem/EntriesPanel";
import PerDiemPrintPanel from "@/components/tools/perdiem/PerDiemPrintPanel";

import type { Batch, Person } from "@/lib/perDiem";
import { buildEntriesFromBatches, makeNewBatchPrefilled } from "@/lib/perDiem";

export default function PerDiemToolPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [batches, setBatches] = useState<Batch[]>([makeNewBatchPrefilled()]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [productionName, setProductionName] = useState<string>("");

  // Auto-check everyone on the first batch once people exist.
  // Also remove selections that no longer exist if people are removed.
  useEffect(() => {
    setBatches((prev) => {
      if (!prev.length) return prev;

      const validIds = new Set(people.map((p) => p.id));
      const allIds = people.map((p) => p.id);

      const next = prev.map((b, idx) => {
        const cleaned = (b.personIds || []).filter((id) => validIds.has(id));

        if (idx === 0) {
          if (allIds.length && cleaned.length === 0) {
            return { ...b, personIds: allIds };
          }
        }

        if (cleaned.length !== (b.personIds || []).length) {
          return { ...b, personIds: cleaned };
        }

        return b;
      });

      return next;
    });
  }, [people]);

  const build = useMemo(() => {
    return buildEntriesFromBatches({
      people,
      batches,
      duplicatePolicy: "skip",
    });
  }, [people, batches]);

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
                  Per Diem Cards Generator
                </h1>
                <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  Production
                </span>
              </div>

              <p className="max-w-3xl text-pretty text-base text-white/70 sm:text-lg">
                Build per diem cards fast using batches. New batches auto-fill
                job number and dates from the previous batch; edit anytime.
                Generate a PDF with multiple cards per page for cutting and
                signatures.
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
              <PeoplePanel people={people} setPeople={setPeople} />

              <BatchesPanel
                people={people}
                batches={batches}
                setBatches={setBatches}
              />

              <EntriesPanel entries={build.entries} warnings={build.warnings} />

              <PerDiemPrintPanel
                entries={build.entries}
                pdfUrl={pdfUrl}
                setPdfUrl={setPdfUrl}
                productionName={productionName}
                setProductionName={setProductionName}
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
