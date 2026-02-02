// src/app/roster/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { MEMBERS } from "@/data/members";
import { useFilteredMembers } from "@/lib/membersSearch";

import GetListedCallout from "@/components/members/GetListedCallout";
import MembersFilters from "@/components/members/MembersFilters";
import MembersGrid from "@/components/members/MembersGrid";
import LoadMoreButton from "@/components/members/LoadMoreButton";
import EmptyState from "@/components/members/EmptyState";

type RoleGroup = {
  department: string;
  roles: string[];
};

/**
 * Roles grouped by department (A–Z) and roles inside each department (A–Z).
 * Includes baseline/common roles so "normal" crew positions do not go missing.
 */
const ROLE_GROUPS: RoleGroup[] = [
  { department: "Acting", roles: ["Actor", "Actress"] },
  {
    department: "Art Department",
    roles: [
      "Art Director",
      "Construction Coordinator",
      "Graphic Designer (Art Dept)",
      "Production Designer",
      "Prop Assistant",
      "Props Master",
      "Scenic Artist",
      "Set Decorator",
      "Set Dresser",
    ],
  },
  {
    department: "Camera Department",
    roles: [
      "1st Assistant Camera (1st AC)",
      "2nd Assistant Camera (2nd AC)",
      "Camera Operator",
      "Cinematographer",
      "DIT (Digital Imaging Technician)",
      "Director of Photography (DP)",
      "Drone Pilot",
      "Steadicam Operator",
      "Unit Stills Photographer",
      "Video Assist",
    ],
  },
  {
    department: "Costume Department",
    roles: [
      "Costume Designer",
      "Costumer",
      "Set Costumer",
      "Wardrobe Supervisor",
    ],
  },
  {
    department: "Directing",
    roles: [
      "1st Assistant Director (1st AD)",
      "2nd 2nd Assistant Director (2nd 2nd AD)",
      "2nd Assistant Director (2nd AD)",
      "Director",
      "Script Supervisor",
      "Showrunner",
    ],
  },
  {
    department: "Editorial",
    roles: ["Assistant Editor", "Colorist", "Editor"],
  },
  {
    department: "Electric",
    roles: [
      "Best Boy Electric",
      "Electrician",
      "Gaffer",
      "Lighting Technician",
    ],
  },
  {
    department: "Grip",
    roles: ["Best Boy Grip", "Dolly Grip", "Grip", "Key Grip"],
  },
  {
    department: "Hair and Makeup",
    roles: [
      "Hair and Makeup Artist",
      "Hair Stylist",
      "Key Hair Stylist",
      "Key Makeup Artist",
      "Makeup Artist",
      "SFX Makeup Artist",
    ],
  },
  {
    department: "Locations",
    roles: ["Assistant Location Manager", "Location Manager", "Location Scout"],
  },
  { department: "Music", roles: ["Composer"] },
  { department: "Post Sound", roles: ["Re-Recording Mixer", "Sound Designer"] },
  {
    department: "Production",
    roles: [
      "Associate Producer",
      "Co-Producer",
      "Craft Service",
      "Executive Producer",
      "Line Producer",
      "Producer",
      "Production Accountant",
      "Production Assistant (PA)",
      "Production Coordinator",
      "Production Secretary",
      "Safety Officer",
      "Unit Production Manager (UPM)",
    ],
  },
  {
    department: "Sound Department",
    roles: ["Boom Operator", "Sound Mixer", "Sound Utility"],
  },
  {
    department: "Transportation",
    roles: ["Driver", "Picture Car Coordinator", "Transportation Coordinator"],
  },
  {
    department: "Visual Effects",
    roles: ["Motion Graphics Designer", "VFX Artist", "VFX Supervisor"],
  },
  { department: "Writing", roles: ["Screenwriter", "Writer"] },
];

/**
 * Synonyms/normalization to dedupe (ex: DP vs Director of Photography).
 * Also maps common variants back to a single canonical label.
 */
const ROLE_SYNONYMS: Array<{ canonical: string; synonyms: string[] }> = [
  {
    canonical: "Director of Photography (DP)",
    synonyms: ["DP", "DOP", "DoP", "Director of Photography"],
  },
  {
    canonical: "Sound Mixer",
    synonyms: [
      "Production Sound Mixer",
      "Production Mixer",
      "Mixer",
      "Sound Recordist",
    ],
  },
  {
    canonical: "Unit Stills Photographer",
    synonyms: ["Photographer", "Stills Photographer", "Unit Photographer"],
  },
];

