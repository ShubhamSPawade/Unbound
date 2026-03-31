"use client"

import { useState } from "react"
import { User, Mail, Phone, Building, GraduationCap, Lock, Bell, Moon, Save, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/toast-provider"

export default function StudentSettingsPage() {
  const { success } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Alex Student",
    email: "alex@university.edu",
    phone: "+91 9876543210",
    department: "Computer Science",
    year: "3rd Year",
    rollNumber: "CS2023045",
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

  const handleProfileSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    success("Profile Updated", "Your profile has been saved successfully")
    setIsLoading(false)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return
    }
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    success("Password Changed", "Your password has been updated successfully")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setIsLoading(false)
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
          {/* Avatar */}
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
              <p className="font-bold">{profileData.name}</p>
              <p className="text-sm text-muted-foreground">Student</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="mb-2 flex items-center gap-2 font-bold">
                <User className="h-4 w-4" />
                Full Name
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
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
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
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <Label htmlFor="rollNumber" className="mb-2 flex items-center gap-2 font-bold">
                <GraduationCap className="h-4 w-4" />
                Roll Number
              </Label>
              <Input
                id="rollNumber"
                value={profileData.rollNumber}
                disabled
                className="border-4 border-foreground bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="department" className="mb-2 flex items-center gap-2 font-bold">
                <Building className="h-4 w-4" />
                Department
              </Label>
              <Input
                id="department"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div>
              <Label htmlFor="year" className="mb-2 flex items-center gap-2 font-bold">
                <GraduationCap className="h-4 w-4" />
                Year
              </Label>
              <select
                id="year"
                value={profileData.year}
                onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                className="w-full border-4 border-foreground bg-background px-3 py-2 font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
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
            {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="mt-2 text-sm font-bold text-destructive">Passwords do not match</p>
            )}
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

      {/* Notifications Section */}
      <section className="border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-foreground bg-muted p-4">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between border-b-2 border-foreground/20 pb-4">
            <div>
              <p className="font-bold">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive email updates about your activity</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between border-b-2 border-foreground/20 pb-4">
            <div>
              <p className="font-bold">Event Reminders</p>
              <p className="text-sm text-muted-foreground">Get notified before events you&apos;ve registered for</p>
            </div>
            <Switch
              checked={notifications.eventReminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, eventReminders: checked })}
            />
          </div>
          <div className="flex items-center justify-between border-b-2 border-foreground/20 pb-4">
            <div>
              <p className="font-bold">Payment Alerts</p>
              <p className="text-sm text-muted-foreground">Receive updates about your payments and refunds</p>
            </div>
            <Switch
              checked={notifications.paymentAlerts}
              onCheckedChange={(checked) => setNotifications({ ...notifications, paymentAlerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Promotional Emails</p>
              <p className="text-sm text-muted-foreground">Receive news and offers from event organizers</p>
            </div>
            <Switch
              checked={notifications.promotionalEmails}
              onCheckedChange={(checked) => setNotifications({ ...notifications, promotionalEmails: checked })}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
