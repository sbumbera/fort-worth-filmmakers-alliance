// src/components/tools/ToolsCallout.tsx
import Link from "next/link";
import { DiscordIcon, InstagramIcon } from "@/components/icons";

const FWFA_LINKS = {
  instagram: "https://www.instagram.com/fortworthfilmmakers",
  discord: "https://discord.gg/aJrsuTHg5Z",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ToolsCallout({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70",
        className
      )}
    >
      <div className="font-semibold text-white">Have a tool idea?</div>
      <div className="mt-1 text-white/70">
        Tell us what would save you time on set or in prep. If it helps the
        community, we will build it.
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={FWFA_LINKS.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          <DiscordIcon className="h-4 w-4" />
          Submit in Discord
        </Link>

        <Link
          href={FWFA_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <InstagramIcon className="h-4 w-4" />
          DM on Instagram
        </Link>
      </div>
    </div>
  );
}
