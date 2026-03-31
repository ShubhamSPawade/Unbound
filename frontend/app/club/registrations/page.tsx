"use client"

import { useState } from "react"
import { Search, Download, Mail, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const events = [
  { id: 1, title: "Hackathon 2026", registrations: 156 },
  { id: 2, title: "Web Dev Bootcamp", registrations: 45 },
  { id: 3, title: "Code Sprint", registrations: 78 },
]

const registrations = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@mitaoe.ac.in",
    phone: "+91 98765 43210",
    event: "Hackathon 2026",
    eventId: 1,
    registeredAt: "Mar 25, 2026",
    status: "confirmed",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@mitaoe.ac.in",
    phone: "+91 98765 43211",
    event: "Hackathon 2026",
    eventId: 1,
    registeredAt: "Mar 24, 2026",
    status: "confirmed",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@mitaoe.ac.in",
    phone: "+91 98765 43212",
    event: "Web Dev Bootcamp",
    eventId: 2,
    registeredAt: "Mar 23, 2026",
    status: "pending",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@mitaoe.ac.in",
    phone: "+91 98765 43213",
    event: "Hackathon 2026",
    eventId: 1,
    registeredAt: "Mar 22, 2026",
    status: "confirmed",
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex.b@mitaoe.ac.in",
    phone: "+91 98765 43214",
    event: "Code Sprint",
    eventId: 3,
    registeredAt: "Mar 21, 2026",
    status: "confirmed",
  },
]

export default function ClubRegistrationsPage() {
  const [selectedEvent, setSelectedEvent] = useState<number | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRegistrations = registrations.filter((reg) => {
    const eventMatch = selectedEvent === "all" || reg.eventId === selectedEvent
    const searchMatch =
      reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase())
    return eventMatch && searchMatch
  })

  const selectedEventData = selectedEvent !== "all" 
    ? events.find(e => e.id === selectedEvent) 
    : null

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Registrations</h1>
        <p className="text-muted-foreground">View and manage event registrations</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border-4 border-foreground bg-primary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{registrations.length}</p>
          <p className="font-bold">Total Registrations</p>
        </div>
        <div className="border-4 border-foreground bg-secondary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">
            {registrations.filter(r => r.status === "confirmed").length}
          </p>
          <p className="font-bold">Confirmed</p>
        </div>
        <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">
            {registrations.filter(r => r.status === "pending").length}
          </p>
          <p className="font-bold">Pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <select
            value={selectedEvent === "all" ? "all" : selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="border-4 border-foreground bg-card px-4 py-2.5 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <option value="all">All Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({event.registrations})
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="outline"
          className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Selected Event Info */}
      {selectedEventData && (
        <div className="mb-6 flex items-center gap-4 border-4 border-foreground bg-secondary p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Users className="h-6 w-6" />
          <div>
            <p className="font-bold">{selectedEventData.title}</p>
            <p className="text-sm text-muted-foreground">
              {filteredRegistrations.length} registrations shown
            </p>
          </div>
        </div>
      )}

      {/* Registrations Table */}
      <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="border-b-4 border-foreground bg-muted">
              <tr>
                <th className="px-6 py-4 text-left font-black">Participant</th>
                <th className="px-6 py-4 text-left font-black">Event</th>
                <th className="px-6 py-4 text-left font-black">Phone</th>
                <th className="px-6 py-4 text-left font-black">Registered</th>
                <th className="px-6 py-4 text-left font-black">Status</th>
                <th className="px-6 py-4 text-left font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-foreground">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary font-bold">
                        {reg.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{reg.name}</p>
                        <p className="text-sm text-muted-foreground">{reg.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">
                      {reg.event}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{reg.phone}</td>
                  <td className="px-6 py-4 text-muted-foreground">{reg.registeredAt}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`border-2 border-foreground px-2 py-0.5 text-sm font-bold ${
                        reg.status === "confirmed" ? "bg-primary" : "bg-accent"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-4 border-foreground font-bold"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y-4 divide-foreground md:hidden">
          {filteredRegistrations.map((reg) => (
            <div key={reg.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary font-bold">
                    {reg.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{reg.name}</p>
                    <p className="text-sm text-muted-foreground">{reg.email}</p>
                  </div>
                </div>
                <span
                  className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                    reg.status === "confirmed" ? "bg-primary" : "bg-accent"
                  }`}
                >
                  {reg.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="border-2 border-foreground bg-secondary px-2 py-0.5 font-bold">
                  {reg.event}
                </span>
                <span className="text-muted-foreground">{reg.registeredAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredRegistrations.length === 0 && (
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-xl font-bold">No registrations found</p>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
