"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const registeredEvents = [
  {
    id: 1,
    title: "Hackathon 2026",
    date: "Apr 15, 2026",
    time: "9:00 AM",
    venue: "Main Auditorium",
    category: "Technical",
    club: "Coding Club",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Web Dev Workshop",
    date: "Mar 20, 2026",
    time: "2:00 PM",
    venue: "Computer Lab",
    category: "Workshop",
    club: "Coding Club",
    status: "completed",
  },
  {
    id: 3,
    title: "Cultural Night",
    date: "Apr 20, 2026",
    time: "6:00 PM",
    venue: "Open Air Theatre",
    category: "Cultural",
    club: "Drama Society",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Photography Contest",
    date: "Feb 28, 2026",
    time: "10:00 AM",
    venue: "Campus Grounds",
    category: "Arts",
    club: "Fine Arts",
    status: "completed",
  },
]

type TabType = "all" | "upcoming" | "completed"

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all")

  const filteredEvents = registeredEvents.filter((event) => {
    if (activeTab === "all") return true
    return event.status === activeTab
  })

  const upcomingCount = registeredEvents.filter((e) => e.status === "upcoming").length
  const completedCount = registeredEvents.filter((e) => e.status === "completed").length

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">My Events</h1>
        <p className="text-muted-foreground">Track your registered and past events</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border-4 border-foreground bg-primary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{registeredEvents.length}</p>
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

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {(["all", "upcoming", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${
              activeTab === tab
                ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-card hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5"
          >
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="border-2 border-foreground bg-primary px-2 py-0.5 text-sm font-bold">
                    {event.category}
                  </span>
                  {event.status === "upcoming" ? (
                    <span className="flex items-center gap-1 border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">
                      <AlertCircle className="h-3 w-3" /> Upcoming
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 border-2 border-foreground bg-muted px-2 py-0.5 text-sm font-bold">
                      <CheckCircle className="h-3 w-3" /> Completed
                    </span>
                  )}
                </div>
                <h3 className="mb-1 text-xl font-black">{event.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">by {event.club}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
              <div>
                <Link href={`/student/events/${event.id}`}>
                  <Button
                    variant="outline"
                    className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-xl font-bold">No events found</p>
          <p className="mb-6 text-muted-foreground">
            {activeTab === "upcoming"
              ? "You have no upcoming events"
              : activeTab === "completed"
              ? "You haven't attended any events yet"
              : "You haven't registered for any events yet"}
          </p>
          <Link href="/student">
            <Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Explore Events
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
