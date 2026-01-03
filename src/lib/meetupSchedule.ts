import { MEETUPS } from "@/content/meetups";

export type MeetupOccurrence = {
  key: "weekly" | "monthly";
  title: string;
  when: Date;
  locationName: string;
  locationCity: string;
};

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function atTime(date: Date, hour24: number, minute: number) {
  const d = new Date(date);
  d.setHours(hour24, minute, 0, 0);
  return d;
}

function isSameOrAfter(a: Date, b: Date) {
  return a.getTime() >= b.getTime();
}

function nextWeeklyOccurrence(
  now: Date,
  dayOfWeek: number,
  hour24: number,
  minute: number
) {
  const today = startOfDay(now);
  const todayDow = today.getDay();

  let delta = dayOfWeek - todayDow;
  if (delta < 0) delta += 7;

  let candidate = atTime(addDays(today, delta), hour24, minute);

  if (!isSameOrAfter(candidate, now)) {
    candidate = addDays(candidate, 7);
  }

  return candidate;
}

function nthDowOfMonth(
  year: number,
  monthIndex: number,
  nth: number,
  dayOfWeek: number,
  hour24: number,
  minute: number
) {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const firstDow = firstOfMonth.getDay();

  let delta = dayOfWeek - firstDow;
  if (delta < 0) delta += 7;

  const dayOfMonth = 1 + delta + (nth - 1) * 7;
  const d = new Date(year, monthIndex, dayOfMonth);
  d.setHours(hour24, minute, 0, 0);
  return d;
}

function nextMonthlyNthDowOccurrence(
  now: Date,
  nth: number,
  dayOfWeek: number,
  hour24: number,
  minute: number
) {
  const year = now.getFullYear();
  const month = now.getMonth();

  const thisMonth = nthDowOfMonth(year, month, nth, dayOfWeek, hour24, minute);
  if (isSameOrAfter(thisMonth, now)) return thisMonth;

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  return nthDowOfMonth(nextYear, nextMonth, nth, dayOfWeek, hour24, minute);
}

export function getUpcomingMeetups(nowInput?: Date): {
  next: MeetupOccurrence;
  alsoComingUp: MeetupOccurrence;
  allSorted: MeetupOccurrence[];
} {
  const now = nowInput ?? new Date();

  const w = MEETUPS.weekly;
  const m = MEETUPS.monthly;

  const weeklyWhen = nextWeeklyOccurrence(now, w.dayOfWeek, w.hour24, w.minute);
  const monthlyWhen = nextMonthlyNthDowOccurrence(
    now,
    m.nth,
    m.dayOfWeek,
    m.hour24,
    m.minute
  );

  const weekly: MeetupOccurrence = {
    key: "weekly",
    title: w.title,
    when: weeklyWhen,
    locationName: w.locationName,
    locationCity: w.locationCity,
  };

  const monthly: MeetupOccurrence = {
    key: "monthly",
    title: m.title,
    when: monthlyWhen,
    locationName: m.locationName,
    locationCity: m.locationCity,
  };

  const allSorted = [weekly, monthly].sort(
    (a, b) => a.when.getTime() - b.when.getTime()
  );
  return {
    next: allSorted[0],
    alsoComingUp: allSorted[1],
    allSorted,
  };
}

export function formatMeetupDateTime(d: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    d
  );
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(d);
  const day = d.getDate();
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);

  return `${weekday}, ${month} ${day} at ${time}`;
}
