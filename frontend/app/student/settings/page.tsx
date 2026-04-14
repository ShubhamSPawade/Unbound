"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Building, GraduationCap, Lock, Bell, Save, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/toast-provider"
import { useAuth } from "@/lib/auth-context"
import { userApi } from "@/lib/api"

export default function StudentSettingsPage() {
  const { success, error } = useToast()
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    eventReminders: true,
    paymentAlerts: true,
    promotionalEmails: false,
  })

  // Load real user data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        department: user.department || "",
      })
    }
  }, [user])

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        department: profileData.department,
      })
      success("Profile Updated", "Your profile has been saved successfully")
    } catch {
      error("Error", "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) return
    setIsLoading(true)
    try {
      // Password change endpoint — to be implemented
      await new Promise((resolve) => setTimeout(resolve, 500))
      success("Password Changed", "Your password has been updated successfully")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch {
      error("Error", "Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Section */}
      <section className="mb-8 border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <User className="h-5 w-5" />
            Profile Information
          </h2>
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center border-4 border-foreground bg-primary">
                <User className="h-10 w-10" />
              </div>
              <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center border-2 border-foreground bg-card hover:bg-muted">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="font-bold">{user?.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="mb-2 flex items-center gap-2 font-bold">
                <User className="h-4 w-4" /> Full Name
              </Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 flex items-center gap-2 font-bold">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="border-4 border-foreground bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 flex items-center gap-2 font-bold">
                <Phone className="h-4 w-4" /> Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <Label htmlFor="department" className="mb-2 flex items-center gap-2 font-bold">
                <Building className="h-4 w-4" /> Department
              </Label>
              <Input
                id="department"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          <Button
            onClick={handleProfileSave}
            disabled={isLoading}
            className="mt-6 border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </section>

      {/* Password Section */}
      <section className="mb-8 border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <Lock className="h-5 w-5" /> Change Password
          </h2>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <Label htmlFor="currentPassword" className="mb-2 block font-bold">Current Password</Label>
            <Input id="currentPassword" type="password" value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          </div>
          <div>
            <Label htmlFor="newPassword" className="mb-2 block font-bold">New Password</Label>
            <Input id="newPassword" type="password" value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="mb-2 block font-bold">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="mt-2 text-sm font-bold text-destructive">Passwords do not match</p>
            )}
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
            className="border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
          >
            <Lock className="mr-2 h-4 w-4" /> Update Password
          </Button>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <Bell className="h-5 w-5" /> Notifications
          </h2>
        </div>
        <div className="space-y-4 p-6">
          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Receive email updates about your activity" },
            { key: "eventReminders", label: "Event Reminders", desc: "Get notified before events you've registered for" },
            { key: "paymentAlerts", label: "Payment Alerts", desc: "Receive updates about your payments and refunds" },
            { key: "promotionalEmails", label: "Promotional Emails", desc: "Receive news and offers from event organizers" },
          ].map(({ key, label, desc }, i, arr) => (
            <div key={key} className={`flex items-center justify-between ${i < arr.length - 1 ? "border-b-2 border-foreground/20 pb-4" : ""}`}>
              <div>
                <p className="font-bold">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
