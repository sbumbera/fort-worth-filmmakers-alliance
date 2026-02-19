// src/lib/recurringFromDirectory.ts

import type { DirectoryItem, DirectoryMeetup } from "@/data/directory";
import { flattenDirectoryItems } from "@/data/directory";

function assertNever(x: never): never {
  throw new Error("Unhandled recurrence kind");
}

export type RecurringEvent = {
  id: string;
  orgId: string;
  orgName: string;

  label: string;

  kind:
    | "weekly"
    | "monthlyNthDow"
    | "monthlyOnDay"
    | "quarterlyNthDow"
    | "quarterlyOnDay"
    | "annualNthDow"
    | "annualOnDate";

  startTime: string;
  durationMinutes: number;

  weekday?: number;
  nth?: number;
  dayOfMonth?: number;
  month?: number;
  months?: number[];

  // NEW
  intervalWeeks?: number; // 1 or 2
  anchorDate?: string; // "YYYY-MM-DD"

  isTBA?: boolean;
  venueName?: string;
  venueAddress?: string;

  notes?: string;
  rsvpUrl?: string;
  rsvpLabel?: string;
};

const DEFAULT_DURATION_MINUTES = 120;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toHHMM(hour24: number, minute: number) {
  return `${pad2(hour24)}:${pad2(minute)}`;
}

function meetupToRecurring(
  org: DirectoryItem,
  meetup: DirectoryMeetup,
  index: number,
): RecurringEvent {
  const rec = meetup.recurrence;

  const startTime = toHHMM(rec.hour24, rec.minute);

  const venueName = meetup.isTBA ? undefined : meetup.locationName;
  const venueAddress = meetup.isTBA
    ? undefined
    : meetup.address || meetup.locationCity || undefined;

  const base = {
    id: `${org.id}-meetup-${index}`,
    orgId: org.id,
    orgName: org.name,
    label: meetup.title || org.name,

    startTime,
    durationMinutes: meetup.durationMinutes ?? DEFAULT_DURATION_MINUTES,

    isTBA: Boolean(meetup.isTBA),
    venueName,
    venueAddress,

    notes: meetup.notes,

    rsvpUrl: meetup.rsvpUrl,
    rsvpLabel: meetup.rsvpLabel,
  };

  switch (rec.kind) {
    case "weekly":
      return {
        ...base,
        kind: "weekly",
        weekday: rec.dayOfWeek,
        intervalWeeks: (rec as any).intervalWeeks ?? 1,
        anchorDate: (rec as any).anchorDate,
      };

    case "monthlyNthDow":
      return {
        ...base,
        kind: "monthlyNthDow",
        weekday: rec.dayOfWeek,
        nth: rec.nth,
      };

    case "monthlyOnDay":
      return {
        ...base,
        kind: "monthlyOnDay",
        dayOfMonth: rec.dayOfMonth,
      };

    case "quarterlyOnDay":
      return {
        ...base,
        kind: "quarterlyOnDay",
        months: rec.months,
        dayOfMonth: rec.dayOfMonth,
      };

    case "quarterlyNthDow":
      return {
        ...base,
        kind: "quarterlyNthDow",
        months: rec.months,
        weekday: rec.dayOfWeek,
        nth: rec.nth,
      };

    case "annualOnDate":
      return {
        ...base,
        kind: "annualOnDate",
        month: rec.month,
        dayOfMonth: rec.dayOfMonth,
      };

    case "annualNthDow":
      return {
        ...base,
        kind: "annualNthDow",
        month: rec.month,
        weekday: rec.dayOfWeek,
        nth: rec.nth,
      };

    default:
      // ✅ Compile-time exhaustiveness check
      return assertNever(rec);
  }
}

export function getRecurringEventsFromDirectory(): RecurringEvent[] {
  const items = flattenDirectoryItems();
  const out: RecurringEvent[] = [];

  for (const org of items) {
    if (!org.meetups || org.meetups.length === 0) continue;

    org.meetups.forEach((m, i) => {
      // ✅ Do not generate calendar events for TBA meetups
      if (m.isTBA) return;

      out.push(meetupToRecurring(org, m, i));
    });
  }

  return out;
}
