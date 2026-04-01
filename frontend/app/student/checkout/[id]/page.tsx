"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  CreditCard,
  Shield,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldError } from "@/components/field-error"
import { useToast } from "@/components/toast-provider"
import { useFormValidation, validators } from "@/hooks/use-form-validation"

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
  description: string
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
    description: "An evening of music, dance, and drama performances.",
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
    description: "Annual inter-college cricket tournament.",
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
    description: "Learn guitar basics from professional instructors.",
  },
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { success, error } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const { values: formData, errors, setValue, handleBlur, validate } = useFormValidation(
    { name: "", email: "", phone: "" },
    {
      name: validators.required("Full name"),
      email: validators.email,
      phone: validators.phone,
    }
  )

  const event = events[params.id as string]

  if (!event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl font-bold">Event not found</p>
          <Link
            href="/student"
            className="mt-4 inline-block border-4 border-foreground bg-primary px-4 py-2 font-bold"
          >
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const platformFee = Math.round(event.price * 0.02)
  const total = event.price + platformFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsProcessing(true)

    // Simulate Razorpay integration
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Random success/failure for demo
    const isSuccess = Math.random() > 0.2

    if (isSuccess) {
      success("Payment Successful!", "You have been registered for the event")
      router.push(`/student/checkout/${params.id}/success`)
    } else {
      error("Payment Failed", "Please try again or use a different payment method")
      router.push(`/student/checkout/${params.id}/failure`)
    }
  }

  return (
    <div>
      <Link
        href={`/student/events/${params.id}`}
        className="mb-6 inline-flex items-center gap-2 font-bold hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Event
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order Summary */}
        <div className="order-2 lg:order-1">
          <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-foreground bg-muted p-4">
              <h2 className="text-xl font-black">Order Summary</h2>
            </div>
            <div className="p-6">
              {/* Event Info */}
              <div className="mb-6 border-b-4 border-foreground/20 pb-6">
                <div className="mb-3 inline-block border-2 border-foreground bg-primary px-2 py-0.5 text-sm font-bold">
                  {event.category}
                </div>
                <h3 className="mb-2 text-2xl font-black">{event.title}</h3>
                <p className="text-muted-foreground">by {event.club}</p>
              </div>

              {/* Event Details */}
              <div className="mb-6 space-y-3 border-b-4 border-foreground/20 pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-muted">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-bold">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-muted">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-bold">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-muted">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-bold">{event.venue}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Event Fee</span>
                  <span className="font-bold">Rs. {event.price}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform Fee (2%)</span>
                  <span>Rs. {platformFee}</span>
                </div>
                <div className="border-t-4 border-foreground pt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-black">Total</span>
                    <span className="text-xl font-black">Rs. {total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 flex items-center gap-3 border-4 border-foreground bg-primary/20 p-4">
            <Shield className="h-6 w-6" />
            <div>
              <p className="font-bold">Secure Checkout</p>
              <p className="text-sm text-muted-foreground">
                Your payment is protected by Razorpay
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="order-1 lg:order-2">
          <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-foreground bg-muted p-4">
              <h2 className="text-xl font-black">Payment Details</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {/* Personal Info */}
              <div className="mb-6 space-y-4">
                <h3 className="flex items-center gap-2 font-bold">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>
                <div>
                  <Label htmlFor="name" className="mb-2 block font-bold">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setValue("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="Enter your full name"
                    className={`border-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${errors.name ? "border-destructive" : "border-foreground"}`}
                  />
                  <FieldError message={errors.name} />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2 block font-bold">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setValue("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="Enter your email"
                    className={`border-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${errors.email ? "border-destructive" : "border-foreground"}`}
                  />
                  <FieldError message={errors.email} />
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-2 block font-bold">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setValue("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+91 9876543210"
                    className={`border-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${errors.phone ? "border-destructive" : "border-foreground"}`}
                  />
                  <FieldError message={errors.phone} />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6 space-y-4">
                <h3 className="flex items-center gap-2 font-bold">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </h3>
                <div className="border-4 border-foreground bg-muted p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="razorpay"
                      name="payment"
                      defaultChecked
                      className="h-5 w-5"
                    />
                    <label htmlFor="razorpay" className="flex items-center gap-2">
                      <span className="font-bold">Razorpay</span>
                      <span className="text-sm text-muted-foreground">
                        (Cards, UPI, Net Banking, Wallets)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full border-4 border-foreground bg-primary py-6 text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  `Pay Rs. ${total}`
                )}
              </Button>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
