// src/lib/membersSearch.ts
import { useMemo } from "react";
import type { Member } from "@/data/members";

export type LinkKind =
  | "website"
  | "instagram"
  | "discord"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "x"
  | "linkedin"
  | "email"
  | "imdb"
  | "backstage";

function normalize(str: string) {
  return str.trim().toLowerCase();
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Roles policy:
 * - Acting is ONLY: Actor, Actress
 * - Searching "acting" should match Actor + Actress
 * - Searching "actor" matches Actor
 * - Searching "actress" matches Actress
 */
const ROLE_ALIASES: Record<string, string[]> = {
  actor: ["acting"],
  actress: ["acting"],

  "production assistant (pa)": ["pa", "production assistant"],
  "unit production manager (upm)": ["upm", "unit production manager"],
  "production coordinator": ["prod coordinator", "production coord"],
  "production secretary": ["prod secretary"],

  director: ["directing"],
  "1st assistant director (1st ad)": ["1st ad", "first ad", "ad"],
  "2nd assistant director (2nd ad)": ["2nd ad", "second ad", "ad"],
  "2nd 2nd assistant director (2nd 2nd ad)": ["2nd 2nd ad", "ad"],

  writer: ["writing"],
  screenwriter: ["screenwriting"],

  "director of photography (dp)": ["dp", "dop", "director of photography"],
  cinematographer: ["cinematography", "cinema"],
  "camera operator": ["cam op", "camera op"],
  "steadicam operator": ["steadicam"],
  "1st assistant camera (1st ac)": ["1st ac", "first ac", "ac"],
  "2nd assistant camera (2nd ac)": ["2nd ac", "second ac", "ac"],
  "dit (digital imaging technician)": ["dit", "digital imaging technician"],
  "video assist": ["vtr", "video playback"],
  "drone pilot": ["drone"],

  gaffer: ["gaff"],
  "best boy electric": ["best boy", "b.b. electric"],
  electrician: ["spark"],
  "lighting technician": ["lighting tech", "lamp op"],
  "key grip": ["keygrip"],
  "best boy grip": ["best boy", "b.b. grip"],
  grip: ["grips"],
  "dolly grip": ["dolly"],

  "production sound mixer": ["sound mixer", "mixer"],
  "boom operator": ["boom"],
  "sound utility": ["utility", "sound util"],

  "production designer": ["prod designer"],
  "art director": ["art dir"],
  "set decorator": ["set dec"],
  "props master": ["prop master"],
  "prop assistant": ["props assistant", "prop asst"],
  "set dresser": ["dresser"],
  "construction coordinator": ["construction coord"],
  "scenic artist": ["scenic"],
  "graphic designer (art dept)": ["graphic designer"],

  "costume designer": ["costume"],
  "wardrobe supervisor": ["wardrobe sup"],
  costumer: ["costumes"],
  "set costumer": ["set wardrobe"],

  "key makeup artist": ["key mua", "makeup"],
  "makeup artist": ["mua", "makeup"],
  "key hair stylist": ["key hair"],
  "hair stylist": ["hair"],
  "sfx makeup artist": ["sfx makeup", "special effects makeup"],

  "location manager": ["locations", "loc manager"],
  "assistant location manager": ["asst location manager", "loc asst"],
  "location scout": ["scout"],

  "transportation coordinator": ["transportation", "transpo"],
  driver: ["drivers"],
  "picture car coordinator": ["picture cars", "car coordinator"],

  "craft service": ["crafty"],
  catering: ["caterer"],

  editor: ["editing"],
  "assistant editor": ["ae"],
  colorist: ["color"],
  "sound designer": ["sound design"],
  "re-recording mixer": ["re recording mixer", "re-recording"],
  composer: ["music"],
  "vfx supervisor": ["vfx sup"],
  "vfx artist": ["vfx"],
  "motion graphics designer": ["motion graphics", "mograph"],

  "script supervisor": ["script sup"],
  photographer: ["photo"],
  "unit stills photographer": ["stills", "unit stills"],
  "production accountant": ["accountant"],
  "safety officer": ["safety"],
};

function canonicalizeRoleForSearch(role: string) {
  const r = normalize(role);
  if (r.includes("actress")) return "actress";
  if (r.includes("actor")) return "actor";
  return r;
}

function roleTokens(roles: string[]) {
  const tokens: string[] = [];

  for (const role of roles) {
    const canonical = canonicalizeRoleForSearch(role);
    tokens.push(canonical);

    const aliases = ROLE_ALIASES[canonical];
    if (aliases?.length) tokens.push(...aliases.map(normalize));

    const match = role.match(/\(([^)]+)\)/);
    if (match?.[1]) {
      const inside = match[1].trim();
      if (inside.length <= 8) tokens.push(normalize(inside));
    }
  }

  return Array.from(new Set(tokens));
}

function matchesQuery(haystack: string, q: string) {
  const query = normalize(q);
  if (!query) return true;

  if (query.length <= 2) {
    const re = new RegExp(`\\b${escapeRegex(query)}\\b`, "i");
    return re.test(haystack);
  }

  const re = new RegExp(`\\b${escapeRegex(query)}`, "i");
  return re.test(haystack);
}

export function useFilteredMembers({
  members,
  query,
  role,
}: {
  members: Member[];
  query: string;
  role: string;
}) {
  return useMemo(() => {
    const q = normalize(query);

    return members
      .filter((m) => {
        const roleMatch =
          role === "All roles"
            ? true
            : m.roles.some(
                (r) => canonicalizeRoleForSearch(r) === normalize(role)
              );

        const tokens = roleTokens(m.roles);
        const haystack = [
          m.name,
          m.location ?? "",
          m.bio,
          ...m.roles,
          ...tokens,
        ]
          .join(" ")
          .toLowerCase();

        const queryMatch = matchesQuery(haystack, q);
        return roleMatch && queryMatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [members, query, role]);
}
