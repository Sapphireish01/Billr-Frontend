import { ActivityEvent } from "@/types";
import { formatRelativeTime, cn } from "@/lib/utils";

const DOT_COLORS: Record<ActivityEvent["type"], string> = {
  subscription: "bg-[#10B981]",
  payment_failed: "bg-[#EF4444]",
  payment_success: "bg-[#10B981]",
  upgrade: "bg-[#10B981]",
  cancellation: "bg-[#EF4444]",
  dunning: "bg-[#10B981]",
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <ul className="flex flex-col">
      {events.map((event) => {
        const dotColor = DOT_COLORS[event.type];
        return (
          <li
            key={event.id}
            className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", dotColor)} />
              <span className="text-sm font-bold text-text-primary font-montserrat">
                {event.message}
              </span>
            </div>
            <span className="text-xs text-text-secondary/60 font-montserrat shrink-0 ml-4">
              {formatRelativeTime(event.timestamp)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
