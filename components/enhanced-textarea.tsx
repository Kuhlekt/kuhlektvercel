"use client"

import type React from "react"
import type { ReactElement } from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ImageIcon, Upload, AlertCircle, CheckCircle, X } from "lucide-react"

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
  placeholder,
  rows = 10,
  disabled = false,
  className = "",
}: EnhancedTextareaProps): ReactElement {
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastAction, setLastAction] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [images, setImages] = useState<ImageData[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Notify parent when images change and update global reference
  useEffect(() => {
    if (onImagesChange) {
      onImagesChange(images)
    }
    // Update global reference for article viewer to access
    ;(window as any).textareaImages = images
    console.log("Updated global textareaImages:", images)
  }, [images, onImagesChange])

  // Generate unique placeholder for image
  const generateImagePlaceholder = (imageName: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    return `[IMAGE:${id}:${imageName}]`
  }

  // Simple function to insert text at cursor
  const insertAtCursor = useCallback(
    (textToInsert: string) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + textToInsert + value.substring(end)

      onChange(newValue)

      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus()
        const newPosition = start + textToInsert.length
        textarea.setSelectionRange(newPosition, newPosition)
      }, 0)
    },
    [value, onChange],
  )

  // Handle paste events
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const clipboardData = e.clipboardData
      if (!clipboardData) return

      // Check for image files first
      const files = Array.from(clipboardData.files)
      const imageFiles = files.filter((f) => f.type.startsWith("image/"))

      if (imageFiles.length > 0) {
        e.preventDefault()
        setIsProcessing(true)
        setError("")

        try {
          const file = imageFiles[0]
          const reader = new FileReader()

          reader.onload = (event) => {
            const dataUrl = event.target?.result as string
            if (dataUrl) {
              const imageName = file.name || "pasted-image"
              const placeholder = generateImagePlaceholder(imageName)

              const imageData: ImageData = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                dataUrl,
                name: imageName,
                placeholder,
              }

              console.log("Adding image to textarea:", imageData.placeholder)
              setImages((prev) => {
                const newImages = [...prev, imageData]
                console.log("Updated images array:", newImages)
                return newImages
              })
              insertAtCursor(`\n\n${placeholder}\n\n`)
              setLastAction(`Image pasted: ${imageName}`)
            }
          }

          reader.onerror = () => {
            setError("Failed to read image file")
          }

          reader.readAsDataURL(file)
        } catch (error) {
          setError("Failed to process pasted image")
        }

        setIsProcessing(false)
        return
      }

      // Check for image items if no files
      const items = Array.from(clipboardData.items)
      const imageItems = items.filter((i) => i.type.startsWith("image/"))

      if (imageItems.length > 0) {
        e.preventDefault()
        setIsProcessing(true)
        setError("")

        try {
          const item = imageItems[0]
          const file = item.getAsFile()

          if (file) {
            const reader = new FileReader()

            reader.onload = (event) => {
              const dataUrl = event.target?.result as string
              if (dataUrl) {
                const imageName = file.name || "clipboard-image"
                const placeholder = generateImagePlaceholder(imageName)

                const imageData: ImageData = {
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                  dataUrl,
                  name: imageName,
                  placeholder,
                }

                console.log("Adding clipboard image:", imageData.placeholder)
                setImages((prev) => {
                  const newImages = [...prev, imageData]
                  console.log("Updated images array:", newImages)
                  return newImages
                })
                insertAtCursor(`\n\n${placeholder}\n\n`)
                setLastAction(`Image pasted from clipboard`)
              }
            }

            reader.onerror = () => {
              setError("Failed to read clipboard image")
            }

            reader.readAsDataURL(file)
          }
        } catch (error) {
          setError("Failed to process clipboard image")
        }

        setIsProcessing(false)
      }
    },
    [insertAtCursor],
  )

  // Handle file upload
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      const imageFiles = files.filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length === 0) return

      setIsProcessing(true)
      setError("")

      try {
        const file = imageFiles[0]
        const reader = new FileReader()

        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          if (dataUrl) {
            const imageName = file.name
            const placeholder = generateImagePlaceholder(imageName)

            const imageData: ImageData = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              dataUrl,
              name: imageName,
              placeholder,
            }

            setImages((prev) => [...prev, imageData])
            insertAtCursor(`\n\n${placeholder}\n\n`)
            setLastAction(`File uploaded: ${imageName}`)
          }
        }

        reader.onerror = () => {
          setError("Failed to read uploaded file")
        }

        reader.readAsDataURL(file)
      } catch (error) {
        setError("Failed to process uploaded file")
      }

      setIsProcessing(false)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [insertAtCursor],
  )

  // Remove image
  const removeImage = useCallback(
    (imageId: string) => {
      setImages((prev) => {
        const imageToRemove = prev.find((img) => img.id === imageId)
        if (imageToRemove) {
          // Remove placeholder from text
          const newValue = value.replace(imageToRemove.placeholder, "")
          onChange(newValue)
        }
        return prev.filter((img) => img.id !== imageId)
      })
    },
    [value, onChange],
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center space-x-1"
          >
            <Upload className="h-3 w-3" />
            <span>Upload Image</span>
          </Button>
        </div>

        {images.length > 0 && (
          <div className="flex items-center space-x-1 text-sm text-green-600">
            <ImageIcon className="h-3 w-3" />
            <span>{images.length} image(s)</span>
          </div>
        )}
      </div>

      <Alert>
        <ImageIcon className="h-4 w-4" />
        <AlertDescription>
          <p>
            <strong>Paste images directly:</strong> Copy any image and press Ctrl+V (or Cmd+V on Mac)
          </p>
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {lastAction && !error && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-700">{lastAction}</AlertDescription>
        </Alert>
      )}

      {/* Show attached images */}
      {images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Attached Images:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.dataUrl || "/placeholder.svg"}
                  alt={image.name}
                  className="w-full h-20 object-cover rounded border"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="text-xs text-gray-500 mt-1 truncate">{image.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled || isProcessing}
          className={`${className} ${isProcessing ? "opacity-50" : ""}`}
        />

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Processing image...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
