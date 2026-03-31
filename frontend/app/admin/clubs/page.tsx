"use client"

import { useState } from "react"
import { Search, CheckCircle, XCircle, Eye, Users, Calendar, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const clubs = [
  {
    id: 1,
    name: "Coding Club",
    representative: "Rahul Sharma",
    email: "rahul@mitaoe.ac.in",
    members: 120,
    events: 12,
    status: "approved",
    joinedAt: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Drama Society",
    representative: "Priya Patel",
    email: "priya@mitaoe.ac.in",
    members: 85,
    events: 8,
    status: "approved",
    joinedAt: "Feb 20, 2024",
  },
  {
    id: 3,
    name: "Fine Arts Club",
    representative: "Arun Kumar",
    email: "arun@mitaoe.ac.in",
    members: 60,
    events: 6,
    status: "approved",
    joinedAt: "Mar 10, 2024",
  },
  {
    id: 4,
    name: "Photography Club",
    representative: "Alex Brown",
    email: "alex@mitaoe.ac.in",
    members: 45,
    events: 0,
    status: "pending",
    joinedAt: "Mar 20, 2026",
  },
  {
    id: 5,
    name: "Robotics Club",
    representative: "Sarah Williams",
    email: "sarah@mitaoe.ac.in",
    members: 32,
    events: 0,
    status: "pending",
    joinedAt: "Mar 22, 2026",
  },
]

type StatusFilter = "all" | "approved" | "pending"

export default function AdminClubsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClubs = clubs.filter((club) => {
    const statusMatch = statusFilter === "all" || club.status === statusFilter
    const searchMatch = club.name.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && searchMatch
  })

  const pendingCount = clubs.filter((c) => c.status === "pending").length
  const approvedCount = clubs.filter((c) => c.status === "approved").length

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Club Management</h1>
        <p className="text-muted-foreground">Approve and manage registered clubs</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border-4 border-foreground bg-primary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{clubs.length}</p>
          <p className="font-bold">Total Clubs</p>
        </div>
        <div className="border-4 border-foreground bg-secondary p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{approvedCount}</p>
          <p className="font-bold">Approved</p>
        </div>
        <div className="border-4 border-foreground bg-accent p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-1 text-4xl font-black">{pendingCount}</p>
          <p className="font-bold">Pending Approval</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "approved", "pending"] as const).map((status) => (
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

      {/* Clubs Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredClubs.map((club) => (
          <div
            key={club.id}
            className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="border-b-4 border-foreground p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center border-4 border-foreground bg-primary text-xl font-black">
                    {club.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black">{club.name}</h3>
                    <p className="text-sm text-muted-foreground">{club.representative}</p>
                  </div>
                </div>
                <span
                  className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                    club.status === "approved" ? "bg-primary" : "bg-accent"
                  }`}
                >
                  {club.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{club.email}</p>
            </div>
            <div className="grid grid-cols-2 divide-x-4 divide-foreground border-b-4 border-foreground">
              <div className="flex items-center gap-2 p-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-black">{club.members}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-black">{club.events}</p>
                  <p className="text-xs text-muted-foreground">Events</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-4">
              {club.status === "pending" ? (
                <>
                  <Button
                    size="sm"
                    className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-4 border-foreground font-bold"
                  >
                    <XCircle className="mr-1 h-4 w-4" /> Reject
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-4 border-foreground font-bold"
                  >
                    <Eye className="mr-1 h-4 w-4" /> View Profile
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-4 border-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="border-4 border-foreground">
                      <DropdownMenuItem>View Events</DropdownMenuItem>
                      <DropdownMenuItem>Message Club</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-xl font-bold">No clubs found</p>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
