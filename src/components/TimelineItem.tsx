
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  status?: "upcoming" | "current" | "completed";
  icon?: React.ReactNode;
}

export function TimelineItem({ time, title, description, status = "upcoming", icon }: TimelineItemProps) {
  return (
    <div className="flex group">
      <div className="flex flex-col items-center mr-4">
        <div className={cn(
          "rounded-full h-9 w-9 flex items-center justify-center z-10",
          status === "upcoming" && "bg-muted border border-border",
          status === "current" && "bg-blue-100 text-primary border-2 border-primary",
          status === "completed" && "bg-green-100 text-green-600 border border-green-600"
        )}>
          {icon ? icon : (
            status === "completed" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
              </svg>
            )
          )}
        </div>
        <div className={cn(
          "w-px flex-grow",
          status === "upcoming" && "bg-muted",
          status === "current" && "bg-primary",
          status === "completed" && "bg-green-600"
        )}></div>
      </div>
      <div className="pb-8">
        <div className="text-sm text-muted-foreground">{time}</div>
        <div className="font-medium mt-1">{title}</div>
        <div className="text-sm text-muted-foreground mt-1">{description}</div>
      </div>
    </div>
  );
}
