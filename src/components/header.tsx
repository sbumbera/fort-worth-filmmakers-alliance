// src/components/Header.tsx

import Image from "next/image";
import Link from "next/link";
import { DiscordIcon } from "@/components/icons";

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
  { label: "Local Roster", href: "/roster" },
  { label: "Directory", href: "/directory" },
  { label: "Tools", href: "/tools" },
];

export default function Header({
  activeHref,
  orgName = "Fort Worth Filmmakers",
  tagline = "Nonprofit community",
  logoSrc = "/brand/logo.png",
  navItems = DEFAULT_NAV,
  ctaHref = "https://discord.gg/aJrsuTHg5Z",
  ctaLabel = "Join",
  showCtaLabelOnMobile = false,
}: HeaderProps) {
  return (
    <header className="relative z-10 shrink-0">
      <div className="mx-auto max-w-6xl px-5 py-5 sm:px-6">
        {/* Top row */}
        <div className="relative flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
              <Image
                src={logoSrc}
                alt={`${orgName} logo`}
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>

            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold tracking-wide">
                {orgName}
              </div>
              <div className="truncate text-xs text-white/60">{tagline}</div>
            </div>
          </Link>

          {/* Center: Desktop nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-sm text-white/75 sm:flex">
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

          {/* Right: CTA */}
          <Link
            href={ctaHref}
            target="_blank"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            <DiscordIcon className="h-4 w-4" />
            <span className={showCtaLabelOnMobile ? "" : "hidden sm:inline"}>
              {ctaLabel}
            </span>
          </Link>
        </div>

        {/* Mobile nav */}
        <nav className="mt-4 sm:hidden">
          <div className="-mx-5 overflow-x-auto px-5">
            <div className="flex w-max items-center gap-2">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm",
                      isActive
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
