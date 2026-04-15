"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { use } from "react"
import { ArrowLeft, Calendar, MapPin, Users, Clock, Building2, CheckCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/toast-provider"
import { eventApi, registrationApi } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { success, error } = useToast()

  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      try {
        const res = await eventApi.getEventById(Number(id))
        setEvent(res.data.data)

        // Check if already registered
        try {
          const myRegs = await registrationApi.getMyRegistrations()
          const registrations = myRegs.data.data || []
          const alreadyRegistered = registrations.some((r: any) => r.eventId === Number(id))
          setIsRegistered(alreadyRegistered)
        } catch {
          // not critical — ignore
        }
      } catch {
        error("Error", "Failed to load event details")
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  const handleRegister = async () => {
    if (!event) return

    // Paid event — go to checkout
    if (event.feeAmount && event.feeAmount > 0) {
      router.push(`/student/checkout/${id}`)
      return
    }

    // Free event — register directly
    setIsRegistering(true)
    try {
      await registrationApi.register(Number(id))
      setIsRegistered(true)
      // Update count live without reload
      setEvent((prev: any) => ({
        ...prev,
        currentRegistrations: prev.currentRegistrations + 1,
      }))
      success("Registered!", `You are now registered for ${event.title}`)
    } catch (err: any) {
      error("Registration Failed", err?.response?.data?.message || "Could not register for this event")
    } finally {
      setIsRegistering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="h-96 animate-pulse border-4 border-foreground bg-muted" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl text-center py-20">
        <p className="text-xl font-black">Event not found</p>
        <Link href="/student" className="mt-4 inline-block border-4 border-foreground bg-primary px-4 py-2 font-bold">
          Back to Events
        </Link>
      </div>
    )
  }

  const pct = event.maxParticipants > 0 ? Math.round((event.currentRegistrations / event.maxParticipants) * 100) : 0
  const isPaid = event.feeAmount && event.feeAmount > 0
  const isFull = event.currentRegistrations >= event.maxParticipants

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/student" className="mb-6 inline-flex items-center gap-2 font-bold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Events
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
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="border-4 border-foreground bg-primary px-3 py-1 font-bold">{event.category}</span>
            {isPaid
              ? <span className="border-4 border-foreground bg-accent px-3 py-1 font-bold">Rs. {event.feeAmount}</span>
              : <span className="border-4 border-foreground bg-secondary px-3 py-1 font-bold">Free Entry</span>
            }
            {event.festName && (
              <span className="border-4 border-foreground bg-muted px-3 py-1 font-bold">{event.festName}</span>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-black md:text-4xl">{event.title}</h1>
          {event.description && <p className="mb-6 text-lg text-muted-foreground">{event.description}</p>}

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Date</p>
                <p className="text-muted-foreground">{new Date(event.eventDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-secondary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Time</p>
                <p className="text-muted-foreground">{new Date(event.eventDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
            {event.venue && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-accent">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Venue</p>
                  <p className="text-muted-foreground">{event.venue}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-muted">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Organized by</p>
                <p className="text-muted-foreground">{event.clubName}</p>
              </div>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold">Registration Status</span>
              <span className="font-bold">{event.currentRegistrations}/{event.maxParticipants}</span>
            </div>
            <div className="h-4 border-4 border-foreground bg-muted">
              <div className={`h-full ${pct >= 90 ? "bg-accent" : "bg-primary"}`} style={{ width: `${pct}%` }} />
            </div>
            {isFull && <p className="mt-2 text-sm font-bold text-destructive">This event is full</p>}
          </div>

          {/* Register Button */}
          {isRegistered ? (
            <div className="inline-flex items-center gap-3 border-4 border-foreground bg-primary px-6 py-4 font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle className="h-6 w-6" />
              You are registered for this event!
            </div>
          ) : (
            <Button
              onClick={handleRegister}
              disabled={isFull || isRegistering}
              className="w-full border-4 border-foreground bg-primary py-6 text-lg font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 md:w-auto md:px-12"
            >
              {isRegistering ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                  Registering...
                </span>
              ) : isFull ? "Event Full" : isPaid ? (
                <span className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Pay & Register — Rs. {event.feeAmount}</span>
              ) : "Register Now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
