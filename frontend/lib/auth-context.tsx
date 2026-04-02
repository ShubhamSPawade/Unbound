"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

const AUTH_STORAGE_KEY = "unbound_auth_user"
const AUTH_COOKIE_NAME = "unbound_auth_role"

function setAuthCookie(role: string) {
  const secure = location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${AUTH_COOKIE_NAME}=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`
}

export type UserRole = "student" | "club" | "admin" | "superadmin"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  department?: string
  year?: string
  clubName?: string
  clubDescription?: string
  collegeName?: string
}

type AuthContextType = {
  user: User | null
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
  role: UserRole
  phone?: string
  department?: string
  year?: string
  clubName?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users — one per role
const mockUsers: Record<string, User & { password: string }> = {
  "student@unbound.com": {
    id: "1",
    name: "Alex Student",
    email: "student@unbound.com",
    password: "password",
    role: "student",
    phone: "+91 9876543210",
    department: "Computer Science",
    year: "3rd Year",
  },
  "club@unbound.com": {
    id: "2",
    name: "Tech Club",
    email: "club@unbound.com",
    password: "password",
    role: "club",
    clubName: "Coding Club",
    clubDescription: "We build cool stuff with code!",
  },
  "admin@unbound.com": {
    id: "3",
    name: "Admin User",
    email: "admin@unbound.com",
    password: "password",
    role: "admin",
    phone: "+91 9876543211",
    department: "Administration",
    collegeName: "MITAOE",
  },
  "superadmin@unbound.com": {
    id: "4",
    name: "Super Admin",
    email: "superadmin@unbound.com",
    password: "password",
    role: "superadmin",
    phone: "+91 9876543212",
    department: "University Administration",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Rehydrate from localStorage on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const parsed: User = JSON.parse(stored)
        setUser(parsed)
        setAuthCookie(parsed.role)
      }
    } catch (err) {
      console.warn("[AuthProvider] Failed to restore session from localStorage:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const persistUser = useCallback((userData: User) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
    setAuthCookie(userData.role)
    setUser(userData)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const mockUser = mockUsers[email]
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userData } = mockUser
      persistUser(userData)
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    throw new Error("Invalid email or password")
  }, [persistUser])

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      department: data.department,
      year: data.year,
      clubName: data.clubName,
    }
    persistUser(newUser)
    setIsLoading(false)
  }, [persistUser])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    clearAuthCookie()
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setUser((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...data }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout, updateProfile }}>
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
