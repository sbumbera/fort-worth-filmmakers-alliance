export const MEETUPS = {
  timezone: "America/Chicago", // Central Time: correct for DFW
  weekly: {
    title: "FWF Weekly Meetup",
    dayOfWeek: 2, // Tuesday
    hour24: 19, // 7 PM
    minute: 0,
    locationName: "Placeholder Bar (Fort Worth)",
    locationCity: "Fort Worth, TX",
  },
  monthly: {
    title: "DFA + FWF Monthly Mixer",
    nth: 1, // first
    dayOfWeek: 4, // Thursday
    hour24: 19, // 7 PM
    minute: 0,
    locationName: "Placeholder Bar (Arlington)",
    locationCity: "Arlington, TX",
  },
} as const;
