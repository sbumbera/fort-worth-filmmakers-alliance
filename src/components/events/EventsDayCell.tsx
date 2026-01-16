"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EventInstance } from "@/lib/eventsCalendar";
import EventChip from "@/components/events/EventChip";

export default function EventsDayCell({
  dayKey,
  date,
  isOutside,
  isToday,
  isSelected,
  events,
  onSelectDay,
  onSelectEvent,
}: {
  dayKey: string;
  date: Date;
  isOutside: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: EventInstance[];
  onSelectDay: () => void;
  onSelectEvent: (e: EventInstance) => void;
}) {
  const day = date.getDate();
  const total = events.length;

  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const [maxDots, setMaxDots] = useState<number>(4);

  // These must match your Tailwind classes below:
  // dot: h-1.5 w-1.5 => 6px
  // gap-1 => 4px
  // We compute: maxDots = floor((width + gap) / (dotSize + gap))
  const DOT_PX = 6;
  const GAP_PX = 4;

  useEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;

    const compute = () => {
      const width = el.clientWidth || 0;
      if (width <= 0) return;

      const perDot = DOT_PX + GAP_PX;
      const dots = Math.max(1, Math.floor((width + GAP_PX) / perDot));

      // Safety clamp so a huge screen does not create silly amounts of dots
      setMaxDots(Math.min(dots, 12));
    };

    compute();

    const ro = new ResizeObserver(() => compute());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const mobileMode = useMemo(() => {
    if (total <= 0) return "none";
    return total <= maxDots ? "dots" : "count";
  }, [total, maxDots]);

  const base = [
    "rounded-2xl border",
    "bg-black/20",
    "transition-colors",
    isOutside ? "opacity-45" : "opacity-100",
    isSelected ? "border-white/30 bg-white/5" : "border-white/10",
  ].join(" ");

  return (
    <div className={base}>
      <button
        type="button"
        onClick={onSelectDay}
        className={[
          "relative w-full text-left",
          "p-2 sm:p-2.5",
          "min-h-[58px] sm:min-h-[110px]",
        ].join(" ")}
        aria-label={`Select ${dayKey}`}
      >
        {/* Day number fixed top-left: mobile + desktop */}
        <div
          className={[
            "absolute left-2 top-2",
            "text-xs font-semibold",
            isToday ? "text-white" : "text-white/70",
          ].join(" ")}
        >
          {day}
        </div>

        {/* Today badge fixed top-right: desktop only */}
        {isToday ? (
          <div className="hidden sm:block absolute right-2 top-2 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
            Today
          </div>
        ) : null}

        {/* Mobile indicators: dots until they do not fit, then a number */}
        <div className="sm:hidden pt-6">
          <div ref={indicatorRef} className="w-full">
            <div className="flex w-full items-center justify-center">
              {mobileMode === "dots" ? (
                <div className="flex items-center gap-1">
                  {Array.from({ length: total }).map((_, i) => (
                    <div
                      key={`${dayKey}-dot-${i}`}
                      className="h-1.5 w-1.5 rounded-full bg-white/55"
                    />
                  ))}
                </div>
              ) : mobileMode === "count" ? (
                <div className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/75">
                  {total}
                </div>
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-transparent" />
              )}
            </div>
          </div>
        </div>

        {/* Desktop: show all event chips */}
        <div className="mt-2 hidden space-y-1.5 sm:block pt-7">
          {events.length === 0 ? (
            <div className="text-[11px] text-white/35"> </div>
          ) : (
            events.map((e) => (
              <EventChip
                key={e.instanceId}
                instance={e}
                onClick={() => onSelectEvent(e)}
              />
            ))
          )}
        </div>
      </button>
    </div>
  );
}
