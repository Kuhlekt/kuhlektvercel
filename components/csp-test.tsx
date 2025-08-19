"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CSPTest() {
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testDataURL = () => {
    addResult("Testing data URL rendering...")

    // Test 1: Direct img element
    const img = document.createElement("img")
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2ZmZiIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEVTVDwvdGV4dD4KPC9zdmc+"

    img.onload = () => addResult("✅ Direct img element loaded successfully")
    img.onerror = (e) => addResult(`❌ Direct img element failed: ${e}`)

    // Test 2: Check for CSP violations
    const originalConsoleError = console.error
    console.error = (...args) => {
      if (args.some((arg) => typeof arg === "string" && arg.includes("Content Security Policy"))) {
        addResult(`❌ CSP Violation detected: ${args.join(" ")}`)
      }
      originalConsoleError.apply(console, args)
    }

    // Restore after 2 seconds
    setTimeout(() => {
      console.error = originalConsoleError
    }, 2000)
  }

  const clearResults = () => setTestResults([])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CSP and Data URL Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              This test checks if Content Security Policy is blocking data URLs from rendering as images.
            </AlertDescription>
          </Alert>

          <div className="flex space-x-2">
            <Button onClick={testDataURL}>Run CSP Test</Button>
            <Button variant="outline" onClick={clearResults}>
              Clear Results
            </Button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Test 1: Direct Data URL Image</h3>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2ZmZiIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEVTVDwvdGV4dD4KPC9zdmc+"
              alt="Direct data URL test"
              style={{ maxWidth: "100px", height: "auto", border: "2px solid red" }}
              onLoad={() => addResult("✅ Direct JSX img loaded")}
              onError={() => addResult("❌ Direct JSX img failed")}
            />
            <p className="text-xs text-gray-600 mt-1">If you see a blue square with "TEST", data URLs work</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Test 2: dangerouslySetInnerHTML</h3>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2ZmZiIvPgogIDx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEVTVDwvdGV4dD4KPC9zdmc+" alt="innerHTML test" style="max-width: 100px; height: auto; border: 2px solid green;" />',
              }}
            />
            <p className="text-xs text-gray-600 mt-1">This tests if dangerouslySetInnerHTML blocks data URLs</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Test Results:</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs max-h-48 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-gray-500">No test results yet. Click "Run CSP Test" above.</div>
              ) : (
                testResults.map((result, index) => <div key={index}>{result}</div>)
              )}
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Expected behavior:</strong> You should see two blue squares with "TEST" text. If you don't see
              them, or if you see CSP violations in the results, then Content Security Policy is blocking data URLs.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
