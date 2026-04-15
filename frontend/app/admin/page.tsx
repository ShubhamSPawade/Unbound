"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Users, Building2, Flag, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { clubApi, eventApi, festApi, registrationApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [recentEvents, setRecentEvents] = useState<any[]>([])
  const [pendingClubs, setPendingClubs] = useState<any[]>([])
  const [fests, setFests] = useState<any[]>([])
  const [stats, setStats] = useState({ events: 0, clubs: 0, fests: 0, registrations: 0 })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [eventsRes, clubsRes, festsRes] = await Promise.allSettled([
          eventApi.getAllEventsAdmin(),
          clubApi.getAllClubsAdmin(),
          festApi.getAllFests(),
        ])

        const allEvents = eventsRes.status === "fulfilled" ? eventsRes.value.data.data || [] : []
        const allClubs = clubsRes.status === "fulfilled" ? clubsRes.value.data.data || [] : []
        const allFests = festsRes.status === "fulfilled" ? festsRes.value.data.data || [] : []

        setRecentEvents(allEvents.slice(0, 4))
        setPendingClubs(allClubs.filter((c: any) => c.status === "PENDING").slice(0, 3))
        setFests(allFests.slice(0, 4))

        const totalRegs = allEvents.reduce((sum: number, e: any) => sum + (e.currentRegistrations || 0), 0)
        setStats({
          events: allEvents.length,
          clubs: allClubs.filter((c: any) => c.status === "APPROVED").length,
          fests: allFests.length,
          registrations: totalRegs,
        })
      } catch { /* ignore */ } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleApprove = async (clubId: number) => {
    try {
      await clubApi.approveClub(clubId)
      setPendingClubs((prev) => prev.filter((c) => c.id !== clubId))
      setStats((prev) => ({ ...prev, clubs: prev.clubs + 1 }))
    } catch { /* ignore */ }
  }

  const statusColor: Record<string, string> = {
    PUBLISHED: "bg-primary", DRAFT: "bg-accent", CANCELLED: "bg-destructive text-destructive-foreground", COMPLETED: "bg-muted",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}! Overview of all platform activities.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Events", value: stats.events, icon: Calendar, color: "bg-primary" },
          { label: "Total Registrations", value: stats.registrations, icon: Users, color: "bg-secondary" },
          { label: "Active Clubs", value: stats.clubs, icon: Building2, color: "bg-accent" },
          { label: "Total Fests", value: stats.fests, icon: Flag, color: "bg-card" },
        ].map((stat) => (
          <div key={stat.label} className={`border-4 border-foreground ${stat.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center border-4 border-foreground bg-card">
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="mb-1 text-3xl font-black">{isLoading ? "—" : stat.value}</p>
            <p className="font-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Recent Events</h2>
            <Link href="/admin/events" className="text-sm font-bold hover:underline">View All</Link>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 animate-pulse bg-muted" />)}</div>
          ) : recentEvents.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No events yet</div>
          ) : (
            <div className="divide-y-4 divide-foreground">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.clubName} · {new Date(event.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{event.currentRegistrations}</span>
                    <span className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${statusColor[event.status] || "bg-muted"}`}>{event.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Club Approvals */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Pending Approvals</h2>
            <Link href="/admin/clubs" className="text-sm font-bold hover:underline">View All</Link>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-16 animate-pulse bg-muted" />)}</div>
          ) : pendingClubs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No pending approvals</div>
          ) : (
            <div className="divide-y-4 divide-foreground">
              {pendingClubs.map((club) => (
                <div key={club.id} className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">{club.ownerName} · {club.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(club.id)}
                      className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      Approve
                    </Button>
                    <Link href="/admin/clubs" className="flex-1">
                      <Button size="sm" variant="outline" className="w-full border-4 border-foreground font-bold">Review</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fests Overview */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:col-span-2">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Fests Overview</h2>
            <Link href="/admin/fests" className="text-sm font-bold hover:underline">Manage Fests</Link>
          </div>
          {fests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No fests yet</div>
          ) : (
            <div className="grid gap-4 p-4 md:grid-cols-2">
              {fests.map((fest) => (
                <div key={fest.id} className="border-4 border-foreground bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-black">{fest.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(fest.startDate).toLocaleDateString()} – {new Date(fest.endDate).toLocaleDateString()}</p>
                  <p className="mt-2 text-sm font-bold">{fest.collegeName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 border-4 border-foreground bg-accent p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-xl font-black">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { href: "/admin/fests", icon: Flag, label: "Manage Fests" },
            { href: "/admin/clubs", icon: Building2, label: "Manage Clubs" },
            { href: "/admin/events", icon: Calendar, label: "View All Events" },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <Button variant="outline" className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                <Icon className="mr-2 h-4 w-4" />{label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
