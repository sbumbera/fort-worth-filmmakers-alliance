// src/components/directory/DirectoryCard.tsx
import type { DirectoryItem, DirectoryLink } from "@/data/directory";
import DirectoryLinkButton from "@/components/directory/DirectoryLinkButton";

function getPrimaryLink(links: DirectoryLink[]) {
  // Preferred: explicitly marked primary website
  const explicitPrimary = links.find(
    (l) => l.kind === "website" && l.placement === "primary",
  );
  if (explicitPrimary) return explicitPrimary;

  // Backwards compatible default: first website link
  return links.find((l) => l.kind === "website");
}

export default function DirectoryCard({ item }: { item: DirectoryItem }) {
  const primary = getPrimaryLink(item.links);

  // Everything except the primary link goes to the footer.
  // This naturally allows "extra websites" to be displayed in footer.
  const footerLinks = item.links.filter((l) => l !== primary);

  return (
    <div className="h-full rounded-3xl border border-white/10 bg-black/25 p-5">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-base font-semibold text-white">
              {item.name}
            </div>
            {item.location ? (
              <div className="mt-0.5 text-sm text-white/60">
                {item.location}
              </div>
            ) : null}
          </div>

          {primary ? (
            <div className="shrink-0">
              <DirectoryLinkButton link={primary} />
            </div>
          ) : null}
        </div>

        {/* Body */}
        <div className="mt-3 text-sm text-white/75">{item.description}</div>

        {/* Footer */}
        {footerLinks.length > 0 ? (
          <div className="mt-auto pt-4">
            <div className="flex flex-wrap gap-2">
              {footerLinks.map((l) => (
                <DirectoryLinkButton
                  key={`${item.name}-${l.kind}-${l.href}`}
                  link={l}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
