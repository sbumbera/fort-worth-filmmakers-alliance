// src/components/members/MetaLine.tsx
export default function MetaLine({
  location,
  roles,
}: {
  location?: string | null;
  roles: string[];
}) {
  const parts = [location, ...roles].filter(Boolean) as string[];

  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/60">
      {parts.map((text, idx) => (
        <span key={`${text}-${idx}`} className="whitespace-nowrap">
          <span className={idx === 0 ? "text-white/60" : "text-white/70"}>
            {text}
          </span>
          {idx < parts.length - 1 ? (
            <span className="ml-2 text-white/25">·</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
