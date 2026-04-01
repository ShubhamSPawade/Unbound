"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Infinity, Home, Building2, Users, BarChart3, Settings, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Dashboard", href: "/superadmin", icon: Home },
  { label: "Colleges", href: "/superadmin/colleges", icon: Building2 },
  { label: "Admins", href: "/superadmin/admins", icon: Users },
  { label: "Analytics", href: "/superadmin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/superadmin/settings", icon: Settings },
]

export function SuperAdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r-4 border-foreground bg-card lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b-4 border-foreground p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-xl font-black tracking-tight">UNBOUND</span>
          </Link>
        </div>

        <div className="border-b-4 border-foreground p-4">
          <div className="inline-flex items-center gap-2 border-4 border-foreground bg-accent px-3 py-1.5 font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Shield className="h-4 w-4" />
            Super Admin
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {nav.map((item) => {
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
