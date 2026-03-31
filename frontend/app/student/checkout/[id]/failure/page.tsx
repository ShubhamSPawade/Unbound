"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { XCircle, RefreshCw, MessageCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentFailurePage() {
  const params = useParams()

  // Mock error details
  const errorCode = "ERR_PAYMENT_DECLINED"
  const transactionId = `TXN${Date.now().toString().slice(-10)}`

  const troubleshootingTips = [
    "Check if your card has sufficient balance",
    "Ensure your card is enabled for online transactions",
    "Try using a different payment method (UPI, Net Banking, etc.)",
    "Check your internet connection and try again",
    "Contact your bank if the issue persists",
  ]

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Failure Card */}
        <div className="border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Failure Header */}
          <div className="border-b-4 border-foreground bg-destructive p-8 text-center text-destructive-foreground">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center border-4 border-destructive-foreground bg-card">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="mb-2 text-3xl font-black">Payment Failed</h1>
            <p className="text-lg">Your payment could not be processed</p>
          </div>

          {/* Error Details */}
          <div className="border-b-4 border-foreground bg-muted p-6">
            <h3 className="mb-4 font-black">Error Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Error Code</span>
                <span className="font-mono font-bold text-destructive">{errorCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono font-bold">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="border-2 border-foreground bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                  FAILED
                </span>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="border-b-4 border-foreground p-6">
            <h3 className="mb-4 font-black">Troubleshooting Tips</h3>
            <ul className="space-y-2">
              {troubleshootingTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border-2 border-foreground bg-muted text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3 p-6">
            <Link href={`/student/checkout/${params.id}`} className="block">
              <Button className="w-full border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Get Help
              </Button>
              <Link href={`/student/events/${params.id}`} className="block">
                <Button
                  variant="outline"
                  className="w-full border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 border-4 border-foreground bg-accent/20 p-4 text-center">
          <p className="text-sm">
            <strong>Note:</strong> If any amount was deducted, it will be refunded
            within 5-7 business days.
          </p>
        </div>
      </div>
    </div>
  )
}
