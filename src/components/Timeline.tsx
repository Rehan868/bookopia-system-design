
import { ReactNode } from "react";
import { TimelineItem } from "./TimelineItem";

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  status?: "upcoming" | "current" | "completed";
  icon?: ReactNode;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={className}>
      {events.map((event, index) => (
        <TimelineItem
          key={index}
          time={event.time}
          title={event.title}
          description={event.description}
          status={event.status}
          icon={event.icon}
        />
      ))}
    </div>
  );
}
