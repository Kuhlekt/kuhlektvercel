"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function PasteDebug() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    addLog("🎯 PASTE EVENT TRIGGERED!")

    const clipboardData = e.clipboardData
    if (!clipboardData) {
      addLog("❌ No clipboard data available")
      return
    }

    addLog(`📋 Clipboard data available: ${clipboardData.types.join(", ")}`)

    // Check files
    const files = Array.from(clipboardData.files)
    addLog(`📁 Files in clipboard: ${files.length}`)
    files.forEach((file, index) => {
      addLog(`   File ${index}: ${file.name} (${file.type}, ${file.size} bytes)`)
    })

    // Check items
    const items = Array.from(clipboardData.items)
    addLog(`📝 Items in clipboard: ${items.length}`)
    items.forEach((item, index) => {
      addLog(`   Item ${index}: ${item.type} (${item.kind})`)
    })

    // Check for images specifically
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    const imageItems = items.filter((item) => item.type.startsWith("image/"))

    addLog(`🖼️ Image files: ${imageFiles.length}`)
    addLog(`🖼️ Image items: ${imageItems.length}`)

    if (imageFiles.length > 0 || imageItems.length > 0) {
      addLog("✅ Images detected! This should work...")
    } else {
      addLog("❌ No images detected in paste")
    }

    // Try to get text content too
    const textData = clipboardData.getData("text/plain")
    if (textData) {
      addLog(`📄 Text data: "${textData.substring(0, 100)}${textData.length > 100 ? "..." : ""}"`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      addLog("⌨️ Ctrl+V detected")
    }
  }

  const clearLogs = () => {
    setLogs([])
    console.clear()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paste Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Copy an image (screenshot, right-click copy image, etc.)</li>
              <li>Click in the textarea below</li>
              <li>Press Ctrl+V (or Cmd+V on Mac)</li>
              <li>Watch the logs below to see what happens</li>
            </ol>
          </div>

          <div>
            <h3 className="font-medium mb-2">Test Area:</h3>
            <Textarea
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              placeholder="Click here and paste an image (Ctrl+V)..."
              rows={4}
              className="w-full"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={clearLogs}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Clear Logs
            </button>
            <span className="text-sm text-gray-600">Logs: {logs.length}</span>
          </div>

          <div>
            <h3 className="font-medium mb-2">Debug Logs:</h3>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet... try pasting an image above</div>
              ) : (
                logs.map((log, index) => <div key={index}>{log}</div>)
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <strong>Expected behavior:</strong> When you paste an image, you should see logs showing clipboard data,
              files, and items. If you don't see "PASTE EVENT TRIGGERED!" then the paste event isn't firing at all.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
