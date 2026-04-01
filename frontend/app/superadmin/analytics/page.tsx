"use client"

import { useState } from "react"
import { TrendingUp, Users, Calendar, Building2, ArrowUp, ArrowDown } from "lucide-react"

const collegeStats = [
  { name: "MITAOE", students: 4800, events: 156, registrations: 4847, clubs: 24, growth: 12 },
  { name: "MIT College", students: 6200, events: 210, registrations: 6320, clubs: 31, growth: 18 },
  { name: "Vishwakarma", students: 3900, events: 98, registrations: 2940, clubs: 18, growth: 8 },
  { name: "Symbiosis", students: 5100, events: 134, registrations: 3820, clubs: 22, growth: 15 },
]

const monthlyData = [
  { month: "Oct", registrations: 1820, events: 42 },
  { month: "Nov", registrations: 2340, events: 58 },
  { month: "Dec", registrations: 1240, events: 31 },
  { month: "Jan", registrations: 3120, events: 74 },
  { month: "Feb", registrations: 3840, events: 89 },
  { month: "Mar", registrations: 5280, events: 112 },
]

const maxReg = Math.max(...monthlyData.map((m) => m.registrations))

const categoryData = [
  { category: "Technical", events: 180, registrations: 7240, pct: 38 },
  { category: "Cultural", events: 128, registrations: 9360, pct: 29 },
  { category: "Sports", events: 112, registrations: 3920, pct: 16 },
  { category: "Workshop", events: 84, registrations: 2560, pct: 11 },
  { category: "Arts", events: 72, registrations: 1680, pct: 6 },
]

export default function SuperAdminAnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month")

  const totalStudents = collegeStats.reduce((s, c) => s + c.students, 0)
  const totalEvents = collegeStats.reduce((s, c) => s + c.events, 0)
  const totalRegistrations = collegeStats.reduce((s, c) => s + c.registrations, 0)

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">Platform Analytics</h1>
          <p className="text-muted-foreground">University-wide performance metrics</p>
        </div>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${period === p ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: totalStudents.toLocaleString(), change: "+8.2%", up: true, icon: Users, color: "bg-primary" },
          { label: "Total Events", value: totalEvents.toLocaleString(), change: "+12.5%", up: true, icon: Calendar, color: "bg-secondary" },
          { label: "Total Registrations", value: totalRegistrations.toLocaleString(), change: "+18.3%", up: true, icon: TrendingUp, color: "bg-accent" },
          { label: "Active Colleges", value: collegeStats.length.toString(), change: "+2 this year", up: true, icon: Building2, color: "bg-card" },
        ].map((k) => (
          <div key={k.label} className={`border-4 border-foreground ${k.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center border-4 border-foreground bg-card">
                <k.icon className="h-6 w-6" />
              </div>
              <span className={`flex items-center gap-1 border-2 border-foreground px-2 py-0.5 text-xs font-bold ${k.up ? "bg-primary" : "bg-destructive text-destructive-foreground"}`}>
                {k.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {k.change}
              </span>
            </div>
            <p className="text-3xl font-black">{k.value}</p>
            <p className="mt-1 font-bold">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Monthly Chart */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Monthly Registrations (All Colleges)</h2>
          </div>
          <div className="p-6">
            <div className="flex h-48 items-end gap-3">
              {monthlyData.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-bold">{(item.registrations / 1000).toFixed(1)}k</span>
                  <div className="w-full border-4 border-foreground bg-primary" style={{ height: `${(item.registrations / maxReg) * 160}px` }} />
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
            {categoryData.map((cat) => (
              <div key={cat.category} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold">{cat.category}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">{cat.events} events</span>
                    <span className="font-bold">{cat.registrations.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 border-2 border-foreground bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-College Table */}
      <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground p-4">
          <h2 className="text-xl font-black">College-wise Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-4 border-foreground bg-muted">
              <tr>
                {["College", "Students", "Clubs", "Events", "Registrations", "Growth"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left font-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-foreground">
              {collegeStats.map((c) => (
                <tr key={c.name}>
                  <td className="px-5 py-4 font-bold">{c.name}</td>
                  <td className="px-5 py-4">{c.students.toLocaleString()}</td>
                  <td className="px-5 py-4">{c.clubs}</td>
                  <td className="px-5 py-4">{c.events}</td>
                  <td className="px-5 py-4 font-bold">{c.registrations.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className="flex w-fit items-center gap-1 border-2 border-foreground bg-primary px-2 py-0.5 text-xs font-bold">
                      <ArrowUp className="h-3 w-3" />+{c.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
