// src/components/Header.tsx

import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/icons";

type NavItem = {
  label: string;
  href: string;
};

type HeaderProps = {
  activeHref?: string;
  orgName?: string;
  tagline?: string;
  logoSrc?: string;
  navItems?: NavItem[];
  ctaHref?: string;
  ctaLabel?: string;
  showCtaLabelOnMobile?: boolean;
};

const DEFAULT_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Local Roster", href: "/roster" },
  { label: "Directory", href: "/directory" },
  { label: "Tools", href: "/tools" },
];

export default function Header({
  activeHref,
  orgName = "Fort Worth Filmmakers",
  tagline = "Nonprofit community",
  logoSrc = "/brand/emblem.png",
  navItems = DEFAULT_NAV,
  ctaHref = "https://www.instagram.com/fortworthfilmmakers",
  ctaLabel = "Follow",

  showCtaLabelOnMobile = false,
}: HeaderProps) {
  return (
    <header className="relative z-10 shrink-0">
      <div className="mx-auto max-w-6xl px-5 py-5 sm:px-6">
        {/* Top row */}
        <div className="flex items-center gap-3">
          {/* Left: Logo + text (must be allowed to shrink) */}
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
              <Image
                src={logoSrc}
                alt={`${orgName} logo`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Let this area shrink and truncate cleanly at any width */}
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold tracking-wide">
                {orgName}
              </div>
              <div className="truncate text-xs text-white/60">{tagline}</div>
            </div>
          </Link>

          {/* Center: Desktop nav (only appears when there is enough space) */}
          <nav className="hidden items-center gap-6 text-sm text-white/75 lg:flex">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "text-white" : "hover:text-white"}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA (never overlaps; stays pinned) */}
          <Link
            href={ctaHref}
            target="_blank"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 lg:ml-6"
          >
            <InstagramIcon className="h-4 w-4" />

            <span className={showCtaLabelOnMobile ? "" : "hidden sm:inline"}>
              {ctaLabel}
            </span>
          </Link>
        </div>

        {/* Nav below header (shown until desktop nav turns on) */}
        <nav className="mt-4 lg:hidden">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "w-full rounded-full border px-3 py-2 text-center text-sm",
                    "truncate",
                    isActive
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                  title={item.label}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
