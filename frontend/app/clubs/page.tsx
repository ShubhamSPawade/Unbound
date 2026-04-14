"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Infinity, Search, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { clubApi } from "@/lib/api"

export default function ClubsPage() {
  const [clubs, setClubs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchClubs = async () => {
      setIsLoading(true)
      try {
        const res = await clubApi.getApprovedClubs()
        setClubs(res.data.data || [])
      } catch {
        setClubs([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchClubs()
  }, [])

  const filtered = clubs.filter((c) =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.category?.toLowerCase().includes(search.toLowerCase())
  )

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

        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search clubs..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 animate-pulse border-4 border-foreground bg-muted" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-4 border-foreground bg-card p-16 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black">No clubs found</p>
            <p className="mt-2 text-muted-foreground">Try a different search</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((club) => (
              <div key={club.id} className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="border-b-4 border-foreground p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center border-4 border-foreground bg-primary text-2xl font-black">
                      {club.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{club.name}</h3>
                      <span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-xs font-bold">{club.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{club.description || "No description available."}</p>
                </div>
                <div className="p-4">
                  <p className="mb-3 text-sm text-muted-foreground">Contact: {club.contactEmail}</p>
                  <Link href="/signup">
                    <Button className="w-full border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                      Join Club
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
