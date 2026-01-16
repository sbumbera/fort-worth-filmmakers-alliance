"use client";

import type { EventInstance } from "@/lib/eventsCalendar";
import { ymd } from "@/lib/eventsCalendar";

function dayHeader(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function timeLabel(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventsAgenda({
  monthDays,
  eventsByDay,
  onSelectEvent,
}: {
  monthDays: Date[]; // includes padding days from grid
  eventsByDay: Map<string, EventInstance[]>;
  onSelectEvent: (e: EventInstance) => void;
}) {
  // For agenda, we only want the actual month days (not the padding from prev/next month).
  const first = monthDays.find((d) => d.getDate() === 1) ?? monthDays[0];
  const monthIndex = first.getMonth();

  const daysInMonth = monthDays.filter((d) => d.getMonth() === monthIndex);

  return (
    <div className="space-y-3">
      {daysInMonth.map((d) => {
        const key = ymd(d);
        const events = eventsByDay.get(key) ?? [];

        return (
          <div
            key={key}
            className="rounded-3xl border border-white/10 bg-black/25 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-white/85">
                {dayHeader(d)}
              </div>
              <div className="text-xs text-white/55">{d.getDate()}</div>
            </div>

            {events.length === 0 ? (
              <div className="mt-2 text-sm text-white/45">
                No listed recurring events.
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {events.map((e) => (
                  <button
                    key={e.instanceId}
                    type="button"
                    onClick={() => onSelectEvent(e)}
                    className="w-full rounded-2xl border border-white/12 bg-white/5 p-3 text-left hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-semibold text-white/85">
                        {e.title}
                      </div>
                      <div className="shrink-0 text-sm text-white/60">
                        {timeLabel(e.start)}
                      </div>
                    </div>

                    <div className="mt-1 text-sm text-white/60">
                      {(() => {
                        const anyE = e as unknown as {
                          locationName?: string;
                          location?: string;
                          locationCity?: string;
                          where?: string;
                        };

                        return (
                          anyE.locationName ??
                          anyE.location ??
                          anyE.locationCity ??
                          anyE.where ??
                          "Location: check organizer links"
                        );
                      })()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
