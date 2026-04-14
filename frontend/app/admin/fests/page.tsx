"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit, Trash2, Calendar, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { festApi, userApi } from "@/lib/api"
import { useToast } from "@/components/toast-provider"
import { useAuth } from "@/lib/auth-context"

export default function AdminFestsPage() {
  const { user } = useAuth()
  const { success, error } = useToast()
  const [fests, setFests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [collegeId, setCollegeId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: "", description: "", startDate: "", endDate: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchFests()
    // Get college ID from user profile
    const loadProfile = async () => {
      try {
        const res = await userApi.getMe()
        const profile = res.data.data
        if (profile.collegeId) setCollegeId(profile.collegeId)
      } catch { /* ignore */ }
    }
    loadProfile()
  }, [])

  const fetchFests = async () => {
    setIsLoading(true)
    try {
      const res = await festApi.getAllFests()
      setFests(res.data.data || [])
    } catch { setFests([]) } finally { setIsLoading(false) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.startDate || !form.endDate) { error("Error", "All fields are required"); return }
    if (!collegeId) { error("Error", "College ID not found. Please update your profile."); return }
    setIsSubmitting(true)
    try {
      await festApi.createFest({ ...form, collegeId })
      success("Created", `${form.name} has been created`)
      setShowCreateModal(false)
      setForm({ name: "", description: "", startDate: "", endDate: "" })
      fetchFests()
    } catch (err: any) {
      error("Error", err?.response?.data?.message || "Failed to create fest")
    } finally { setIsSubmitting(false) }
  }

  const handleDelete = async (id: number) => {
    try {
      await festApi.deleteFest(id)
      setFests((prev) => prev.filter((f) => f.id !== id))
      success("Deleted", "Fest has been deleted")
    } catch (err: any) { error("Error", err?.response?.data?.message || "Failed to delete") }
  }

  const filtered = fests.filter((f) => f.name?.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-black md:text-4xl">Fest Management</h1>
          <p className="text-muted-foreground">Create and manage college fests</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}
          className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <PlusCircle className="mr-2 h-5 w-5" /> Create Fest
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search fests..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-4 border-foreground bg-card pl-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">{[...Array(3)].map((_, i) => <div key={i} className="h-48 animate-pulse border-4 border-foreground bg-muted" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl font-bold">No fests yet</p>
          <p className="mt-2 text-muted-foreground">Create your first fest</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((fest) => (
            <div key={fest.id} className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b-4 border-foreground p-5">
                <h3 className="text-xl font-black">{fest.name}</h3>
                {fest.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{fest.description}</p>}
              </div>
              <div className="grid grid-cols-2 divide-x-4 divide-foreground border-b-4 border-foreground">
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">Start</p>
                  <p className="font-bold">{new Date(fest.startDate).toLocaleDateString()}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">End</p>
                  <p className="font-bold">{new Date(fest.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2 p-4">
                <Button size="sm" variant="outline" onClick={() => handleDelete(fest.id)}
                  className="border-4 border-foreground font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="w-full max-w-lg border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-6 text-2xl font-black">Create New Fest</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="festName" className="mb-2 block font-bold">Fest Name *</Label>
                <Input id="festName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., TechFest 2026"
                  className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div>
                <Label htmlFor="festDesc" className="mb-2 block font-bold">Description</Label>
                <Input id="festDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description"
                  className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="mb-2 block font-bold">Start Date *</Label>
                  <Input id="startDate" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
                </div>
                <div>
                  <Label htmlFor="endDate" className="mb-2 block font-bold">End Date *</Label>
                  <Input id="endDate" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-4 border-foreground font-bold">Cancel</Button>
                <Button type="submit" disabled={isSubmitting}
                  className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                  {isSubmitting ? "Creating..." : "Create Fest"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
