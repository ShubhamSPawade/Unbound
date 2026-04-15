"use client"

import { useState, useRef } from "react"
import { Upload, Link, X, Image as ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Banner Image" }: ImageUploadProps) {
  const [mode, setMode] = useState<"url" | "upload">("url")
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value || "")
  const fileRef = useRef<HTMLInputElement>(null)

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!cloudName || !uploadPreset || cloudName === "your_cloudinary_cloud_name") {
      // Fallback: use local object URL for preview (won't persist)
      const localUrl = URL.createObjectURL(file)
      setPreview(localUrl)
      onChange(localUrl)
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      )
      const data = await res.json()
      if (data.secure_url) {
        setPreview(data.secure_url)
        onChange(data.secure_url)
      }
    } catch {
      // ignore upload error
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlChange = (url: string) => {
    setPreview(url)
    onChange(url)
  }

  const handleClear = () => {
    setPreview("")
    onChange("")
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <div>
      <Label className="mb-2 block font-bold">{label} (optional)</Label>

      {/* Mode Toggle */}
      <div className="mb-3 flex gap-2">
        <button type="button" onClick={() => setMode("url")}
          className={`border-4 border-foreground px-3 py-1.5 text-sm font-bold transition-all ${mode === "url" ? "bg-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>
          <Link className="mr-1 inline h-3 w-3" />URL
        </button>
        <button type="button" onClick={() => setMode("upload")}
          className={`border-4 border-foreground px-3 py-1.5 text-sm font-bold transition-all ${mode === "upload" ? "bg-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "bg-card hover:bg-muted"}`}>
          <Upload className="mr-1 inline h-3 w-3" />Upload
        </button>
      </div>

      {mode === "url" ? (
        <Input value={value} onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/banner.jpg"
          className="border-4 border-foreground bg-background px-4 py-5 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
      ) : (
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange}
            className="hidden" id="banner-file-input" />
          <label htmlFor="banner-file-input"
            className="flex cursor-pointer items-center justify-center gap-2 border-4 border-dashed border-foreground bg-muted p-6 font-bold transition-all hover:bg-muted/80">
            {isUploading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                Uploading...
              </span>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Click to upload image
              </>
            )}
          </label>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative mt-3">
          <img src={preview} alt="Banner preview"
            className="h-32 w-full border-4 border-foreground object-cover"
            onError={() => setPreview("")} />
          <button type="button" onClick={handleClear}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center border-2 border-foreground bg-card hover:bg-destructive hover:text-destructive-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!preview && (
        <div className="mt-3 flex h-20 items-center justify-center border-4 border-dashed border-foreground/30 bg-muted/30">
          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
        </div>
      )}
    </div>
  )
}
