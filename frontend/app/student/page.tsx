"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Filter, Calendar, MapPin, Users, X, Search, SortAsc, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EventCardGridSkeleton } from "@/components/skeletons"
import { EmptyState } from "@/components/empty-state"

const categories = ["All", "Technical", "Cultural", "Arts", "Sports", "Workshop"]
const clubs = ["All Clubs", "Coding Club", "Drama Society", "Fine Arts", "Sports Committee", "Music Club"]
const sortOptions = [
  { value: "date-asc", label: "Date (Earliest)" },
  { value: "date-desc", label: "Date (Latest)" },
  { value: "popularity", label: "Most Popular" },
  { value: "spots", label: "Spots Available" },
]

const events = [
  {
    id: 1,
    title: "Hackathon 2026",
    date: "Apr 15, 2026",
    time: "9:00 AM",
    venue: "Main Auditorium",
    category: "Technical",
    club: "Coding Club",
    capacity: 200,
    registered: 156,
    isPaid: false,
  },
  {
    id: 2,
    title: "Cultural Night",
    date: "Apr 20, 2026",
    time: "6:00 PM",
    venue: "Open Air Theatre",
    category: "Cultural",
    club: "Drama Society",
    capacity: 500,
    registered: 342,
    isPaid: true,
    price: 100,
  },
  {
    id: 3,
    title: "Art Exhibition",
    date: "Apr 25, 2026",
    time: "10:00 AM",
    venue: "Art Gallery",
    category: "Arts",
    club: "Fine Arts",
    capacity: 100,
    registered: 67,
    isPaid: false,
  },
  {
    id: 4,
    title: "Inter-College Cricket",
    date: "May 1, 2026",
    time: "8:00 AM",
    venue: "Sports Ground",
    category: "Sports",
    club: "Sports Committee",
    capacity: 150,
    registered: 120,
    isPaid: true,
    price: 50,
  },
  {
    id: 5,
    title: "Music Workshop",
    date: "May 5, 2026",
    time: "2:00 PM",
    venue: "Music Room",
    category: "Workshop",
    club: "Music Club",
    capacity: 30,
    registered: 28,
    isPaid: true,
    price: 200,
  },
  {
    id: 6,
    title: "Web Dev Bootcamp",
    date: "May 10, 2026",
    time: "10:00 AM",
    venue: "Computer Lab",
    category: "Workshop",
    club: "Coding Club",
    capacity: 50,
    registered: 45,
    isPaid: false,
  },
]

export default function StudentExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedClub, setSelectedClub] = useState("All Clubs")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-asc")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredAndSortedEvents = useMemo(() => {
    let result = events.filter((event) => {
      const categoryMatch = selectedCategory === "All" || event.category === selectedCategory
      const clubMatch = selectedClub === "All Clubs" || event.club === selectedClub
      const searchMatch =
        debouncedSearch === "" ||
        event.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.club.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      return categoryMatch && clubMatch && searchMatch
    })

    // Sort
    switch (sortBy) {
      case "date-desc":
        result = [...result].reverse()
        break
      case "popularity":
        result = [...result].sort((a, b) => b.registered - a.registered)
        break
      case "spots":
        result = [...result].sort((a, b) => (b.capacity - b.registered) - (a.capacity - a.registered))
        break
      default:
        break
    }

    return result
  }, [selectedCategory, selectedClub, debouncedSearch, sortBy])

  const clearFilters = () => {
    setSelectedCategory("All")
    setSelectedClub("All Clubs")
    setSearchQuery("")
    setSortBy("date-asc")
  }

  const hasActiveFilters = selectedCategory !== "All" || selectedClub !== "All Clubs" || searchQuery !== ""

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Explore Events</h1>
        <p className="text-muted-foreground">Discover and register for upcoming campus events</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events, clubs, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-4 border-foreground bg-background pl-12 font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none lg:hidden"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center border-2 border-foreground bg-primary text-xs font-bold">
                !
              </span>
            )}
          </Button>

          {/* Desktop Category Pills */}
          <div className="hidden flex-wrap gap-2 lg:flex">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`border-4 border-foreground px-4 py-2 font-bold transition-all ${
                  selectedCategory === category
                    ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-card hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Desktop Club Filter */}
          <div className="hidden lg:block">
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="border-4 border-foreground bg-card px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {clubs.map((club) => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="ml-auto hidden lg:block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-4 border-foreground bg-card px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="hidden items-center gap-1 font-bold text-muted-foreground hover:text-foreground lg:flex"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        {/* Mobile Filters Panel */}
        {showFilters && (
          <div className="mt-4 border-4 border-foreground bg-card p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold">Filters</span>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-bold text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </button>
                )}
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <Label className="mb-2 block font-bold">Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`border-2 border-foreground px-3 py-1.5 text-sm font-bold ${
                      selectedCategory === category ? "bg-primary" : "bg-card"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <Label className="mb-2 block font-bold">Club</Label>
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="w-full border-4 border-foreground bg-background px-3 py-2 font-bold"
              >
                {clubs.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block font-bold">Sort By</Label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border-4 border-foreground bg-background px-3 py-2 font-bold"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && filteredAndSortedEvents.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Loading State */}
      {isLoading ? (
        <EventCardGridSkeleton count={6} />
      ) : filteredAndSortedEvents.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events found"
          description={
            hasActiveFilters
              ? "Try adjusting your filters or search terms"
              : "There are no upcoming events at the moment"
          }
          action={
            hasActiveFilters
              ? { label: "Clear Filters", onClick: clearFilters }
              : undefined
          }
        />
      ) : (
        /* Events Grid */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedEvents.map((event) => (
            <Link href={`/student/events/${event.id}`} key={event.id}>
              <div className="group h-full border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="aspect-video border-b-4 border-foreground bg-muted flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="border-2 border-foreground bg-primary px-2 py-0.5 text-sm font-bold">
                      {event.category}
                    </span>
                    {event.isPaid ? (
                      <span className="border-2 border-foreground bg-accent px-2 py-0.5 text-sm font-bold">
                        Rs. {event.price}
                      </span>
                    ) : (
                      <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">
                        Free
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 text-xl font-black group-hover:underline">{event.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">by {event.club}</p>
                  <div className="mb-4 space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.registered}/{event.capacity} registered</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-2 flex-1 border-2 border-foreground bg-muted">
                      <div
                        className={`h-full ${(event.registered / event.capacity) >= 0.9 ? "bg-accent" : "bg-primary"}`}
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      />
                    </div>
                    <span className="ml-3 text-sm font-bold">
                      {Math.round((event.registered / event.capacity) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
