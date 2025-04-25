
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  type?: "full" | "icon";
}

export function Logo({ className, type = "full" }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="text-primary font-bold flex items-center">
        <span className="bg-primary text-primary-foreground rounded-lg p-1.5 mr-2 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 7v10c0 3-2 5-5 5H6.2c-1.8 0-3.2-1.4-3.2-3.2V5c0-1.8 1.4-3.2 3.2-3.2H14" />
            <path d="M16 3h6v6" />
            <path d="M12 13v4" />
            <path d="M9 13v4" />
            <path d="M19 13v4" />
            <path d="M16 13v4" />
            <path d="M9 8h1" />
            <path d="M16 8h1" />
            <path d="M12 8h.01" />
          </svg>
        </span>
        {type === "full" && <span className="text-xl tracking-tight">BOOKOPIA</span>}
      </div>
    </div>
  );
}
