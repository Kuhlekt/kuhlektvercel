"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Upload,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

export interface ImageData {
  id: string
  dataUrl: string
  name: string
  placeholder: string
}

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  onImagesChange?: (images: ImageData[]) => void
  placeholder?: string
  className?: string
}

export function WysiwygEditor({
  value,
  onChange,
  onImagesChange,
  placeholder = "Start writing your content...",
  className = "",
}: WysiwygEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize with existing images
  useEffect(() => {
    const existingImages = (window as any).textareaImages || []
    if (existingImages.length > 0) {
      setImages(existingImages)
    }
  }, [])

  // Update global images when local images change
  useEffect(() => {
    ;(window as any).textareaImages = images
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

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    },
    [onChange],
  )

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    for (const file of imageFiles) {
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

        // Add to images state
        setImages((prev) => [...prev, newImage])

        // Insert image directly into editor
        const imgElement = document.createElement("img")
        imgElement.src = dataUrl
        imgElement.alt = file.name
        imgElement.style.maxWidth = "100%"
        imgElement.style.height = "auto"
        imgElement.style.margin = "10px 0"
        imgElement.style.borderRadius = "8px"
        imgElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
        imgElement.style.display = "block"

        // Insert at cursor or at end
        if (editorRef.current) {
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.insertNode(imgElement)
            range.collapse(false)
          } else {
            editorRef.current.appendChild(imgElement)
          }
          onChange(editorRef.current.innerHTML)
        }
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items)
    const imageItems = items.filter((item) => item.type.startsWith("image/"))

    if (imageItems.length > 0) {
      e.preventDefault()

      for (const item of imageItems) {
        const file = item.getAsFile()
        if (file) {
          try {
            const dataUrl = await fileToDataUrl(file)
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 5)
            const placeholder = `[IMAGE:${id}:pasted-image]`

            const newImage: ImageData = {
              id,
              dataUrl,
              name: "pasted-image",
              placeholder,
            }

            setImages((prev) => [...prev, newImage])

            // Insert image directly
            const imgElement = document.createElement("img")
            imgElement.src = dataUrl
            imgElement.alt = "Pasted image"
            imgElement.style.maxWidth = "100%"
            imgElement.style.height = "auto"
            imgElement.style.margin = "10px 0"
            imgElement.style.borderRadius = "8px"
            imgElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
            imgElement.style.display = "block"

            if (editorRef.current) {
              const selection = window.getSelection()
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)
                range.insertNode(imgElement)
                range.collapse(false)
              } else {
                editorRef.current.appendChild(imgElement)
              }
              onChange(editorRef.current.innerHTML)
            }
          } catch (error) {
            console.error("Error pasting image:", error)
          }
        }
      }
    }
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      execCommand("insertHTML", `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
      setLinkUrl("")
      setLinkText("")
      setShowLinkDialog(false)
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

  const getPreviewContent = () => {
    return value || "<p>No content to preview</p>"
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("bold")}
              className="h-8 w-8 p-0"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("italic")}
              className="h-8 w-8 p-0"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("underline")}
              className="h-8 w-8 p-0"
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("insertUnorderedList")}
              className="h-8 w-8 p-0"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("insertOrderedList")}
              className="h-8 w-8 p-0"
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("justifyLeft")}
              className="h-8 w-8 p-0"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("justifyCenter")}
              className="h-8 w-8 p-0"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("justifyRight")}
              className="h-8 w-8 p-0"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Media */}
          <div className="flex items-center gap-1 border-r pr-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 p-0"
              title="Upload Image"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowLinkDialog(!showLinkDialog)}
              className="h-8 w-8 p-0"
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Preview Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8 px-3"
            title="Toggle Preview"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showPreview ? "Edit" : "Preview"}
          </Button>

          {images.length > 0 && (
            <div className="flex items-center space-x-1 text-sm text-green-600 ml-2">
              <ImageIcon className="h-3 w-3" />
              <span>
                {images.length} image{images.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Link Dialog */}
        {showLinkDialog && (
          <div className="flex items-center gap-2 pt-3 mt-3 border-t">
            <Label htmlFor="link-text" className="text-sm whitespace-nowrap">
              Text:
            </Label>
            <Input
              id="link-text"
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text"
              className="h-8"
            />
            <Label htmlFor="link-url" className="text-sm whitespace-nowrap">
              URL:
            </Label>
            <Input
              id="link-url"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-8"
            />
            <Button type="button" size="sm" onClick={insertLink} disabled={!linkUrl || !linkText} className="h-8">
              Insert
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowLinkDialog(false)
                setLinkUrl("")
                setLinkText("")
              }}
              className="h-8"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Editor/Preview Area */}
      <div className="min-h-[400px]">
        {showPreview ? (
          <div className="p-4 prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onPaste={handlePaste}
            className="p-4 min-h-[400px] focus:outline-none prose max-w-none"
            style={{ minHeight: "400px" }}
            suppressContentEditableWarning={true}
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* Status Bar */}
      {images.length > 0 && (
        <div className="border-t bg-gray-50 p-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              {images.length} image{images.length !== 1 ? "s" : ""} attached
            </span>
            <span>Tip: You can paste images directly with Ctrl+V</span>
          </div>
        </div>
      )}

      <Alert className="m-3">
        <ImageIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro tip:</strong> You can paste images directly from your clipboard (Ctrl+V) or drag and drop them
          into the editor.
        </AlertDescription>
      </Alert>
    </div>
  )
}
