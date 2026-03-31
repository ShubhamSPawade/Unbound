"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Infinity, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldError } from "@/components/field-error"
import { useAuth } from "@/lib/auth-context"
import { useFormValidation, validators } from "@/hooks/use-form-validation"
import { ThemeToggle } from "@/components/theme-toggle"

const roleRedirects = { student: "/student", club: "/club", admin: "/admin", superadmin: "/superadmin" }

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<"student" | "club" | "admin" | "superadmin">("student")
  const [serverError, setServerError] = useState("")

  const { values, errors, setValue, handleBlur, validate } = useFormValidation(
    { email: "", password: "" },
    {
      email: validators.email,
      password: validators.minLength(6, "Password"),
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setServerError("")
    try {
      await login(values.email, values.password)
      router.push(roleRedirects[role])
    } catch {
      setServerError("Invalid email or password. Try student@unbound.com / password")
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden w-1/2 border-r-4 border-foreground bg-primary lg:block">
        <div className="flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-card">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight">UNBOUND</span>
          </Link>
          <div>
            <h2 className="mb-4 text-5xl font-black leading-tight">WELCOME<br />BACK.</h2>
            <p className="mb-8 max-w-md text-lg font-medium text-foreground/80">
              Sign in to access your dashboard, manage events, and stay connected with your campus community.
            </p>
            <div className="space-y-1.5 border-4 border-foreground bg-card/20 p-4">
              <p className="text-sm font-black">Demo Credentials</p>
              <p className="font-mono text-sm">student@unbound.com / password</p>
              <p className="font-mono text-sm">club@unbound.com / password</p>
              <p className="font-mono text-sm">admin@unbound.com / password</p>
              <p className="font-mono text-sm">superadmin@unbound.com / password</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-4 border-4 border-foreground bg-card" />
            <div className="h-4 w-4 border-4 border-foreground bg-secondary" />
            <div className="h-4 w-4 border-4 border-foreground bg-accent" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col bg-background lg:w-1/2">
        <div className="flex items-center border-b-4 border-foreground p-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight">UNBOUND</span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-16">
          <div className="flex items-center justify-between">
            <Link href="/" className="mb-8 inline-flex w-fit items-center gap-2 font-bold hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>

          <h1 className="mb-2 text-4xl font-black">Login</h1>
          <p className="mb-8 text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/signup" className="font-bold text-foreground underline">Sign up</Link>
          </p>

          {/* Role Selector */}
          <div className="mb-6">
            <Label className="mb-3 block font-bold">I am a</Label>
            <div className="flex flex-wrap gap-2">
              {(["student", "club", "admin", "superadmin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 border-4 border-foreground px-3 py-3 font-bold uppercase transition-all text-sm ${
                    role === r ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"
                  }`}
                >
                  {r === "superadmin" ? "Super Admin" : r}
                </button>
              ))}
            </div>
          </div>

          {serverError && (
            <div className="mb-4 border-4 border-destructive bg-destructive/10 p-3 text-sm font-bold text-destructive">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="email" className="mb-2 block font-bold">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => setValue("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="you@mitaoe.ac.in"
                className={`border-4 bg-card px-4 py-6 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-muted-foreground focus:translate-x-1 focus:translate-y-1 focus:shadow-none ${
                  errors.email ? "border-destructive" : "border-foreground"
                }`}
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="password" className="font-bold">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={(e) => setValue("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter your password"
                  className={`border-4 bg-card px-4 py-6 pr-12 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-muted-foreground focus:translate-x-1 focus:translate-y-1 focus:shadow-none ${
                    errors.password ? "border-destructive" : "border-foreground"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-4 border-foreground bg-primary py-6 text-lg font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
