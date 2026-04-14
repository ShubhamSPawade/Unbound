"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { use } from "react"
import { ArrowLeft, Calendar, MapPin, Clock, Building2 } from "lucide-react"
import { eventApi } from "@/lib/api"
import { useToast } from "@/components/toast-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Infinity } from "lucide-react"

export default function PublicEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b-4 border-foreground bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight">UNBOUND</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/events" className="mb-6 inline-flex items-center gap-2 font-bold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>

        {isLoading ? (
          <div className="h-96 animate-pulse border-4 border-foreground bg-muted" />
        ) : !event ? (
          <div className="border-4 border-foreground bg-card p-16 text-center">
            <p className="text-xl font-black">Event not found</p>
          </div>
        ) : (
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
                {event.feeAmount > 0
                  ? <span className="border-4 border-foreground bg-accent px-3 py-1 font-bold">Rs. {event.feeAmount}</span>
                  : <span className="border-4 border-foreground bg-secondary px-3 py-1 font-bold">Free</span>
                }
                <span className="border-4 border-foreground bg-muted px-3 py-1 font-bold">{event.status}</span>
              </div>
              <h1 className="mb-4 text-3xl font-black md:text-4xl">{event.title}</h1>
              {event.description && <p className="mb-6 text-lg text-muted-foreground">{event.description}</p>}
              <div className="grid gap-4 md:grid-cols-2">
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
                  <div><p className="font-bold">Organized by</p><p className="text-muted-foreground">{event.clubName}</p></div>
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-2 flex justify-between">
                  <span className="font-bold">Registrations</span>
                  <span className="font-bold">{event.currentRegistrations}/{event.maxParticipants}</span>
                </div>
                <div className="h-4 border-4 border-foreground bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${event.maxParticipants > 0 ? (event.currentRegistrations / event.maxParticipants) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
