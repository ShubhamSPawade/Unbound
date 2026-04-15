"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Clock, User, CreditCard, Shield, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/toast-provider"
import { eventApi, paymentApi, registrationApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { success, error } = useToast()
  const { user } = useAuth()

  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      try {
        const res = await eventApi.getEventById(Number(params.id))
        setEvent(res.data.data)
      } catch {
        error("Error", "Failed to load event details")
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [params.id])

  // Load Razorpay script dynamically
  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!event) return
    setIsProcessing(true)

    try {
      // Step 1 — Create Razorpay order on backend
      const orderRes = await paymentApi.createOrder(Number(params.id))
      const { razorpayOrderId, amount } = orderRes.data.data

      // Step 2 — Load Razorpay script
      const loaded = await loadRazorpay()
      if (!loaded) {
        error("Error", "Failed to load payment gateway. Please try again.")
        setIsProcessing(false)
        return
      }

      // Step 3 — Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RnWTeFkA7utkL8",
        amount: amount * 100, // paise
        currency: "INR",
        name: "Unbound",
        description: event.title,
        order_id: razorpayOrderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#000000" },

        handler: async (response: any) => {
          // Step 4 — Verify payment on backend
          try {
            await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            success("Payment Successful!", `You are now registered for ${event.title}`)
            router.push("/student/my-events")
          } catch {
            error("Verification Failed", "Payment received but verification failed. Contact support.")
          }
        },

        modal: {
          ondismiss: async () => {
            // Step 5 — Handle failure/dismiss
            try {
              await paymentApi.handleFailure(razorpayOrderId, "Payment dismissed by user")
            } catch { /* ignore */ }
            error("Payment Cancelled", "You cancelled the payment.")
            setIsProcessing(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", async (response: any) => {
        try {
          await paymentApi.handleFailure(razorpayOrderId, response.error?.description || "Payment failed")
        } catch { /* ignore */ }
        error("Payment Failed", response.error?.description || "Payment could not be processed")
        setIsProcessing(false)
      })

      rzp.open()

    } catch (err: any) {
      error("Error", err?.response?.data?.message || "Could not initiate payment")
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return <div className="h-96 animate-pulse border-4 border-foreground bg-muted mx-auto max-w-4xl" />
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-4 border-foreground bg-card p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl font-bold">Event not found</p>
          <Link href="/student" className="mt-4 inline-block border-4 border-foreground bg-primary px-4 py-2 font-bold">Back to Events</Link>
        </div>
      </div>
    )
  }

  const platformFee = Math.round((event.feeAmount || 0) * 0.02)
  const total = (event.feeAmount || 0) + platformFee

  return (
    <div>
      <Link href={`/student/events/${params.id}`} className="mb-6 inline-flex items-center gap-2 font-bold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Event
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order Summary */}
        <div className="order-2 lg:order-1">
          <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-foreground bg-muted p-4">
              <h2 className="text-xl font-black">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="mb-6 border-b-4 border-foreground/20 pb-6">
                <div className="mb-3 inline-block border-2 border-foreground bg-primary px-2 py-0.5 text-sm font-bold">{event.category}</div>
                <h3 className="mb-2 text-2xl font-black">{event.title}</h3>
                <p className="text-muted-foreground">by {event.clubName}</p>
              </div>

              <div className="mb-6 space-y-3 border-b-4 border-foreground/20 pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-muted"><Calendar className="h-5 w-5" /></div>
                  <div><p className="text-sm text-muted-foreground">Date</p><p className="font-bold">{new Date(event.eventDate).toLocaleDateString()}</p></div>
                </div>
                {event.venue && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-muted"><MapPin className="h-5 w-5" /></div>
                    <div><p className="text-sm text-muted-foreground">Venue</p><p className="font-bold">{event.venue}</p></div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between"><span>Event Fee</span><span className="font-bold">Rs. {event.feeAmount}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Platform Fee (2%)</span><span>Rs. {platformFee}</span></div>
                <div className="border-t-4 border-foreground pt-3">
                  <div className="flex justify-between"><span className="text-xl font-black">Total</span><span className="text-xl font-black">Rs. {total}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 border-4 border-foreground bg-primary/20 p-4">
            <Shield className="h-6 w-6" />
            <div>
              <p className="font-bold">Secure Checkout</p>
              <p className="text-sm text-muted-foreground">Your payment is protected by Razorpay</p>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="order-1 lg:order-2">
          <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-foreground bg-muted p-4">
              <h2 className="text-xl font-black">Payment Details</h2>
            </div>
            <div className="p-6">
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3 border-4 border-foreground bg-muted p-4">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="font-bold">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 border-4 border-foreground bg-muted p-4">
                <div className="flex items-center gap-3">
                  <input type="radio" id="razorpay" name="payment" defaultChecked className="h-5 w-5" />
                  <label htmlFor="razorpay" className="flex items-center gap-2">
                    <span className="font-bold">Razorpay</span>
                    <span className="text-sm text-muted-foreground">(Cards, UPI, Net Banking, Wallets)</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full border-4 border-foreground bg-primary py-6 text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                    Opening Razorpay...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Pay Rs. {total}</span>
                )}
              </Button>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
