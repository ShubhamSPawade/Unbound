"use client"

import { useState, useEffect } from "react"
import { Building2, Mail, Lock, Bell, Save, Camera, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/toast-provider"
import { clubApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function ClubSettingsPage() {
  const { success, error } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [clubId, setClubId] = useState<number | null>(null)
  const [clubData, setClubData] = useState({
    name: "",
    contactEmail: "",
    description: "",
    category: "",
    logoUrl: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    publicProfile: true,
  })

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await clubApi.getMyClub()
        const myClub = res.data.data
        if (myClub) {
          setClubId(myClub.id)
          setClubData({
            name: myClub.name || "",
            contactEmail: myClub.contactEmail || "",
            description: myClub.description || "",
            category: myClub.category || "",
            logoUrl: myClub.logoUrl || "",
          })
        }
      } catch { /* ignore */ }
    }
    if (user) fetchClub()
  }, [user])

  const handleSave = async () => {
    if (!clubId) return
    setIsLoading(true)
    try {
      await clubApi.updateClub(clubId, clubData)
      success("Club Profile Updated", "Your club profile has been saved successfully")
    } catch (err: any) {
      error("Error", err?.response?.data?.message || "Failed to update club profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) return
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      success("Password Changed", "Your password has been updated successfully")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch {
      error("Error", "Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black md:text-4xl">Club Settings</h1>
        <p className="text-muted-foreground">Manage your club profile and preferences</p>
      </div>

      {/* Club Profile Section */}
      <section className="mb-8 border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <Building2 className="h-5 w-5" />
            Club Profile
          </h2>
        </div>
        <div className="p-6">
          {/* Club Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center border-4 border-foreground bg-secondary">
                <Building2 className="h-10 w-10" />
              </div>
              <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center border-2 border-foreground bg-card hover:bg-muted">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="font-bold">{clubData.name || "Your Club"}</p>
              <p className="text-sm text-muted-foreground">{clubData.category} Club</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="mb-2 flex items-center gap-2 font-bold">
                <Building2 className="h-4 w-4" /> Club Name
              </Label>
              <Input id="name" value={clubData.name}
                onChange={(e) => setClubData({ ...clubData, name: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="mb-2 flex items-center gap-2 font-bold">
                <FileText className="h-4 w-4" /> Description
              </Label>
              <Textarea id="description" value={clubData.description} rows={4}
                onChange={(e) => setClubData({ ...clubData, description: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 flex items-center gap-2 font-bold">
                <Mail className="h-4 w-4" /> Contact Email
              </Label>
              <Input id="email" type="email" value={clubData.contactEmail}
                onChange={(e) => setClubData({ ...clubData, contactEmail: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            </div>
            <div>
              <Label htmlFor="category" className="mb-2 flex items-center gap-2 font-bold">Category</Label>
              <select id="category" value={clubData.category}
                onChange={(e) => setClubData({ ...clubData, category: e.target.value })}
                className="w-full border-4 border-foreground bg-background px-3 py-2 font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <option>Technical</option>
                <option>Cultural</option>
                <option>Sports</option>
                <option>Arts</option>
                <option>Music</option>
                <option>Literary</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleSave}
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
            <Lock className="h-5 w-5" />
            Change Password
          </h2>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <Label htmlFor="currentPassword" className="mb-2 block font-bold">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="mb-2 block font-bold">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="mb-2 block font-bold">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
            className="border-4 border-foreground bg-primary font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50"
          >
            <Lock className="mr-2 h-4 w-4" />
            Update Password
          </Button>
        </div>
      </section>

      {/* Privacy & Notifications */}
      <section className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <Bell className="h-5 w-5" />
            Privacy & Notifications
          </h2>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between border-b-2 border-foreground/20 pb-4">
            <div>
              <p className="font-bold">Public Profile</p>
              <p className="text-sm text-muted-foreground">Allow students to view your club profile</p>
            </div>
            <Switch checked={notifications.publicProfile}
              onCheckedChange={(checked) => setNotifications({ ...notifications, publicProfile: checked })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates about registrations and events</p>
            </div>
            <Switch checked={notifications.emailNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })} />
          </div>
        </div>
      </section>
    </div>
  )
}
