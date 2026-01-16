// src/lib/directoryLookup.ts

import { SECTIONS, type DirectoryItem } from "@/data/directory";

export function flattenDirectoryItems(): DirectoryItem[] {
  return SECTIONS.flatMap((s) => s.items);
}

export function findDirectoryItem(params: {
  orgId?: string;
  orgName?: string;
}): DirectoryItem | null {
  const items = flattenDirectoryItems();

  if (params.orgId) {
    const byId = items.find((i) => i.id === params.orgId);
    if (byId) return byId;
  }

  if (params.orgName) {
    const exact = items.find((i) => i.name === params.orgName);
    if (exact) return exact;
  }

  return null;
}

export function getPrimaryWebsite(
  item: DirectoryItem | null,
): string | undefined {
  const link = item?.links?.find((l) => l.kind === "website");
  return link?.href;
}
