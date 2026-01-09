// src/components/directory/DirectorySections.tsx
import type { DirectorySection } from "@/data/directory";
import DirectoryCard from "@/components/directory/DirectoryCard";

export default function DirectorySections({
  sections,
}: {
  sections: DirectorySection[];
}) {
  return (
    <div className="mt-10 space-y-10">
      {sections.map((section) => (
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
              <DirectoryCard key={`${section.id}-${item.name}`} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
