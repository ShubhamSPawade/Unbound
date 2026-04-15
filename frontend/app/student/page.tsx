"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Filter, Calendar, MapPin, Users, X, Search, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EventCardGridSkeleton } from "@/components/skeletons"
import { EmptyState } from "@/components/empty-state"
import { eventApi } from "@/lib/api"

const categories = ["All", "TECHNICAL", "CULTURAL", "SPORTS", "WORKSHOP", "SEMINAR", "HACKATHON", "OTHER"]
const categoryLabels: Record<string, string> = {
  All: "All", TECHNICAL: "Technical", CULTURAL: "Cultural", SPORTS: "Sports",
  WORKSHOP: "Workshop", SEMINAR: "Seminar", HACKATHON: "Hackathon", OTHER: "Other",
}
const sortOptions = [
  { value: "date-asc", label: "Date (Earliest)" },
  { value: "date-desc", label: "Date (Latest)" },
  { value: "popularity", label: "Most Popular" },
  { value: "spots", label: "Spots Available" },
]

export default function StudentExplorePage() {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-asc")
  const [showFilters, setShowFilters] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const params = selectedCategory !== "All" ? { category: selectedCategory } : {}
        const res = await eventApi.getPublishedEvents(params)
        setEvents(res.data.data || [])
      } catch {
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [selectedCategory])

  const filteredAndSortedEvents = useMemo(() => {
    let result = events.filter((event) => {
      if (!debouncedSearch) return true
      return event.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.clubName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.category?.toLowerCase().includes(debouncedSearch.toLowerCase())
    })
    switch (sortBy) {
      case "date-desc": result = [...result].reverse(); break
      case "popularity": result = [...result].sort((a, b) => b.currentRegistrations - a.currentRegistrations); break
      case "spots": result = [...result].sort((a, b) => (b.maxParticipants - b.currentRegistrations) - (a.maxParticipants - a.currentRegistrations)); break
    }
    return result
  }, [events, debouncedSearch, sortBy])

  const clearFilters = () => { setSelectedCategory("All"); setSearchQuery(""); setSortBy("date-asc") }
  const hasActiveFilters = selectedCategory !== "All" || searchQuery !== ""

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Explore Events</h1>
        <p className="text-muted-foreground">Discover and register for upcoming campus events</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search events, clubs, categories..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-4 border-foreground bg-background pl-12 font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}
            className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none lg:hidden">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
          <div className="hidden flex-wrap gap-2 lg:flex">
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`border-4 border-foreground px-4 py-2 font-bold transition-all ${selectedCategory === c ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>
                {categoryLabels[c]}
              </button>
            ))}
          </div>
          <div className="ml-auto hidden lg:block">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="border-4 border-foreground bg-card px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="hidden items-center gap-1 font-bold text-muted-foreground hover:text-foreground lg:flex">
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 border-4 border-foreground bg-card p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold">Filters</span>
              <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-4">
              <Label className="mb-2 block font-bold">Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button key={c} onClick={() => setSelectedCategory(c)}
                    className={`border-2 border-foreground px-3 py-1.5 text-sm font-bold ${selectedCategory === c ? "bg-primary" : "bg-card"}`}>
                    {categoryLabels[c]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {!isLoading && filteredAndSortedEvents.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? "s" : ""}</p>
      )}

      {isLoading ? (
        <EventCardGridSkeleton count={6} />
      ) : filteredAndSortedEvents.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No events found"
          description={hasActiveFilters ? "Try adjusting your filters or search terms" : "There are no upcoming events at the moment"}
          action={hasActiveFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedEvents.map((event) => {
            const pct = event.maxParticipants > 0 ? Math.round((event.currentRegistrations / event.maxParticipants) * 100) : 0
            const isPaid = event.feeAmount && event.feeAmount > 0
            return (
              <Link href={`/student/events/${event.id}`} key={event.id}>
                <div className="group h-full border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="aspect-video border-b-4 border-foreground bg-muted flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="border-2 border-foreground bg-primary px-2 py-0.5 text-sm font-bold">{event.category}</span>
                      {isPaid
                        ? <span className="border-2 border-foreground bg-accent px-2 py-0.5 text-sm font-bold">Rs. {event.feeAmount}</span>
                        : <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">Free</span>
                      }
                    </div>
                    <h3 className="mb-2 text-xl font-black group-hover:underline">{event.title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">by {event.clubName}</p>
                    <div className="mb-4 space-y-1.5 text-sm">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{new Date(event.eventDate).toLocaleDateString()}</div>
                      {event.venue && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{event.venue}</div>}
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{event.currentRegistrations}/{event.maxParticipants} registered</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-2 flex-1 border-2 border-foreground bg-muted">
                        <div className={`h-full ${pct >= 90 ? "bg-accent" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="ml-3 text-sm font-bold">{pct}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
