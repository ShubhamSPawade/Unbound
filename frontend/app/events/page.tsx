"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Infinity, Search, Filter, X, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"

const categories = ["All", "Technical", "Cultural", "Arts", "Sports", "Workshop"]

const events = [
  { id: 1, title: "Hackathon 2026", date: "Apr 15, 2026", time: "9:00 AM", venue: "Main Auditorium", category: "Technical", club: "Coding Club", capacity: 200, registered: 156, isPaid: false },
  { id: 2, title: "Cultural Night", date: "Apr 20, 2026", time: "6:00 PM", venue: "Open Air Theatre", category: "Cultural", club: "Drama Society", capacity: 500, registered: 342, isPaid: true, price: 100 },
  { id: 3, title: "Art Exhibition", date: "Apr 25, 2026", time: "10:00 AM", venue: "Art Gallery", category: "Arts", club: "Fine Arts", capacity: 100, registered: 67, isPaid: false },
  { id: 4, title: "Inter-College Cricket", date: "May 1, 2026", time: "8:00 AM", venue: "Sports Ground", category: "Sports", club: "Sports Committee", capacity: 150, registered: 120, isPaid: true, price: 50 },
  { id: 5, title: "Music Workshop", date: "May 5, 2026", time: "2:00 PM", venue: "Music Room", category: "Workshop", club: "Music Club", capacity: 30, registered: 28, isPaid: true, price: 200 },
  { id: 6, title: "Web Dev Bootcamp", date: "May 10, 2026", time: "10:00 AM", venue: "Computer Lab", category: "Workshop", club: "Coding Club", capacity: 50, registered: 45, isPaid: false },
  { id: 7, title: "Photography Walk", date: "May 15, 2026", time: "7:00 AM", venue: "Campus Grounds", category: "Arts", club: "Photography Club", capacity: 40, registered: 18, isPaid: false },
  { id: 8, title: "Robotics Demo Day", date: "May 20, 2026", time: "11:00 AM", venue: "Innovation Lab", category: "Technical", club: "Robotics Club", capacity: 80, registered: 34, isPaid: false },
]

export default function EventsPage() {
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [category, setCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const filtered = useMemo(() =>
    events.filter((e) => {
      const catMatch = category === "All" || e.category === category
      const searchMatch = !debounced ||
        e.title.toLowerCase().includes(debounced.toLowerCase()) ||
        e.club.toLowerCase().includes(debounced.toLowerCase())
      return catMatch && searchMatch
    }), [category, debounced])

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
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
            <Link href="/login">
              <Button variant="outline" className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-black md:text-5xl">All Events</h1>
          <p className="text-muted-foreground">Browse all upcoming campus events</p>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events or clubs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`border-4 border-foreground px-4 py-2 font-bold transition-all ${
                  category === c ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">{filtered.length} event{filtered.length !== 1 ? "s" : ""} found</p>

        {filtered.length === 0 ? (
          <div className="border-4 border-foreground bg-card p-16 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black">No events found</p>
            <p className="mt-2 text-muted-foreground">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((event) => {
              const pct = Math.round((event.registered / event.capacity) * 100)
              return (
                <div key={event.id} className="group border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="aspect-video border-b-4 border-foreground bg-muted flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="border-2 border-foreground bg-primary px-2 py-0.5 text-sm font-bold">{event.category}</span>
                      {event.isPaid
                        ? <span className="border-2 border-foreground bg-accent px-2 py-0.5 text-sm font-bold">Rs. {(event as any).price}</span>
                        : <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">Free</span>
                      }
                    </div>
                    <h3 className="mb-1 text-xl font-black group-hover:underline">{event.title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">by {event.club}</p>
                    <div className="mb-4 space-y-1.5 text-sm">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{event.date} at {event.time}</div>
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{event.venue}</div>
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{event.registered}/{event.capacity} registered</div>
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
        )}
      </div>
    </div>
  )
}
