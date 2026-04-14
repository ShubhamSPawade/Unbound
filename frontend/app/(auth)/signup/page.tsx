"use client"

import Link from "next/link"
import { useState, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Infinity, ArrowLeft, Eye, EyeOff, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldError } from "@/components/field-error"
import { useAuth } from "@/lib/auth-context"
import { useFormValidation, validators } from "@/hooks/use-form-validation"
import { ThemeToggle } from "@/components/theme-toggle"

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = (searchParams.get("role") as "student" | "club") || "student"
  const { signup, isLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<"student" | "club">(initialRole)
  const [serverError, setServerError] = useState("")
  const [password, setPasswordState] = useState("")

  const rules = useMemo(
    () => ({
      ...(role === "club" ? { clubName: validators.required("Club name") } : {}),
      name: validators.required(role === "club" ? "Representative name" : "Full name"),
      email: validators.email,
      password: validators.minLength(6, "Password"),
      confirmPassword: validators.confirmPassword(password),
    }),
    [role, password]
  )

  const { values, errors, setValue, handleBlur, validate } = useFormValidation(
    { clubName: "", name: "", email: "", password: "", confirmPassword: "" },
    rules
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setServerError("")
    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
        role,
        clubName: role === "club" ? values.clubName : undefined,
      })
      router.push(role === "club" ? "/club" : "/student")
    } catch {
      setServerError("Something went wrong. Please try again.")
    }
  }

  const inputClass = (field: keyof typeof values) =>
    `border-4 bg-card px-4 py-6 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-muted-foreground focus:translate-x-1 focus:translate-y-1 focus:shadow-none ${
      errors[field] ? "border-destructive" : "border-foreground"
    }`

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden w-1/2 border-r-4 border-foreground bg-secondary lg:block">
        <div className="flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-card">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight">UNBOUND</span>
          </Link>
          <div>
            <h2 className="mb-4 text-5xl font-black leading-tight">JOIN THE<br />COMMUNITY.</h2>
            <p className="mb-6 max-w-md text-lg font-medium text-foreground/80">
              Create your account and unlock access to all campus events, clubs, and fests.
            </p>
            <ul className="space-y-3">
              {["Discover and register for events", "Connect with clubs and societies", "Get personalized recommendations", "Never miss a campus fest"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium">
                  <div className="flex h-6 w-6 items-center justify-center border-2 border-foreground bg-card">
                    <Check className="h-4 w-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-4 border-4 border-foreground bg-card" />
            <div className="h-4 w-4 border-4 border-foreground bg-primary" />
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

          <h1 className="mb-2 text-4xl font-black">Create Account</h1>
          <p className="mb-8 text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-foreground underline">Sign in</Link>
          </p>

          {/* Role Selector */}
          <div className="mb-6">
            <Label className="mb-3 block font-bold">I want to register as</Label>
            <div className="flex gap-3">
              {(["student", "club"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 border-4 border-foreground px-4 py-3 font-bold uppercase transition-all ${
                    role === r ? "bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"
                  }`}
                >
                  {r}
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
            {role === "club" && (
              <div>
                <Label htmlFor="clubName" className="mb-2 block font-bold">Club Name</Label>
                <Input
                  id="clubName"
                  value={values.clubName}
                  onChange={(e) => setValue("clubName", e.target.value)}
                  onBlur={() => handleBlur("clubName")}
                  placeholder="Your club's name"
                  className={inputClass("clubName")}
                />
                <FieldError message={errors.clubName} />
              </div>
            )}

            <div>
              <Label htmlFor="name" className="mb-2 block font-bold">
                {role === "club" ? "Representative Name" : "Full Name"}
              </Label>
              <Input
                id="name"
                value={values.name}
                onChange={(e) => setValue("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder={role === "club" ? "Club representative" : "Your full name"}
                className={inputClass("name")}
              />
              <FieldError message={errors.name} />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block font-bold">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => setValue("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="you@mitaoe.ac.in"
                className={inputClass("email")}
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 block font-bold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={(e) => { setValue("password", e.target.value); setPasswordState(e.target.value) }}
                  onBlur={() => handleBlur("password")}
                  placeholder="Create a strong password"
                  className={`${inputClass("password")} pr-12`}
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

            <div>
              <Label htmlFor="confirmPassword" className="mb-2 block font-bold">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={(e) => setValue("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Confirm your password"
                className={inputClass("confirmPassword")}
              />
              <FieldError message={errors.confirmPassword} />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-4 border-foreground bg-primary py-6 text-lg font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="font-medium underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium underline">Privacy Policy</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}
