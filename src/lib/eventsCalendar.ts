// src/lib/eventsCalendar.ts

import type { RecurringEvent } from "@/lib/recurringFromDirectory";

export type EventInstance = {
  instanceId: string; // `${event.id}-${YYYY-MM-DD}`

  eventId: string;
  title: string;

  // Directory matching for modal
  orgId?: string;
  orgName?: string;

  start: Date;
  end: Date;

  // Venue fields for display + directions
  isTBA?: boolean;
  venueName?: string;
  venueAddress?: string;

  // Notes for modal and Add-to-Calendar
  notes?: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function ymd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// Calendar grid starts Sunday and ends Saturday
export function startOfCalendarGrid(month: Date) {
  const s = startOfMonth(month);
  const day = s.getDay(); // 0-6
  return new Date(s.getFullYear(), s.getMonth(), s.getDate() - day);
}

export function endOfCalendarGrid(month: Date) {
  const e = endOfMonth(month);
  const day = e.getDay(); // 0-6
  return new Date(e.getFullYear(), e.getMonth(), e.getDate() + (6 - day));
}

export function addMinutes(d: Date, mins: number) {
  return new Date(d.getTime() + mins * 60_000);
}

export function parseTimeHHMM(time: string): { h: number; m: number } {
  const [hh, mm] = time.split(":").map((x) => Number(x));
  return { h: Number.isFinite(hh) ? hh : 0, m: Number.isFinite(mm) ? mm : 0 };
}

export function monthLabel(month: Date) {
  return month.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export function buildMonthDays(month: Date) {
  const start = startOfCalendarGrid(month);
  const end = endOfCalendarGrid(month);

  const days: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function isNthDowOfMonth(date: Date, nth: number, weekday: number) {
  if (date.getDay() !== weekday) return false;

  // Find occurrence index within that month:
  // 1st/2nd/3rd/4th/5th <weekday>
  const dayOfMonth = date.getDate();
  const occurrence = Math.floor((dayOfMonth - 1) / 7) + 1;
  return occurrence === nth;
}

export function buildEventInstancesForMonth(
  month: Date,
  recurring: RecurringEvent[],
): EventInstance[] {
  const start = startOfCalendarGrid(month);
  const end = endOfCalendarGrid(month);

  const instances: EventInstance[] = [];
  const cur = new Date(start);

  while (cur <= end) {
    const weekday = cur.getDay(); // 0-6

    for (const ev of recurring) {
      if (ev.weekday !== weekday) continue;

      // Monthly events only occur on the nth weekday of their month.
      if (ev.kind === "monthlyNthDow") {
        const nth = ev.nth ?? 1;
        if (!isNthDowOfMonth(cur, nth, weekday)) continue;
      }

      const { h, m } = parseTimeHHMM(ev.startTime);
      const startDt = new Date(
        cur.getFullYear(),
        cur.getMonth(),
        cur.getDate(),
        h,
        m,
        0,
        0,
      );
      const endDt = addMinutes(startDt, ev.durationMinutes);

      instances.push({
        instanceId: `${ev.id}-${ymd(cur)}`,
        eventId: ev.id,
        title: ev.label || ev.orgName || "Event",
        orgId: ev.orgId,
        orgName: ev.orgName,

        start: startDt,
        end: endDt,

        isTBA: ev.isTBA,
        venueName: ev.venueName,
        venueAddress: ev.venueAddress,

        notes: ev.notes,
      });
    }

    cur.setDate(cur.getDate() + 1);
  }

  instances.sort((a, b) => a.start.getTime() - b.start.getTime());
  return instances;
}
