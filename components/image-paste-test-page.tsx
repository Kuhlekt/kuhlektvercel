"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedTextarea } from "./enhanced-textarea"
import { ImageIcon } from "lucide-react"

export function ImagePasteTestPage() {
  const [testContent, setTestContent] = useState("")

  const processContentForDisplay = (content: string) => {
    const dataUrlRegex = /(data:image\/[^;]+;base64,[^\s]+)/gi
    return content
      .replace(dataUrlRegex, (url) => {
        return `<img src="${url}" alt="Pasted image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />`
      })
      .replace(/\n/g, "<br />")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>Image Paste Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Test Area:</h3>
            <EnhancedTextarea
              value={testContent}
              onChange={setTestContent}
              placeholder="Test image pasting here:

1. Copy any image (screenshot, from browser, etc.)
2. Click in this text area
3. Press Ctrl+V (or Cmd+V on Mac)
4. Watch the magic happen!

You can also upload files or paste multiple images."
              rows={8}
            />
          </div>

          {testContent && (
            <div>
              <h3 className="font-medium mb-2">Preview:</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div
                  dangerouslySetInnerHTML={{ __html: processContentForDisplay(testContent) }}
                  style={{ lineHeight: "1.6" }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
