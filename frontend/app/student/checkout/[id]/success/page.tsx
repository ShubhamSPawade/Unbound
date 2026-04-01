"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Calendar, MapPin, Clock, Download, QrCode, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock event data
const events: Record<string, {
  id: number
  title: string
  date: string
  time: string
  venue: string
  category: string
  club: string
  price: number
}> = {
  "2": {
    id: 2,
    title: "Cultural Night",
    date: "Apr 20, 2026",
    time: "6:00 PM",
    venue: "Open Air Theatre",
    category: "Cultural",
    club: "Drama Society",
    price: 100,
  },
  "4": {
    id: 4,
    title: "Inter-College Cricket",
    date: "May 1, 2026",
    time: "8:00 AM",
    venue: "Sports Ground",
    category: "Sports",
    club: "Sports Committee",
    price: 50,
  },
  "5": {
    id: 5,
    title: "Music Workshop",
    date: "May 5, 2026",
    time: "2:00 PM",
    venue: "Music Room",
    category: "Workshop",
    club: "Music Club",
    price: 200,
  },
}

export default function PaymentSuccessPage() {
  const params = useParams()
  const event = events[params.id as string]

  // Generate mock transaction details
  const transactionId = `TXN${Date.now().toString().slice(-10)}`
  const registrationId = `REG${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Success Card */}
        <div className="border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Success Header */}
          <div className="border-b-4 border-foreground bg-primary p-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center border-4 border-foreground bg-card">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-black">Payment Successful!</h1>
            <p className="text-lg">You&apos;re all set for the event</p>
          </div>

          {/* Event Details */}
          <div className="border-b-4 border-foreground p-6">
            <div className="mb-2 inline-block border-2 border-foreground bg-secondary px-2 py-0.5 text-sm font-bold">
              {event?.category || "Event"}
            </div>
            <h2 className="mb-4 text-2xl font-black">{event?.title || "Event"}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{event?.date || "TBD"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{event?.time || "TBD"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event?.venue || "TBD"}</span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="border-b-4 border-foreground bg-muted p-6">
            <h3 className="mb-4 font-black">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono font-bold">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registration ID</span>
                <span className="font-mono font-bold">{registrationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold">
                  Rs. {event ? event.price + Math.round(event.price * 0.02) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="border-2 border-foreground bg-primary px-2 py-0.5 text-xs font-bold">
                  CONFIRMED
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border-b-4 border-foreground p-6 text-center">
            <h3 className="mb-4 font-black">Your Entry Pass</h3>
            <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center border-4 border-foreground bg-white">
              <QrCode className="h-24 w-24 text-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Show this QR code at the venue for entry
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 p-6">
            <Button className="w-full border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              <Download className="mr-2 h-4 w-4" />
              Download Ticket
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Link href="/student/my-events" className="block">
                <Button
                  variant="outline"
                  className="w-full border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                  My Events
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Back to explore */}
        <div className="mt-6 text-center">
          <Link
            href="/student"
            className="font-bold text-primary hover:underline"
          >
            Explore More Events
          </Link>
        </div>
      </div>
    </div>
  )
}
