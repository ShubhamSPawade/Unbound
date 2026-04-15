"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Calendar, Building2, ArrowUp } from "lucide-react"
import { clubApi, eventApi, festApi } from "@/lib/api"

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ events: 0, registrations: 0, clubs: 0, fests: 0 })
  const [events, setEvents] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([])

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

        const totalRegs = allEvents.reduce((s: number, e: any) => s + (e.currentRegistrations || 0), 0)

        setStats({
          events: allEvents.length,
          registrations: totalRegs,
          clubs: allClubs.filter((c: any) => c.status === "APPROVED").length,
          fests: allFests.length,
        })

        // Top events by registrations
        const sorted = [...allEvents].sort((a, b) => (b.currentRegistrations || 0) - (a.currentRegistrations || 0))
        setEvents(sorted.slice(0, 5))

        // Top clubs by event count
        const clubEventCount: Record<string, { name: string; events: number; registrations: number }> = {}
        allEvents.forEach((e: any) => {
          if (!clubEventCount[e.clubName]) clubEventCount[e.clubName] = { name: e.clubName, events: 0, registrations: 0 }
          clubEventCount[e.clubName].events++
          clubEventCount[e.clubName].registrations += e.currentRegistrations || 0
        })
        const topClubs = Object.values(clubEventCount).sort((a, b) => b.registrations - a.registrations).slice(0, 5)
        setClubs(topClubs)

        // Category breakdown
        const catMap: Record<string, { events: number; registrations: number }> = {}
        allEvents.forEach((e: any) => {
          if (!catMap[e.category]) catMap[e.category] = { events: 0, registrations: 0 }
          catMap[e.category].events++
          catMap[e.category].registrations += e.currentRegistrations || 0
        })
        const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-muted", "bg-card"]
        setCategoryBreakdown(
          Object.entries(catMap).map(([cat, data], i) => ({ category: cat, ...data, color: colors[i % colors.length] }))
            .sort((a, b) => b.registrations - a.registrations)
        )
      } catch { /* ignore */ } finally { setIsLoading(false) }
    }
    fetchData()
  }, [])

  const maxRegs = Math.max(...events.map((e) => e.currentRegistrations || 0), 1)
  const totalCatRegs = categoryBreakdown.reduce((s, c) => s + c.registrations, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Analytics</h1>
        <p className="text-muted-foreground">Platform-wide performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Registrations", value: stats.registrations, icon: Users, color: "bg-primary" },
          { label: "Total Events", value: stats.events, icon: Calendar, color: "bg-secondary" },
          { label: "Active Clubs", value: stats.clubs, icon: Building2, color: "bg-accent" },
          { label: "Total Fests", value: stats.fests, icon: TrendingUp, color: "bg-card" },
        ].map((kpi) => (
          <div key={kpi.label} className={`border-4 border-foreground ${kpi.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center border-4 border-foreground bg-card">
              <kpi.icon className="h-6 w-6" />
            </div>
            <p className="text-3xl font-black">{isLoading ? "—" : kpi.value}</p>
            <p className="mt-1 font-bold">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Top Events Bar Chart */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Top Events by Registrations</h2>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-8 animate-pulse bg-muted" />)}</div>
            ) : events.length === 0 ? (
              <p className="text-center text-muted-foreground">No events yet</p>
            ) : (
              <div className="flex h-48 items-end gap-3">
                {events.map((event) => (
                  <div key={event.id} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-bold">{event.currentRegistrations || 0}</span>
                    <div className="w-full border-4 border-foreground bg-primary transition-all"
                      style={{ height: `${((event.currentRegistrations || 0) / maxRegs) * 140}px` }} />
                    <span className="text-xs font-bold text-muted-foreground truncate w-full text-center">{event.title?.slice(0, 8)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Events by Category</h2>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 animate-pulse bg-muted" />)}</div>
          ) : categoryBreakdown.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No data yet</div>
          ) : (
            <div className="divide-y-4 divide-foreground">
              {categoryBreakdown.map((cat) => {
                const pct = totalCatRegs > 0 ? Math.round((cat.registrations / totalCatRegs) * 100) : 0
                return (
                  <div key={cat.category} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 border-2 border-foreground ${cat.color}`} />
                        <span className="font-bold">{cat.category}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{cat.events} events</span>
                        <span className="font-bold">{cat.registrations}</span>
                      </div>
                    </div>
                    <div className="h-2 border-2 border-foreground bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Clubs */}
      <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground p-4">
          <h2 className="text-xl font-black">Top Clubs by Registrations</h2>
        </div>
        {isLoading ? (
          <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse bg-muted" />)}</div>
        ) : clubs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No data yet</div>
        ) : (
          <div className="divide-y-4 divide-foreground">
            {clubs.map((club, i) => (
              <div key={club.name} className="flex items-center gap-4 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border-4 border-foreground bg-secondary font-black">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-bold">{club.name}</p>
                  <p className="text-sm text-muted-foreground">{club.events} events</p>
                </div>
                <div className="text-right">
                  <p className="font-black">{club.registrations}</p>
                  <p className="text-xs text-muted-foreground">registrations</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
