"use client"

import { useState, useEffect } from "react"
import { Palette, X, Check } from "lucide-react"

type Theme = {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
}

const themes: Theme[] = [
  { id: "default", name: "Green",   primary: "#4ade80", secondary: "#fde68a", accent: "#fb923c" },
  { id: "ocean",   name: "Ocean",   primary: "#3b82f6", secondary: "#67e8f9", accent: "#22d3ee" },
  { id: "rose",    name: "Rose",    primary: "#f43f5e", secondary: "#fda4af", accent: "#e879f9" },
  { id: "violet",  name: "Violet",  primary: "#8b5cf6", secondary: "#d8b4fe", accent: "#818cf8" },
  { id: "amber",   name: "Amber",   primary: "#f59e0b", secondary: "#fef08a", accent: "#fb923c" },
  { id: "teal",    name: "Teal",    primary: "#14b8a6", secondary: "#6ee7b7", accent: "#38bdf8" },
  { id: "mono",    name: "Mono",    primary: "#1a1a1a", secondary: "#d4d4d4", accent: "#737373" },
  { id: "crimson", name: "Crimson", primary: "#dc2626", secondary: "#fbbf24", accent: "#ea580c" },
  { id: "mint",    name: "Mint",    primary: "#34d399", secondary: "#bbf7d0", accent: "#6ee7b7" },
  { id: "sunset",  name: "Sunset",  primary: "#f97316", secondary: "#fca5a5", accent: "#f472b6" },
  { id: "sky",     name: "Sky",     primary: "#0ea5e9", secondary: "#c4b5fd", accent: "#7dd3fc" },
  { id: "forest",  name: "Forest",  primary: "#166534", secondary: "#d97706", accent: "#92400e" },
  { id: "candy",   name: "Candy",   primary: "#ec4899", secondary: "#a3e635", accent: "#fbbf24" },
]

const STORAGE_KEY = "unbound-theme"

function applyTheme(id: string) {
  const html = document.documentElement
  // Remove all theme classes
  themes.forEach((t) => html.classList.remove(`theme-${t.id}`))
  if (id !== "default") {
    html.classList.add(`theme-${id}`)
  }
  localStorage.setItem(STORAGE_KEY, id)
}

export function ThemePicker() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("default")

  // Restore saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? "default"
    setActive(saved)
    applyTheme(saved)
  }, [])

  const select = (id: string) => {
    setActive(id)
    applyTheme(id)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Panel */}
      {open && (
        <div className="mb-3 w-64 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-4 border-foreground px-4 py-3">
            <span className="font-black">Themes</span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center border-2 border-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 p-4">
            {themes.map((t) => {
              const isActive = active === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => select(t.id)}
                  className={`group relative border-4 border-foreground p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    isActive ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : ""
                  }`}
                >
                  {/* Color swatches */}
                  <div className="mb-2 flex gap-1">
                    <span
                      className="h-5 w-5 border-2 border-foreground/30"
                      style={{ backgroundColor: t.primary }}
                    />
                    <span
                      className="h-5 w-5 border-2 border-foreground/30"
                      style={{ backgroundColor: t.secondary }}
                    />
                    <span
                      className="h-5 w-5 border-2 border-foreground/30"
                      style={{ backgroundColor: t.accent }}
                    />
                  </div>
                  <span className="text-sm font-bold">{t.name}</span>

                  {/* Active checkmark */}
                  {isActive && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center border-2 border-foreground bg-primary">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center border-4 border-foreground bg-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        title="Change theme"
        aria-label="Open theme picker"
      >
        <Palette className="h-6 w-6" />
      </button>
    </div>
  )
}
