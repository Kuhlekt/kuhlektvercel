"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function SimplePreviewTest() {
  const [content, setContent] = useState(`
    <h1>Sample Article</h1>
    <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
    </ul>
    <img src="https://via.placeholder.com/300x200" alt="Sample image" />
  `)
  const [showPreview, setShowPreview] = useState(false)

  // Mock image data
  const mockImages = [
    {
      id: "123",
      placeholder: "[IMAGE:123:test.png]",
      name: "test.png",
      dataUrl:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2ZmZiIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEVTVDwvdGV4dD4KPC9zdmc+",
    },
  ]

  const processContent = () => {
    let processed = content

    console.log("=== SIMPLE TEST DEBUG ===")
    console.log("Original content:", content)
    console.log("Mock images:", mockImages)

    mockImages.forEach((image) => {
      console.log(`Looking for: "${image.placeholder}"`)
      console.log(`Found in content:`, content.includes(image.placeholder))

      if (content.includes(image.placeholder)) {
        const imgTag = `<img src="${image.dataUrl}" alt="${image.name}" style="max-width: 100%; height: auto; border: 2px solid red;" />`
        processed = processed.replace(image.placeholder, imgTag)
        console.log("Replaced with:", imgTag.substring(0, 100) + "...")
      }
    })

    console.log("Final processed:", processed)
    console.log("=== END DEBUG ===")

    return processed.replace(/\n/g, "<br />")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simple Preview Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Content:</label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
          </div>

          <Button onClick={() => setShowPreview(!showPreview)}>{showPreview ? "Hide Preview" : "Show Preview"}</Button>

          {showPreview && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Processed HTML:</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">{processContent()}</pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Rendered Preview:</h3>
                <div className="border p-4 bg-white rounded" dangerouslySetInnerHTML={{ __html: processContent() }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
