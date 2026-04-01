"use client"

import { useState } from "react"
import Link from "next/link"
import { Infinity, Star, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [submitted, setSubmitted] = useState(false)

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
            <Link href="/" className="font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="border-4 border-foreground bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center border-4 border-foreground bg-primary">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mb-2 text-3xl font-black">Thank You!</h2>
              <p className="text-muted-foreground">Your feedback helps us improve Unbound for everyone.</p>
              <Link href="/" className="mt-6 inline-block border-4 border-foreground bg-primary px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-2 text-3xl font-black">Share Feedback</h1>
              <p className="mb-8 text-muted-foreground">Help us make Unbound better</p>

              <form onSubmit={(e) => { e.preventDefault(); if (rating > 0) setSubmitted(true) }} className="space-y-6">
                <div>
                  <Label className="mb-3 block font-bold">Overall Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 ${
                            star <= (hovered || rating) ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating === 0 && <p className="mt-1 text-sm text-muted-foreground">Click a star to rate</p>}
                </div>

                <div>
                  <Label htmlFor="category" className="mb-2 block font-bold">Category</Label>
                  <select id="category" className="w-full border-4 border-foreground bg-background px-4 py-3 font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <option>General</option>
                    <option>Event Registration</option>
                    <option>Payment</option>
                    <option>Club Management</option>
                    <option>UI / Design</option>
                    <option>Bug Report</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message" className="mb-2 block font-bold">Your Feedback</Label>
                  <Textarea id="message" rows={5} placeholder="Tell us what you think..." required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
                </div>

                <Button
                  type="submit"
                  disabled={rating === 0}
                  className="w-full border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
                >
                  Submit Feedback
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
