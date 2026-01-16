// src/components/events/EventsCalendar.tsx
"use client";

import { useMemo, useState } from "react";
import type { RecurringEvent } from "@/lib/recurringFromDirectory";
import { getRecurringEventsFromDirectory } from "@/lib/recurringFromDirectory";
import {
  buildEventInstancesForMonth,
  buildMonthDays,
  monthLabel,
  ymd,
  type EventInstance,
} from "@/lib/eventsCalendar";
import EventsGrid from "@/components/events/EventsGrid";
import EventModal from "@/components/events/EventModal";

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function monthFirstDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function niceDayLabel(d: Date) {
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

export default function EventsCalendar({
  recurring,
}: {
  recurring?: RecurringEvent[];
}) {
  const [month, setMonth] = useState(() => new Date());
  const [active, setActive] = useState<EventInstance | null>(null);

  const effectiveRecurring = useMemo(
    () => recurring ?? getRecurringEventsFromDirectory(),
    [recurring],
  );

  const days = useMemo(() => buildMonthDays(month), [month]);
  const instances = useMemo(
    () => buildEventInstancesForMonth(month, effectiveRecurring),
    [month, effectiveRecurring],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, EventInstance[]>();
    for (const inst of instances) {
      const key = ymd(inst.start);
      const arr = map.get(key) ?? [];
      arr.push(inst);
      map.set(key, arr);
    }
    return map;
  }, [instances]);

  const monthIndex = month.getMonth();

  // Selected day for the mobile mini-agenda
  const defaultSelectedDay = useMemo(() => {
    const now = new Date();
    const d = isSameMonth(now, month) ? now : monthFirstDay(month);
    return ymd(d);
  }, [month]);

  const [selectedDayKey, setSelectedDayKey] =
    useState<string>(defaultSelectedDay);

  // When month changes, reset selected day to today (if same month) or first day
  function syncSelectedDay(nextMonth: Date) {
    const now = new Date();
    const d = isSameMonth(now, nextMonth) ? now : monthFirstDay(nextMonth);
    setSelectedDayKey(ymd(d));
  }

  function prevMonth() {
    setMonth((m) => {
      const next = new Date(m.getFullYear(), m.getMonth() - 1, 1);
      syncSelectedDay(next);
      return next;
    });
  }

  function nextMonth() {
    setMonth((m) => {
      const next = new Date(m.getFullYear(), m.getMonth() + 1, 1);
      syncSelectedDay(next);
      return next;
    });
  }

  function goToday() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), 1);
    setMonth(next);
    syncSelectedDay(next);
  }

  const selectedDayDate = useMemo(() => {
    const [yy, mm, dd] = selectedDayKey.split("-").map((n) => Number(n));
    return new Date(yy, (mm || 1) - 1, dd || 1);
  }, [selectedDayKey]);

  const selectedEvents = byDay.get(selectedDayKey) ?? [];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold text-white/60">Events</div>
          <div className="mt-1 text-xl font-semibold">{monthLabel(month)}</div>
          <div className="mt-1 text-sm text-white/60">
            Recurring listings only: confirm updates on organizer channels.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
            aria-label="Previous month"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
            aria-label="Next month"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-4">
        <EventsGrid
          month={month}
          monthIndex={monthIndex}
          days={days}
          eventsByDay={byDay}
          selectedDayKey={selectedDayKey}
          onSelectDay={(dayKey) => setSelectedDayKey(dayKey)}
          onSelectEvent={(e) => setActive(e)}
        />
      </div>

      {/* Mobile mini-agenda */}
      <div className="mt-4 sm:hidden">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-white/85">
              {niceDayLabel(selectedDayDate)}
            </div>
            <div className="text-xs text-white/55">
              {selectedEvents.length
                ? `${selectedEvents.length} event${selectedEvents.length === 1 ? "" : "s"}`
                : "No events"}
            </div>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="mt-3 text-sm text-white/55">
              No listed recurring events for this day.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {selectedEvents.map((e) => (
                <button
                  key={e.instanceId}
                  type="button"
                  onClick={() => setActive(e)}
                  className="w-full rounded-2xl border border-white/12 bg-white/5 p-3 text-left hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="line-clamp-1 text-sm font-semibold text-white/85">
                        {e.title}
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {timeLabel(e.start)}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs text-white/55">
                      Tap for details
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <EventModal
        open={Boolean(active)}
        instance={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}
