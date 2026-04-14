"use client"

import Link from "next/link"
import { useState } from "react"
import { Infinity, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset logic
    console.log({ email })
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Decorative */}
      <div className="hidden w-1/2 border-r-4 border-foreground bg-accent lg:block">
        <div className="flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-card">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight">UNBOUND</span>
          </Link>
          <div>
            <h2 className="mb-4 text-5xl font-black leading-tight">
              {"DON'T"}<br />WORRY.
            </h2>
            <p className="max-w-md text-lg font-medium text-foreground/80">
              {"It happens to the best of us. We'll help you get back into your account in no time."}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-4 border-4 border-foreground bg-card"></div>
            <div className="h-4 w-4 border-4 border-foreground bg-primary"></div>
            <div className="h-4 w-4 border-4 border-foreground bg-secondary"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col bg-background lg:w-1/2">
        <div className="flex items-center justify-between border-b-4 border-foreground p-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-4 border-foreground bg-primary">
              <Infinity className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight">UNBOUND</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-16">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/login"
              className="inline-flex w-fit items-center gap-2 font-bold hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>

          {!submitted ? (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center border-4 border-foreground bg-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Mail className="h-8 w-8" />
              </div>
              <h1 className="mb-2 text-4xl font-black">Reset Password</h1>
              <p className="mb-8 text-muted-foreground">
                {"Enter your email address and we'll send you a link to reset your password."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="mb-2 block font-bold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@mitaoe.ac.in"
                    className="border-4 border-foreground bg-card px-4 py-6 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-muted-foreground focus:translate-x-1 focus:translate-y-1 focus:shadow-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full border-4 border-foreground bg-primary py-6 text-lg font-bold text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-4 border-foreground bg-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h1 className="mb-2 text-4xl font-black">Check Your Email</h1>
              <p className="mb-8 text-muted-foreground">
                {"We've sent a password reset link to"}{" "}
                <span className="font-bold text-foreground">{email}</span>
              </p>
              <p className="mb-8 text-sm text-muted-foreground">
                {"Didn't receive the email? Check your spam folder or"}{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-bold text-foreground underline"
                >
                  try again
                </button>
              </p>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-4 border-foreground font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
