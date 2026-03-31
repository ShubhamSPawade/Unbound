"use client"

import Link from "next/link"
import { Calendar, Users, TrendingUp, ArrowRight, PlusCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Total Events", value: "12", change: "+2 this month", icon: Calendar, color: "bg-primary" },
  { label: "Total Registrations", value: "847", change: "+156 this week", icon: Users, color: "bg-secondary" },
  { label: "Avg. Attendance", value: "89%", change: "+5% from last month", icon: TrendingUp, color: "bg-accent" },
]

const recentEvents = [
  {
    id: 1,
    title: "Hackathon 2026",
    date: "Apr 15, 2026",
    registrations: 156,
    capacity: 200,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Web Dev Bootcamp",
    date: "May 10, 2026",
    registrations: 45,
    capacity: 50,
    status: "upcoming",
  },
  {
    id: 3,
    title: "Code Sprint",
    date: "Mar 20, 2026",
    registrations: 78,
    capacity: 80,
    status: "completed",
  },
]

const recentRegistrations = [
  { name: "John Doe", event: "Hackathon 2026", time: "2 hours ago" },
  { name: "Jane Smith", event: "Hackathon 2026", time: "3 hours ago" },
  { name: "Mike Johnson", event: "Web Dev Bootcamp", time: "5 hours ago" },
  { name: "Sarah Williams", event: "Hackathon 2026", time: "1 day ago" },
]

export default function ClubDashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Coding Club!</p>
        </div>
        <Link href="/club/create">
          <Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`border-4 border-foreground ${stat.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center border-4 border-foreground bg-card">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="mb-1 text-4xl font-black">{stat.value}</p>
            <p className="font-bold">{stat.label}</p>
            <p className="mt-1 text-sm font-medium opacity-80">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Recent Events</h2>
            <Link href="/club/events" className="text-sm font-bold hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y-4 divide-foreground">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">{event.registrations}/{event.capacity}</p>
                    <p className="text-xs text-muted-foreground">registrations</p>
                  </div>
                  <span
                    className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                      event.status === "upcoming" ? "bg-secondary" : "bg-muted"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Recent Registrations</h2>
            <Link href="/club/registrations" className="text-sm font-bold hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y-4 divide-foreground">
            {recentRegistrations.map((reg, index) => (
              <div key={index} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary font-bold">
                    {reg.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{reg.name}</p>
                    <p className="text-sm text-muted-foreground">{reg.event}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{reg.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 border-4 border-foreground bg-secondary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-xl font-black">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/club/create">
            <Button
              variant="outline"
              className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
          </Link>
          <Link href="/club/events">
            <Button
              variant="outline"
              className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Eye className="mr-2 h-4 w-4" />
              Manage Events
            </Button>
          </Link>
          <Link href="/club/registrations">
            <Button
              variant="outline"
              className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Users className="mr-2 h-4 w-4" />
              View Registrations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
