import Link from "next/link";

export default function EventsHero() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="text-xs font-semibold text-white/65">Events</div>

      <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        A simple monthly hub for recurring film events in North Texas.
      </h1>

      <p className="mt-4 max-w-3xl text-pretty text-sm text-white/70 sm:text-base">
        We only list known, recurring events. We do not post schedule updates or
        changes. Always confirm cancellations, time shifts, and special events
        by checking the organizer’s website and socials.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
          Recurring only
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
          No live updates
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
          Follow organizers for changes
        </span>
      </div>

      <div className="mt-5 text-sm text-white/70">
        Want your recurring event listed?{" "}
        <Link
          href="/directory"
          className="font-semibold text-white underline underline-offset-4 hover:opacity-90"
        >
          Add your org to the directory
        </Link>
        .
      </div>
    </div>
  );
}
