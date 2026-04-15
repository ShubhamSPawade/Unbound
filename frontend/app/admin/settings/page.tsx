"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Lock, Bell, Shield, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/toast-provider"
import { useAuth } from "@/lib/auth-context"

export default function AdminSettingsPage() {
  const { success, error } = useToast()
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "", department: "" })
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [notifications, setNotifications] = useState({
    newClubRequests: true, eventApprovals: true, systemAlerts: true, dailyReports: false,
  })

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || "", email: user.email || "", phone: user.phone || "", department: user.department || "" })
    }
  }, [user])

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      await updateProfile({ name: profileData.name, phone: profileData.phone, department: profileData.department })
      success("Profile Updated", "Your profile has been saved successfully")
    } catch { error("Error", "Failed to update profile") } finally { setIsLoading(false) }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) return
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      success("Password Changed", "Your password has been updated successfully")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch { error("Error", "Failed to change password") } finally { setIsLoading(false) }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Profile */}
      <section className="mb-8 border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black"><User className="h-5 w-5" />Admin Profile</h2>
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center border-4 border-foreground bg-accent">
              <Shield className="h-10 w-10" />
            </div>
            <div>
              <p className="font-bold">{user?.name}</p>
              <p className="inline-block border-2 border-foreground bg-accent px-2 py-0.5 text-sm font-bold capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="mb-2 flex items-center gap-2 font-bold"><User className="h-4 w-4" />Full Name</Label>
              <Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 flex items-center gap-2 font-bold"><Mail className="h-4 w-4" />Email</Label>
              <Input id="email" value={profileData.email} disabled className="border-4 border-foreground bg-muted" />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 flex items-center gap-2 font-bold"><Phone className="h-4 w-4" />Phone</Label>
              <Input id="phone" type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            </div>
            <div>
              <Label htmlFor="dept" className="mb-2 flex items-center gap-2 font-bold"><Shield className="h-4 w-4" />Department</Label>
              <Input id="dept" value={profileData.department} onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            </div>
          </div>
          <Button onClick={handleProfileSave} disabled={isLoading}
            className="mt-6 border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <Save className="mr-2 h-4 w-4" />{isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </section>

      {/* Password */}
      <section className="mb-8 border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black"><Lock className="h-5 w-5" />Change Password</h2>
        </div>
        <div className="space-y-4 p-6">
          {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="mb-2 block font-bold capitalize">{field.replace(/([A-Z])/g, " $1")}</Label>
              <Input id={field} type="password" value={passwordData[field as keyof typeof passwordData]}
                onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            </div>
          ))}
          {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
            <p className="text-sm font-bold text-destructive">Passwords do not match</p>
          )}
          <Button onClick={handlePasswordChange}
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
            className="border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50">
            <Lock className="mr-2 h-4 w-4" />Update Password
          </Button>
        </div>
      </section>

      {/* Notifications */}
      <section className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black"><Bell className="h-5 w-5" />Admin Notifications</h2>
        </div>
        <div className="space-y-4 p-6">
          {[
            { key: "newClubRequests", label: "New Club Requests", desc: "Get notified when new clubs request approval" },
            { key: "eventApprovals", label: "Event Approvals", desc: "Notify when events are pending approval" },
            { key: "systemAlerts", label: "System Alerts", desc: "Critical system alerts and security notifications" },
            { key: "dailyReports", label: "Daily Reports", desc: "Receive daily summary reports via email" },
          ].map(({ key, label, desc }, i, arr) => (
            <div key={key} className={`flex items-center justify-between ${i < arr.length - 1 ? "border-b-2 border-foreground/20 pb-4" : ""}`}>
              <div><p className="font-bold">{label}</p><p className="text-sm text-muted-foreground">{desc}</p></div>
              <Switch checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
