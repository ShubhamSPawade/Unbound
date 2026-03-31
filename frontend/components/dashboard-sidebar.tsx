"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Infinity, Home, Calendar, Users, Settings, LogOut, PlusCircle, BarChart3, Building2, Flag, User, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

type SidebarProps = {
  role: "student" | "club" | "admin"
}

const studentNav: NavItem[] = [
  { label: "Explore", href: "/student", icon: Home },
  { label: "My Events", href: "/student/my-events", icon: Calendar },
  { label: "Transactions", href: "/student/transactions", icon: CreditCard },
  { label: "Settings", href: "/student/settings", icon: Settings },
]

const clubNav: NavItem[] = [
  { label: "Dashboard", href: "/club", icon: Home },
  { label: "Create Event", href: "/club/create", icon: PlusCircle },
  { label: "My Events", href: "/club/events", icon: Calendar },
  { label: "Registrations", href: "/club/registrations", icon: Users },
  { label: "Settings", href: "/club/settings", icon: Settings },
]

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Fests", href: "/admin/fests", icon: Flag },
  { label: "Clubs", href: "/admin/clubs", icon: Building2 },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

const navMap = {
  student: studentNav,
  club: clubNav,
  admin: adminNav,
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const navItems = navMap[role]

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r-4 border-foreground bg-card lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b-4 border-foreground p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-xl font-black tracking-tight">UNBOUND</span>
          </Link>
        </div>

        {/* Role Badge */}
        <div className="border-b-4 border-foreground p-4">
          <div className={cn(
            "inline-flex items-center gap-2 border-4 border-foreground px-3 py-1.5 font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
            role === "student" && "bg-primary",
            role === "club" && "bg-secondary",
            role === "admin" && "bg-accent"
          )}>
            <User className="h-4 w-4" />
            {role}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 border-4 border-foreground px-4 py-3 font-bold transition-all",
                  isActive
                    ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-card hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t-4 border-foreground p-4">
          <Link
            href="/login"
            className="flex items-center gap-3 border-4 border-foreground bg-card px-4 py-3 font-bold transition-all hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </div>
    </aside>
  )
}
