"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Users, Calendar, TrendingUp, Shield, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { clubApi, eventApi, userApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function SuperAdminDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ events: 0, clubs: 0, admins: 0, registrations: 0 })
  const [recentAdmins, setRecentAdmins] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [eventsRes, clubsRes, usersRes] = await Promise.allSettled([
          eventApi.getAllEventsAdmin(),
          clubApi.getAllClubsAdmin(),
          userApi.getAllUsers(),
        ])
        const allEvents = eventsRes.status === "fulfilled" ? eventsRes.value.data.data || [] : []
        const allClubs = clubsRes.status === "fulfilled" ? clubsRes.value.data.data || [] : []
        const allUsers = usersRes.status === "fulfilled" ? usersRes.value.data.data || [] : []

        const totalRegs = allEvents.reduce((s: number, e: any) => s + (e.currentRegistrations || 0), 0)
        const admins = allUsers.filter((u: any) => u.role === "COLLEGE_ADMIN")

        setStats({ events: allEvents.length, clubs: allClubs.length, admins: admins.length, registrations: totalRegs })
        setRecentAdmins(admins.slice(0, 3))
      } catch { /* ignore */ } finally { setIsLoading(false) }
    }
    fetchData()
  }, [])
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.name}! University-wide platform overview.</p>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Events", value: stats.events, icon: Calendar, color: "bg-primary" },
          { label: "College Admins", value: stats.admins, icon: Shield, color: "bg-secondary" },
          { label: "Total Clubs", value: stats.clubs, icon: Building2, color: "bg-accent" },
          { label: "Total Registrations", value: stats.registrations, icon: Users, color: "bg-card" },
        ].map((k) => (
          <div key={k.label} className={`border-4 border-foreground ${k.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center border-4 border-foreground bg-card">
              <k.icon className="h-6 w-6" />
            </div>
            <p className="text-3xl font-black">{isLoading ? "—" : k.value}</p>
            <p className="mt-1 font-bold">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Stats */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Platform Info</h2>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between border-b-2 border-foreground/20 pb-3">
              <span className="font-bold">College</span>
              <span className="text-muted-foreground">MITAOE (Single College MVP)</span>
            </div>
            <div className="flex justify-between border-b-2 border-foreground/20 pb-3">
              <span className="font-bold">Total Events</span>
              <span className="font-black">{isLoading ? "—" : stats.events}</span>
            </div>
            <div className="flex justify-between border-b-2 border-foreground/20 pb-3">
              <span className="font-bold">Total Clubs</span>
              <span className="font-black">{isLoading ? "—" : stats.clubs}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Total Registrations</span>
              <span className="font-black">{isLoading ? "—" : stats.registrations}</span>
            </div>
          </div>
        </div>

        {/* Recent Admins */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Recent Admins</h2>
            <Link href="/superadmin/admins" className="text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="divide-y-4 divide-foreground">
            {recentAdmins.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No college admins yet</div>
            ) : recentAdmins.map((a) => (
              <div key={a.email} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-accent font-black">
                    {a.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-bold">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.email}</p>
                  </div>
                </div>
                <span className="border-2 border-foreground bg-primary px-2 py-0.5 text-xs font-bold">active</span>
              </div>
            ))}
          </div>
          <div className="p-4">
            <Link href="/superadmin/admins">
              <Button variant="outline" className="w-full border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                Manage Admins
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 border-4 border-foreground bg-accent p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-xl font-black">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { label: "Add College", href: "/superadmin/colleges", icon: Building2 },
            { label: "Add Admin", href: "/superadmin/admins", icon: Shield },
            { label: "View Analytics", href: "/superadmin/analytics", icon: TrendingUp },
          ].map((a) => (
            <Link key={a.label} href={a.href}>
              <Button variant="outline" className="border-4 border-foreground bg-card font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                <a.icon className="mr-2 h-4 w-4" />{a.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
