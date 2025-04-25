
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="font-semibold">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
