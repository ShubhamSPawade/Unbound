"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Mail, FileText, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FieldError } from "@/components/field-error"
import { useToast } from "@/components/toast-provider"
import { clubApi } from "@/lib/api"

const categories = ["Technical", "Cultural", "Sports", "Arts", "Music", "Literary", "Other"]

export default function RegisterClubPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: "", description: "", category: "", contactEmail: "", logoUrl: "",
  })

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "Club name is required"
    if (!form.category) errs.category = "Category is required"
    if (!form.contactEmail.trim()) errs.contactEmail = "Contact email is required"
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setIsSubmitting(true)
    try {
      await clubApi.createClub({
        name: form.name,
        description: form.description,
        category: form.category,
        contactEmail: form.contactEmail,
        logoUrl: form.logoUrl || undefined,
      })
      success("Club Registered!", "Your club registration has been submitted for approval by the college admin.")
      router.push("/club")
    } catch (err: any) {
      error("Error", err?.response?.data?.message || "Failed to register club")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (field: string) =>
    `border-4 bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors[field] ? "border-destructive" : "border-foreground"}`

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Register Your Club</h1>
        <p className="text-muted-foreground">Submit your club for college admin approval</p>
      </div>

      <div className="border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <Label htmlFor="name" className="mb-2 flex items-center gap-2 font-bold">
              <Building2 className="h-4 w-4" />Club Name *
            </Label>
            <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)}
              placeholder="e.g., Coding Club" className={inputClass("name")} />
            <FieldError message={errors.name} />
          </div>

          <div>
            <Label htmlFor="category" className="mb-2 block font-bold">Category *</Label>
            <select id="category" value={form.category} onChange={(e) => update("category", e.target.value)}
              className={`w-full border-4 bg-background px-4 py-3 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.category ? "border-destructive" : "border-foreground"}`}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <FieldError message={errors.category} />
          </div>

          <div>
            <Label htmlFor="contactEmail" className="mb-2 flex items-center gap-2 font-bold">
              <Mail className="h-4 w-4" />Contact Email *
            </Label>
            <Input id="contactEmail" type="email" value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              placeholder="club@mitaoe.ac.in" className={inputClass("contactEmail")} />
            <FieldError message={errors.contactEmail} />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2 flex items-center gap-2 font-bold">
              <FileText className="h-4 w-4" />Description
            </Label>
            <Textarea id="description" value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What does your club do?" rows={4}
              className="border-4 border-foreground bg-background px-4 py-3 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          </div>

          <div>
            <Label htmlFor="logoUrl" className="mb-2 block font-bold">Logo URL (optional)</Label>
            <Input id="logoUrl" value={form.logoUrl} onChange={(e) => update("logoUrl", e.target.value)}
              placeholder="https://..." className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          </div>

          <div className="border-4 border-foreground bg-accent p-4">
            <p className="text-sm font-bold">Note: Your club will be reviewed by the college admin before it becomes active. You will be notified once approved.</p>
          </div>

          <Button type="submit" disabled={isSubmitting}
            className="w-full border-4 border-foreground bg-primary py-6 font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Save className="h-5 w-5" />Submit for Approval</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
