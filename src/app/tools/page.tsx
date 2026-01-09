"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import ToolsCallout from "@/components/tools/ToolsCallout";
import ToolsGrid, { type ToolCard } from "@/components/tools/ToolsGrid";

const TOOLS: ToolCard[] = [
  {
    title: "Crew Calculator and Invoicing",
    description:
      "Quickly estimate non-union crew costs; rates, days, kit fees, OT, and totals and generate an invoice PDF.",
    href: "/tools/nonunioncalc",
    badge: "Beta",
  },
];

export default function ToolsPage() {
  return (
    <div className="film-grain relative flex min-h-screen flex-col overflow-hidden bg-[#05060a] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-52 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.85)]" />
      </div>

      <Header />

      <main className="relative z-10 flex-1">
        <section className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-6 sm:pt-14">
          <div className="flex flex-col gap-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Tools
            </h1>
            <p className="max-w-3xl text-pretty text-base text-white/70 sm:text-lg">
              Simple utilities built for working filmmakers: quick answers,
              fewer spreadsheets, better prep.
            </p>
          </div>

          <div className="mt-6">
            <ToolsCallout />
          </div>

          <ToolsGrid tools={TOOLS} />

          <div className="h-10" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
