"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Lock, Bell, Shield, Save, Globe, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/toast-provider"
import { useAuth } from "@/lib/auth-context"

export default function SuperAdminSettingsPage() {
  const { success, error } = useToast()
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", department: "" })
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })
  const [platform, setPlatform] = useState({
    allowNewColleges: true, requireCollegeApproval: true, maintenanceMode: false, maxCollegesPerAdmin: "3",
  })
  const [notifications, setNotifications] = useState({
    newCollegeRequests: true, adminActivity: true, systemAlerts: true, weeklyReports: true,
  })

  useEffect(() => {
    if (user) setProfile({ name: user.name || "", email: user.email || "", phone: user.phone || "", department: user.department || "" })
  }, [user])

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      await updateProfile({ name: profile.name, phone: profile.phone, department: profile.department })
      success("Saved", "Profile updated successfully")
    } catch { error("Error", "Failed to update profile") } finally { setIsLoading(false) }
  }

  const inputCls = "border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Super Admin Settings</h1>
        <p className="text-muted-foreground">Manage your account and platform-wide settings</p>
      </div>

      {/* Profile */}
      <section className="mb-8 border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black"><User className="h-5 w-5" />Profile</h2>
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center border-4 border-foreground bg-accent">
              <Shield className="h-10 w-10" />
            </div>
            <div>
              <p className="font-bold">{user?.name}</p>
              <span className="border-2 border-foreground bg-accent px-2 py-0.5 text-sm font-bold">Super Admin</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { id: "name", label: "Full Name", icon: User, value: profile.name, key: "name" },
              { id: "email", label: "Email", icon: Mail, value: profile.email, key: "email", type: "email" },
              { id: "phone", label: "Phone", icon: Phone, value: profile.phone, key: "phone", type: "tel" },
              { id: "dept", label: "Department", icon: Shield, value: profile.department, key: "department" },
            ].map(({ id, label, icon: Icon, value, key, type }) => (
              <div key={id}>
                <Label htmlFor={id} className="mb-2 flex items-center gap-2 font-bold"><Icon className="h-4 w-4" />{label}</Label>
                <Input id={id} type={type ?? "text"} value={value} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} className={inputCls} />
              </div>
            ))}
          </div>
          <Button onClick={handleProfileSave} disabled={isLoading} className="mt-6 border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <Save className="mr-2 h-4 w-4" />{isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </section>

      {/* Platform Settings */}
      <section className="mb-8 border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-accent p-4">
          <h2 className="flex items-center gap-2 text-xl font-black"><Globe className="h-5 w-5" />Platform Settings</h2>
        </div>
        <div className="p-6">
          <div className="mb-6 space-y-4">
            {[
              { key: "allowNewColleges", label: "Allow New College Registrations", desc: "Let new colleges join the platform" },
              { key: "requireCollegeApproval", label: "Require College Approval", desc: "New colleges need super admin approval" },
              { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily disable the platform" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between border-b-2 border-foreground/20 pb-4 last:border-0 last:pb-0">
                <div><p className="font-bold">{label}</p><p className="text-sm text-muted-foreground">{desc}</p></div>
                <Switch checked={platform[key as keyof typeof platform] as boolean} onCheckedChange={(v) => setPlatform({ ...platform, [key]: v })} />
              </div>
            ))}
          </div>
          <div>
            <Label htmlFor="maxColleges" className="mb-2 block font-bold">Max Colleges per Admin</Label>
            <Input id="maxColleges" type="number" value={platform.maxCollegesPerAdmin} onChange={(e) => setPlatform({ ...platform, maxCollegesPerAdmin: e.target.value })} className={`max-w-xs ${inputCls}`} />
          </div>
          <Button onClick={() => success("Saved", "Platform settings updated")} disabled={isLoading} className="mt-6 border-4 border-foreground bg-accent font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            <Database className="mr-2 h-4 w-4" />Save Platform Settings
          </Button>
        </div>
      </section>

      {/* Password */}
      <section className="mb-8 border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black"><Lock className="h-5 w-5" />Change Password</h2>
        </div>
        <div className="space-y-4 p-6">
          {[
            { id: "cur", label: "Current Password", key: "current" },
            { id: "new", label: "New Password", key: "next" },
            { id: "con", label: "Confirm New Password", key: "confirm" },
          ].map(({ id, label, key }) => (
            <div key={id}>
              <Label htmlFor={id} className="mb-2 block font-bold">{label}</Label>
              <Input id={id} type="password" value={passwords[key as keyof typeof passwords]} onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })} className={inputCls} />
            </div>
          ))}
          <Button
            onClick={() => { success("Saved", "Password updated successfully"); setPasswords({ current: "", next: "", confirm: "" }) }}
            disabled={isLoading || !passwords.current || !passwords.next || passwords.next !== passwords.confirm}
            className="border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
          >
            <Lock className="mr-2 h-4 w-4" />Update Password
          </Button>
        </div>
      </section>

      {/* Notifications */}
      <section className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black"><Bell className="h-5 w-5" />Notifications</h2>
        </div>
        <div className="space-y-4 p-6">
          {[
            { key: "newCollegeRequests", label: "New College Requests", desc: "When a new college requests to join" },
            { key: "adminActivity", label: "Admin Activity", desc: "When college admins perform key actions" },
            { key: "systemAlerts", label: "System Alerts", desc: "Critical platform alerts" },
            { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly platform summary" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between border-b-2 border-foreground/20 pb-4 last:border-0 last:pb-0">
              <div><p className="font-bold">{label}</p><p className="text-sm text-muted-foreground">{desc}</p></div>
              <Switch checked={notifications[key as keyof typeof notifications]} onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
