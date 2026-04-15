"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FieldError } from "@/components/field-error"
import { useToast } from "@/components/toast-provider"
import { eventApi, clubApi, festApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"

const categories = ["TECHNICAL", "CULTURAL", "SPORTS", "WORKSHOP", "SEMINAR", "HACKATHON", "OTHER"]

type FormData = {
  title: string
  category: string
  fest: string
  date: string
  time: string
  venue: string
  description: string
  capacity: string
  price: string
  eligibility: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

function validate(data: FormData, isPaid: boolean): FormErrors {
  const errs: FormErrors = {}
  if (!data.title.trim()) errs.title = "Event title is required"
  if (!data.category) errs.category = "Please select a category"
  if (!data.description.trim()) errs.description = "Description is required"
  if (!data.date) errs.date = "Date is required"
  if (!data.time) errs.time = "Time is required"
  if (!data.venue.trim()) errs.venue = "Venue is required"
  if (!data.capacity.trim() || isNaN(Number(data.capacity)) || Number(data.capacity) < 1)
    errs.capacity = "Enter a valid capacity (min 1)"
  if (isPaid && (!data.price.trim() || isNaN(Number(data.price)) || Number(data.price) < 1))
    errs.price = "Enter a valid fee amount"
  return errs
}

export default function CreateEventPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const { user } = useAuth()
  const [isPaid, setIsPaid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [myClubId, setMyClubId] = useState<number | null>(null)
  const [fests, setFests] = useState<any[]>([])
  const [formData, setFormData] = useState<FormData>({
    title: "", category: "", fest: "none", date: "", time: "",
    venue: "", description: "", capacity: "", price: "", eligibility: "",
  })

  useEffect(() => {
    const load = async () => {
      try {
        const clubRes = await clubApi.getMyClub()
        setMyClubId(clubRes.data.data?.id || null)
      } catch { /* no club yet */ }
      try {
        const festRes = await festApi.getAllFests()
        setFests(festRes.data.data || [])
      } catch { /* ignore */ }
    }
    load()
  }, [])

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(formData, isPaid)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    if (!myClubId) { error("Error", "You don't have a registered club yet"); return }

    setIsSubmitting(true)
    try {
      const eventDate = `${formData.date}T${formData.time}:00`
      await eventApi.createEvent({
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        eventDate,
        maxParticipants: Number(formData.capacity),
        category: formData.category,
        feeAmount: isPaid ? Number(formData.price) : 0,
        clubId: myClubId,
        festId: formData.fest !== "none" ? Number(formData.fest) : undefined,
      })
      success("Event Created", `"${formData.title}" has been created successfully`)
      router.push("/club/events")
      router.refresh()
    } catch (err: any) {
      error("Error", err?.response?.data?.message || "Failed to create event")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (field: keyof FormData) =>
    `border-4 bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-muted-foreground ${
      errors[field] ? "border-destructive" : "border-foreground"
    }`

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/club/events" className="mb-6 inline-flex items-center gap-2 font-bold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div className="border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8">
        <h1 className="mb-2 text-3xl font-black">Create Event</h1>
        <p className="mb-8 text-muted-foreground">Fill in the details to create a new event</p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="border-b-4 border-foreground pb-2 text-xl font-black">Basic Information</h2>

            <div>
              <Label htmlFor="title" className="mb-2 block font-bold">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Enter event title"
                className={inputClass("title")}
              />
              <FieldError message={errors.title} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="category" className="mb-2 block font-bold">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => update("category", e.target.value)}
                  className={`w-full border-4 bg-background px-4 py-3 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    errors.category ? "border-destructive" : "border-foreground"
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <FieldError message={errors.category} />
              </div>
              <div>
                <Label htmlFor="fest" className="mb-2 block font-bold">Part of Fest</Label>
                <select id="fest" value={formData.fest} onChange={(e) => update("fest", e.target.value)}
                  className="w-full border-4 border-foreground bg-background px-4 py-3 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <option value="none">None (Standalone Event)</option>
                  {fests.map((f: any) => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block font-bold">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe your event..."
                rows={4}
                className={`border-4 bg-background px-4 py-3 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-muted-foreground ${
                  errors.description ? "border-destructive" : "border-foreground"
                }`}
              />
              <FieldError message={errors.description} />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h2 className="border-b-4 border-foreground pb-2 text-xl font-black">Schedule & Location</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="date" className="mb-2 block font-bold">
                  <Calendar className="mr-2 inline h-4 w-4" />Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => update("date", e.target.value)}
                  className={inputClass("date")}
                />
                <FieldError message={errors.date} />
              </div>
              <div>
                <Label htmlFor="time" className="mb-2 block font-bold">
                  <Clock className="mr-2 inline h-4 w-4" />Time *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => update("time", e.target.value)}
                  className={inputClass("time")}
                />
                <FieldError message={errors.time} />
              </div>
            </div>

            <div>
              <Label htmlFor="venue" className="mb-2 block font-bold">
                <MapPin className="mr-2 inline h-4 w-4" />Venue *
              </Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => update("venue", e.target.value)}
                placeholder="e.g., Main Auditorium, Block A"
                className={inputClass("venue")}
              />
              <FieldError message={errors.venue} />
            </div>
          </div>

          {/* Capacity & Pricing */}
          <div className="space-y-4">
            <h2 className="border-b-4 border-foreground pb-2 text-xl font-black">Capacity & Pricing</h2>

            <div>
              <Label htmlFor="capacity" className="mb-2 block font-bold">
                <Users className="mr-2 inline h-4 w-4" />Maximum Capacity *
              </Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => update("capacity", e.target.value)}
                placeholder="Enter maximum participants"
                className={inputClass("capacity")}
              />
              <FieldError message={errors.capacity} />
            </div>

            <div className="flex items-center justify-between border-4 border-foreground bg-muted p-4">
              <div>
                <Label htmlFor="isPaid" className="font-bold">Paid Event</Label>
                <p className="text-sm text-muted-foreground">Toggle if this event requires payment</p>
              </div>
              <Switch id="isPaid" checked={isPaid} onCheckedChange={setIsPaid} />
            </div>

            {isPaid && (
              <div>
                <Label htmlFor="price" className="mb-2 block font-bold">
                  <DollarSign className="mr-2 inline h-4 w-4" />Registration Fee (Rs.) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="Enter fee amount"
                  className={inputClass("price")}
                />
                <FieldError message={errors.price} />
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h2 className="border-b-4 border-foreground pb-2 text-xl font-black">Additional Information</h2>
            <div>
              <Label htmlFor="eligibility" className="mb-2 block font-bold">
                <FileText className="mr-2 inline h-4 w-4" />Eligibility Criteria
              </Label>
              <Textarea
                id="eligibility"
                value={formData.eligibility}
                onChange={(e) => update("eligibility", e.target.value)}
                placeholder="Who can participate? Any prerequisites?"
                rows={3}
                className="border-4 border-foreground bg-background px-4 py-3 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/club/events")}
              className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 border-4 border-foreground bg-primary py-6 font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                  Creating...
                </span>
              ) : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
