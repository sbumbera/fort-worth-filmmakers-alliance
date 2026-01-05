// src/app/members/page.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  InstagramIcon,
  DiscordIcon,
  WebsiteIcon,
  FacebookIcon,
  YouTubeIcon,
  TikTokIcon,
  XIcon,
  LinkedInIcon,
  EmailIcon,
  IMDbIcon,
  BackstageIcon,
} from "@/components/icons";

import {
  MEMBERS,
  type LinkKind,
  type Member,
  type MemberLink,
} from "@/data/members";

const FWFA_LINKS = {
  instagram: "https://www.instagram.com/fortworthfilmmakers",
  discord: "https://discord.gg/aJrsuTHg5Z",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
  // Acting (simplified)
  actor: ["acting"],
  actress: ["acting"],

  // Production
  "production assistant (pa)": ["pa", "production assistant"],
  "unit production manager (upm)": ["upm", "unit production manager"],
  "production coordinator": ["prod coordinator", "production coord"],
  "production secretary": ["prod secretary"],

  // Directing
  director: ["directing"],
  "1st assistant director (1st ad)": ["1st ad", "first ad", "ad"],
  "2nd assistant director (2nd ad)": ["2nd ad", "second ad", "ad"],
  "2nd 2nd assistant director (2nd 2nd ad)": ["2nd 2nd ad", "ad"],

  // Writing
  writer: ["writing"],
  screenwriter: ["screenwriting"],

  // Camera
  "director of photography (dp)": ["dp", "dop", "director of photography"],
  cinematographer: ["cinematography", "cinema"],
  "camera operator": ["cam op", "camera op"],
  "steadicam operator": ["steadicam"],
  "1st assistant camera (1st ac)": ["1st ac", "first ac", "ac"],
  "2nd assistant camera (2nd ac)": ["2nd ac", "second ac", "ac"],
  "dit (digital imaging technician)": ["dit", "digital imaging technician"],
  "video assist": ["vtr", "video playback"],
  "drone pilot": ["drone"],

  // Electric / Grip
  gaffer: ["gaff"],
  "best boy electric": ["best boy", "b.b. electric"],
  electrician: ["spark"],
  "lighting technician": ["lighting tech", "lamp op"],
  "key grip": ["keygrip"],
  "best boy grip": ["best boy", "b.b. grip"],
  grip: ["grips"],
  "dolly grip": ["dolly"],

  // Sound
  "production sound mixer": ["sound mixer", "mixer"],
  "boom operator": ["boom"],
  "sound utility": ["utility", "sound util"],

  // Art Department
  "production designer": ["prod designer"],
  "art director": ["art dir"],
  "set decorator": ["set dec"],
  "props master": ["prop master"],
  "prop assistant": ["props assistant", "prop asst"],
  "set dresser": ["dresser"],
  "construction coordinator": ["construction coord"],
  "scenic artist": ["scenic"],
  "graphic designer (art dept)": ["graphic designer"],

  // Wardrobe
  "costume designer": ["costume"],
  "wardrobe supervisor": ["wardrobe sup"],
  costumer: ["costumes"],
  "set costumer": ["set wardrobe"],

  // HMU
  "key makeup artist": ["key mua", "makeup"],
  "makeup artist": ["mua", "makeup"],
  "key hair stylist": ["key hair"],
  "hair stylist": ["hair"],
  "sfx makeup artist": ["sfx makeup", "special effects makeup"],

  // Locations
  "location manager": ["locations", "loc manager"],
  "assistant location manager": ["asst location manager", "loc asst"],
  "location scout": ["scout"],

  // Transportation
  "transportation coordinator": ["transportation", "transpo"],
  driver: ["drivers"],
  "picture car coordinator": ["picture cars", "car coordinator"],

  // Services
  "craft service": ["crafty"],
  catering: ["caterer"],

  // Post
  editor: ["editing"],
  "assistant editor": ["ae"],
  colorist: ["color"],
  "sound designer": ["sound design"],
  "re-recording mixer": ["re recording mixer", "re-recording"],
  composer: ["music"],
  "vfx supervisor": ["vfx sup"],
  "vfx artist": ["vfx"],
  "motion graphics designer": ["motion graphics", "mograph"],

  // Other
  "script supervisor": ["script sup"],
  photographer: ["photo"],
  "unit stills photographer": ["stills", "unit stills"],
  "production accountant": ["accountant"],
  "safety officer": ["safety"],
};

