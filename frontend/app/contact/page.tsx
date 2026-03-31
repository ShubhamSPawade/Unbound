"use client"

import { useState } from "react"
import Link from "next/link"
import { Infinity, Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ContactPage() {
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
            <Link href="/"><Button variant="outline" className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">← Back</Button></Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-black md:text-5xl">Contact Us</h1>
          <p className="text-muted-foreground">Get in touch with the Unbound team</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "support@unbound.mitaoe.ac.in" },
              { icon: Phone, label: "Phone", value: "+91 20 1234 5678" },
              { icon: MapPin, label: "Address", value: "MITAOE, Alandi, Pune – 412105" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-foreground bg-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black">{label}</p>
                  <p className="text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center border-4 border-foreground bg-primary">
                  <Send className="h-8 w-8" />
                </div>
                <h2 className="mb-2 text-2xl font-black">Message Sent!</h2>
                <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
                <h2 className="mb-4 text-xl font-black">Send a Message</h2>
                <div>
                  <Label htmlFor="name" className="mb-2 block font-bold">Name</Label>
                  <Input id="name" placeholder="Your name" required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2 block font-bold">Email</Label>
                  <Input id="email" type="email" placeholder="you@mitaoe.ac.in" required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
                </div>
                <div>
                  <Label htmlFor="subject" className="mb-2 block font-bold">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
                </div>
                <div>
                  <Label htmlFor="message" className="mb-2 block font-bold">Message</Label>
                  <Textarea id="message" rows={4} placeholder="Your message..." required className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
                </div>
                <Button type="submit" className="w-full border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
