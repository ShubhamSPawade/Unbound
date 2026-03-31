"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sparkles, Menu, X, Search, User, Home, Calendar, Users, Settings, LogOut, PlusCircle, BarChart3, Building2, Flag, CreditCard, Sun, Moon, Infinity } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { NotificationPanel } from "@/components/notification-panel"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

type HeaderProps = {
  role: "student" | "club" | "admin"
  userName?: string
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

export function DashboardHeader({ role, userName = "User" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const navItems = navMap[role]
  const { theme, setTheme } = useTheme()

  return (
    <>
      <header className="sticky top-0 z-30 border-b-4 border-foreground bg-card">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-card"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center border-4 border-foreground bg-primary">
                <Infinity className="h-4 w-4 text-foreground" />
              </div>
              <span className="text-lg font-black">UNBOUND</span>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden flex-1 px-8 lg:block">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events, clubs..."
                className="border-4 border-foreground bg-background pl-12 font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-card lg:hidden"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-card transition-colors hover:bg-muted"
              title="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>
            <NotificationPanel />
            <Link
              href={`/${role}/settings`}
              className="hidden items-center gap-2 border-4 border-foreground bg-muted px-3 py-1.5 transition-colors hover:bg-muted/80 lg:flex"
            >
              <div className="flex h-7 w-7 items-center justify-center border-2 border-foreground bg-primary">
                <User className="h-4 w-4" />
              </div>
              <span className="font-bold">{userName}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="border-t-4 border-foreground p-4 lg:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events, clubs..."
                className="border-4 border-foreground bg-background pl-12 font-medium"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r-4 border-foreground bg-card">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b-4 border-foreground p-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
                    <Infinity className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="text-xl font-black">UNBOUND</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-card"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

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

              <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 border-4 border-foreground px-4 py-3 font-bold transition-all",
                        isActive
                          ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-card"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

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
          </div>
        </div>
      )}
    </>
  )
}
