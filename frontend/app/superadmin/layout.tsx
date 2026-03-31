"use client"

import { useRequireAuth } from "@/hooks/use-require-auth"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { SuperAdminHeader } from "@/components/superadmin-header"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth("superadmin")

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin border-4 border-foreground border-t-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="lg:ml-64">
        <SuperAdminHeader userName={user.name} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
