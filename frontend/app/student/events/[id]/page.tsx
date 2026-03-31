"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use } from "react"
import { ArrowLeft, Calendar, MapPin, Users, Clock, Building2, CheckCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/toast-provider"

// Mock event data
const eventData = {
  id: 1,
  title: "Hackathon 2026",
  description: "Join us for an exciting 24-hour coding marathon! Build innovative solutions, collaborate with peers, and compete for amazing prizes. This hackathon is open to all skill levels - whether you're a beginner or an experienced developer, there's something for everyone.",
  date: "April 15, 2026",
  time: "9:00 AM - 9:00 AM (next day)",
  venue: "Main Auditorium, Block A",
  category: "Technical",
  club: "Coding Club",
  clubDescription: "The premier coding community at MITAOE",
  capacity: 200,
  registered: 156,
  isPaid: false,
  eligibility: "Open to all MITAOE students",
  requirements: [
    "Bring your own laptop",
    "Team size: 2-4 members",
    "Valid college ID required",
  ],
  prizes: [
    "1st Place: Rs. 25,000 + Internship Opportunity",
    "2nd Place: Rs. 15,000",
    "3rd Place: Rs. 10,000",
  ],
}

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const handleRegister = () => {
    if (eventData.isPaid) {
      setShowPayment(true)
    } else {
      setIsRegistered(true)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back Link */}
      <Link
        href="/student"
        className="mb-6 inline-flex items-center gap-2 font-bold hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      {/* Event Header */}
      <div className="mb-6 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="aspect-video border-b-4 border-foreground bg-muted"></div>
        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="border-4 border-foreground bg-primary px-3 py-1 font-bold">
              {eventData.category}
            </span>
            {eventData.isPaid ? (
              <span className="border-4 border-foreground bg-accent px-3 py-1 font-bold">
                Rs. 100
              </span>
            ) : (
              <span className="border-4 border-foreground bg-secondary px-3 py-1 font-bold">
                Free Entry
              </span>
            )}
          </div>
          <h1 className="mb-4 text-3xl font-black md:text-4xl">{eventData.title}</h1>
          <p className="mb-6 text-lg text-muted-foreground">{eventData.description}</p>

          {/* Event Meta */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Date</p>
                <p className="text-muted-foreground">{eventData.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-secondary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Time</p>
                <p className="text-muted-foreground">{eventData.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-accent">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Venue</p>
                <p className="text-muted-foreground">{eventData.venue}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-muted">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Organized by</p>
                <p className="text-muted-foreground">{eventData.club}</p>
              </div>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold">Registration Status</span>
              <span className="font-bold">{eventData.registered}/{eventData.capacity}</span>
            </div>
            <div className="h-4 border-4 border-foreground bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${(eventData.registered / eventData.capacity) * 100}%` }}
              />
            </div>
          </div>

          {/* Register Button */}
          {!isRegistered ? (
            <Button
              onClick={handleRegister}
              className="w-full border-4 border-foreground bg-primary py-6 text-lg font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:w-auto md:px-12"
            >
              Register Now
            </Button>
          ) : (
            <div className="inline-flex items-center gap-3 border-4 border-foreground bg-primary px-6 py-4 font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle className="h-6 w-6" />
              You are registered for this event!
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Eligibility */}
        <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-xl font-black">Eligibility</h2>
          <p className="text-muted-foreground">{eventData.eligibility}</p>
        </div>

        {/* Requirements */}
        <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-xl font-black">Requirements</h2>
          <ul className="space-y-2">
            {eventData.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 flex h-5 w-5 items-center justify-center border-2 border-foreground bg-primary text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prizes */}
        <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:col-span-2">
          <h2 className="mb-4 text-xl font-black">Prizes</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {eventData.prizes.map((prize, index) => (
              <div
                key={index}
                className={`border-4 border-foreground p-4 ${
                  index === 0 ? "bg-secondary" : index === 1 ? "bg-muted" : "bg-accent"
                }`}
              >
                <p className="font-bold">{prize}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="w-full max-w-md border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-4 text-2xl font-black">Complete Payment</h2>
            <div className="mb-6 border-4 border-foreground bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold">Event Fee</span>
                <span className="text-xl font-black">Rs. 100</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="flex-1 border-4 border-foreground font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowPayment(false)
                  setIsRegistered(true)
                }}
                className="flex-1 border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
