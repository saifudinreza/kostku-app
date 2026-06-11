import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** mis. "+12%" atau "-15%" */
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  iconClassName?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaTone = "neutral",
  iconClassName,
}: StatCardProps) {
  return (
    <div className="kk-card rounded-card bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-ink-soft">{label}</p>
        <span
          className={cn(
            "nm-chip flex h-10 w-10 items-center justify-center rounded-xl text-brand",
            iconClassName
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 font-sans text-[28px] font-bold leading-tight text-ink">
        {value}
      </p>
      {delta && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            deltaTone === "up" && "text-success",
            deltaTone === "down" && "text-danger",
            deltaTone === "neutral" && "text-ink-soft"
          )}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
