"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { use } from "react"
import { ArrowLeft, Calendar, MapPin, Clock, Building2, Users } from "lucide-react"
import { eventApi } from "@/lib/api"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"

export default function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { error } = useToast()
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      try {
        const res = await eventApi.getEventById(Number(id))
        setEvent(res.data.data)
      } catch {
        error("Error", "Failed to load event details")
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  if (isLoading) return <div className="h-96 animate-pulse border-4 border-foreground bg-muted" />

  if (!event) return (
    <div className="text-center py-20">
      <p className="text-xl font-black">Event not found</p>
      <Link href="/admin/events" className="mt-4 inline-block border-4 border-foreground bg-primary px-4 py-2 font-bold">Back to Events</Link>
    </div>
  )

  const pct = event.maxParticipants > 0 ? Math.round((event.currentRegistrations / event.maxParticipants) * 100) : 0

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/events" className="mb-6 inline-flex items-center gap-2 font-bold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div className="border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {event.bannerUrl ? (
          <img src={event.bannerUrl} alt={event.title} className="aspect-video w-full border-b-4 border-foreground object-cover" />
        ) : (
          <div className="aspect-video border-b-4 border-foreground bg-muted flex items-center justify-center">
            <Calendar className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="border-4 border-foreground bg-primary px-3 py-1 font-bold">{event.category}</span>
            <span className={`border-4 border-foreground px-3 py-1 font-bold ${event.status === "PUBLISHED" ? "bg-secondary" : event.status === "CANCELLED" ? "bg-destructive text-destructive-foreground" : "bg-accent"}`}>{event.status}</span>
            {event.feeAmount > 0
              ? <span className="border-4 border-foreground bg-accent px-3 py-1 font-bold">Rs. {event.feeAmount}</span>
              : <span className="border-4 border-foreground bg-secondary px-3 py-1 font-bold">Free</span>
            }
          </div>
          <h1 className="mb-4 text-3xl font-black">{event.title}</h1>
          {event.description && <p className="mb-6 text-muted-foreground">{event.description}</p>}

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary"><Calendar className="h-5 w-5" /></div>
              <div><p className="font-bold">Date</p><p className="text-muted-foreground">{new Date(event.eventDate).toLocaleDateString()}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-secondary"><Clock className="h-5 w-5" /></div>
              <div><p className="font-bold">Time</p><p className="text-muted-foreground">{new Date(event.eventDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div>
            </div>
            {event.venue && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-accent"><MapPin className="h-5 w-5" /></div>
                <div><p className="font-bold">Venue</p><p className="text-muted-foreground">{event.venue}</p></div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-muted"><Building2 className="h-5 w-5" /></div>
              <div><p className="font-bold">Club</p><p className="text-muted-foreground">{event.clubName}</p></div>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex justify-between">
              <span className="font-bold">Registrations</span>
              <span className="font-bold">{event.currentRegistrations}/{event.maxParticipants}</span>
            </div>
            <div className="h-4 border-4 border-foreground bg-muted">
              <div className={`h-full ${pct >= 90 ? "bg-accent" : "bg-primary"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>

          <Link href={`/admin/events`}>
            <Button variant="outline" className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
