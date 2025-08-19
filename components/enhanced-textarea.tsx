"use client"

import type React from "react"
import type { ReactElement } from "react"
import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

export interface ImageData {
  id: string
  dataUrl: string
  name: string
  placeholder: string
}

interface EnhancedTextareaProps {
  value: string
  onChange: (value: string) => void
  onImagesChange?: (images: ImageData[]) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  className?: string
}

export function EnhancedTextarea({
  value,
  onChange,
  onImagesChange,
  placeholder = "Write your content here...",
  rows = 10,
  disabled = false,
  className = "",
}: EnhancedTextareaProps): ReactElement {
  const [images, setImages] = useState<ImageData[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Initialize with existing images from global storage
    const existingImages = (window as any).textareaImages || []
    if (existingImages.length > 0) {
      setImages(existingImages)
    }
  }, [])

  useEffect(() => {
    // Update global storage when images change
    ;(window as any).textareaImages = images
    if (onImagesChange) {
      onImagesChange(images)
    }
    console.log("Enhanced textarea images updated:", images)
  }, [images, onImagesChange])

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items)
    const imageItems = items.filter((item) => item.type.startsWith("image/"))

    if (imageItems.length > 0) {
      e.preventDefault()

      for (const item of imageItems) {
        const file = item.getAsFile()
        if (file) {
          await processImageFile(file)
        }
      }
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

    for (const file of files) {
      await processImageFile(file)
    }
  }

  const processImageFile = async (file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file)
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 5)
      const placeholder = `[IMAGE:${id}:${file.name}]`

      const newImage: ImageData = {
        id,
        dataUrl,
        name: file.name,
        placeholder,
      }

      console.log("Processing new image:", newImage)

      // Add image to state
      setImages((prev) => [...prev, newImage])

      // Insert placeholder at cursor position
      if (textareaRef.current) {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newValue = value.substring(0, start) + "\n" + placeholder + "\n" + value.substring(end)
        onChange(newValue)

        // Restore cursor position
        setTimeout(() => {
          const newPosition = start + placeholder.length + 2
          textarea.setSelectionRange(newPosition, newPosition)
          textarea.focus()
        }, 0)
      }
    } catch (error) {
      console.error("Error processing image:", error)
    }
  }

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-2">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`min-h-[200px] resize-none ${className}`}
      />
      {images.length > 0 && (
        <div className="text-xs text-gray-500">
          {images.length} image{images.length !== 1 ? "s" : ""} attached
        </div>
      )}
    </div>
  )
}
