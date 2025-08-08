"use client"

import type React from "react"
import type { ReactElement } from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Palette, Type, ImageIcon, Upload, AlertCircle, CheckCircle, X, Undo, Redo } from 'lucide-react'

const isBrowser = typeof window !== 'undefined'

export interface ImageData {
  id: string
  dataUrl: string
  name: string
  placeholder: string
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  onImagesChange?: (images: ImageData[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  onImagesChange,
  placeholder = "Start typing your content...",
  disabled = false,
  className = "",
}: RichTextEditorProps): ReactElement {
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastAction, setLastAction] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [images, setImages] = useState<ImageData[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontSizePicker, setShowFontSizePicker] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Notify parent when images change
  useEffect(() => {
    if (onImagesChange) {
      onImagesChange(images)
    }
  }, [images, onImagesChange])

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
    }
  }, [onChange])

  // Execute formatting command
  const executeCommand = useCallback((command: string, value?: string) => {
    if (!isBrowser) return
  
    try {
      document.execCommand(command, false, value)
      editorRef.current?.focus()
      handleContentChange()
    } catch (error) {
      console.warn('Command execution failed:', command, error)
    }
  }, [handleContentChange])

  // Format text commands
  const formatBold = () => executeCommand('bold')
  const formatItalic = () => executeCommand('italic')
  const formatUnderline = () => executeCommand('underline')
  const formatBulletList = () => executeCommand('insertUnorderedList')
  const formatNumberedList = () => executeCommand('insertOrderedList')
  const formatAlignLeft = () => executeCommand('justifyLeft')
  const formatAlignCenter = () => executeCommand('justifyCenter')
  const formatAlignRight = () => executeCommand('justifyRight')
  const formatUndo = () => executeCommand('undo')
  const formatRedo = () => executeCommand('redo')

  // Color and font size options
  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
    '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#0066FF',
    '#6600FF', '#FF0066', '#8B4513', '#2E8B57', '#4682B4'
  ]

  const fontSizes = [
    { label: 'Small', value: '12px' },
    { label: 'Normal', value: '14px' },
    { label: 'Medium', value: '16px' },
    { label: 'Large', value: '18px' },
    { label: 'X-Large', value: '24px' },
    { label: 'XX-Large', value: '32px' }
  ]

  // Apply color
  const applyColor = (color: string) => {
    executeCommand('foreColor', color)
    setShowColorPicker(false)
  }

  // Apply font size
  const applyFontSize = (size: string) => {
    if (!isBrowser) return
  
    try {
      executeCommand('fontSize', '3') // Reset to medium first
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const span = document.createElement('span')
        span.style.fontSize = size
        try {
          range.surroundContents(span)
        } catch (e) {
          // If can't surround, insert at cursor
          span.innerHTML = range.toString()
          range.deleteContents()
          range.insertNode(span)
        }
      }
      setShowFontSizePicker(false)
      handleContentChange()
    } catch (error) {
      console.warn('Font size application failed:', error)
      setShowFontSizePicker(false)
    }
  }

  // Generate unique placeholder for image
  const generateImagePlaceholder = (imageName: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    return `[IMAGE:${id}:${imageName}]`
  }

  // Insert image at cursor
  const insertImageAtCursor = useCallback((imageData: ImageData) => {
    if (editorRef.current) {
      const img = document.createElement('img')
      img.src = imageData.dataUrl
      img.alt = imageData.name
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
      img.style.margin = '10px 0'
      img.style.borderRadius = '8px'
      img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      img.style.display = 'block'
      img.setAttribute('data-image-id', imageData.id)

      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.insertNode(img)
        range.collapse(false)
      } else {
        editorRef.current.appendChild(img)
      }

      handleContentChange()
    }
  }, [handleContentChange])

  // Handle paste events
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
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
            const imageData: ImageData = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              dataUrl,
              name: imageName,
              placeholder: generateImagePlaceholder(imageName),
            }

            setImages((prev) => [...prev, imageData])
            insertImageAtCursor(imageData)
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

    // Handle formatted text paste
    const htmlData = clipboardData.getData('text/html')
    const textData = clipboardData.getData('text/plain')

    if (htmlData) {
      e.preventDefault()
      
      // Clean and sanitize HTML
      const cleanHtml = htmlData
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '')

      // Insert HTML at cursor
      executeCommand('insertHTML', cleanHtml)
      setLastAction("Formatted text pasted")
    } else if (textData) {
      // Let default text paste behavior handle plain text
      setLastAction("Text pasted")
    }
  }, [insertImageAtCursor, executeCommand])

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
            const imageData: ImageData = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              dataUrl,
              name: file.name,
              placeholder: generateImagePlaceholder(file.name),
            }

            setImages((prev) => [...prev, imageData])
            insertImageAtCursor(imageData)
            setLastAction(`File uploaded: ${file.name}`)
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
    [insertImageAtCursor],
  )

  // Remove image
  const removeImage = useCallback((imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
    
    // Remove image from editor
    if (editorRef.current) {
      const img = editorRef.current.querySelector(`img[data-image-id="${imageId}"]`)
      if (img) {
        img.remove()
        handleContentChange()
      }
    }
  }, [handleContentChange])

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="border rounded-lg p-2 bg-gray-50">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatBold}
            className="h-8 w-8 p-0"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatItalic}
            className="h-8 w-8 p-0"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatUnderline}
            className="h-8 w-8 p-0"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatBulletList}
            className="h-8 w-8 p-0"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatNumberedList}
            className="h-8 w-8 p-0"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Alignment */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatAlignLeft}
            className="h-8 w-8 p-0"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatAlignCenter}
            className="h-8 w-8 p-0"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatAlignRight}
            className="h-8 w-8 p-0"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Color picker */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="h-8 w-8 p-0"
              title="Text Color"
            >
              <Palette className="h-4 w-4" />
            </Button>
            {showColorPicker && (
              <div className="absolute top-10 left-0 z-10 bg-white border rounded-lg shadow-lg p-2">
                <div className="grid grid-cols-5 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => applyColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColorPicker(false)}
                  className="w-full mt-2"
                >
                  Close
                </Button>
              </div>
            )}
          </div>

          {/* Font size picker */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFontSizePicker(!showFontSizePicker)}
              className="h-8 w-8 p-0"
              title="Font Size"
            >
              <Type className="h-4 w-4" />
            </Button>
            {showFontSizePicker && (
              <div className="absolute top-10 left-0 z-10 bg-white border rounded-lg shadow-lg p-2 min-w-32">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                    onClick={() => applyFontSize(size.value)}
                  >
                    {size.label}
                  </button>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFontSizePicker(false)}
                  className="w-full mt-2"
                >
                  Close
                </Button>
              </div>
            )}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatUndo}
            className="h-8 w-8 p-0"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatRedo}
            className="h-8 w-8 p-0"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Image upload */}
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="h-8 w-8 p-0"
            title="Upload Image"
          >
            <Upload className="h-4 w-4" />
          </Button>

          {images.length > 0 && (
            <div className="flex items-center space-x-1 text-sm text-green-600 ml-2">
              <ImageIcon className="h-3 w-3" />
              <span>{images.length} image(s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <Alert>
        <ImageIcon className="h-4 w-4" />
        <AlertDescription>
          <p>
            <strong>Rich text editor:</strong> Use the toolbar above for formatting, or paste formatted text directly (Ctrl+V). Images can be pasted or uploaded.
          </p>
        </AlertDescription>
      </Alert>

      {/* Status messages */}
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

      {/* Rich text editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled && !isProcessing}
          onInput={handleContentChange}
          onPaste={handlePaste}
          className={`
            min-h-[300px] p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
            ${disabled || isProcessing ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
          `}
          style={{
            lineHeight: "1.6",
            fontSize: "14px",
            color: "#374151",
          }}
          data-placeholder={placeholder}
        />

        {/* Placeholder text */}
        {!value && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
