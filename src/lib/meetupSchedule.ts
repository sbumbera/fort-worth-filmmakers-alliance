// src/lib/meetupSchedule.ts

import { getHomeFeaturedOrg } from "@/data/directory";
import { getRecurringEventsFromDirectory } from "@/lib/recurringFromDirectory";
import {
  buildEventInstancesForMonth,
  type EventInstance,
} from "@/lib/eventsCalendar";

export type MeetupOccurrence = {
  key: "featured" | "calendar";
  title: string;
  when: Date;

  locationName: string;
  locationCity: string;

  orgId?: string;
  orgName?: string;

  isTBA?: boolean;
};

function firstUpcomingNonEnded(instances: EventInstance[], now: Date) {
  return instances.find((x) => x.end.getTime() > now.getTime()) ?? null;
}

export function getUpcomingMeetups(nowInput?: Date): {
  next: MeetupOccurrence;
  alsoComingUp: MeetupOccurrence;
} {
  const now = nowInput ?? new Date();

  const recurring = getRecurringEventsFromDirectory();

  // Build a rolling window by combining this month + next month
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const instA = buildEventInstancesForMonth(thisMonth, recurring);
  const instB = buildEventInstancesForMonth(nextMonth, recurring);

  const all = [...instA, ...instB].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  // Featured org for homepage “Next”
  const featuredOrg = getHomeFeaturedOrg();
  const featuredOrgId = featuredOrg?.id;

  const nextFeatured = featuredOrgId
    ? firstUpcomingNonEnded(
        all.filter((x) => x.orgId === featuredOrgId),
        now,
      )
    : null;

  const nextCalendar = firstUpcomingNonEnded(
    all.filter((x) => {
      // Exclude featured org from “Also coming up”
      if (featuredOrgId && x.orgId === featuredOrgId) return false;
      // Exclude TBA from “Also coming up” to keep it actionable
      if (x.isTBA) return false;
      return true;
    }),
    now,
  );

  const next: MeetupOccurrence = nextFeatured
    ? {
        key: "featured",
        title: nextFeatured.title,
        when: nextFeatured.start,
        locationName: nextFeatured.isTBA
          ? "TBA"
          : nextFeatured.venueName || "TBA",
        locationCity: nextFeatured.isTBA
          ? featuredOrg?.location
            ? `${featuredOrg.location}, TX`
            : ""
          : nextFeatured.venueAddress || "",
        orgId: nextFeatured.orgId,
        orgName: nextFeatured.orgName,
        isTBA: Boolean(nextFeatured.isTBA),
      }
    : {
        key: "featured",
        title: featuredOrg?.name ?? "Next meetup",
        when: now,
        locationName: "TBA",
        locationCity: featuredOrg?.location
          ? `${featuredOrg.location}, TX`
          : "",
        orgId: featuredOrg?.id,
        orgName: featuredOrg?.name,
        isTBA: true,
      };

  const alsoComingUp: MeetupOccurrence = nextCalendar
    ? {
        key: "calendar",
        title: nextCalendar.title,
        when: nextCalendar.start,
        locationName: nextCalendar.venueName || "TBA",
        locationCity: nextCalendar.venueAddress || "",
        orgId: nextCalendar.orgId,
        orgName: nextCalendar.orgName,
        isTBA: Boolean(nextCalendar.isTBA),
      }
    : {
        key: "calendar",
        title: "No upcoming events listed",
        when: now,
        locationName: "TBA",
        locationCity: "",
        isTBA: true,
      };

  return { next, alsoComingUp };
}

const TZ = "America/Chicago";

export function formatMeetupDateTime(d: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: TZ,
  }).format(d);

  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: TZ,
  }).format(d);

  const day = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone: TZ,
  }).format(d);

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  }).format(d);

  return `${weekday}, ${month} ${day} at ${time}`;
}