function normalizeRoleLabel(label: string) {
  const trimmed = label.trim();
  for (const entry of ROLE_SYNONYMS) {
    const canon = entry.canonical.toLowerCase();
    const val = trimmed.toLowerCase();
    if (val === canon) return entry.canonical;
    for (const s of entry.synonyms) {
      if (val === s.toLowerCase()) return entry.canonical;
    }
  }
  return trimmed;
}

function uniqSorted(items: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const normalized = normalizeRoleLabel(item);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      out.push(normalized);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

const SORTED_GROUPS = ROLE_GROUPS.map((g) => ({
  department: g.department,
  roles: uniqSorted(g.roles),
})).sort((a, b) => a.department.localeCompare(b.department));

const DEPT_TO_ROLES = new Map<string, string[]>(
  SORTED_GROUPS.map((g) => [g.department, g.roles]),
);

/**
 * Instead of fake "____________" divider rows (ugly, ambiguous),
 * we use a structured dropdown with <optgroup> so departments are obvious and bolded by the browser UI.
 *
 * roleOptions is now a structured object, but MembersFilters already expects string[].
 * So we pass a single encoded string[] that MembersFilters will convert into grouped <option>s.
 *
 * Format:
 *   - "All roles"
 *   - "__DEPT__|{Department}" (rendered as optgroup label, not selectable)
 *   - "dept:{Department}" (selectable: All {Department})
 *   - "{Role}" (selectable)
 */
const ROLE_OPTIONS: string[] = (() => {
  const options: string[] = ["All roles"];
  for (const g of SORTED_GROUPS) {
    options.push(`__DEPT__|${g.department}`);
    options.push(`dept:${g.department}`);
    for (const r of g.roles) options.push(r);
  }
  return options;
})();

const PAGE_SIZE = 30;

export default function MembersPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("All roles");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Keep search behavior: use existing hook for query filtering only.
  const queryFiltered = useFilteredMembers({
    members: MEMBERS,
    query,
    role: "All roles",
  });

  const roleFiltered = useMemo(() => {
    if (!role || role === "All roles") return queryFiltered;

    // Department selection: role will be "dept:Camera Department"
    if (role.startsWith("dept:")) {
      const dept = role.slice("dept:".length);
      const deptRoles = DEPT_TO_ROLES.get(dept) ?? [];
      const deptRoleSet = new Set(deptRoles.map((r) => normalizeRoleLabel(r)));

      return queryFiltered.filter((m: any) => {
        const memberRoles: string[] = Array.isArray(m.roles)
          ? m.roles
          : m.role
            ? [m.role]
            : [];

        return memberRoles.some((mr) =>
          deptRoleSet.has(normalizeRoleLabel(mr)),
        );
      });
    }

    // If the user somehow selected the dept marker row, ignore it
    if (role.startsWith("__DEPT__|")) return queryFiltered;

    // Specific role selection
    const selected = normalizeRoleLabel(role);

    return queryFiltered.filter((m: any) => {
      const memberRoles: string[] = Array.isArray(m.roles)
        ? m.roles
        : m.role
          ? [m.role]
          : [];

      return memberRoles.some((mr) => normalizeRoleLabel(mr) === selected);
    });
  }, [queryFiltered, role]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, role]);

  const visible = useMemo(
    () => roleFiltered.slice(0, visibleCount),
    [roleFiltered, visibleCount],
  );

  const canLoadMore = visibleCount < roleFiltered.length;

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
        <section>
          <div className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-6 sm:pt-14">
            <div className="flex flex-col gap-3">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Local talent and crew
              </h1>
              <p className="max-w-3xl text-pretty text-base text-white/70 sm:text-lg">
                Search by name, role, city, keywords, or acronyms; then filter
                by role to crew up fast.
              </p>
            </div>

            <div className="mt-6">
              <GetListedCallout />
            </div>

            <MembersFilters
              query={query}
              setQuery={setQuery}
              role={role}
              setRole={setRole}
              roleOptions={ROLE_OPTIONS}
              showingCount={visible.length}
              totalCount={roleFiltered.length}
            />

            <MembersGrid members={visible} />

            {roleFiltered.length === 0 ? <EmptyState /> : null}

            {roleFiltered.length > 0 && canLoadMore ? (
              <LoadMoreButton
                onClick={() =>
                  setVisibleCount((v) =>
                    Math.min(roleFiltered.length, v + PAGE_SIZE),
                  )
                }
              />
            ) : null}

            <div className="mt-10">
              <GetListedCallout />
            </div>

            {/* spacer so content never kisses footer */}
            <div className="h-10" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
