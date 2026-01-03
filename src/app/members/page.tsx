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
} from "@/components/icons";

import {
  MEMBERS,
  type LinkKind,
  type Member,
  type MemberLink,
} from "@/data/members";

/**
 * MEMBERS PAGE (FWFA)
 * - Data sourced from src/data/members.ts
 * - Search across: name, roles, location, bio, keywords
 * - Filter by role (dropdown) with a full on-set role list
 * - Card includes: photo, roles, 1-paragraph bio, and links
 * - "Get listed" callout (like Resources page)
 * - Results count sits at the bottom of the search/filter card
 */

const FWFA_LINKS = {
  instagram: "https://www.instagram.com/fortworthfilmmakers",
  discord: "https://discord.gg/aJrsuTHg5Z",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <Image
              src={member.image.src}
              alt={member.image.alt}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="text-base font-semibold text-white">
              {member.name}
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/60">
              {member.location ? (
                <span className="whitespace-nowrap">{member.location}</span>
              ) : null}

              {member.location ? (
                <span className="text-white/25">•</span>
              ) : null}

              <span className="text-white/70">{member.roles.join(" · ")}</span>
            </div>
          </div>
        </div>

        {website ? (
          <div className="shrink-0">
            <ExternalLinkButton link={website} />
          </div>
        ) : null}
      </div>

      <div className="mt-3 text-sm text-white/75">{member.bio}</div>

      {socials.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
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

/**
 * Full on-set style role list (select options).
 * Members can still have any role string; this list is for filtering convenience.
 */
const ROLE_OPTIONS: string[] = [
  "All roles",

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

  // Talent
  "Actor",
  "Lead Actor",
  "Supporting Actor",
  "Background Actor",
  "Stunt Coordinator",
  "Stunt Performer",
  "Intimacy Coordinator",

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

  // Post (common directory roles)
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

function normalize(str: string) {
  return str.trim().toLowerCase();
}

export default function MembersPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("All roles");

  const normalizedQuery = normalize(query);

  const filtered = useMemo(() => {
    return MEMBERS.filter((m) => {
      const roleMatch =
        role === "All roles"
          ? true
          : m.roles.some((r) => normalize(r) === normalize(role));

      const haystack = [
        m.name,
        m.location ?? "",
        m.bio,
        ...m.roles,
        ...(m.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();

      const queryMatch = normalizedQuery
        ? haystack.includes(normalizedQuery)
        : true;

      return roleMatch && queryMatch;
    });
  }, [normalizedQuery, role]);

  return (
    <div className="film-grain relative flex flex-1 flex-col overflow-hidden bg-[#05060a] text-white">
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
              Members
            </h1>
            <p className="max-w-3xl text-pretty text-base text-white/70 sm:text-lg">
              Search by name, role, city, keywords, or acronyms; then filter by
              role to crew up fast.
            </p>
          </div>

          {/* Top callout, like Resources page */}
          <div className="mt-6">
            <GetListedCallout />
          </div>

          {/* Search + filter */}
          <div className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-5 sm:items-center">
            <div className="sm:col-span-3">
              <label className="block text-xs text-white/60">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a name, role, city, or keyword (e.g., DP, Gaffer, 1st AC)…"
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

          {/* Results */}
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {filtered.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              <div className="font-semibold text-white">No matches yet.</div>
              <div className="mt-1">
                Try a different spelling, acronym, or role. This directory grows
                as members submit their info.
              </div>
            </div>
          ) : null}

          {/* Bottom callout */}
          <div className="mt-10">
            <GetListedCallout />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
