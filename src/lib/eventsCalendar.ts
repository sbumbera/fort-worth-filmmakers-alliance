// src/lib/eventsCalendar.ts

import type { RecurringEvent } from "@/lib/recurringFromDirectory";
import { fromZonedTime } from "date-fns-tz";

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

  // ✅ Event-specific link (modal-only)
  rsvpUrl?: string;
  rsvpLabel?: string;
};

const TZ = "America/Chicago";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Build a Date that represents a wall-clock time in America/Chicago,
 * regardless of where the code runs (server UTC, client Central, etc).
 */
function chicagoLocalToDate(
  year: number,
  month0: number, // 0-11
  day: number, // 1-31
  hour: number, // 0-23
  minute: number, // 0-59
) {
  const isoLocal = `${year}-${pad2(month0 + 1)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:00`;
  // Convert Chicago wall-clock time -> actual UTC instant Date
  return fromZonedTime(isoLocal, TZ);
}

export function ymd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * DST-safe day number (UTC midnight based).
 * Used only for interval calculations so "every 2 weeks" stays stable across DST.
 */
function utcDayNumber(d: Date) {
  return Math.floor(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000,
  );
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

function daysInMonth(year: number, month0: number) {
  return new Date(year, month0 + 1, 0).getDate();
}

function clampDayOfMonth(year: number, month0: number, dayOfMonth: number) {
  const dim = daysInMonth(year, month0);
  const d = Math.max(1, Math.floor(dayOfMonth || 1));
  return Math.min(d, dim);
}

function isNthDowOfMonth(date: Date, nth: number, weekday: number) {
  if (date.getDay() !== weekday) return false;

  // 1st/2nd/3rd/4th/5th <weekday> in this month
  const dayOfMonth = date.getDate();
  const occurrence = Math.floor((dayOfMonth - 1) / 7) + 1;
  return occurrence === nth;
}

function includesMonth(months: number[] | undefined, month0: number) {
  if (!months || months.length === 0) return false;
  return months.includes(month0);
}

function matchesRecurrenceOnDate(ev: RecurringEvent, cur: Date): boolean {
  const month0 = cur.getMonth();
  const weekday0 = cur.getDay();

  switch (ev.kind) {
    case "weekly": {
      if (typeof ev.weekday !== "number") return false;
      if (weekday0 !== ev.weekday) return false;

      const interval = ev.intervalWeeks ?? 1;
      if (interval === 1) return true;

      // If no anchor is provided, fall back to weekly behavior.
      if (!ev.anchorDate) return true;

      // Anchor is treated as a calendar date, not a moment in time.
      // Using UTC day math prevents DST from skipping valid occurrences.
      const anchor = new Date(ev.anchorDate + "T00:00:00");

      // Only allow dates on/after anchor (prevents backfill)
      if (utcDayNumber(cur) < utcDayNumber(anchor)) return false;

      const dayDiff = utcDayNumber(cur) - utcDayNumber(anchor);
      const weeks = Math.floor(dayDiff / 7);

      return weeks % interval === 0;
    }

    case "monthlyNthDow": {
      const nth = ev.nth ?? 1;
      if (typeof ev.weekday !== "number") return false;
      if (weekday0 !== ev.weekday) return false;
      return isNthDowOfMonth(cur, nth, ev.weekday);
    }

    case "monthlyOnDay": {
      const day = clampDayOfMonth(
        cur.getFullYear(),
        month0,
        ev.dayOfMonth ?? 1,
      );
      return cur.getDate() === day;
    }

    case "quarterlyOnDay": {
      if (!includesMonth(ev.months, month0)) return false;
      const day = clampDayOfMonth(
        cur.getFullYear(),
        month0,
        ev.dayOfMonth ?? 1,
      );
      return cur.getDate() === day;
    }

    case "quarterlyNthDow": {
      if (!includesMonth(ev.months, month0)) return false;
      const nth = ev.nth ?? 1;
      if (typeof ev.weekday !== "number") return false;
      if (weekday0 !== ev.weekday) return false;
      return isNthDowOfMonth(cur, nth, ev.weekday);
    }

    case "annualOnDate": {
      if (typeof ev.month !== "number") return false;
      if (month0 !== ev.month) return false;
      const day = clampDayOfMonth(
        cur.getFullYear(),
        month0,
        ev.dayOfMonth ?? 1,
      );
      return cur.getDate() === day;
    }

    case "annualNthDow": {
      if (typeof ev.month !== "number") return false;
      if (month0 !== ev.month) return false;
      const nth = ev.nth ?? 1;
      if (typeof ev.weekday !== "number") return false;
      if (weekday0 !== ev.weekday) return false;
      return isNthDowOfMonth(cur, nth, ev.weekday);
    }

    default: {
      const _exhaustive: never = ev.kind;
      return _exhaustive;
    }
  }
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
    for (const ev of recurring) {
      if (!matchesRecurrenceOnDate(ev, cur)) continue;

      const { h, m } = parseTimeHHMM(ev.startTime);

      // ✅ Timezone-safe: treat startTime as Chicago wall-clock time
      const startDt = chicagoLocalToDate(
        cur.getFullYear(),
        cur.getMonth(),
        cur.getDate(),
        h,
        m,
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

        rsvpUrl: ev.rsvpUrl,
        rsvpLabel: ev.rsvpLabel,
      });
    }

    cur.setDate(cur.getDate() + 1);
  }

  instances.sort((a, b) => a.start.getTime() - b.start.getTime());
  return instances;
}
