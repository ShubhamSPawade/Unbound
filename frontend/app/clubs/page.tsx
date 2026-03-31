"use client"

import { useState } from "react"
import Link from "next/link"
import { Infinity, Search, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

const categories = ["All", "Technical", "Cultural", "Sports", "Arts", "Music", "Literary"]

const clubs = [
  { id: 1, name: "Coding Club", category: "Technical", members: 120, events: 12, description: "Building cool stuff with code — hackathons, workshops, and more." },
  { id: 2, name: "Drama Society", category: "Cultural", members: 85, events: 8, description: "Performing arts, theatre productions, and cultural events." },
  { id: 3, name: "Fine Arts Club", category: "Arts", members: 60, events: 6, description: "Painting, sculpture, and visual arts exhibitions." },
  { id: 4, name: "Sports Committee", category: "Sports", members: 200, events: 10, description: "Inter-college sports tournaments and athletic events." },
  { id: 5, name: "Music Club", category: "Music", members: 75, events: 7, description: "Concerts, workshops, and jam sessions for music lovers." },
  { id: 6, name: "Photography Club", category: "Arts", members: 45, events: 4, description: "Photography walks, contests, and exhibitions." },
  { id: 7, name: "Robotics Club", category: "Technical", members: 55, events: 5, description: "Robotics competitions, demos, and innovation projects." },
  { id: 8, name: "Literary Society", category: "Literary", members: 40, events: 6, description: "Debates, quizzes, creative writing, and book clubs." },
]

export default function ClubsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = clubs.filter((c) => {
    const catMatch = category === "All" || c.category === category
    const searchMatch = !search || c.name.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

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
          <h1 className="mb-2 text-4xl font-black md:text-5xl">Clubs & Societies</h1>
          <p className="text-muted-foreground">Discover and connect with campus clubs</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clubs..."
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
                className={`border-4 border-foreground px-3 py-2 text-sm font-bold transition-all ${
                  category === c ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club) => (
            <div key={club.id} className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b-4 border-foreground p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center border-4 border-foreground bg-primary text-2xl font-black">
                    {club.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black">{club.name}</h3>
                    <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-xs font-bold">{club.category}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{club.description}</p>
              </div>
              <div className="grid grid-cols-2 divide-x-4 divide-foreground border-b-4 border-foreground">
                <div className="flex items-center gap-2 p-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-black">{club.members}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-black">{club.events}</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <Link href="/signup">
                  <Button className="w-full border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                    Join Club
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="border-4 border-foreground bg-card p-16 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black">No clubs found</p>
            <p className="mt-2 text-muted-foreground">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  )
}
