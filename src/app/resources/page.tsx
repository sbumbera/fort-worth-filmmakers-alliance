// src/app/resources/page.tsx
"use client";

import { useMemo, useState } from "react";
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
  SECTIONS,
  type LinkKind,
  type ResourceItem,
  type ResourceLink,
  type ResourceSection,
} from "@/data/resources";

/**
 * RESOURCES PAGE (FWFA)
 * - Data sourced from src/data/resources.ts
 * - ZERO guessed links: only include verified URLs you provide
 * - Website button top-right of each card header
 * - Social buttons under description
 * - Search + category filter (dropdown)
 * - Visual boundaries around each category section for easier scanning while scrolling
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

function ExternalLinkButton({ link }: { link: ResourceLink }) {
  const isEmail = link.kind === "email";
  const isExternal = !isEmail;

  const icon =
    link.kind === "instagram" ? (
      <InstagramIcon className="h-4 w-4" />
    ) : link.kind === "discord" ? (
      <DiscordIcon className="h-4 w-4" />
    ) : link.kind === "website" ? (
      <WebsiteIcon className="h-4 w-4" />
    ) : link.kind === "facebook" ? (
      <FacebookIcon className="h-4 w-4" />
    ) : link.kind === "youtube" ? (
      <YouTubeIcon className="h-4 w-4" />
    ) : link.kind === "tiktok" ? (
      <TikTokIcon className="h-4 w-4" />
    ) : link.kind === "x" ? (
      <XIcon className="h-4 w-4" />
    ) : link.kind === "linkedin" ? (
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
      <span className="whitespace-nowrap">{link.label}</span>
    </Link>
  );
}

function ResourceCard({ item }: { item: ResourceItem }) {
  const website = item.links.find((l) => l.kind === "website");
  const socials = item.links.filter((l) => l.kind !== "website");

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-base font-semibold text-white">{item.name}</div>
          {item.location ? (
            <div className="mt-0.5 text-sm text-white/60">{item.location}</div>
          ) : null}
        </div>

        {website ? (
          <div className="shrink-0">
            <ExternalLinkButton link={website} />
          </div>
        ) : null}
      </div>

      <div className="mt-3 text-sm text-white/75">{item.description}</div>

      {socials.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {socials.map((l) => (
            <ExternalLinkButton
              key={`${item.name}-${l.kind}-${l.href}`}
              link={l}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MissingSomething({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70",
        className
      )}
    >
      <div className="font-semibold text-white">Missing something?</div>
      <div className="mt-1 text-white/70">
        Drop it in Discord and we will add it. This list is meant to stay alive
        and useful.
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={FWFA_LINKS.discord}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          <DiscordIcon className="h-4 w-4" />
          Share in Discord
        </Link>

        <Link
          href={FWFA_LINKS.instagram}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <InstagramIcon className="h-4 w-4" />
          DM us on Instagram
        </Link>
      </div>
    </div>
  );
}

function sanitizeLinks(items: ResourceItem[]) {
  // Ensures: no empty links, no duplicates, no missing labels
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

// Category dropdown options (derived from data)
const CATEGORY_OPTIONS = [
  { id: "all", label: "All categories" },
  ...SECTIONS.map((s) => ({ id: s.id, label: s.title })),
];

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const normalized = query.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    const sections =
      category === "all" ? SECTIONS : SECTIONS.filter((s) => s.id === category);

    return sections
      .map((section) => {
        const items = sanitizeLinks(section.items)
          .filter((item) => {
            const haystack = [
              item.name,
              item.location ?? "",
              item.description,
              ...(item.keywords ?? []),
            ]
              .join(" ")
              .toLowerCase();

            return normalized ? haystack.includes(normalized) : true;
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        return { ...section, items };
      })
      .filter((s) => s.items.length > 0);
  }, [category, normalized]);

  const matchCount = useMemo(() => {
    return filteredSections.reduce((acc, s) => acc + s.items.length, 0);
  }, [filteredSections]);

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
              Resources
            </h1>
            <p className="max-w-3xl text-pretty text-base text-white/70 sm:text-lg">
              A living, manually curated directory of the DFW film ecosystem:
              commissions, orgs, festivals, unions, training, studios, post, and
              rentals. If it is not listed, we do not have a verified link yet.
            </p>
          </div>

          {/* Callout top */}
          <div className="mt-6">
            <MissingSomething />
          </div>

          {/* Search bar + filter */}
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
                {CATEGORY_OPTIONS.map((opt) => (
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

          {/* Sections */}
          <div className="mt-10 space-y-10">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  {section.subtitle ? (
                    <p className="text-sm text-white/60">{section.subtitle}</p>
                  ) : null}

                  <div className="mt-4 h-px w-full bg-white/10" />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {section.items.map((item) => (
                    <ResourceCard
                      key={`${section.id}-${item.name}`}
                      item={item}
                    />
                  ))}
                </div>

                {/* Empty-state (kept for future, even though we filter empty sections out) */}
                {section.items.length === 0 ? (
                  <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/70">
                    No verified links yet. Share a URL in Discord and we will
                    add it.
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Bottom callout */}
          <div className="mt-10">
            <MissingSomething />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
