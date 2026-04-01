"use client"

import { useState } from "react"
import { Search, Eye, CheckCircle, XCircle, MoreVertical, Calendar, Users, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const events = [
  {
    id: 1,
    title: "Hackathon 2026",
    club: "Coding Club",
    date: "Apr 15, 2026",
    category: "Technical",
    registrations: 156,
    capacity: 200,
    status: "approved",
  },
  {
    id: 2,
    title: "Cultural Night",
    club: "Drama Society",
    date: "Apr 20, 2026",
    category: "Cultural",
    registrations: 342,
    capacity: 500,
    status: "approved",
  },
  {
    id: 3,
    title: "Art Exhibition",
    club: "Fine Arts",
    date: "Apr 25, 2026",
    category: "Arts",
    registrations: 67,
    capacity: 100,
    status: "pending",
  },
  {
    id: 4,
    title: "Inter-College Cricket",
    club: "Sports Committee",
    date: "May 1, 2026",
    category: "Sports",
    registrations: 120,
    capacity: 150,
    status: "approved",
  },
  {
    id: 5,
    title: "Music Workshop",
    club: "Music Club",
    date: "May 5, 2026",
    category: "Workshop",
    registrations: 28,
    capacity: 30,
    status: "pending",
  },
  {
    id: 6,
    title: "Robotics Demo",
    club: "Robotics Club",
    date: "May 8, 2026",
    category: "Technical",
    registrations: 0,
    capacity: 50,
    status: "pending",
  },
]

type StatusFilter = "all" | "approved" | "pending"

export default function AdminEventsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = events.filter((event) => {
    const statusMatch = statusFilter === "all" || event.status === statusFilter
    const searchMatch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.club.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && searchMatch
  })

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">All Events</h1>
        <p className="text-muted-foreground">Review and manage all platform events</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="border-4 border-foreground bg-primary p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{events.length}</p>
          <p className="font-bold">Total Events</p>
        </div>
        <div className="border-4 border-foreground bg-secondary p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{events.filter(e => e.status === "approved").length}</p>
          <p className="font-bold">Approved</p>
        </div>
        <div className="border-4 border-foreground bg-accent p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{events.filter(e => e.status === "pending").length}</p>
          <p className="font-bold">Pending</p>
        </div>
        <div className="border-4 border-foreground bg-card p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{events.reduce((acc, e) => acc + e.registrations, 0)}</p>
          <p className="font-bold">Total Registrations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events or clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "approved", "pending"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${
                statusFilter === status
                  ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-card hover:bg-muted"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <table className="w-full">
            <thead className="border-b-4 border-foreground bg-muted">
              <tr>
                <th className="px-6 py-4 text-left font-black">Event</th>
                <th className="px-6 py-4 text-left font-black">Club</th>
                <th className="px-6 py-4 text-left font-black">Date</th>
                <th className="px-6 py-4 text-left font-black">Category</th>
                <th className="px-6 py-4 text-left font-black">Registrations</th>
                <th className="px-6 py-4 text-left font-black">Status</th>
                <th className="px-6 py-4 text-left font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-foreground">
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 font-bold">{event.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{event.club}</td>
                  <td className="px-6 py-4 text-muted-foreground">{event.date}</td>
                  <td className="px-6 py-4">
                    <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 border-2 border-foreground bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">
                        {event.registrations}/{event.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`border-2 border-foreground px-2 py-0.5 text-sm font-bold ${
                        event.status === "approved" ? "bg-primary" : "bg-accent"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {event.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="border-4 border-foreground bg-primary font-bold text-foreground"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-4 border-foreground">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="border-4 border-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-4 border-foreground">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Registrations</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Cancel Event</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y-4 divide-foreground lg:hidden">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.club}</p>
                </div>
                <span
                  className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                    event.status === "approved" ? "bg-primary" : "bg-accent"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {event.date}
                </span>
                <span className="border-2 border-foreground bg-secondary px-2 py-0.5 font-bold">
                  {event.category}
                </span>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                <div className="h-2 flex-1 border-2 border-foreground bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold">
                  {event.registrations}/{event.capacity}
                </span>
              </div>
              {event.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-4 border-foreground font-bold">
                    <XCircle className="mr-1 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-xl font-bold">No events found</p>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
