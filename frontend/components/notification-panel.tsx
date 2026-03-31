"use client"

import { useState } from "react"
import { Bell, X, CheckCircle2, AlertCircle, AlertTriangle, Info, Check } from "lucide-react"
import { useNotifications, type Notification } from "@/lib/notification-context"
import { cn } from "@/lib/utils"

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: "bg-primary/20 border-primary",
  error: "bg-destructive/20 border-destructive",
  warning: "bg-accent/20 border-accent",
  info: "bg-secondary/20 border-secondary",
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function NotificationItem({
  notification,
  onMarkRead,
  onRemove,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
  onRemove: (id: string) => void
}) {
  const Icon = icons[notification.type]

  return (
    <div
      className={cn(
        "border-b-2 border-foreground/20 p-4 last:border-b-0",
        !notification.read && "bg-muted/50"
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border-2",
            styles[notification.type]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={cn("font-bold", !notification.read && "text-foreground")}>
              {notification.title}
            </p>
            <div className="flex shrink-0 gap-1">
              {!notification.read && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="p-1 hover:bg-muted"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onRemove(notification.id)}
                className="p-1 hover:bg-muted"
                title="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatTime(notification.timestamp)}
          </p>
        </div>
      </div>
    </div>
  )
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications()

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center border-4 border-foreground bg-card"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center border-2 border-foreground bg-accent text-xs font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:w-96">
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-foreground p-4">
              <h3 className="font-black">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm font-bold text-muted-foreground hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notifications list */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="font-bold text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={markAsRead}
                    onRemove={removeNotification}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
