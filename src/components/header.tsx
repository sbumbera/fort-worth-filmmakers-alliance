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
  { label: "Members", href: "/members" },
  { label: "Resources", href: "/resources" },
];

export default function Header({
  activeHref,
  orgName = "Fort Worth Filmmakers Alliance",
  tagline = "Nonprofit community",
  logoSrc = "/brand/logo.png",
  navItems = DEFAULT_NAV,
  ctaHref = "https://discord.gg/aJrsuTHg5Z",
  ctaLabel = "Join",
  showCtaLabelOnMobile = false,
}: HeaderProps) {
  return (
    <header className="relative z-10 shrink-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
            <Image
              src={logoSrc}
              alt={`${orgName} logo`}
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">{orgName}</div>
            <div className="text-xs text-white/60">{tagline}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/75 sm:flex">
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

        <Link
          href={ctaHref}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
        >
          <DiscordIcon className="h-4 w-4" />
          <span className={showCtaLabelOnMobile ? "" : "hidden sm:inline"}>
            {ctaLabel}
          </span>
        </Link>
      </div>
    </header>
  );
}
