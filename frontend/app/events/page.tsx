"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Infinity, Search, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { eventApi } from "@/lib/api"

const categories = ["All", "TECHNICAL", "CULTURAL", "SPORTS", "WORKSHOP", "SEMINAR", "HACKATHON", "OTHER"]
const categoryLabels: Record<string, string> = {
  All: "All", TECHNICAL: "Technical", CULTURAL: "Cultural", SPORTS: "Sports",
  WORKSHOP: "Workshop", SEMINAR: "Seminar", HACKATHON: "Hackathon", OTHER: "Other",
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [category, setCategory] = useState("All")

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const params = category !== "All" ? { category } : {}
        const res = await eventApi.getPublishedEvents(params)
        setEvents(res.data.data || [])
      } catch {
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [category])

  const filtered = useMemo(() =>
    events.filter((e) => {
      if (!debounced) return true
      return e.title?.toLowerCase().includes(debounced.toLowerCase()) ||
        e.clubName?.toLowerCase().includes(debounced.toLowerCase())
    }), [events, debounced])

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b-4 border-foreground bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight">UNBOUND</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login"><Button variant="outline" className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Login</Button></Link>
            <Link href="/signup"><Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Sign Up</Button></Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-black md:text-5xl">All Events</h1>
          <p className="text-muted-foreground">Browse all upcoming campus events</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search events or clubs..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`border-4 border-foreground px-4 py-2 font-bold transition-all ${category === c ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>
                {categoryLabels[c]}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse border-4 border-foreground bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-4 border-foreground bg-card p-16 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black">No events found</p>
            <p className="mt-2 text-muted-foreground">Try a different search or category</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{filtered.length} event{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((event) => {
                const pct = event.maxParticipants > 0 ? Math.round((event.currentRegistrations / event.maxParticipants) * 100) : 0
                const isPaid = event.feeAmount && event.feeAmount > 0
                return (
                  <div key={event.id} className="group border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="aspect-video border-b-4 border-foreground bg-muted flex items-center justify-center overflow-hidden">
                      {event.bannerUrl ? (
                        <img src={event.bannerUrl} alt={event.title} className="h-full w-full object-cover" />
                      ) : (
                        <Calendar className="h-12 w-12 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="border-2 border-foreground bg-primary px-2 py-0.5 text-sm font-bold">{event.category}</span>
                        {isPaid
                          ? <span className="border-2 border-foreground bg-accent px-2 py-0.5 text-sm font-bold">Rs. {event.feeAmount}</span>
                          : <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">Free</span>
                        }
                      </div>
                      <h3 className="mb-1 text-xl font-black group-hover:underline">{event.title}</h3>
                      <p className="mb-3 text-sm text-muted-foreground">by {event.clubName}</p>
                      <div className="mb-4 space-y-1.5 text-sm">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{new Date(event.eventDate).toLocaleDateString()}</div>
                        {event.venue && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{event.venue}</div>}
                        <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{event.currentRegistrations}/{event.maxParticipants} registered</div>
                      </div>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="h-2 flex-1 border-2 border-foreground bg-muted">
                          <div className={`h-full ${pct >= 90 ? "bg-accent" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm font-bold">{pct}%</span>
                      </div>
                      <Link href="/login">
                        <Button className="w-full border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                          Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
