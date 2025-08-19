"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function SimpleImageTest() {
  const [content, setContent] = useState("")
  const [images, setImages] = useState<Array<{ id: string; dataUrl: string; placeholder: string }>>([])
  const [showPreview, setShowPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePaste = async (e: React.ClipboardEvent) => {
    console.log("Paste event triggered")

    const clipboardData = e.clipboardData
    if (!clipboardData) return

    const items = Array.from(clipboardData.items)
    console.log(
      "Clipboard items:",
      items.map((item) => ({ type: item.type, kind: item.kind })),
    )

    const imageItems = items.filter((item) => item.type.startsWith("image/"))
    console.log("Image items found:", imageItems.length)

    if (imageItems.length > 0) {
      e.preventDefault()

      const item = imageItems[0]
      const file = item.getAsFile()

      if (file) {
        console.log("Processing file:", file.name, file.type, file.size)

        const reader = new FileReader()
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          if (dataUrl) {
            console.log("Generated data URL length:", dataUrl.length)
            console.log("Data URL start:", dataUrl.substring(0, 100))

            const id = Date.now().toString()
            const placeholder = `[IMAGE:${id}]`

            // Add to images array
            setImages((prev) => [...prev, { id, dataUrl, placeholder }])

            // Add placeholder to content
            const textarea = textareaRef.current
            if (textarea) {
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const newContent = content.substring(0, start) + `\n\n${placeholder}\n\n` + content.substring(end)
              setContent(newContent)
            }
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const getPreviewContent = () => {
    console.log("=== PREVIEW PROCESSING ===")
    console.log("Content:", content)
    console.log("Images:", images)

    let processedContent = content

    images.forEach((image) => {
      console.log(`Looking for placeholder: ${image.placeholder}`)
      console.log(`Content includes placeholder:`, content.includes(image.placeholder))

      if (content.includes(image.placeholder)) {
        console.log("Replacing placeholder with image")
        processedContent = processedContent.replace(
          image.placeholder,
          `<img src="${image.dataUrl}" alt="Test image" style="max-width: 100%; height: auto; border: 2px solid red;" />`,
        )
      }
    })

    console.log("Final processed content:", processedContent)
    return processedContent.replace(/\n/g, "<br />")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simple Image Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Test Area (paste image here):</h3>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              placeholder="Paste an image here with Ctrl+V..."
              rows={6}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <span className="text-sm text-gray-600">Images stored: {images.length}</span>
          </div>

          {images.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Stored Images:</h4>
              <div className="grid grid-cols-3 gap-2">
                {images.map((image) => (
                  <div key={image.id} className="border p-2">
                    <img src={image.dataUrl || "/placeholder.svg"} alt="Stored" className="w-full h-20 object-cover" />
                    <div className="text-xs mt-1">Placeholder: {image.placeholder}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showPreview && (
            <div>
              <h4 className="font-medium mb-2">Preview:</h4>
              <div className="border p-4 bg-gray-50" dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Debug Info:</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              Content: {JSON.stringify(content, null, 2)}
              {"\n"}
              Images:{" "}
              {JSON.stringify(
                images.map((img) => ({ id: img.id, placeholder: img.placeholder, dataUrlLength: img.dataUrl.length })),
                null,
                2,
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
