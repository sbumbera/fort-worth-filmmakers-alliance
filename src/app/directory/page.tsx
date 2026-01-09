"use client";

import { useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

import { SECTIONS } from "@/data/directory";
import {
  buildCategoryOptions,
  countDirectoryMatches,
  useFilteredDirectorySections,
} from "@/lib/directorySearch";

import DirectoryCallout from "@/components/directory/DirectoryCallout";
import DirectoryFilters from "@/components/directory/DirectoryFilters";
import DirectorySections from "@/components/directory/DirectorySections";

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categoryOptions = useMemo(() => buildCategoryOptions(SECTIONS), []);
  const filteredSections = useFilteredDirectorySections({
    sections: SECTIONS,
    query,
    category,
  });
  const matchCount = useMemo(
    () => countDirectoryMatches(filteredSections),
    [filteredSections]
  );

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
        <section className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-6 sm:pt-14">
          <div className="flex flex-col gap-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Directory
            </h1>
            <p className="max-w-3xl text-pretty text-base text-white/70 sm:text-lg">
              A living, manually curated directory of the DFW film ecosystem:
              commissions, orgs, festivals, unions, training, studios, post, and
              rentals. If it is not listed, we do not have a verified link yet.
            </p>
          </div>

          <div className="mt-6">
            <DirectoryCallout />
          </div>

          <DirectoryFilters
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            categoryOptions={categoryOptions}
            matchCount={matchCount}
          />

          <DirectorySections sections={filteredSections} />

          <div className="mt-10">
            <DirectoryCallout />
          </div>

          <div className="h-10" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
