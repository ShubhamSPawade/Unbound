import Link from "next/link"
import { Infinity } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using Unbound, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.",
  },
  {
    title: "2. Use of the Platform",
    content: "Unbound is intended for use by students, clubs, and administrators of MITAOE. You agree to use the platform only for lawful purposes and in accordance with these terms.",
  },
  {
    title: "3. User Accounts",
    content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorised use of your account.",
  },
  {
    title: "4. Event Registration & Payments",
    content: "Registration fees are set by individual clubs. Payments are processed securely via Razorpay. Refund policies are determined by the organising club.",
  },
  {
    title: "5. Club Responsibilities",
    content: "Clubs are responsible for the accuracy of event information they publish. Clubs must comply with college policies and obtain necessary approvals.",
  },
  {
    title: "6. Intellectual Property",
    content: "All content on Unbound, including logos, design, and code, is the property of MITAOE / Unbound. You may not reproduce or distribute it without permission.",
  },
  {
    title: "7. Limitation of Liability",
    content: "Unbound is provided 'as is'. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
  },
  {
    title: "8. Changes to Terms",
    content: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.",
  },
]

export default function TermsPage() {
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
          <h1 className="mb-2 text-4xl font-black">Terms of Service</h1>
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
