import type { EventInstance } from "@/lib/eventsCalendar";
import { ymd } from "@/lib/eventsCalendar";
import EventsDayCell from "@/components/events/EventsDayCell";

export default function EventsGrid({
  month,
  monthIndex,
  days,
  eventsByDay,
  selectedDayKey,
  onSelectDay,
  onSelectEvent,
}: {
  month: Date;
  monthIndex: number;
  days: Date[];
  eventsByDay: Map<string, EventInstance[]>;
  selectedDayKey: string;
  onSelectDay: (dayKey: string) => void;
  onSelectEvent: (e: EventInstance) => void;
}) {
  const weekdayLabelsMobile = ["S", "M", "T", "W", "T", "F", "S"];
  const weekdayLabelsDesktop = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 px-1 pb-2 text-[11px] font-semibold text-white/55">
        {weekdayLabelsMobile.map((w, idx) => (
          <div key={`${w}-${idx}`} className="text-center sm:hidden">
            {w}
          </div>
        ))}
        {weekdayLabelsDesktop.map((w) => (
          <div key={w} className="hidden text-left sm:block">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const key = ymd(d);
          const events = eventsByDay.get(key) ?? [];
          const isOutside = d.getMonth() !== monthIndex;
          const isToday = key === ymd(new Date());
          const isSelected = key === selectedDayKey;

          return (
            <EventsDayCell
              key={key}
              dayKey={key}
              date={d}
              isOutside={isOutside}
              isToday={isToday}
              isSelected={isSelected}
              events={events}
              onSelectDay={() => onSelectDay(key)}
              onSelectEvent={onSelectEvent}
            />
          );
        })}
      </div>
    </div>
  );
}
