"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PreviewDebug() {
  const [content, setContent] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  // Simulate the exact same process as the main form
  const mockImages = [
    {
      id: "test123",
      placeholder: "[IMAGE:test123:image.png]",
      name: "image.png",
      dataUrl:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2ZmZiIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEVTVDwvdGV4dD4KPC9zdmc+",
    },
  ]

  const getPreviewContent = () => {
    if (!content) return ""

    let processedContent = content

    console.log("=== PREVIEW DEBUG TEST ===")
    console.log("Original content:", content)

    // Replace placeholders with actual images (same logic as main form)
    mockImages.forEach((image) => {
      if (content.includes(image.placeholder)) {
        console.log(`✅ Replacing ${image.placeholder}`)
        const imgTag = `<img src="${image.dataUrl}" alt="${image.name}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />`
        processedContent = processedContent.replace(image.placeholder, imgTag)
        console.log("Generated img tag:", imgTag)
      }
    })

    console.log("Final processed content:", processedContent)
    console.log("=== END DEBUG ===")

    return processedContent.replace(/\n/g, "<br />")
  }

  const addPlaceholder = () => {
    setContent((prev) => prev + "\n\nHere's an image: [IMAGE:test123:image.png]\n\n")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preview Debug Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content:</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  rows={8}
                  placeholder="Type some content here..."
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={addPlaceholder}>Add Test Image</Button>
                <Button onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
              </div>

              <div className="text-xs text-gray-600">
                <p>Mock image placeholder: [IMAGE:test123:image.png]</p>
                <p>This should render as a blue square with "TEST" text</p>
              </div>
            </div>

            {/* Preview Section */}
            {showPreview && (
              <div className="border-l pl-6">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>

                <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <details>
                    <summary className="cursor-pointer">Show processed HTML</summary>
                    <pre className="bg-gray-200 p-2 mt-2 rounded overflow-auto max-h-32">{getPreviewContent()}</pre>
                  </details>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  {content ? (
                    <div
                      className="prose max-w-none"
                      style={{
                        lineHeight: "1.6",
                        fontSize: "14px",
                        color: "#374151",
                      }}
                      dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                    />
                  ) : (
                    <div className="text-gray-500 italic">Content preview will appear here...</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
