"use client"

import Link from "next/link"
import { Building2, Users, Calendar, TrendingUp, ArrowUp, ArrowDown, Shield, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"

const kpis = [
  { label: "Total Colleges", value: "12", change: "+2 this year", up: true, icon: Building2, color: "bg-primary" },
  { label: "College Admins", value: "24", change: "+4 this month", up: true, icon: Shield, color: "bg-secondary" },
  { label: "Total Students", value: "48,200", change: "+3,200 this sem", up: true, icon: Users, color: "bg-accent" },
  { label: "Total Events", value: "1,840", change: "+156 this month", up: true, icon: Calendar, color: "bg-card" },
]

const colleges = [
  { id: 1, name: "MITAOE", location: "Alandi, Pune", students: 4800, clubs: 24, events: 156, admins: 2, status: "active" },
  { id: 2, name: "MIT College of Engineering", location: "Kothrud, Pune", students: 6200, clubs: 31, events: 210, admins: 2, status: "active" },
  { id: 3, name: "Vishwakarma Institute", location: "Bibwewadi, Pune", students: 3900, clubs: 18, events: 98, admins: 1, status: "active" },
  { id: 4, name: "Symbiosis Institute", location: "Lavale, Pune", students: 5100, clubs: 22, events: 134, admins: 2, status: "active" },
]

const recentAdmins = [
  { name: "Rajesh Kumar", college: "MITAOE", email: "rajesh@mitaoe.ac.in", addedAt: "Mar 28, 2026", status: "active" },
  { name: "Priya Sharma", college: "MIT College", email: "priya@mitcoe.ac.in", addedAt: "Mar 25, 2026", status: "active" },
  { name: "Arun Patel", college: "Vishwakarma", email: "arun@vit.ac.in", addedAt: "Mar 20, 2026", status: "pending" },
]

export default function SuperAdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">University-wide platform overview</p>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className={`border-4 border-foreground ${k.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center border-4 border-foreground bg-card">
                <k.icon className="h-6 w-6" />
              </div>
              <span className={`flex items-center gap-1 border-2 border-foreground px-2 py-0.5 text-xs font-bold ${k.up ? "bg-primary" : "bg-destructive text-destructive-foreground"}`}>
                {k.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {k.change}
              </span>
            </div>
            <p className="text-3xl font-black">{k.value}</p>
            <p className="mt-1 font-bold">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Colleges Overview */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Colleges</h2>
            <Link href="/superadmin/colleges" className="text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="divide-y-4 divide-foreground">
            {colleges.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary font-black">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{c.students.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">students</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4">
            <Link href="/superadmin/colleges">
              <Button className="w-full border-4 border-foreground bg-primary font-bold text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                Manage Colleges
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Admins */}
        <div className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground p-4">
            <h2 className="text-xl font-black">Recent Admins</h2>
            <Link href="/superadmin/admins" className="text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="divide-y-4 divide-foreground">
            {recentAdmins.map((a) => (
              <div key={a.email} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-accent font-black">
                    {a.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.college}</p>
                  </div>
                </div>
                <span className={`border-2 border-foreground px-2 py-0.5 text-xs font-bold ${a.status === "active" ? "bg-primary" : "bg-accent"}`}>
                  {a.status}
                </span>
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
