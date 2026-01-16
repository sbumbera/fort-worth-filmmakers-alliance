// src/lib/addToCalendar.ts

import type { EventInstance } from "@/lib/eventsCalendar";
import type { DirectoryItem, DirectoryLink } from "@/data/directory";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toUTCStamp(d: Date) {
  // YYYYMMDDTHHMMSSZ
  return (
    d.getUTCFullYear() +
    pad2(d.getUTCMonth() + 1) +
    pad2(d.getUTCDate()) +
    "T" +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) +
    "Z"
  );
}

function escapeICSValue(s: string) {
  // RFC5545 escaping
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function foldICSLines(line: string) {
  // RFC5545: lines should be folded at 75 octets; simple char folding
  const limit = 73;
  const out: string[] = [];
  let cur = line;

  while (cur.length > limit) {
    out.push(cur.slice(0, limit));
    cur = " " + cur.slice(limit);
  }

  out.push(cur);
  return out.join("\r\n");
}

function buildOrganizerLinksText(links: DirectoryLink[] | undefined) {
  if (!links || links.length === 0) return "";
  const lines = links.map((l) => {
    const label = l.label || l.kind;
    return `- ${label}: ${l.href}`;
  });
  return lines.join("\n");
}

export function buildCalendarNotes(params: {
  instance: EventInstance;
  org?: DirectoryItem | null;
}) {
  const { instance, org } = params;

  const venueName = instance.venueName || "";
  const venueAddress = instance.venueAddress || "";
  const locationLine = [venueName, venueAddress].filter(Boolean).join(", ");

  const header =
    "Recurring listings only: confirm updates on organizer channels.";
  const organizerName = org?.name || instance.orgName || "Organizer";
  const organizerAbout = org?.description || "";
  const organizerLocation = org?.location || "";

  const linksText = buildOrganizerLinksText(org?.links);

  const parts: string[] = [];
  parts.push(header);

  if (instance.notes) {
    parts.push("");
    parts.push(`Note: ${instance.notes}`);
  }

  parts.push("");
  parts.push(`Organizer: ${organizerName}`);

  if (organizerAbout) parts.push(`About: ${organizerAbout}`);
  if (organizerLocation) parts.push(`Organizer location: ${organizerLocation}`);
  if (locationLine) parts.push(`Meetup location: ${locationLine}`);

  if (linksText) {
    parts.push("");
    parts.push("Links:");
    parts.push(linksText);
  }

  return parts.join("\n");
}

export function buildCalendarLocation(params: {
  instance: EventInstance;
  org?: DirectoryItem | null;
}) {
  const { instance, org } = params;

  const venueName = instance.venueName || "";
  const venueAddress = instance.venueAddress || "";

  // Prefer explicit venue address if present
  if (venueName || venueAddress) {
    return [venueName, venueAddress].filter(Boolean).join(", ");
  }

  // Fallback to org location
  if (org?.location) return org.location;

  return "";
}

export function makeGoogleCalendarUrl(params: {
  instance: EventInstance;
  org?: DirectoryItem | null;
  publicEventUrl?: string;
}) {
  const { instance, org, publicEventUrl } = params;

  const text = instance.title;
  const dates = `${toUTCStamp(instance.start)}/${toUTCStamp(instance.end)}`;
  const details = buildCalendarNotes({ instance, org });
  const location = buildCalendarLocation({ instance, org });

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", text);
  url.searchParams.set("dates", dates);
  url.searchParams.set("details", details);

  if (location) url.searchParams.set("location", location);
  if (publicEventUrl) url.searchParams.set("sprop", publicEventUrl);

  return url.toString();
}

export function makeICSDownload(params: {
  instance: EventInstance;
  org?: DirectoryItem | null;
  publicEventUrl?: string;
}) {
  const { instance, org, publicEventUrl } = params;

  const uid = `${instance.instanceId}@fwfilmmakers.org`;
  const dtstamp = toUTCStamp(new Date());
  const dtstart = toUTCStamp(instance.start);
  const dtend = toUTCStamp(instance.end);

  const summary = instance.title;
  const description = buildCalendarNotes({ instance, org });
  const location = buildCalendarLocation({ instance, org });

  const lines: string[] = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//Fort Worth Filmmakers//Events//EN");
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");
  lines.push("BEGIN:VEVENT");
  lines.push(`UID:${escapeICSValue(uid)}`);
  lines.push(`DTSTAMP:${dtstamp}`);
  lines.push(`DTSTART:${dtstart}`);
  lines.push(`DTEND:${dtend}`);
  lines.push(`SUMMARY:${escapeICSValue(summary)}`);

  if (location) lines.push(`LOCATION:${escapeICSValue(location)}`);

  lines.push(`DESCRIPTION:${escapeICSValue(description)}`);

  if (publicEventUrl) lines.push(`URL:${escapeICSValue(publicEventUrl)}`);

  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  const ics = lines.map(foldICSLines).join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);

  const safeTitle = summary
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const filename = `${safeTitle || "event"}.ics`;

  return { href, filename };
}
