"use client"

import { useState } from "react"
import { PlusCircle, Search, Building2, Users, Calendar, MoreVertical, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/toast-provider"

const colleges = [
  { id: 1, name: "MITAOE", location: "Alandi, Pune", students: 4800, clubs: 24, events: 156, admins: 2, status: "active", joinedAt: "Jan 2024" },
  { id: 2, name: "MIT College of Engineering", location: "Kothrud, Pune", students: 6200, clubs: 31, events: 210, admins: 2, status: "active", joinedAt: "Jan 2024" },
  { id: 3, name: "Vishwakarma Institute", location: "Bibwewadi, Pune", students: 3900, clubs: 18, events: 98, admins: 1, status: "active", joinedAt: "Mar 2024" },
  { id: 4, name: "Symbiosis Institute", location: "Lavale, Pune", students: 5100, clubs: 22, events: 134, admins: 2, status: "active", joinedAt: "Jun 2024" },
  { id: 5, name: "Pune Institute of Computer Technology", location: "Dhankawadi, Pune", students: 3200, clubs: 15, events: 67, admins: 1, status: "pending", joinedAt: "Mar 2026" },
]

export default function CollegesPage() {
  const { success } = useToast()
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: "", location: "", adminEmail: "", adminName: "" })

  const filtered = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    success("College Added", `${form.name} has been added to the platform`)
    setShowModal(false)
    setForm({ name: "", location: "", adminEmail: "", adminName: "" })
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">Colleges</h1>
          <p className="text-muted-foreground">Manage all colleges on the platform</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add College
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border-4 border-foreground bg-primary p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{colleges.length}</p>
          <p className="font-bold">Total Colleges</p>
        </div>
        <div className="border-4 border-foreground bg-secondary p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{colleges.filter(c => c.status === "active").length}</p>
          <p className="font-bold">Active</p>
        </div>
        <div className="border-4 border-foreground bg-accent p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{colleges.filter(c => c.status === "pending").length}</p>
          <p className="font-bold">Pending Approval</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search colleges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        />
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((college) => (
          <div key={college.id} className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-foreground p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center border-4 border-foreground bg-primary text-2xl font-black">
                    {college.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black">{college.name}</h3>
                    <p className="text-sm text-muted-foreground">{college.location}</p>
                    <p className="text-xs text-muted-foreground">Since {college.joinedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${college.status === "active" ? "bg-primary" : "bg-accent"}`}>
                    {college.status}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-4 border-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="border-4 border-foreground">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Manage Admins</DropdownMenuItem>
                      <DropdownMenuItem>View Analytics</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x-4 divide-foreground border-b-4 border-foreground">
              {[
                { icon: Users, value: college.students.toLocaleString(), label: "Students" },
                { icon: Building2, value: college.clubs, label: "Clubs" },
                { icon: Calendar, value: college.events, label: "Events" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2 p-4">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-black">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            {college.status === "pending" && (
              <div className="flex gap-2 p-4">
                <Button size="sm" className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                  <CheckCircle className="mr-1 h-4 w-4" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-4 border-foreground font-bold">
                  <XCircle className="mr-1 h-4 w-4" /> Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add College Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="w-full max-w-md border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-6 text-2xl font-black">Add College</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label htmlFor="cname" className="mb-2 block font-bold">College Name *</Label>
                <Input id="cname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., MITAOE" required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div>
                <Label htmlFor="cloc" className="mb-2 block font-bold">Location *</Label>
                <Input id="cloc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div>
                <Label htmlFor="aname" className="mb-2 block font-bold">Admin Name *</Label>
                <Input id="aname" value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} placeholder="College admin's name" required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div>
                <Label htmlFor="aemail" className="mb-2 block font-bold">Admin Email *</Label>
                <Input id="aemail" type="email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} placeholder="admin@college.ac.in" required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div className="flex gap-4 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-4 border-foreground font-bold">Cancel</Button>
                <Button type="submit" className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Add College</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
