// src/components/members/MembersFilters.tsx
import type { Dispatch, SetStateAction } from "react";

export default function MembersFilters({
  query,
  setQuery,
  role,
  setRole,
  roleOptions,
  showingCount,
  totalCount,
}: {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  role: string;
  setRole: Dispatch<SetStateAction<string>>;
  roleOptions: string[];
  showingCount: number;
  totalCount: number;
}) {
  // Parse the encoded roleOptions into grouped data for <optgroup>.
  // Encoding format (from roster page):
  //   - "All roles"
  //   - "__DEPT__|{Department}" -> start a new optgroup
  //   - "dept:{Department}" -> selectable department-wide filter label "All {Department}"
  //   - "{Role}" -> selectable role within current department
  const groups: Array<{
    label: string | null; // null means ungrouped (top area)
    options: Array<{ value: string; label: string }>;
  }> = [];

  let currentGroup: {
    label: string | null;
    options: Array<{ value: string; label: string }>;
  } = { label: null, options: [] };

  for (const opt of roleOptions) {
    if (opt.startsWith("__DEPT__|")) {
      // push previous
      if (currentGroup.options.length > 0) groups.push(currentGroup);

      currentGroup = {
        label: opt.slice("__DEPT__|".length),
        options: [],
      };
      continue;
    }

    if (opt.startsWith("dept:")) {
      const deptName = opt.slice("dept:".length);
      currentGroup.options.push({
        value: opt,
        label: `All ${deptName}`,
      });
      continue;
    }

    // Normal option
    currentGroup.options.push({ value: opt, label: opt });
  }

  if (currentGroup.options.length > 0) groups.push(currentGroup);

  return (
    <div className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-5 sm:items-center">
      <div className="min-w-0 sm:col-span-3">
        <label className="block text-xs text-white/60">Search</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a name, role, city, or keyword (e.g., PA, DP, acting)…"
          className="mt-1 w-full min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
        />
      </div>

      <div className="min-w-0 sm:col-span-2">
        <label className="block text-xs text-white/60">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 w-full min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/20"
        >
          {groups.map((g) => {
            // If label is null, render normal ungrouped options (ex: "All roles")
            if (!g.label) {
              return g.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ));
            }

            return (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </div>

      <div className="mt-2 text-xs text-white/50 sm:col-span-5">
        Showing {showingCount} of {totalCount} result
        {totalCount === 1 ? "" : "s"}.
      </div>
    </div>
  );
}
