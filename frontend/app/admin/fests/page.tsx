"use client"

import { useState } from "react"
import { PlusCircle, Edit, Trash2, Calendar, Eye, MoreVertical, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fests = [
  {
    id: 1,
    name: "TechFest 2026",
    description: "Annual technology festival showcasing innovation and creativity",
    startDate: "Apr 10, 2026",
    endDate: "Apr 15, 2026",
    events: 25,
    registrations: 1250,
    status: "active",
  },
  {
    id: 2,
    name: "CultFest 2026",
    description: "Celebrate art, culture, and performing talents",
    startDate: "May 1, 2026",
    endDate: "May 5, 2026",
    events: 18,
    registrations: 0,
    status: "upcoming",
  },
  {
    id: 3,
    name: "SportsFest 2026",
    description: "Inter-college sports competition and athletic events",
    startDate: "Jun 10, 2026",
    endDate: "Jun 15, 2026",
    events: 12,
    registrations: 0,
    status: "upcoming",
  },
  {
    id: 4,
    name: "TechFest 2025",
    description: "Previous year technology festival",
    startDate: "Apr 10, 2025",
    endDate: "Apr 15, 2025",
    events: 22,
    registrations: 1100,
    status: "completed",
  },
]

export default function AdminFestsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFests = fests.filter((fest) =>
    fest.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">Fest Management</h1>
          <p className="text-muted-foreground">Create and manage college fests</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Fest
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search fests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
      </div>

      {/* Fests Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredFests.map((fest) => (
          <div
            key={fest.id}
            className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="border-b-4 border-foreground p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <span
                    className={`mb-2 inline-block border-2 border-foreground px-2 py-0.5 text-xs font-bold ${
                      fest.status === "active"
                        ? "bg-primary"
                        : fest.status === "upcoming"
                        ? "bg-secondary"
                        : "bg-muted"
                    }`}
                  >
                    {fest.status}
                  </span>
                  <h3 className="text-xl font-black">{fest.name}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-4 border-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-4 border-foreground">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" /> View Events
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground">{fest.description}</p>
            </div>
            <div className="grid grid-cols-3 divide-x-4 divide-foreground">
              <div className="p-4 text-center">
                <p className="text-2xl font-black">{fest.events}</p>
                <p className="text-xs font-bold text-muted-foreground">Events</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-2xl font-black">{fest.registrations}</p>
                <p className="text-xs font-bold text-muted-foreground">Registrations</p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-muted-foreground">
                  {fest.startDate.split(",")[0]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Fest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="w-full max-w-lg border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-6 text-2xl font-black">Create New Fest</h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="festName" className="mb-2 block font-bold">
                  Fest Name
                </Label>
                <Input
                  id="festName"
                  placeholder="e.g., TechFest 2026"
                  className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              <div>
                <Label htmlFor="festDesc" className="mb-2 block font-bold">
                  Description
                </Label>
                <Input
                  id="festDesc"
                  placeholder="Brief description"
                  className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="mb-2 block font-bold">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="mb-2 block font-bold">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-4 border-foreground font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                  Create Fest
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
