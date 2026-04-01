import Link from "next/link"
import { Infinity, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const faqs = [
  { q: "How do I register for an event?", a: "Sign up as a student, browse events on your dashboard, and click Register. For paid events, you'll be taken to the checkout page." },
  { q: "How do I create a club account?", a: "Click Sign Up on the landing page and select 'Club'. Fill in your club details and submit for admin approval." },
  { q: "Can I get a refund after registering?", a: "Refund policies are set by individual clubs. Contact the organising club directly for refund requests." },
  { q: "How do I create an event as a club?", a: "Log in to your club dashboard and click 'Create Event'. Fill in all required details and submit for admin approval." },
  { q: "What payment methods are supported?", a: "We support UPI, credit/debit cards, net banking, and wallets via Razorpay." },
  { q: "How do I contact an event organiser?", a: "Visit the event details page — the organising club's contact info is listed there." },
  { q: "I forgot my password. What do I do?", a: "Click 'Forgot password?' on the login page and enter your email. You'll receive a reset link." },
  { q: "How do I download my event ticket?", a: "After successful payment, go to the success page or My Events to download your ticket." },
]

export default function HelpPage() {
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

      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-black md:text-5xl">Help Center</h1>
          <p className="text-muted-foreground">Frequently asked questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start gap-4 p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border-4 border-foreground bg-primary font-black text-sm">
                  {i + 1}
                </span>
                <div>
                  <p className="mb-2 font-black">{faq.q}</p>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-4 border-foreground bg-secondary p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-4 text-lg font-black">Still need help?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 border-4 border-foreground bg-card px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            Contact Us <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
