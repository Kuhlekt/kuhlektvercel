"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon } from "lucide-react"

export function ImagePasteTest() {
  const [content, setContent] = useState("")
  const [lastPasteEvent, setLastPasteEvent] = useState<string>("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    console.log("Paste event triggered")
    setLastPasteEvent(new Date().toLocaleTimeString())

    const clipboardData = e.clipboardData
    if (!clipboardData) {
      console.log("No clipboard data")
      return
    }

    const items = Array.from(clipboardData.items)
    console.log(
      "Clipboard items:",
      items.map((item) => ({ type: item.type, kind: item.kind })),
    )

    const imageItems = items.filter((item) => item.type.startsWith("image/"))
    console.log("Image items found:", imageItems.length)

    if (imageItems.length > 0) {
      e.preventDefault()

      for (const item of imageItems) {
        const file = item.getAsFile()
        if (file) {
          console.log("Processing image file:", file.name, file.type, file.size)

          const reader = new FileReader()
          reader.onload = () => {
            const dataURL = reader.result as string
            const textarea = textareaRef.current
            if (textarea) {
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const newContent = content.substring(0, start) + "\n\n" + dataURL + "\n\n" + content.substring(end)
              setContent(newContent)
            }
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  const processContentForDisplay = (content: string) => {
    const dataUrlRegex = /(data:image\/[^;]+;base64,[^\s]+)/gi
    return content
      .replace(dataUrlRegex, (url) => {
        return `<img src="${url}" alt="Pasted image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />`
      })
      .replace(/\n/g, "<br />")
  }

  const imageCount = (content.match(/data:image\/[^;]+;base64,/g) || []).length

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5" />
          <span>Image Paste Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <strong>Test Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Copy an image from anywhere (screenshot, browser, etc.)</li>
              <li>Click in the textarea below</li>
              <li>Press Ctrl+V (or Cmd+V on Mac)</li>
              <li>The image should appear below the textarea</li>
            </ol>
          </AlertDescription>
        </Alert>

        <div>
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={handlePaste}
            placeholder="Click here and paste an image (Ctrl+V)..."
            rows={6}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Images in content: {imageCount}</span>
          {lastPasteEvent && <span>Last paste: {lastPasteEvent}</span>}
        </div>

        {content && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Preview:</h4>
            <div
              dangerouslySetInnerHTML={{ __html: processContentForDisplay(content) }}
              style={{ lineHeight: "1.6" }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
