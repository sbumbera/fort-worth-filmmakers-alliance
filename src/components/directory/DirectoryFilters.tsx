// src/components/directory/DirectoryFilters.tsx
import type { Dispatch, SetStateAction } from "react";

export default function DirectoryFilters({
  query,
  setQuery,
  category,
  setCategory,
  categoryOptions,
  matchCount,
}: {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  categoryOptions: Array<{ id: string; label: string }>;
  matchCount: number;
}) {
  return (
    <div className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-5 sm:items-center">
      <div className="sm:col-span-3">
        <label className="block text-xs text-white/60">Search</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a name, acronym, city, or keyword (e.g., DPA, DIFF, IATSE)…"
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-xs text-white/60">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/20"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 text-xs text-white/50">
        Showing {matchCount} result{matchCount === 1 ? "" : "s"}.
      </div>
    </div>
  );
}
