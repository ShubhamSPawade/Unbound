"use client"

import { useState } from "react"
import { PlusCircle, Search, MoreVertical, Shield, Mail, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/toast-provider"

const admins = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@mitaoe.ac.in", college: "MITAOE", phone: "+91 9876543210", addedAt: "Jan 15, 2024", status: "active", eventsManaged: 156 },
  { id: 2, name: "Priya Sharma", email: "priya@mitcoe.ac.in", college: "MIT College of Engineering", phone: "+91 9876543211", addedAt: "Jan 20, 2024", status: "active", eventsManaged: 210 },
  { id: 3, name: "Suresh Patel", email: "suresh@mitcoe.ac.in", college: "MIT College of Engineering", phone: "+91 9876543212", addedAt: "Feb 10, 2024", status: "active", eventsManaged: 98 },
  { id: 4, name: "Arun Mehta", email: "arun@vit.ac.in", college: "Vishwakarma Institute", phone: "+91 9876543213", addedAt: "Mar 5, 2024", status: "active", eventsManaged: 67 },
  { id: 5, name: "Neha Singh", email: "neha@pict.ac.in", college: "Pune Institute of Computer Technology", phone: "+91 9876543214", addedAt: "Mar 20, 2026", status: "pending", eventsManaged: 0 },
]

const colleges = ["MITAOE", "MIT College of Engineering", "Vishwakarma Institute", "Symbiosis Institute", "Pune Institute of Computer Technology"]

export default function AdminsPage() {
  const { success } = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all")
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", college: "", phone: "" })

  const filtered = admins.filter((a) => {
    const statusMatch = statusFilter === "all" || a.status === statusFilter
    const searchMatch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.college.toLowerCase().includes(search.toLowerCase())
    return statusMatch && searchMatch
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    success("Admin Added", `${form.name} has been added as admin for ${form.college}`)
    setShowModal(false)
    setForm({ name: "", email: "", college: "", phone: "" })
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">College Admins</h1>
          <p className="text-muted-foreground">Manage college-level administrators</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add Admin
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border-4 border-foreground bg-primary p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{admins.length}</p><p className="font-bold">Total Admins</p>
        </div>
        <div className="border-4 border-foreground bg-secondary p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{admins.filter(a => a.status === "active").length}</p><p className="font-bold">Active</p>
        </div>
        <div className="border-4 border-foreground bg-accent p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-3xl font-black">{admins.filter(a => a.status === "pending").length}</p><p className="font-bold">Pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search admins or colleges..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "pending"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${statusFilter === s ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="border-b-4 border-foreground bg-muted">
              <tr>
                {["Admin", "College", "Phone", "Added", "Events", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left font-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-foreground">
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-accent font-black">{a.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold">{a.name}</p>
                        <p className="text-sm text-muted-foreground">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">{a.college}</span></td>
                  <td className="px-5 py-4 text-muted-foreground">{a.phone}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.addedAt}</td>
                  <td className="px-5 py-4 font-bold">{a.eventsManaged}</td>
                  <td className="px-5 py-4">
                    <span className={`border-2 border-foreground px-2 py-0.5 text-sm font-bold ${a.status === "active" ? "bg-primary" : "bg-accent"}`}>{a.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {a.status === "pending" && (
                        <>
                          <Button size="sm" className="border-4 border-foreground bg-primary font-bold text-foreground"><CheckCircle className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" className="border-4 border-foreground"><XCircle className="h-4 w-4" /></Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="border-4 border-foreground"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-4 border-foreground">
                          <DropdownMenuItem><Mail className="mr-2 h-4 w-4" />Send Email</DropdownMenuItem>
                          <DropdownMenuItem>View College</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Revoke Access</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y-4 divide-foreground md:hidden">
          {filtered.map((a) => (
            <div key={a.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-accent font-black">{a.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.email}</p>
                  </div>
                </div>
                <span className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${a.status === "active" ? "bg-primary" : "bg-accent"}`}>{a.status}</span>
              </div>
              <p className="text-sm font-bold">{a.college}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="w-full max-w-md border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-6 text-2xl font-black">Add College Admin</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label htmlFor="aname" className="mb-2 block font-bold">Full Name *</Label>
                <Input id="aname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div>
                <Label htmlFor="aemail" className="mb-2 block font-bold">Email *</Label>
                <Input id="aemail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div>
                <Label htmlFor="acollege" className="mb-2 block font-bold">Assign College *</Label>
                <select id="acollege" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} required className="w-full border-4 border-foreground bg-background px-3 py-2 font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <option value="">Select college</option>
                  {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="aphone" className="mb-2 block font-bold">Phone</Label>
                <Input id="aphone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div className="flex gap-4 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-4 border-foreground font-bold">Cancel</Button>
                <Button type="submit" className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Add Admin</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
