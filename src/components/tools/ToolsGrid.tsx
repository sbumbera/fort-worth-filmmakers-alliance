"use client";

import Link from "next/link";
import React from "react";

export type ToolCard = {
  title: string;
  description: string;
  href: string;
  badge?: string;
};

export default function ToolsGrid({ tools }: { tools: ToolCard[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {tools.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="group rounded-[34px] border border-white/10 bg-black/25 p-6 transition hover:bg-white/[0.04]"
        >
          <div className="flex h-full min-h-[240px] flex-col">
            {/* Fixed-height header block so body text lines up across cards */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-balance text-xl font-semibold tracking-tight text-white sm:text-2xl">
                <span className="block min-h-[72px] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                  {t.title}
                </span>
              </h2>

              {t.badge ? (
                <span className="shrink-0 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  {t.badge}
                </span>
              ) : null}
            </div>

            {/* Description will now always start at the same vertical position */}
            <p className="mt-3 text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
              {t.description}
            </p>

            {/* CTA pinned to bottom */}
            <div className="mt-auto pt-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                Open tool <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
