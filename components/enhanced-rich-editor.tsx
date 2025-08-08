"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bold, Italic, List, ListOrdered, Link, Image, Eye, EyeOff, Upload } from 'lucide-react'

interface EnhancedRichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function EnhancedRichEditor({ value, onChange, placeholder }: EnhancedRichEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const insertText = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const insertImage = () => {
    if (imageUrl) {
      insertText(`<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto;" />`)
      setImageUrl("")
    }
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      insertText(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
      setLinkText("")
      setLinkUrl("")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        insertText(`<img src="${result}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('<strong>', '</strong>')}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('<em>', '</em>')}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('<ul><li>', '</li></ul>')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertText('<ol><li>', '</li></ol>')}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="h-8 px-3"
        >
          {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
          {showPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {/* Editor/Preview */}
      {showPreview ? (
        <div className="min-h-[300px] p-4 border rounded-lg bg-white prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] font-mono text-sm"
        />
      )}

      {/* Quick Insert Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
        {/* Image Insert */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Image className="h-4 w-4" />
            Insert Image
          </Label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={insertImage}
              disabled={!imageUrl}
            >
              Insert
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">or</span>
            <Label htmlFor="image-upload" className="cursor-pointer">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                asChild
              >
                <span>
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </span>
              </Button>
            </Label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Link Insert */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Link className="h-4 w-4" />
            Insert Link
          </Label>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Link text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={insertLink}
                disabled={!linkUrl || !linkText}
              >
                Insert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