function canonicalizeRoleForSearch(role: string) {
  const r = normalize(role);

  // Force any “lead actor”, “supporting actor”, etc into Actor or Actress if someone ever adds them by accident.
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

    // Pull acronym inside parentheses
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

  // 1–2 chars: whole word only (prevents pa matching paul)
  if (query.length <= 2) {
    const re = new RegExp(`\\b${escapeRegex(query)}\\b`, "i");
    return re.test(haystack);
  }

  // >=3: word-start matching only (prevents random mid-word matches)
  const re = new RegExp(`\\b${escapeRegex(query)}`, "i");
  return re.test(haystack);
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
    case "imdb":
      return "IMDb";
    case "backstage":
      return "Backstage";
    default:
      return "Link";
  }
}

function ExternalLinkButton({ link }: { link: MemberLink }) {
  const kind = link.kind;
  const label = link.label?.trim() ? link.label : getKindLabel(kind);
  const isEmail = kind === "email";
  const isExternal = !isEmail;

  const icon =
    kind === "instagram" ? (
      <InstagramIcon className="h-4 w-4" />
    ) : kind === "discord" ? (
      <DiscordIcon className="h-4 w-4" />
    ) : kind === "website" ? (
      <WebsiteIcon className="h-4 w-4" />
    ) : kind === "facebook" ? (
      <FacebookIcon className="h-4 w-4" />
    ) : kind === "youtube" ? (
      <YouTubeIcon className="h-4 w-4" />
    ) : kind === "tiktok" ? (
      <TikTokIcon className="h-4 w-4" />
    ) : kind === "x" ? (
      <XIcon className="h-4 w-4" />
    ) : kind === "linkedin" ? (
      <LinkedInIcon className="h-4 w-4" />
    ) : kind === "imdb" ? (
      <IMDbIcon className="h-4 w-4" />
    ) : kind === "backstage" ? (
      <BackstageIcon className="h-4 w-4" />
    ) : (
      <EmailIcon className="h-4 w-4" />
    );

  return (
    <Link
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}

function MemberCard({ member }: { member: Member }) {
  const website = member.links.find((l) => l.kind === "website");
  const socials = member.links.filter((l) => l.kind !== "website");

  return (
    <div className="flex min-h-[260px] flex-col rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <Image
              src={member.image.src}
              alt={member.image.alt}
              fill
              sizes="64px"
              className="object-cover"
              style={{ objectPosition: "50% 20%" }}
            />
          </div>

          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-white">
              {member.name}
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/60">
              {member.location ? (
                <span className="whitespace-nowrap">{member.location}</span>
              ) : null}

              {member.location ? (
                <span className="text-white/25">•</span>
              ) : null}

              <span className="line-clamp-1 text-white/70">
                {member.roles.join(" · ")}
              </span>
            </div>
          </div>
        </div>

        {website ? (
          <div className="shrink-0">
            <ExternalLinkButton link={website} />
          </div>
        ) : null}
      </div>

      <div className="mt-4 text-sm text-white/75">{member.bio}</div>

      {socials.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {socials.map((l) => (
            <ExternalLinkButton
              key={`${member.name}-${l.kind}-${l.href}`}
              link={l}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function GetListedCallout({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70",
        className
      )}
    >
      <div className="font-semibold text-white">Want to get listed?</div>
      <div className="mt-1 text-white/70">
        Send your name, roles, city, a short bio, a headshot, and any links you
        want shown. We keep this directory manually curated.
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={FWFA_LINKS.discord}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          <DiscordIcon className="h-4 w-4" />
          Submit in Discord
        </Link>

        <Link
          href={FWFA_LINKS.instagram}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <InstagramIcon className="h-4 w-4" />
          DM on Instagram
        </Link>
      </div>
    </div>
  );
}

const ROLE_OPTIONS: string[] = [
  "All roles",

  // Acting (simple)
  "Actor",
  "Actress",

  // Above the line (creative leadership)
  "Producer",
  "Executive Producer",
  "Co-Producer",
  "Associate Producer",
  "Line Producer",
  "Unit Production Manager (UPM)",
  "Production Coordinator",
  "Production Secretary",
  "Production Assistant (PA)",

  "Director",
  "1st Assistant Director (1st AD)",
  "2nd Assistant Director (2nd AD)",
  "2nd 2nd Assistant Director (2nd 2nd AD)",
  "Script Supervisor",

  "Writer",
  "Screenwriter",
  "Showrunner",

  // Camera
  "Director of Photography (DP)",
  "Cinematographer",
  "Camera Operator",
  "Steadicam Operator",
  "1st Assistant Camera (1st AC)",
  "2nd Assistant Camera (2nd AC)",
  "DIT (Digital Imaging Technician)",
  "Video Assist",
  "Drone Pilot",
  "Photographer",
  "Unit Stills Photographer",

  // Electric / Lighting
  "Gaffer",
  "Best Boy Electric",
  "Electrician",
  "Lighting Technician",

  // Grip
  "Key Grip",
  "Best Boy Grip",
  "Grip",
  "Dolly Grip",

  // Sound
  "Production Sound Mixer",
  "Boom Operator",
  "Sound Utility",

  // Art Department
  "Production Designer",
  "Art Director",
  "Set Decorator",
  "Props Master",
  "Prop Assistant",
  "Set Dresser",
  "Construction Coordinator",
  "Scenic Artist",
  "Graphic Designer (Art Dept)",

  // Wardrobe
  "Costume Designer",
  "Wardrobe Supervisor",
  "Costumer",
  "Set Costumer",

  // Hair and Makeup
  "Key Makeup Artist",
  "Makeup Artist",
  "Key Hair Stylist",
  "Hair Stylist",
  "SFX Makeup Artist",

  // Locations
  "Location Manager",
  "Assistant Location Manager",
  "Location Scout",

  // Transportation
  "Transportation Coordinator",
  "Driver",
  "Picture Car Coordinator",

  // Production services
  "Craft Service",
  "Catering",

  // Post
  "Editor",
  "Assistant Editor",
  "Colorist",
  "Sound Designer",
  "Re-Recording Mixer",
  "Composer",
  "VFX Supervisor",
  "VFX Artist",
  "Motion Graphics Designer",

  // Other
  "Production Accountant",
  "Safety Officer",
];

export default function MembersPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("All roles");

  const filtered = useMemo(() => {
    const q = normalize(query);

    return MEMBERS.filter((m) => {
      const roleMatch =
        role === "All roles"
          ? true
          : m.roles.some(
              (r) => canonicalizeRoleForSearch(r) === normalize(role)
            );

      const tokens = roleTokens(m.roles);

      const haystack = [m.name, m.location ?? "", m.bio, ...m.roles, ...tokens]
        .join(" ")
        .toLowerCase();

      const queryMatch = matchesQuery(haystack, q);

      return roleMatch && queryMatch;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, role]);

  return (
    <div className="film-grain relative flex flex-1 flex-col overflow-hidden bg-[#05060a] text-white">
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
              Local talent and crew
            </h1>
            <p className="max-w-3xl text-pretty text-base text-white/70 sm:text-lg">
              Search by name, role, city, keywords, or acronyms; then filter by
              role to crew up fast.
            </p>
          </div>

          <div className="mt-6">
            <GetListedCallout />
          </div>

          <div className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-5 sm:items-center">
            <div className="sm:col-span-3">
              <label className="block text-xs text-white/60">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a name, role, city, or keyword (e.g., PA, DP, acting)…"
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-white/60">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/90 outline-none focus:border-white/20"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2 text-xs text-white/50 sm:col-span-5">
              Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
              .
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {filtered.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              <div className="font-semibold text-white">No matches yet.</div>
              <div className="mt-1">
                Try a different spelling, acronym, or role.
              </div>
            </div>
          ) : null}

          <div className="mt-10">
            <GetListedCallout />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
