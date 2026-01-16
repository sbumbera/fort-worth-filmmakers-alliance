// src/lib/recurringFromDirectory.ts

import type { DirectoryItem, DirectoryMeetup } from "@/data/directory";
import { flattenDirectoryItems } from "@/data/directory";

export type RecurringEvent = {
  id: string; // stable id for recurrence rule
  orgId: string; // directory item id (slugified)
  orgName: string;

  label: string;

  kind: "weekly" | "monthlyNthDow";

  // 0=Sun..6=Sat
  weekday: number;

  // Only used for monthlyNthDow
  nth?: number;

  // "HH:MM" 24h
  startTime: string;

  durationMinutes: number;

  // Venue and UX fields
  isTBA?: boolean;
  venueName?: string;
  venueAddress?: string; // can be full address or city

  // Extra content for modal and Add-to-Calendar notes
  notes?: string;
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

  const kind = rec.kind;
  const weekday = rec.dayOfWeek;

  const startTime = toHHMM(rec.hour24, rec.minute);

  const venueName = meetup.isTBA ? undefined : meetup.locationName;
  const venueAddress = meetup.isTBA
    ? undefined
    : meetup.address || meetup.locationCity || undefined;

  return {
    id: `${org.id}-meetup-${index}`,
    orgId: org.id,
    orgName: org.name,
    label: meetup.title || org.name,

    kind,
    weekday,
    nth: kind === "monthlyNthDow" ? rec.nth : undefined,

    startTime,
    durationMinutes: meetup.durationMinutes ?? DEFAULT_DURATION_MINUTES,

    isTBA: Boolean(meetup.isTBA),
    venueName,
    venueAddress,

    notes: meetup.notes,
  };
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
