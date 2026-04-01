"use client"

import Link from "next/link"
import { Calendar, Users, Infinity, ArrowRight, Music, Code, Palette, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const categories = [
  { name: "Technical", icon: Code, color: "bg-primary" },
  { name: "Cultural", icon: Music, color: "bg-secondary" },
  { name: "Arts", icon: Palette, color: "bg-accent" },
  { name: "Sports", icon: Trophy, color: "bg-primary" },
]

const featuredEvents = [
  {
    id: 1,
    title: "Hackathon 2026",
    date: "Apr 15, 2026",
    category: "Technical",
    club: "Coding Club",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Cultural Night",
    date: "Apr 20, 2026",
    category: "Cultural",
    club: "Drama Society",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Art Exhibition",
    date: "Apr 25, 2026",
    category: "Arts",
    club: "Fine Arts Club",
    image: "/placeholder.svg",
  },
]

const stats = [
  { value: "500+", label: "Events Hosted" },
  { value: "50+", label: "Active Clubs" },
  { value: "10K+", label: "Students" },
  { value: "25+", label: "Fests" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b-4 border-foreground bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight">UNBOUND</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/events" className="font-bold hover:underline">Events</Link>
            <Link href="/clubs" className="font-bold hover:underline">Clubs</Link>
            <Link href="/fests" className="font-bold hover:underline">Fests</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b-4 border-foreground bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit border-4 border-foreground bg-secondary px-4 py-1 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              MITAOE Event Hub
            </div>
            <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight md:text-7xl">
              YOUR CAMPUS.<br />
              <span className="text-primary">UNBOUND.</span>
            </h1>
            <p className="mb-8 max-w-md text-lg font-medium text-muted-foreground">
              Discover events, join clubs, and experience the best of college life. One platform for students, clubs, and administrators.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button size="lg" className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline" className="border-4 border-foreground font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -right-4 -top-4 h-full w-full border-4 border-foreground bg-secondary"></div>
            <div className="relative grid h-full grid-cols-2 gap-4 border-4 border-foreground bg-card p-6">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className={`flex flex-col items-center justify-center border-4 border-foreground ${category.color} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <category.icon className="mb-2 h-10 w-10" />
                  <span className="font-bold">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b-4 border-foreground bg-primary">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center border-foreground p-8 ${index < stats.length - 1 ? "border-r-4" : ""}`}
            >
              <span className="text-4xl font-black md:text-5xl">{stat.value}</span>
              <span className="font-bold text-foreground/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b-4 border-foreground bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">WHY UNBOUND?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to make the most of your college experience
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-4 border-foreground bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center border-4 border-foreground bg-primary">
                <Calendar className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-2xl font-black">Discover Events</h3>
              <p className="text-muted-foreground">
                Browse through hundreds of events across all categories. Filter by date, type, or club to find what interests you.
              </p>
            </div>
            <div className="border-4 border-foreground bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center border-4 border-foreground bg-secondary">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-2xl font-black">Join Clubs</h3>
              <p className="text-muted-foreground">
                Connect with like-minded students. Join clubs that match your interests and be part of something bigger.
              </p>
            </div>
            <div className="border-4 border-foreground bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center border-4 border-foreground bg-accent">
                <Infinity className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-2xl font-black">Experience Fests</h3>
              <p className="text-muted-foreground">
                Never miss a fest again. Get all the details about upcoming festivals and register with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="border-b-4 border-foreground bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">UPCOMING EVENTS</h2>
            <Link href="/events">
              <Button variant="outline" className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredEvents.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id}>
                <div className="group border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="aspect-video border-b-4 border-foreground bg-muted"></div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="border-2 border-foreground bg-primary px-2 py-0.5 text-sm font-bold">
                        {event.category}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">{event.date}</span>
                    </div>
                    <h3 className="mb-1 text-xl font-black group-hover:underline">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">by {event.club}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b-4 border-foreground bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">READY TO GET STARTED?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground/80">
            Join thousands of students already using Unbound to discover and participate in campus events.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup?role=student">
              <Button size="lg" className="border-4 border-foreground bg-card font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Join as Student
              </Button>
            </Link>
            <Link href="/signup?role=club">
              <Button size="lg" className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Register Club
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-foreground bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
                  <Infinity className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-2xl font-black">UNBOUND</span>
              </div>
              <p className="text-muted-foreground">
                The centralized platform for college event management at MITAOE.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-black">PLATFORM</h4>
              <ul className="space-y-2">
                <li><Link href="/events" className="text-muted-foreground hover:underline">Events</Link></li>
                <li><Link href="/clubs" className="text-muted-foreground hover:underline">Clubs</Link></li>
                <li><Link href="/fests" className="text-muted-foreground hover:underline">Fests</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-black">ROLES</h4>
              <ul className="space-y-2">
                <li><Link href="/student" className="text-muted-foreground hover:underline">Students</Link></li>
                <li><Link href="/club" className="text-muted-foreground hover:underline">Clubs</Link></li>
                <li><Link href="/admin" className="text-muted-foreground hover:underline">Admins</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-black">CONNECT</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-muted-foreground hover:underline">Contact Us</Link></li>
                <li><Link href="/help" className="text-muted-foreground hover:underline">Help Center</Link></li>
                <li><Link href="/feedback" className="text-muted-foreground hover:underline">Feedback</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t-4 border-foreground pt-8 text-center">
            <p className="font-medium text-muted-foreground">
              &copy; 2026 Unbound. Built for MITAOE.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
