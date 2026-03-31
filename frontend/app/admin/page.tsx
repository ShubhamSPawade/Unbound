"use client"

import Link from "next/link"
import { Calendar, Users, Building2, Flag, TrendingUp, ArrowRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { label: "Total Events", value: "156", change: "+12 this month", icon: Calendar, color: "bg-primary" },
  { label: "Total Registrations", value: "4,847", change: "+523 this week", icon: Users, color: "bg-secondary" },
  { label: "Active Clubs", value: "24", change: "+2 this month", icon: Building2, color: "bg-accent" },
  { label: "Ongoing Fests", value: "3", change: "2 upcoming", icon: Flag, color: "bg-card" },
]

const recentEvents = [
  { id: 1, title: "Hackathon 2026", club: "Coding Club", date: "Apr 15, 2026", registrations: 156, status: "approved" },
  { id: 2, title: "Cultural Night", club: "Drama Society", date: "Apr 20, 2026", registrations: 342, status: "approved" },
  { id: 3, title: "Art Exhibition", club: "Fine Arts", date: "Apr 25, 2026", registrations: 67, status: "pending" },
  { id: 4, title: "Cricket Tournament", club: "Sports Committee", date: "May 1, 2026", registrations: 120, status: "approved" },
]

const pendingClubs = [
  { id: 1, name: "Photography Club", representative: "Alex Brown", members: 45, submittedAt: "Mar 20, 2026" },
  { id: 2, name: "Robotics Club", representative: "Sarah Williams", members: 32, submittedAt: "Mar 22, 2026" },
]

const upcomingFests = [
  { id: 1, name: "TechFest 2026", date: "Apr 10-15, 2026", events: 25, status: "active" },
  { id: 2, name: "CultFest 2026", date: "May 1-5, 2026", events: 18, status: "upcoming" },
]

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of all platform activities</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="mb-1 text-3xl font-black">{stat.value}</p>
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
            <Link href="/admin/events" className="text-sm font-bold hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y-4 divide-foreground">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.club} - {event.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{event.registrations}</span>
                  <span
                    className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                      event.status === "approved" ? "bg-primary" : "bg-accent"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Club Approvals */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Pending Approvals</h2>
            <Link href="/admin/clubs" className="text-sm font-bold hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y-4 divide-foreground">
            {pendingClubs.map((club) => (
              <div key={club.id} className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{club.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Rep: {club.representative} | {club.members} members
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{club.submittedAt}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-4 border-foreground font-bold"
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
            {pendingClubs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No pending approvals
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Fests */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:col-span-2">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Fests Overview</h2>
            <Link href="/admin/fests" className="text-sm font-bold hover:underline">
              Manage Fests
            </Link>
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-2">
            {upcomingFests.map((fest) => (
              <div
                key={fest.id}
                className={`border-4 border-foreground p-4 ${
                  fest.status === "active" ? "bg-secondary" : "bg-muted"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-black">{fest.name}</h3>
                  <span
                    className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                      fest.status === "active" ? "bg-primary" : "bg-card"
                    }`}
                  >
                    {fest.status}
                  </span>
                </div>
                <p className="text-muted-foreground">{fest.date}</p>
                <p className="mt-2 font-bold">{fest.events} events</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 border-4 border-foreground bg-accent p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-xl font-black">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/fests">
            <Button
              variant="outline"
              className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Flag className="mr-2 h-4 w-4" />
              Manage Fests
            </Button>
          </Link>
          <Link href="/admin/clubs">
            <Button
              variant="outline"
              className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Manage Clubs
            </Button>
          </Link>
          <Link href="/admin/events">
            <Button
              variant="outline"
              className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Calendar className="mr-2 h-4 w-4" />
              View All Events
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button
              variant="outline"
              className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
