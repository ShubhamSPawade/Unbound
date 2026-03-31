"use client"

import { useState } from "react"
import { TrendingUp, Users, Calendar, Building2, ArrowUp, ArrowDown } from "lucide-react"

const monthlyRegistrations = [
  { month: "Oct", count: 320 },
  { month: "Nov", count: 480 },
  { month: "Dec", count: 210 },
  { month: "Jan", count: 540 },
  { month: "Feb", count: 620 },
  { month: "Mar", count: 890 },
]

const categoryBreakdown = [
  { category: "Technical", events: 45, registrations: 1820, color: "bg-primary" },
  { category: "Cultural", events: 32, registrations: 2340, color: "bg-secondary" },
  { category: "Sports", events: 28, registrations: 980, color: "bg-accent" },
  { category: "Workshop", events: 21, registrations: 640, color: "bg-muted" },
  { category: "Arts", events: 18, registrations: 420, color: "bg-card" },
]

const topEvents = [
  { title: "Cultural Night", club: "Drama Society", registrations: 342, capacity: 500, trend: "up" },
  { title: "Hackathon 2026", club: "Coding Club", registrations: 156, capacity: 200, trend: "up" },
  { title: "Inter-College Cricket", club: "Sports Committee", registrations: 120, capacity: 150, trend: "down" },
  { title: "Music Workshop", club: "Music Club", registrations: 28, capacity: 30, trend: "up" },
  { title: "Art Exhibition", club: "Fine Arts", registrations: 67, capacity: 100, trend: "up" },
]

const topClubs = [
  { name: "Coding Club", events: 12, registrations: 847, growth: 23 },
  { name: "Drama Society", events: 8, registrations: 1240, growth: 15 },
  { name: "Sports Committee", events: 10, registrations: 620, growth: -5 },
  { name: "Music Club", events: 6, registrations: 380, growth: 42 },
  { name: "Fine Arts", events: 5, registrations: 290, growth: 8 },
]

const maxRegistrations = Math.max(...monthlyRegistrations.map((m) => m.count))

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month")

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">Analytics</h1>
          <p className="text-muted-foreground">Platform-wide performance overview</p>
        </div>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${
                period === p
                  ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-card hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Registrations", value: "4,847", change: "+12.5%", up: true, icon: Users, color: "bg-primary" },
          { label: "Active Events", value: "156", change: "+8.2%", up: true, icon: Calendar, color: "bg-secondary" },
          { label: "Active Clubs", value: "24", change: "+2 new", up: true, icon: Building2, color: "bg-accent" },
          { label: "Revenue", value: "Rs. 48,200", change: "+18.3%", up: true, icon: TrendingUp, color: "bg-card" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={`border-4 border-foreground ${kpi.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center border-4 border-foreground bg-card">
                <kpi.icon className="h-6 w-6" />
              </div>
              <span
                className={`flex items-center gap-1 border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                  kpi.up ? "bg-primary" : "bg-destructive text-destructive-foreground"
                }`}
              >
                {kpi.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-3xl font-black">{kpi.value}</p>
            <p className="mt-1 font-bold">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Monthly Registrations Chart */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Monthly Registrations</h2>
          </div>
          <div className="p-6">
            <div className="flex h-48 items-end gap-3">
              {monthlyRegistrations.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-bold">{item.count}</span>
                  <div
                    className="w-full border-4 border-foreground bg-primary transition-all"
                    style={{ height: `${(item.count / maxRegistrations) * 160}px` }}
                  />
                  <span className="text-xs font-bold text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Events by Category</h2>
          </div>
          <div className="divide-y-4 divide-foreground">
            {categoryBreakdown.map((cat) => {
              const totalRegs = categoryBreakdown.reduce((s, c) => s + c.registrations, 0)
              const pct = Math.round((cat.registrations / totalRegs) * 100)
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
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Events */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Top Events</h2>
          </div>
          <div className="divide-y-4 divide-foreground">
            {topEvents.map((event, i) => (
              <div key={event.title} className="flex items-center gap-4 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border-4 border-foreground bg-primary font-black">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-bold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.club}</p>
                </div>
                <div className="text-right">
                  <p className="font-black">{event.registrations}</p>
                  <p className="text-xs text-muted-foreground">/ {event.capacity}</p>
                </div>
                {event.trend === "up" ? (
                  <ArrowUp className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <ArrowDown className="h-4 w-4 shrink-0 text-destructive" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Clubs */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Top Clubs</h2>
          </div>
          <div className="divide-y-4 divide-foreground">
            {topClubs.map((club, i) => (
              <div key={club.name} className="flex items-center gap-4 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border-4 border-foreground bg-secondary font-black">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-bold">{club.name}</p>
                  <p className="text-sm text-muted-foreground">{club.events} events</p>
                </div>
                <div className="text-right">
                  <p className="font-black">{club.registrations}</p>
                  <p className="text-xs text-muted-foreground">registrations</p>
                </div>
                <span
                  className={`flex items-center gap-0.5 border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                    club.growth >= 0
                      ? "bg-primary"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {club.growth >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(club.growth)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
