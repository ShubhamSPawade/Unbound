import Link from "next/link"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type EventData = {
  id: string | number
  title: string
  date: string
  time: string
  venue: string
  category: string
  club: string
  capacity: number
  registered: number
  isPaid: boolean
  price?: number
  status?: "upcoming" | "ongoing" | "completed" | "cancelled"
  imageUrl?: string
}

type EventCardProps = {
  event: EventData
  href?: string
  variant?: "default" | "compact" | "horizontal"
  showProgress?: boolean
  actions?: React.ReactNode
}

export function EventCard({
  event,
  href,
  variant = "default",
  showProgress = true,
  actions,
}: EventCardProps) {
  const progressPercent = Math.round((event.registered / event.capacity) * 100)

  const content = (
    <div
      className={cn(
        "group h-full border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all",
        href && "hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        variant === "horizontal" && "flex flex-col md:flex-row"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "border-b-4 border-foreground bg-muted",
          variant === "horizontal"
            ? "aspect-video md:aspect-auto md:w-48 md:border-b-0 md:border-r-4"
            : "aspect-video",
          variant === "compact" && "aspect-[3/2]"
        )}
      >
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 p-5", variant === "compact" && "p-4")}>
        {/* Badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="border-2 border-foreground bg-primary px-2 py-0.5 text-sm font-bold">
            {event.category}
          </span>
          {event.isPaid ? (
            <span className="border-2 border-foreground bg-accent px-2 py-0.5 text-sm font-bold">
              Rs. {event.price}
            </span>
          ) : (
            <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">
              Free
            </span>
          )}
          {event.status && event.status !== "upcoming" && (
            <span
              className={cn(
                "border-2 border-foreground px-2 py-0.5 text-sm font-bold uppercase",
                event.status === "ongoing" && "bg-primary",
                event.status === "completed" && "bg-muted",
                event.status === "cancelled" && "bg-destructive text-destructive-foreground"
              )}
            >
              {event.status}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={cn(
            "mb-2 font-black",
            href && "group-hover:underline",
            variant === "compact" ? "text-lg" : "text-xl"
          )}
        >
          {event.title}
        </h3>
        <p className="mb-3 text-sm text-muted-foreground">by {event.club}</p>

        {/* Details */}
        <div className={cn("mb-4 space-y-1.5 text-sm", variant === "compact" && "mb-3")}>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {event.registered}/{event.capacity} registered
            </span>
          </div>
        </div>

        {/* Progress */}
        {showProgress && (
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 border-2 border-foreground bg-muted">
              <div
                className={cn(
                  "h-full",
                  progressPercent >= 90 ? "bg-accent" : "bg-primary"
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-bold">{progressPercent}%</span>
          </div>
        )}

        {/* Actions */}
        {actions && <div className="mt-4">{actions}</div>}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
