import React from "react";
import { cn } from "@/lib/nonUnionCalc";

export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative inline-flex items-center">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-[260px] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/90 p-3 text-xs text-white/80 opacity-0 shadow-lg transition",
          "group-hover:opacity-100"
        )}
      >
        {label}
      </span>
    </span>
  );
}

export function InfoDot({ label }: { label: string }) {
  return (
    <Tooltip label={label}>
      <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/12 bg-white/5 text-[11px] font-semibold text-white/70">
        i
      </span>
    </Tooltip>
  );
}
