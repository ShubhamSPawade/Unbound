"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { registrationApi } from "@/lib/api"

type TabType = "all" | "upcoming" | "completed"

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("all")

  useEffect(() => {
    const fetchRegistrations = async () => {
      setIsLoading(true)
      try {
        const res = await registrationApi.getMyRegistrations()
        setRegistrations(res.data.data || [])
      } catch {
        setRegistrations([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchRegistrations()
  }, [])

  const getStatus = (eventDate: string | null) => {
    if (!eventDate) return "upcoming" // default to upcoming if no date
    return new Date(eventDate) > new Date() ? "upcoming" : "completed"
  }

  const filtered = registrations.filter((r) => {
    if (activeTab === "all") return true
    return getStatus(r.eventDate) === activeTab
  })

  const upcomingCount = registrations.filter((r) => getStatus(r.eventDate) === "upcoming").length
  const completedCount = registrations.filter((r) => getStatus(r.eventDate) === "completed").length

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">My Events</h1>
        <p className="text-muted-foreground">Track your registered and past events</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border-4 border-foreground bg-primary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{registrations.length}</p>
          <p className="font-bold">Total Registered</p>
        </div>
        <div className="border-4 border-foreground bg-secondary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{upcomingCount}</p>
          <p className="font-bold">Upcoming</p>
        </div>
        <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{completedCount}</p>
          <p className="font-bold">Completed</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {(["all", "upcoming", "completed"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${activeTab === tab ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 animate-pulse border-4 border-foreground bg-muted" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-xl font-bold">No events found</p>
          <p className="mb-6 text-muted-foreground">
            {activeTab === "upcoming" ? "You have no upcoming events"
              : activeTab === "completed" ? "You haven't attended any events yet"
              : "You haven't registered for any events yet"}
          </p>
          <Link href="/student">
            <Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Explore Events
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((reg) => {
            const status = getStatus(reg.eventDate)
            return (
              <div key={reg.id} className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5">
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {status === "upcoming" ? (
                        <span className="flex items-center gap-1 border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">
                          <AlertCircle className="h-3 w-3" /> Upcoming
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 border-2 border-foreground bg-muted px-2 py-0.5 text-sm font-bold">
                          <CheckCircle className="h-3 w-3" /> Completed
                        </span>
                      )}
                      <span className="border-2 border-foreground bg-card px-2 py-0.5 text-xs font-bold capitalize">{reg.status}</span>
                    </div>
                    <h3 className="mb-1 text-xl font-black">{reg.eventTitle}</h3>
                    <div className="flex flex-wrap gap-4 text-sm mt-2">
                      {reg.eventDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(reg.eventDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {reg.eventVenue && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{reg.eventVenue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Link href={`/student/events/${reg.eventId}`}>
                      <Button variant="outline" className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
