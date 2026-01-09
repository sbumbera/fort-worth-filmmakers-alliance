// src/components/directory/DirectoryCard.tsx
import type { DirectoryItem } from "@/data/directory";
import DirectoryLinkButton from "@/components/directory/DirectoryLinkButton";

export default function DirectoryCard({ item }: { item: DirectoryItem }) {
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
            <DirectoryLinkButton link={website} />
          </div>
        ) : null}
      </div>

      <div className="mt-3 text-sm text-white/75">{item.description}</div>

      {socials.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {socials.map((l) => (
            <DirectoryLinkButton
              key={`${item.name}-${l.kind}-${l.href}`}
              link={l}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
