"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Menu, X, Shield, User, Home, Building2, Users, BarChart3, Settings, LogOut, Infinity } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationPanel } from "@/components/notification-panel"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Dashboard", href: "/superadmin", icon: Home },
  { label: "Colleges", href: "/superadmin/colleges", icon: Building2 },
  { label: "Admins", href: "/superadmin/admins", icon: Users },
  { label: "Analytics", href: "/superadmin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/superadmin/settings", icon: Settings },
]

export function SuperAdminHeader({ userName }: { userName: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-30 border-b-4 border-foreground bg-card">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-card"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center border-4 border-foreground bg-primary">
                <Infinity className="h-4 w-4" />
              </div>
              <span className="text-lg font-black">UNBOUND</span>
            </Link>
          </div>

          <div className="hidden flex-1 px-8 lg:block">
            <p className="font-bold text-muted-foreground">University Administration Panel</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationPanel />
            <Link
              href="/superadmin/settings"
              className="hidden items-center gap-2 border-4 border-foreground bg-muted px-3 py-1.5 transition-colors hover:bg-muted/80 lg:flex"
            >
              <div className="flex h-7 w-7 items-center justify-center border-2 border-foreground bg-accent">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-bold">{userName}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r-4 border-foreground bg-card">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b-4 border-foreground p-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
                    <Infinity className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-black">UNBOUND</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="flex h-10 w-10 items-center justify-center border-4 border-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="border-b-4 border-foreground p-4">
                <div className="inline-flex items-center gap-2 border-4 border-foreground bg-accent px-3 py-1.5 font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Shield className="h-4 w-4" />
                  Super Admin
                </div>
              </div>
              <nav className="flex-1 space-y-2 p-4">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 border-4 border-foreground px-4 py-3 font-bold transition-all",
                      pathname === item.href ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t-4 border-foreground p-4">
                <Link href="/login" className="flex items-center gap-3 border-4 border-foreground bg-card px-4 py-3 font-bold hover:bg-destructive hover:text-destructive-foreground">
                  <LogOut className="h-5 w-5" /> Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
