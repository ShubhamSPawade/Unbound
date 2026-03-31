import { type LucideIcon, Calendar, Users, Search, FileX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: "default" | "compact"
}

export function EmptyState({
  icon: Icon = FileX,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-4 border-foreground bg-card text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        variant === "default" ? "p-12" : "p-8"
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center border-4 border-foreground bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className={cn("font-black", variant === "default" ? "text-xl" : "text-lg")}>
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-6 border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Pre-configured empty states
export function NoEventsFound({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="No events found"
      description="Try adjusting your filters or search terms"
      action={onClear ? { label: "Clear Filters", onClick: onClear } : undefined}
    />
  )
}

export function NoRegistrations() {
  return (
    <EmptyState
      icon={Users}
      title="No registrations yet"
      description="When students register for your events, they&apos;ll appear here"
    />
  )
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title={`No results for "${query}"`}
      description="Try searching with different keywords"
    />
  )
}
