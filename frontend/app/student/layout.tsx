"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useRequireAuth } from "@/hooks/use-require-auth"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth("student")

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin border-4 border-foreground border-t-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar role="student" />
      <div className="lg:ml-64">
        <DashboardHeader role="student" userName={user.name} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
