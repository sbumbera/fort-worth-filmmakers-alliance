// src/components/events/EventModal.tsx
"use client";

import { useEffect, useMemo } from "react";
import type { EventInstance } from "@/lib/eventsCalendar";
import { findDirectoryItem } from "@/lib/directoryLookup";
import AddToCalendarButton from "@/components/events/AddToCalendarButton";
import { buildMapsUrl } from "@/lib/maps";
import type { DirectoryItem, DirectoryLink, LinkKind } from "@/data/directory";

function timeRangeLabel(start: Date, end: Date) {
  const t1 = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const t2 = end.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const date = start.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return `${date} • ${t1} to ${t2}`;
}

function kindLabel(kind: LinkKind) {
  if (kind === "x") return "X";
  return kind[0].toUpperCase() + kind.slice(1);
}

function linkText(l: DirectoryLink) {
  return l.label || kindLabel(l.kind);
}

export default function EventModal({
  open,
  instance,
  onClose,
}: {
  open: boolean;
  instance: EventInstance | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const org: DirectoryItem | null = useMemo(() => {
    if (!instance) return null;
    return findDirectoryItem({
      orgId: instance.orgId,
      orgName: instance.orgName,
    });
  }, [instance]);

  const mapsUrl = useMemo(() => {
    if (!instance) return null;
    if (instance.isTBA) return null;

    return buildMapsUrl({
      name: instance.venueName,
      address: instance.venueAddress || org?.location,
    });
  }, [instance, org]);

  // ✅ Build link list: organizer links + optional RSVP link (modal-only)
  const modalLinks: DirectoryLink[] = useMemo(() => {
    const base = org?.links ?? [];
    if (!instance?.rsvpUrl) return base;

    return [
      ...base,
      {
        kind: "website",
        href: instance.rsvpUrl,
        label: instance.rsvpLabel || "RSVP",
      },
    ];
  }, [org?.links, instance?.rsvpUrl, instance?.rsvpLabel]);

  if (!open || !instance) return null;

  const venueLabel = instance.isTBA
    ? "TBA"
    : instance.venueName || "Meetup location";

  const venueSub = instance.isTBA
    ? "Check organizer links for updates."
    : instance.venueAddress ||
      org?.location ||
      "Check organizer links for location details";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl sm:inset-0 sm:flex sm:items-center sm:justify-center sm:px-6">
        <div className="w-full rounded-t-3xl border border-white/10 bg-[#05060a] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.75)] sm:rounded-3xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-white/60">Event</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {instance.title}
              </div>
              <div className="mt-1 text-sm text-white/70">
                {timeRangeLabel(instance.start, instance.end)}
              </div>

              <div className="mt-2 text-sm text-white/70">
                {mapsUrl ? (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-white underline underline-offset-4 hover:opacity-90"
                  >
                    {venueLabel}
                  </a>
                ) : (
                  <span className="font-semibold text-white">{venueLabel}</span>
                )}
                <div className="mt-0.5 text-sm text-white/55">{venueSub}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs font-semibold text-white/60">
              Recurring only
            </div>
            <div className="mt-1 text-sm text-white/75">
              We only list known, recurring events. We do not post schedule
              updates or changes. Always confirm cancellations, time shifts, and
              special events on the organizer’s website and socials.
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs font-semibold text-white/60">
                Organizer
              </div>

              <div className="mt-1 text-base font-semibold text-white">
                {org?.name || instance.orgName || "Organizer"}
              </div>

              {org?.description ? (
                <div className="mt-2 text-sm text-white/70">
                  {org.description}
                </div>
              ) : (
                <div className="mt-2 text-sm text-white/60">
                  No directory entry found for this organizer yet.
                </div>
              )}

              {modalLinks.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {modalLinks.map((l) => (
                    <a
                      key={`${l.kind}-${l.href}`}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/10"
                    >
                      {linkText(l)}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs font-semibold text-white/60">
                Add to your calendar
              </div>
              <div className="mt-2">
                <AddToCalendarButton instance={instance} org={org} />
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-white/45">
            This hub stays stable on purpose. Follow organizers for updates.
          </div>
        </div>
      </div>
    </div>
  );
}
