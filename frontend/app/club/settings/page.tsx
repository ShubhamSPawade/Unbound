"use client"

import { useState } from "react"
import { Building2, Mail, Phone, Globe, FileText, Lock, Bell, Save, Camera, Users, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/toast-provider"

export default function ClubSettingsPage() {
  const { success } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [clubData, setClubData] = useState({
    name: "Coding Club",
    email: "coding@university.edu",
    phone: "+91 9876543210",
    website: "https://codingclub.university.edu",
    description: "We build cool stuff with code! Join us for hackathons, workshops, and coding sessions.",
    category: "Technical",
    foundedYear: "2020",
    memberCount: "150",
    instagram: "@codingclub_uni",
    twitter: "@codingclub",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [settings, setSettings] = useState({
    publicProfile: true,
    allowFollowers: true,
    showMemberCount: true,
    emailNotifications: true,
  })

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    success("Club Profile Updated", "Your club profile has been saved successfully")
    setIsLoading(false)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    success("Password Changed", "Your password has been updated successfully")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setIsLoading(false)
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
              <p className="font-bold">{clubData.name}</p>
              <p className="text-sm text-muted-foreground">{clubData.category} Club</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="mb-2 flex items-center gap-2 font-bold">
                <Building2 className="h-4 w-4" />
                Club Name
              </Label>
              <Input
                id="name"
                value={clubData.name}
                onChange={(e) => setClubData({ ...clubData, name: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="mb-2 flex items-center gap-2 font-bold">
                <FileText className="h-4 w-4" />
                Description
              </Label>
              <Textarea
                id="description"
                value={clubData.description}
                onChange={(e) => setClubData({ ...clubData, description: e.target.value })}
                rows={4}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 flex items-center gap-2 font-bold">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={clubData.email}
                onChange={(e) => setClubData({ ...clubData, email: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 flex items-center gap-2 font-bold">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={clubData.phone}
                onChange={(e) => setClubData({ ...clubData, phone: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <Label htmlFor="website" className="mb-2 flex items-center gap-2 font-bold">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="website"
                value={clubData.website}
                onChange={(e) => setClubData({ ...clubData, website: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <Label htmlFor="category" className="mb-2 flex items-center gap-2 font-bold">
                Category
              </Label>
              <select
                id="category"
                value={clubData.category}
                onChange={(e) => setClubData({ ...clubData, category: e.target.value })}
                className="w-full border-4 border-foreground bg-background px-3 py-2 font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <option>Technical</option>
                <option>Cultural</option>
                <option>Sports</option>
                <option>Arts</option>
                <option>Music</option>
                <option>Literary</option>
              </select>
            </div>
            <div>
              <Label htmlFor="instagram" className="mb-2 flex items-center gap-2 font-bold">
                <Instagram className="h-4 w-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                value={clubData.instagram}
                onChange={(e) => setClubData({ ...clubData, instagram: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <Label htmlFor="twitter" className="mb-2 flex items-center gap-2 font-bold">
                <Twitter className="h-4 w-4" />
                Twitter
              </Label>
              <Input
                id="twitter"
                value={clubData.twitter}
                onChange={(e) => setClubData({ ...clubData, twitter: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
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
            <Switch
              checked={settings.publicProfile}
              onCheckedChange={(checked) => setSettings({ ...settings, publicProfile: checked })}
            />
          </div>
          <div className="flex items-center justify-between border-b-2 border-foreground/20 pb-4">
            <div>
              <p className="font-bold">Allow Followers</p>
              <p className="text-sm text-muted-foreground">Let students follow your club for updates</p>
            </div>
            <Switch
              checked={settings.allowFollowers}
              onCheckedChange={(checked) => setSettings({ ...settings, allowFollowers: checked })}
            />
          </div>
          <div className="flex items-center justify-between border-b-2 border-foreground/20 pb-4">
            <div>
              <p className="font-bold">Show Member Count</p>
              <p className="text-sm text-muted-foreground">Display the number of members publicly</p>
            </div>
            <Switch
              checked={settings.showMemberCount}
              onCheckedChange={(checked) => setSettings({ ...settings, showMemberCount: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates about registrations and events</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
