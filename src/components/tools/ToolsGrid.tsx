// src/components/tools/ToolsGrid.tsx
import Link from "next/link";

export type ToolCard = {
  title: string;
  description: string;
  href: string;
  badge?: string;
};

export default function ToolsGrid({ tools }: { tools: ToolCard[] }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="group rounded-3xl border border-white/10 bg-black/25 p-5 transition hover:border-white/20 hover:bg-black/30"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-base font-semibold text-white">{t.title}</div>
            {t.badge ? (
              <span className="shrink-0 rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/70">
                {t.badge}
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {t.description}
          </p>

          <div className="mt-4 text-sm font-semibold text-white/85 group-hover:text-white">
            Open tool →
          </div>
        </Link>
      ))}
    </div>
  );
}
