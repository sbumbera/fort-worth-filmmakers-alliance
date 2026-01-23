import type { EventInstance } from "@/lib/eventsCalendar";

function timeLabel(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventChip({
  instance,
  onClick,
}: {
  instance: EventInstance;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={instance.title}
      className="w-full rounded-xl border border-white/12 bg-white/5 px-2 py-1.5 text-left hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-full">
          <div className="text-[11px] font-semibold leading-snug text-white/85">
            {instance.title}
          </div>
          <div className="mt-0.5 text-[11px] text-white/55">
            {timeLabel(instance.start)}
          </div>
        </div>
      </div>
    </button>
  );
}
