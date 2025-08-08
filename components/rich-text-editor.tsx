"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Image, Palette, Type, Undo, Redo, Eye, EyeOff } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = `<img src="${e.target?.result}" style="max-width: 100%; height: auto;" alt="Uploaded image" />`
        execCommand('insertHTML', img)
      }
      reader.readAsDataURL(file)
    }
  }, [execCommand])

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080'
  ]

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']

  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          <strong>Rich Text Editor Features:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Use toolbar buttons for formatting (Bold, Italic, etc.)</li>
            <li>• Upload images with the Image button</li>
            <li>• Change text colors with the palette</li>
            <li>• Create lists and adjust alignment</li>
            <li>• Toggle preview to see formatted content</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card className="border border-gray-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-3 bg-white border-b border-gray-200">
          {/* Basic formatting */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('bold')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('italic')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('underline')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <Underline className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('insertUnorderedList')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('insertOrderedList')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Alignment */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('justifyLeft')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('justifyCenter')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('justifyRight')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Color picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-2 bg-white border border-gray-200 shadow-lg z-50">
              <div className="grid grid-cols-7 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => execCommand('foreColor', color)}
                  />
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
              >
                <Type className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg z-50">
              {fontSizes.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => execCommand('fontSize', size)}
                  className="hover:bg-gray-50"
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Image upload */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <Image className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Undo/Redo */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('undo')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand('redo')}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Preview toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-gray-50"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Editor/Preview */}
        <div className="min-h-[300px]">
          {showPreview ? (
            <div 
              className="p-4 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable
              className="p-4 min-h-[300px] focus:outline-none"
              onInput={handleContentChange}
              dangerouslySetInnerHTML={{ __html: value }}
              style={{ minHeight: '300px' }}
            />
          )}
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}
