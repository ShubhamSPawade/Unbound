"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { authApi, userApi, setAuthToken } from "./api"

export type UserRole = "student" | "club" | "admin" | "superadmin"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  department?: string
  collegeName?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

type SignupData = {
  name: string
  email: string
  password: string
  role: string
  phone?: string
  department?: string
  collegeId?: number
}

// Map backend roles to frontend roles
const mapRole = (backendRole: string): UserRole => {
  const map: Record<string, UserRole> = {
    STUDENT: "student",
    CLUB_ADMIN: "club",
    COLLEGE_ADMIN: "admin",
    SUPER_ADMIN: "superadmin",
  }
  return map[backendRole] ?? "student"
}

// Map frontend roles to backend roles
const mapRoleToBackend = (frontendRole: string): string => {
  const map: Record<string, string> = {
    student: "STUDENT",
    club: "CLUB_ADMIN",
    admin: "COLLEGE_ADMIN",
    superadmin: "SUPER_ADMIN",
  }
  return map[frontendRole] ?? "STUDENT"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (storedToken && storedUser) {
      setAuthToken(storedToken)
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(email, password)
      const { token: jwt, name, email: userEmail, role } = res.data.data

      const mappedUser: User = {
        id: "",
        name,
        email: userEmail,
        role: mapRole(role),
      }

      // Set token immediately so subsequent API calls work
      localStorage.setItem("token", jwt)
      setAuthToken(jwt)
      try {
        const profileRes = await userApi.getMe()
        const profile = profileRes.data.data
        mappedUser.id = String(profile.id)
        mappedUser.phone = profile.phone
        mappedUser.department = profile.department
        mappedUser.collegeName = profile.college
      } catch {
        // profile fetch failed — continue with basic info
      }
      localStorage.setItem("user", JSON.stringify(mappedUser))
      setToken(jwt)
      setUser(mappedUser)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true)
    try {
      const res = await authApi.register({
        ...data,
        role: mapRoleToBackend(data.role),
      })
      const { token: jwt, name, email, role } = res.data.data

      const mappedUser: User = {
        id: "",
        name,
        email,
        role: mapRole(role),
        phone: data.phone,
        department: data.department,
      }

      localStorage.setItem("token", jwt)
      localStorage.setItem("user", JSON.stringify(mappedUser))
      setToken(jwt)
      setUser(mappedUser)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setAuthToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true)
    try {
      await userApi.updateMe({
        name: data.name,
        phone: data.phone,
        department: data.department,
      })
      const updated = { ...user, ...data } as User
      localStorage.setItem("user", JSON.stringify(updated))
      setUser(updated)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
