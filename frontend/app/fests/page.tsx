import Link from "next/link"
import { Infinity, Calendar, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const fests = [
  {
    id: 1,
    name: "TechFest 2026",
    description: "Annual technology festival showcasing innovation, hackathons, robotics, and coding competitions.",
    startDate: "Apr 10, 2026",
    endDate: "Apr 15, 2026",
    events: 25,
    status: "active",
    color: "bg-primary",
  },
  {
    id: 2,
    name: "CultFest 2026",
    description: "Celebrate art, culture, music, dance, and performing talents from across the campus.",
    startDate: "May 1, 2026",
    endDate: "May 5, 2026",
    events: 18,
    status: "upcoming",
    color: "bg-secondary",
  },
  {
    id: 3,
    name: "SportsFest 2026",
    description: "Inter-college sports competition featuring cricket, football, athletics, and more.",
    startDate: "Jun 10, 2026",
    endDate: "Jun 15, 2026",
    events: 12,
    status: "upcoming",
    color: "bg-accent",
  },
]

const statusLabel: Record<string, string> = {
  active: "Happening Now",
  upcoming: "Upcoming",
  completed: "Completed",
}

export default function FestsPage() {
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
            <Link href="/login"><Button variant="outline" className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Login</Button></Link>
            <Link href="/signup"><Button className="border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">Sign Up</Button></Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-black md:text-5xl">Fests</h1>
          <p className="text-muted-foreground">All major college festivals at MITAOE</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {fests.map((fest) => (
            <div key={fest.id} className="border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1">
              <div className={`border-b-4 border-foreground ${fest.color} p-6`}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center border-4 border-foreground bg-card">
                    <Flag className="h-7 w-7" />
                  </div>
                  <span className="border-4 border-foreground bg-card px-3 py-1 text-sm font-black">
                    {statusLabel[fest.status]}
                  </span>
                </div>
                <h2 className="text-2xl font-black">{fest.name}</h2>
              </div>
              <div className="p-6">
                <p className="mb-4 text-muted-foreground">{fest.description}</p>
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold">{fest.startDate} – {fest.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold">{fest.events} events</span>
                  </div>
                </div>
                <Link href="/events">
                  <Button className="w-full border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                    View Events
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
