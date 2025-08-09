"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bold, Italic, List, Upload, ImageIcon, Eye, EyeOff } from 'lucide-react'

export interface ImageData {
  id: string
  dataUrl: string
  name: string
  placeholder: string
}

interface SimpleRichEditorProps {
  value: string
  onChange: (value: string) => void
  onImagesChange?: (images: ImageData[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SimpleRichEditor({
  value,
  onChange,
  onImagesChange,
  placeholder = "Start typing your content...",
  disabled = false,
  className = "",
}: SimpleRichEditorProps) {
  const [images, setImages] = useState<ImageData[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Simple text formatting functions
  const wrapSelection = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)
    
    onChange(newText)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  const formatBold = () => wrapSelection('**', '**')
  const formatItalic = () => wrapSelection('*', '*')
  const formatList = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newText = value.substring(0, lineStart) + '• ' + value.substring(lineStart)
    onChange(newText)
  }

  // Handle file upload
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) return

    setIsProcessing(true)

    try {
      const file = imageFiles[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        if (dataUrl) {
          const imageData: ImageData = {
            id: Date.now().toString(),
            dataUrl,
            name: file.name,
            placeholder: `[IMAGE:${file.name}]`,
          }

          setImages((prev) => {
            const newImages = [...prev, imageData]
            if (onImagesChange) onImagesChange(newImages)
            return newImages
          })

          // Insert placeholder in text
          const textarea = textareaRef.current
          if (textarea) {
            const start = textarea.selectionStart
            const newText = value.substring(0, start) + `\n\n${imageData.placeholder}\n\n` + value.substring(start)
            onChange(newText)
          }
        }
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Failed to process image:', error)
    }

    setIsProcessing(false)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [value, onChange, onImagesChange])

  // Convert markdown-like syntax to HTML for preview
  const getPreviewContent = () => {
    let html = value
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/\n/g, '<br />')

    // Replace image placeholders with actual images
    images.forEach((image) => {
      html = html.replace(
        image.placeholder,
        `<img src="${image.dataUrl}" alt="${image.name}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />`
      )
    })

    // Wrap list items in ul tags
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

    return html
  }

  return (
    <div className="space-y-4">
      {/* Simple Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border rounded-lg bg-gray-50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={formatBold}
          className="h-8"
          title="Bold (**text**)"
        >
          <Bold className="h-4 w-4 mr-1" />
          Bold
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={formatItalic}
          className="h-8"
          title="Italic (*text*)"
        >
          <Italic className="h-4 w-4 mr-1" />
          Italic
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={formatList}
          className="h-8"
          title="Bullet Point"
        >
          <List className="h-4 w-4 mr-1" />
          List
        </Button>

        <div className="w-px h-6 bg-gray-300" />

        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload} 
          className="hidden" 
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="h-8"
          title="Upload Image"
        >
          <Upload className="h-4 w-4 mr-1" />
          Image
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="h-8"
        >
          {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
          {showPreview ? 'Hide' : 'Preview'}
        </Button>

        {images.length > 0 && (
          <div className="flex items-center space-x-1 text-sm text-green-600 ml-2">
            <ImageIcon className="h-3 w-3" />
            <span>{images.length} image(s)</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <Alert className="border-blue-200 bg-blue-50">
        <ImageIcon className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <p>
            <strong>Formatting:</strong> Use **bold**, *italic*, and • for bullet points. Upload images or paste them directly.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isProcessing}
            className={`min-h-[300px] font-mono text-sm ${className}`}
            rows={15}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Preview:</h4>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
              style={{ lineHeight: "1.6", fontSize: "14px" }}
            />
          </div>
        )}
      </div>

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
                <div className="text-xs text-gray-500 mt-1 truncate">{image.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
