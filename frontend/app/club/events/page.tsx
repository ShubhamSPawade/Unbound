"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Users, Edit, Trash2, Eye, MoreVertical, Search } from "lucide-react"
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
    date: "Apr 15, 2026",
    category: "Technical",
    registrations: 156,
    capacity: 200,
    status: "upcoming",
    isPaid: false,
  },
  {
    id: 2,
    title: "Web Dev Bootcamp",
    date: "May 10, 2026",
    category: "Workshop",
    registrations: 45,
    capacity: 50,
    status: "upcoming",
    isPaid: false,
  },
  {
    id: 3,
    title: "Code Sprint",
    date: "Mar 20, 2026",
    category: "Technical",
    registrations: 78,
    capacity: 80,
    status: "completed",
    isPaid: true,
    price: 100,
  },
  {
    id: 4,
    title: "AI Workshop",
    date: "Jun 5, 2026",
    category: "Workshop",
    registrations: 12,
    capacity: 40,
    status: "draft",
    isPaid: true,
    price: 200,
  },
]

type StatusFilter = "all" | "upcoming" | "completed" | "draft"

export default function ClubEventsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = events.filter((event) => {
    const statusMatch = statusFilter === "all" || event.status === statusFilter
    const searchMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && searchMatch
  })

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">My Events</h1>
          <p className="text-muted-foreground">Manage all your club events</p>
        </div>
        <Link href="/club/create">
          <Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Create Event
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "upcoming", "completed", "draft"] as const).map((status) => (
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
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="border-b-4 border-foreground bg-muted">
              <tr>
                <th className="px-6 py-4 text-left font-black">Event</th>
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
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold">{event.title}</p>
                      {event.isPaid && (
                        <span className="text-sm text-muted-foreground">Rs. {event.price}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{event.date}</td>
                  <td className="px-6 py-4">
                    <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 border-2 border-foreground bg-muted">
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
                        event.status === "upcoming"
                          ? "bg-primary"
                          : event.status === "completed"
                          ? "bg-muted"
                          : "bg-accent"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-4 border-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-4 border-foreground">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y-4 divide-foreground md:hidden">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <span
                  className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                    event.status === "upcoming"
                      ? "bg-primary"
                      : event.status === "completed"
                      ? "bg-muted"
                      : "bg-accent"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-xs font-bold">
                  {event.category}
                </span>
                {event.isPaid && (
                  <span className="text-sm text-muted-foreground">Rs. {event.price}</span>
                )}
              </div>
              <div className="mb-3 flex items-center gap-2">
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-4 border-foreground font-bold">
                  <Eye className="mr-1 h-4 w-4" /> View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-4 border-foreground font-bold">
                  <Edit className="mr-1 h-4 w-4" /> Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-xl font-bold">No events found</p>
          <p className="text-muted-foreground">Try adjusting your filters or create a new event</p>
        </div>
      )}
    </div>
  )
}
