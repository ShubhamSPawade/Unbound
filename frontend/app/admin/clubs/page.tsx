"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle, XCircle, Eye, Users, Calendar, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { clubApi } from "@/lib/api"
import { useToast } from "@/components/toast-provider"

type StatusFilter = "all" | "APPROVED" | "PENDING" | "REJECTED"

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const { success, error } = useToast()

  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    setIsLoading(true)
    try {
      const res = await clubApi.getAllClubsAdmin()
      setClubs(res.data.data || [])
    } catch { setClubs([]) } finally { setIsLoading(false) }
  }

  const handleApprove = async (id: number) => {
    try {
      await clubApi.approveClub(id)
      setClubs((prev) => prev.map((c) => c.id === id ? { ...c, status: "APPROVED" } : c))
      success("Approved", "Club has been approved")
    } catch (err: any) { error("Error", err?.response?.data?.message || "Failed to approve") }
  }

  const handleReject = async (id: number) => {
    if (!rejectReason.trim()) { error("Error", "Rejection reason is required"); return }
    try {
      await clubApi.rejectClub(id, rejectReason)
      setClubs((prev) => prev.map((c) => c.id === id ? { ...c, status: "REJECTED" } : c))
      setRejectingId(null)
      setRejectReason("")
      success("Rejected", "Club has been rejected")
    } catch (err: any) { error("Error", err?.response?.data?.message || "Failed to reject") }
  }

  const filtered = clubs.filter((c) => {
    const statusMatch = statusFilter === "all" || c.status === statusFilter
    const searchMatch = c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    return statusMatch && searchMatch
  })

  const statusColor: Record<string, string> = { APPROVED: "bg-primary", PENDING: "bg-accent", REJECTED: "bg-destructive text-destructive-foreground" }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Club Management</h1>
        <p className="text-muted-foreground">Approve and manage registered clubs</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Clubs", value: clubs.length, color: "bg-primary" },
          { label: "Approved", value: clubs.filter(c => c.status === "APPROVED").length, color: "bg-secondary" },
          { label: "Pending", value: clubs.filter(c => c.status === "PENDING").length, color: "bg-accent" },
        ].map((s) => (
          <div key={s.label} className={`border-4 border-foreground ${s.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
            <p className="mb-1 text-4xl font-black">{isLoading ? "—" : s.value}</p>
            <p className="font-bold">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search clubs..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
        <div className="flex gap-2">
          {(["all", "APPROVED", "PENDING", "REJECTED"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`border-4 border-foreground px-4 py-2 font-bold capitalize transition-all ${statusFilter === s ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">{[...Array(4)].map((_, i) => <div key={i} className="h-48 animate-pulse border-4 border-foreground bg-muted" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl font-bold">No clubs found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((club) => (
            <div key={club.id} className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b-4 border-foreground p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center border-4 border-foreground bg-primary text-xl font-black">
                      {club.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">{club.ownerName}</p>
                    </div>
                  </div>
                  <span className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${statusColor[club.status] || "bg-muted"}`}>{club.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{club.contactEmail}</p>
                {club.rejectionReason && <p className="mt-2 text-sm text-destructive font-medium">Reason: {club.rejectionReason}</p>}
              </div>
              <div className="flex gap-2 p-4">
                {club.status === "PENDING" ? (
                  <>
                    <Button size="sm" onClick={() => handleApprove(club.id)}
                      className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <CheckCircle className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setRejectingId(club.id)}
                      className="flex-1 border-4 border-foreground font-bold">
                      <XCircle className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground px-2">{club.category}</span>
                )}
              </div>

              {/* Reject reason input */}
              {rejectingId === club.id && (
                <div className="border-t-4 border-foreground p-4 space-y-3">
                  <input type="text" placeholder="Rejection reason..." value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full border-4 border-foreground bg-background px-3 py-2 font-medium" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReject(club.id)}
                      className="flex-1 border-4 border-foreground bg-destructive font-bold text-destructive-foreground">
                      Confirm Reject
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setRejectingId(null); setRejectReason("") }}
                      className="border-4 border-foreground font-bold">Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
