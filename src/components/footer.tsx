// src/components/Footer.tsx

import Link from "next/link";
import { InstagramIcon, DiscordIcon } from "@/components/icons";

type FooterProps = {
  instagramUrl?: string;
  discordUrl?: string;
  orgName?: string;
  className?: string;
};

export default function Footer({
  instagramUrl = "https://www.instagram.com/fortworthfilmmakers",
  discordUrl = "https://discord.gg/aJrsuTHg5Z",
  orgName = "Fort Worth Filmmakers Alliance",
  className = "",
}: FooterProps) {
  return (
    <footer
      className={`relative z-10 shrink-0 border-t border-white/10 ${className}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          © {new Date().getFullYear()} {orgName}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={instagramUrl}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            <InstagramIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Instagram</span>
          </Link>

          <Link
            href={discordUrl}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            <DiscordIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Discord</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
