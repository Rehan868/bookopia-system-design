
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: {
    value: string | number;
    positive: boolean;
  };
  description?: string;
  className?: string;
}

export function StatCard({ 
  icon, 
  value, 
  label, 
  trend, 
  description,
  className 
}: StatCardProps) {
  return (
    <div className={cn("bookopia-stat-card", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-accent rounded-lg">
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-medium py-1 px-2 rounded-full",
            trend.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trend.positive && "+"}{trend.value}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-2">{description}</div>
        )}
      </div>
    </div>
  );
}
