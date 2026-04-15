"use client"

import { useState, useEffect } from "react"
import { Search, Eye, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { eventApi } from "@/lib/api"
import { useToast } from "@/components/toast-provider"

type StatusFilter = "all" | "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED"

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { success, error } = useToast()

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const res = await eventApi.getAllEventsAdmin()
        setEvents(res.data.data || [])
      } catch { setEvents([]) } finally { setIsLoading(false) }
    }
    fetchEvents()
  }, [])

  const handleCancel = async (id: number) => {
    try {
      await eventApi.cancelEvent(id)
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, status: "CANCELLED" } : e))
      success("Cancelled", "Event has been cancelled")
    } catch (err: any) { error("Error", err?.response?.data?.message || "Failed to cancel") }
  }

  const handlePublish = async (id: number) => {
    try {
      await eventApi.publishEvent(id)
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, status: "PUBLISHED" } : e))
      success("Published", "Event is now live")
    } catch (err: any) { error("Error", err?.response?.data?.message || "Failed to publish") }
  }

  const filtered = events.filter((e) => {
    const statusMatch = statusFilter === "all" || e.status === statusFilter
    const searchMatch = e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.clubName?.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && searchMatch
  })

  const statusColor: Record<string, string> = {
    PUBLISHED: "bg-primary", DRAFT: "bg-accent", CANCELLED: "bg-destructive text-destructive-foreground", COMPLETED: "bg-muted",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">All Events</h1>
        <p className="text-muted-foreground">Review and manage all platform events</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: events.length, color: "bg-primary" },
          { label: "Published", value: events.filter(e => e.status === "PUBLISHED").length, color: "bg-secondary" },
          { label: "Draft", value: events.filter(e => e.status === "DRAFT").length, color: "bg-accent" },
          { label: "Registrations", value: events.reduce((s, e) => s + (e.currentRegistrations || 0), 0), color: "bg-card" },
        ].map((s) => (
          <div key={s.label} className={`border-4 border-foreground ${s.color} p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
            <p className="text-3xl font-black">{isLoading ? "—" : s.value}</p>
            <p className="font-bold">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search events or clubs..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${statusFilter === s ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse border-4 border-foreground bg-muted" />)}</div>
      ) : (
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
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
                {filtered.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 font-bold">{event.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{event.clubName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(event.eventDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">{event.category}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 border-2 border-foreground bg-muted">
                          <div className="h-full bg-primary" style={{ width: `${event.maxParticipants > 0 ? (event.currentRegistrations / event.maxParticipants) * 100 : 0}%` }} />
                        </div>
                        <span className="text-sm font-bold">{event.currentRegistrations}/{event.maxParticipants}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`border-2 border-foreground px-2 py-0.5 text-sm font-bold ${statusColor[event.status] || "bg-muted"}`}>{event.status}</span></td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="border-4 border-foreground"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-4 border-foreground">
                          <DropdownMenuItem asChild><Link href={`/admin/events/${event.id}`}><Eye className="mr-2 h-4 w-4" /> View</Link></DropdownMenuItem>
                          {event.status === "DRAFT" && (
                            <DropdownMenuItem onClick={() => handlePublish(event.id)}>Publish Event</DropdownMenuItem>
                          )}
                          {event.status !== "CANCELLED" && (
                            <DropdownMenuItem onClick={() => handleCancel(event.id)} className="text-destructive">Cancel Event</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y-4 divide-foreground lg:hidden">
            {filtered.map((event) => (
              <div key={event.id} className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.clubName}</p>
                  </div>
                  <span className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${statusColor[event.status] || "bg-muted"}`}>{event.status}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No events found</div>
          )}
        </div>
      )}
    </div>
  )
}
