import Link from "next/link"
import { Infinity } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const sections = [
  {
    title: "1. Information We Collect",
    content: "We collect information you provide when registering (name, email, phone, department) and information generated through your use of the platform (event registrations, payment records).",
  },
  {
    title: "2. How We Use Your Information",
    content: "Your information is used to manage your account, process event registrations and payments, send event reminders, and improve the platform experience.",
  },
  {
    title: "3. Data Sharing",
    content: "We share your registration details with the organising club for events you register for. We do not sell your personal data to third parties.",
  },
  {
    title: "4. Payment Data",
    content: "Payment processing is handled by Razorpay. We do not store your card or banking details. Please review Razorpay's privacy policy for details.",
  },
  {
    title: "5. Cookies",
    content: "We use cookies to maintain your session and improve your experience. You can disable cookies in your browser settings, though some features may not work correctly.",
  },
  {
    title: "6. Data Security",
    content: "We implement reasonable security measures to protect your data. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "7. Your Rights",
    content: "You may request access to, correction of, or deletion of your personal data by contacting us. We will respond within 30 days.",
  },
  {
    title: "8. Contact",
    content: "For privacy-related queries, contact us at privacy@unbound.mitaoe.ac.in or visit our Contact page.",
  },
]

export default function PrivacyPage() {
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
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-black">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
        </div>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="mb-3 text-lg font-black">{s.title}</h2>
              <p className="text-muted-foreground">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border-4 border-foreground bg-muted p-4 text-center text-sm text-muted-foreground">
          Questions? <Link href="/contact" className="font-bold text-foreground underline">Contact us</Link>
        </div>
      </div>
    </div>
  )
}
