"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

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
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const mockUser = mockUsers[email]
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userData } = mockUser
      setUser(userData)
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    throw new Error("Invalid email or password")
  }, [])

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
    setUser(newUser)
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setUser((prev) => (prev ? { ...prev, ...data } : null))
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
