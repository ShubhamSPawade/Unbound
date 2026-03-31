"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth-context"

export const roleHome: Record<UserRole, string> = {
  student: "/student",
  club: "/club",
  admin: "/admin",
  superadmin: "/superadmin",
}

export function useRequireAuth(requiredRole?: UserRole) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace("/login")
      return
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(roleHome[user.role])
    }
  }, [user, isLoading, requiredRole, router])

  return { user, isLoading }
}
