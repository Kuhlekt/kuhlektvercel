"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PreviewTest() {
  const [testHtml, setTestHtml] = useState("")

  const testCases = [
    {
      name: "Simple HTML",
      html: "<p>Hello <strong>world</strong>!</p>",
    },
    {
      name: "Direct Data URL",
      html: `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2ZmZiIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEVTVDwvdGV4dD4KPC9zdmc+" alt="Test" style="max-width: 100px; height: auto;" />`,
    },
    {
      name: "Image with Styling",
      html: `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2ZmZiIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEVTVDwvdGV4dD4KPC9zdmc+" alt="Test image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />`,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preview Rendering Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {testCases.map((testCase, index) => (
              <Button key={index} variant="outline" onClick={() => setTestHtml(testCase.html)} className="mr-2">
                Test: {testCase.name}
              </Button>
            ))}
            <Button variant="destructive" onClick={() => setTestHtml("")}>
              Clear
            </Button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Current HTML:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">{testHtml || "No HTML set"}</pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">Rendered Output:</h3>
            <div className="border p-4 bg-white rounded min-h-[100px]" dangerouslySetInnerHTML={{ __html: testHtml }} />
          </div>

          <div>
            <h3 className="font-medium mb-2">Alternative Rendering (createElement):</h3>
            <div className="border p-4 bg-white rounded min-h-[100px]">
              {testHtml && (
                <div
                  style={{
                    lineHeight: "1.6",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                  dangerouslySetInnerHTML={{ __html: testHtml }}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
