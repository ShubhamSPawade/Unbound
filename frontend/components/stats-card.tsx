import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

type StatsCardProps = {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  variant?: "default" | "primary" | "secondary" | "accent"
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "border-4 border-foreground p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        variant === "default" && "bg-card",
        variant === "primary" && "bg-primary",
        variant === "secondary" && "bg-secondary",
        variant === "accent" && "bg-accent"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="text-4xl font-black">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 border-2 border-foreground px-2 py-0.5 text-sm font-bold",
                trend.isPositive ? "bg-primary" : "bg-destructive text-destructive-foreground"
              )}
            >
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
              <span className="text-xs">{trend.label}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center border-4 border-foreground bg-background">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}
