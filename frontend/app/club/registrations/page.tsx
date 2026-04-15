"use client"

import { useState, useEffect } from "react"
import { Search, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { eventApi, registrationApi, clubApi } from "@/lib/api"
import { exportRegistrationsToCSV } from "@/lib/csv-export"
import { useAuth } from "@/lib/auth-context"

export default function ClubRegistrationsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEventId, setSelectedEventId] = useState<number | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const clubRes = await clubApi.getMyClub()
        const myClub = clubRes.data.data
        if (myClub) {
          const res = await eventApi.getEventsByClub(myClub.id)
          setEvents(res.data.data || [])
        }
      } catch {
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    if (user) fetchEvents()
  }, [user])

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (selectedEventId === "all") {
        // Fetch registrations for all events
        try {
          const allRegs: any[] = []
          for (const event of events.slice(0, 5)) {
            const res = await registrationApi.getRegistrationsByEvent(event.id)
            allRegs.push(...(res.data.data || []))
          }
          setRegistrations(allRegs)
        } catch {
          setRegistrations([])
        }
      } else {
        try {
          const res = await registrationApi.getRegistrationsByEvent(selectedEventId)
          setRegistrations(res.data.data || [])
        } catch {
          setRegistrations([])
        }
      }
    }
    if (events.length > 0) fetchRegistrations()
  }, [selectedEventId, events])

  const filtered = registrations.filter((r) =>
    !searchQuery ||
    r.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const confirmed = filtered.filter((r) => r.status === "CONFIRMED").length
  const pending = filtered.filter((r) => r.status === "PENDING").length

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Registrations</h1>
        <p className="text-muted-foreground">View and manage event registrations</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border-4 border-foreground bg-primary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{filtered.length}</p>
          <p className="font-bold">Total Registrations</p>
        </div>
        <div className="border-4 border-foreground bg-secondary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{confirmed}</p>
          <p className="font-bold">Confirmed</p>
        </div>
        <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{pending}</p>
          <p className="font-bold">Pending</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search participants..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          </div>
          <select value={selectedEventId === "all" ? "all" : selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="border-4 border-foreground bg-card px-4 py-2.5 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <option value="all">All Events</option>
            {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <Button variant="outline" onClick={() => exportRegistrationsToCSV(filtered, "registrations")}
          className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 animate-pulse border-4 border-foreground bg-muted" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-xl font-bold">No registrations found</p>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="border-b-4 border-foreground bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left font-black">Participant</th>
                  <th className="px-6 py-4 text-left font-black">Event</th>
                  <th className="px-6 py-4 text-left font-black">Registered</th>
                  <th className="px-6 py-4 text-left font-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-foreground">
                {filtered.map((reg) => (
                  <tr key={reg.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary font-bold">
                          {reg.userName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-bold">{reg.userName}</p>
                          <p className="text-sm text-muted-foreground">{reg.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">{reg.eventTitle}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`border-2 border-foreground px-2 py-0.5 text-sm font-bold ${reg.status === "CONFIRMED" ? "bg-primary" : "bg-accent"}`}>
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y-4 divide-foreground md:hidden">
            {filtered.map((reg) => (
              <div key={reg.id} className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary font-bold">
                      {reg.userName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-bold">{reg.userName}</p>
                      <p className="text-sm text-muted-foreground">{reg.userEmail}</p>
                    </div>
                  </div>
                  <span className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${reg.status === "CONFIRMED" ? "bg-primary" : "bg-accent"}`}>
                    {reg.status}
                  </span>
                </div>
                <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-xs font-bold">{reg.eventTitle}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
