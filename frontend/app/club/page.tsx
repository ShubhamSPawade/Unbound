"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Calendar, Users, TrendingUp, PlusCircle, Eye, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { eventApi, registrationApi, clubApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"

export default function ClubDashboardPage() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [events, setEvents] = useState<any[]>([])
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [allEventsCount, setAllEventsCount] = useState(0)
  const [recentRegs, setRecentRegs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasClub, setHasClub] = useState<boolean | null>(null) // null = loading

  const fetchData = useCallback(async () => {
    if (!user?.email) return
    setIsLoading(true)
    try {
      const clubRes = await clubApi.getMyClub()
      const myClub = clubRes.data.data
      if (myClub) {
        setHasClub(true)
        const eventsRes = await eventApi.getEventsByClub(myClub.id)
        const allEventsData = eventsRes.data.data || []
        setAllEventsCount(allEventsData.length)
        setAllEvents(allEventsData)
        setEvents(allEventsData.slice(0, 3))
        const allRegs: any[] = []
        await Promise.allSettled(
          allEventsData.map(async (event: any) => {
            try {
              const regRes = await registrationApi.getRegistrationsByEvent(event.id)
              allRegs.push(...(regRes.data.data || []))
            } catch { /* ignore */ }
          })
        )
        allRegs.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
        setRecentRegs(allRegs.slice(0, 4))
      } else {
        setHasClub(false)
      }
    } catch {
      setHasClub(false)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  // Re-fetch every time dashboard is visited (including after create)
  useEffect(() => {
    fetchData()
  }, [fetchData, pathname])

  const totalRegistrations = events.reduce((sum, e) => sum + (e.currentRegistrations || 0), 0)

  // Show register club prompt if no club exists
  if (!isLoading && hasClub === false) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md border-4 border-foreground bg-card p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-6 flex h-20 w-20 items-center justify-center border-4 border-foreground bg-secondary mx-auto">
            <Building2 className="h-10 w-10" />
          </div>
          <h2 className="mb-3 text-2xl font-black">No Club Registered</h2>
          <p className="mb-6 text-muted-foreground">
            You haven't registered a club yet. Register your club to start creating events and managing registrations.
          </p>
          <Link href="/club/register">
            <Button className="w-full border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <PlusCircle className="mr-2 h-5 w-5" /> Register Your Club
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
        <Link href="/club/create">
          <Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Event
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Events", value: String(allEventsCount), icon: Calendar, color: "bg-primary" },
          { label: "Total Registrations", value: String(totalRegistrations), icon: Users, color: "bg-secondary" },
          { label: "Published Events", value: String(allEvents.filter(e => e.status === "PUBLISHED").length), icon: TrendingUp, color: "bg-accent" },
        ].map((stat) => (
          <div key={stat.label} className={`border-4 border-foreground ${stat.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center border-4 border-foreground bg-card">
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="mb-1 text-4xl font-black">{isLoading ? "—" : stat.value}</p>
            <p className="font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Recent Events</h2>
            <Link href="/club/events" className="text-sm font-bold hover:underline">View All</Link>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 animate-pulse bg-muted" />)}</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No events yet. Create your first event!</div>
          ) : (
            <div className="divide-y-4 divide-foreground">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(event.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">{event.currentRegistrations}/{event.maxParticipants}</p>
                      <p className="text-xs text-muted-foreground">registrations</p>
                    </div>
                    <span className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${event.status === "PUBLISHED" ? "bg-secondary" : event.status === "COMPLETED" ? "bg-muted" : "bg-accent"}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Registrations */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Recent Registrations</h2>
            <Link href="/club/registrations" className="text-sm font-bold hover:underline">View All</Link>
          </div>
          {recentRegs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No registrations yet.</div>
          ) : (
            <div className="divide-y-4 divide-foreground">
              {recentRegs.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary font-bold">
                      {reg.userName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-bold">{reg.userName}</p>
                      <p className="text-sm text-muted-foreground">{reg.eventTitle}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground capitalize">{reg.status?.toLowerCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 border-4 border-foreground bg-secondary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-xl font-black">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/club/create">
            <Button variant="outline" className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
            </Button>
          </Link>
          <Link href="/club/events">
            <Button variant="outline" className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              <Eye className="mr-2 h-4 w-4" /> Manage Events
            </Button>
          </Link>
          <Link href="/club/registrations">
            <Button variant="outline" className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              <Users className="mr-2 h-4 w-4" /> View Registrations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
