"use client";

import { useEffect, useMemo, useState } from "react";
import type { EventInstance } from "@/lib/eventsCalendar";
import type { DirectoryItem } from "@/data/directory";
import { makeGoogleCalendarUrl, makeICSDownload } from "@/lib/addToCalendar";

export default function AddToCalendarButton({
  instance,
  org,
}: {
  instance: EventInstance;
  org?: DirectoryItem | null;
}) {
  const [icsHref, setIcsHref] = useState<string | null>(null);
  const [icsFilename, setIcsFilename] = useState<string>("event.ics");

  const googleUrl = useMemo(() => {
    return makeGoogleCalendarUrl({ instance, org });
  }, [instance, org]);

  useEffect(() => {
    const { href, filename } = makeICSDownload({ instance, org });
    setIcsHref(href);
    setIcsFilename(filename);

    return () => {
      try {
        URL.revokeObjectURL(href);
      } catch {
        // ignore
      }
    };
  }, [instance, org]);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <a
        href={googleUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10"
      >
        Add via Google Calendar
      </a>

      <a
        href={icsHref ?? undefined}
        download={icsFilename}
        className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:opacity-90"
      >
        Download .ics
      </a>
    </div>
  );
}
