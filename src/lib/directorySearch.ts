// src/lib/directorySearch.ts

import { useMemo } from "react";
import type {
  LinkKind,
  DirectoryItem,
  DirectorySection,
} from "@/data/directory";

function normalize(str: string) {
  return str.trim().toLowerCase();
}

function getKindLabel(kind: LinkKind) {
  switch (kind) {
    case "website":
      return "Website";
    case "instagram":
      return "Instagram";
    case "discord":
      return "Discord";
    case "facebook":
      return "Facebook";
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    case "x":
      return "X";
    case "linkedin":
      return "LinkedIn";
    case "email":
      return "Email";
    default:
      return "Link";
  }
}

function sanitizeLinks(items: DirectoryItem[]) {
  return items.map((it) => {
    const seen = new Set<string>();
    const links = it.links
      .filter((l) => l.href?.trim())
      .map((l) => ({
        ...l,
        label: l.label?.trim() ? l.label : getKindLabel(l.kind),
      }))
      .filter((l) => {
        const key = `${l.kind}:${l.href}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    return { ...it, links };
  });
}

export function buildCategoryOptions(sections: DirectorySection[]) {
  return [
    { id: "all", label: "All categories" },
    ...sections.map((s) => ({ id: s.id, label: s.title })),
  ];
}

export function useFilteredDirectorySections({
  sections,
  query,
  category,
}: {
  sections: DirectorySection[];
  query: string;
  category: string;
}) {
  return useMemo(() => {
    const q = normalize(query);

    const scoped =
      category === "all" ? sections : sections.filter((s) => s.id === category);

    return scoped
      .map((section) => {
        const items = sanitizeLinks(section.items)
          .filter((item) => {
            const haystack = [item.name, item.location ?? "", item.description]
              .join(" ")
              .toLowerCase();

            return q ? haystack.includes(q) : true;
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        return { ...section, items };
      })
      .filter((s) => s.items.length > 0);
  }, [sections, query, category]);
}

export function countDirectoryMatches(filteredSections: DirectorySection[]) {
  return filteredSections.reduce((acc, s) => acc + s.items.length, 0);
}
