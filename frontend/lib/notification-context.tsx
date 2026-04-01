"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type NotificationType = "success" | "error" | "warning" | "info"

export type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock initial notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Registration Confirmed",
    message: "You have successfully registered for Hackathon 2026",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Event Reminder",
    message: "Cultural Night starts tomorrow at 6:00 PM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Limited Spots",
    message: "Only 5 spots left for Music Workshop",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
  },
]

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])
    },
    []
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
