"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FieldError } from "@/components/field-error"
import { useToast } from "@/components/toast-provider"
import { eventApi, festApi, clubApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

const categories = ["TECHNICAL", "CULTURAL", "SPORTS", "WORKSHOP", "SEMINAR", "HACKATHON", "OTHER"]

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { success, error } = useToast()
  const { user } = useAuth()

  const [isPaid, setIsPaid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [myClubId, setMyClubId] = useState<number | null>(null)
  const [fests, setFests] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: "", category: "", fest: "none", date: "", time: "",
    venue: "", description: "", capacity: "", price: "",
  })

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        // Load event data
        const eventRes = await eventApi.getEventById(Number(id))
        const event = eventRes.data.data
        const eventDate = new Date(event.eventDate)

        setFormData({
          title: event.title || "",
          category: event.category || "",
          fest: event.festId ? String(event.festId) : "none",
          date: eventDate.toISOString().split("T")[0],
          time: eventDate.toTimeString().slice(0, 5),
          venue: event.venue || "",
          description: event.description || "",
          capacity: String(event.maxParticipants || ""),
          price: String(event.feeAmount || ""),
        })
        setIsPaid(event.feeAmount > 0)

        // Load club and fests
        const clubRes = await clubApi.getMyClub()
        setMyClubId(clubRes.data.data?.id || null)

        const festRes = await festApi.getAllFests()
        setFests(festRes.data.data || [])
      } catch {
        error("Error", "Failed to load event")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!myClubId) { error("Error", "Club not found"); return }

    const errs: Record<string, string> = {}
    if (!formData.title.trim()) errs.title = "Title is required"
    if (!formData.category) errs.category = "Category is required"
    if (!formData.date) errs.date = "Date is required"
    if (!formData.time) errs.time = "Time is required"
    if (!formData.venue.trim()) errs.venue = "Venue is required"
    if (!formData.capacity || Number(formData.capacity) < 1) errs.capacity = "Valid capacity required"
    if (isPaid && (!formData.price || Number(formData.price) < 1)) errs.price = "Valid fee required"

    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setIsSubmitting(true)
    try {
      await eventApi.updateEvent(Number(id), {
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        eventDate: `${formData.date}T${formData.time}:00`,
        maxParticipants: Number(formData.capacity),
        category: formData.category,
        feeAmount: isPaid ? Number(formData.price) : 0,
        clubId: myClubId,
        festId: formData.fest !== "none" ? Number(formData.fest) : undefined,
      })
      success("Event Updated", `"${formData.title}" has been updated successfully`)
      router.push("/club/events")
    } catch (err: any) {
      error("Error", err?.response?.data?.message || "Failed to update event")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (field: string) =>
    `border-4 bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-muted-foreground ${errors[field] ? "border-destructive" : "border-foreground"}`

  if (isLoading) return <div className="h-96 animate-pulse border-4 border-foreground bg-muted mx-auto max-w-3xl" />

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/club/events" className="mb-6 inline-flex items-center gap-2 font-bold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div className="border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8">
        <h1 className="mb-2 text-3xl font-black">Edit Event</h1>
        <p className="mb-8 text-muted-foreground">Update the event details</p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-4">
            <h2 className="border-b-4 border-foreground pb-2 text-xl font-black">Basic Information</h2>
            <div>
              <Label htmlFor="title" className="mb-2 block font-bold">Event Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => update("title", e.target.value)}
                placeholder="Enter event title" className={inputClass("title")} />
              <FieldError message={errors.title} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="category" className="mb-2 block font-bold">Category *</Label>
                <select id="category" value={formData.category} onChange={(e) => update("category", e.target.value)}
                  className={`w-full border-4 bg-background px-4 py-3 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.category ? "border-destructive" : "border-foreground"}`}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <FieldError message={errors.category} />
              </div>
              <div>
                <Label htmlFor="fest" className="mb-2 block font-bold">Part of Fest</Label>
                <select id="fest" value={formData.fest} onChange={(e) => update("fest", e.target.value)}
                  className="w-full border-4 border-foreground bg-background px-4 py-3 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <option value="none">None (Standalone)</option>
                  {fests.map((f: any) => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="mb-2 block font-bold">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => update("description", e.target.value)}
                rows={4} className="border-4 border-foreground bg-background px-4 py-3 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="border-b-4 border-foreground pb-2 text-xl font-black">Schedule & Location</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="date" className="mb-2 block font-bold"><Calendar className="mr-2 inline h-4 w-4" />Date *</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => update("date", e.target.value)} className={inputClass("date")} />
                <FieldError message={errors.date} />
              </div>
              <div>
                <Label htmlFor="time" className="mb-2 block font-bold"><Clock className="mr-2 inline h-4 w-4" />Time *</Label>
                <Input id="time" type="time" value={formData.time} onChange={(e) => update("time", e.target.value)} className={inputClass("time")} />
                <FieldError message={errors.time} />
              </div>
            </div>
            <div>
              <Label htmlFor="venue" className="mb-2 block font-bold"><MapPin className="mr-2 inline h-4 w-4" />Venue *</Label>
              <Input id="venue" value={formData.venue} onChange={(e) => update("venue", e.target.value)} className={inputClass("venue")} />
              <FieldError message={errors.venue} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="border-b-4 border-foreground pb-2 text-xl font-black">Capacity & Pricing</h2>
            <div>
              <Label htmlFor="capacity" className="mb-2 block font-bold"><Users className="mr-2 inline h-4 w-4" />Maximum Capacity *</Label>
              <Input id="capacity" type="number" min="1" value={formData.capacity} onChange={(e) => update("capacity", e.target.value)} className={inputClass("capacity")} />
              <FieldError message={errors.capacity} />
            </div>
            <div className="flex items-center justify-between border-4 border-foreground bg-muted p-4">
              <div>
                <Label className="font-bold">Paid Event</Label>
                <p className="text-sm text-muted-foreground">Toggle if this event requires payment</p>
              </div>
              <Switch checked={isPaid} onCheckedChange={setIsPaid} />
            </div>
            {isPaid && (
              <div>
                <Label htmlFor="price" className="mb-2 block font-bold"><DollarSign className="mr-2 inline h-4 w-4" />Registration Fee (Rs.) *</Label>
                <Input id="price" type="number" min="1" value={formData.price} onChange={(e) => update("price", e.target.value)} className={inputClass("price")} />
                <FieldError message={errors.price} />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/club/events")}
              className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}
              className="flex-1 border-4 border-foreground bg-primary py-6 font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                  Saving...
                </span>
              ) : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
