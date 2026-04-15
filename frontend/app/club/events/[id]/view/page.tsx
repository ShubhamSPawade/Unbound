"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { use } from "react"
import { ArrowLeft, Calendar, MapPin, Clock, Building2 } from "lucide-react"
import { eventApi, registrationApi } from "@/lib/api"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"

export default function ClubEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { error } = useToast()
  const [event, setEvent] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await eventApi.getEventById(Number(id))
        setEvent(res.data.data)
        try {
          const regRes = await registrationApi.getRegistrationsByEvent(Number(id))
          setRegistrations(regRes.data.data || [])
        } catch { /* ignore */ }
      } catch {
        error("Error", "Failed to load event details")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (isLoading) return <div className="h-96 animate-pulse border-4 border-foreground bg-muted" />

  if (!event) return (
    <div className="text-center py-20">
      <p className="text-xl font-black">Event not found</p>
      <Link href="/club/events" className="mt-4 inline-block border-4 border-foreground bg-primary px-4 py-2 font-bold">Back to Events</Link>
    </div>
  )

  const pct = event.maxParticipants > 0 ? Math.round((event.currentRegistrations / event.maxParticipants) * 100) : 0

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/club/events" className="mb-6 inline-flex items-center gap-2 font-bold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to My Events
      </Link>

      <div className="mb-6 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
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
        </div>
      </div>

      {/* Registrations Table */}
      {registrations.length > 0 && (
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Registrations ({registrations.length})</h2>
          </div>
          <div className="divide-y-4 divide-foreground">
            {registrations.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary font-black">
                    {reg.userName?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-bold">{reg.userName}</p>
                    <p className="text-sm text-muted-foreground">{reg.userEmail}</p>
                  </div>
                </div>
                <span className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${reg.status === "CONFIRMED" ? "bg-primary" : "bg-accent"}`}>
                  {reg.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
