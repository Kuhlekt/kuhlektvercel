"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ImagePasteDebug() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    addLog("🎯 PASTE EVENT TRIGGERED!")

    const clipboardData = e.clipboardData
    if (!clipboardData) {
      addLog("❌ No clipboard data")
      return
    }

    // Log all available types
    addLog(`📋 Available types: ${Array.from(clipboardData.types).join(", ")}`)

    // Check files array
    const files = Array.from(clipboardData.files)
    addLog(`📁 Files count: ${files.length}`)

    if (files.length > 0) {
      files.forEach((file, index) => {
        addLog(`   File ${index}: name="${file.name}", type="${file.type}", size=${file.size}`)
      })
    }

    // Check items array
    const items = Array.from(clipboardData.items)
    addLog(`📝 Items count: ${items.length}`)

    if (items.length > 0) {
      items.forEach((item, index) => {
        addLog(`   Item ${index}: type="${item.type}", kind="${item.kind}"`)
      })
    }

    // Look for images specifically
    const imageFiles = files.filter((f) => f.type.startsWith("image/"))
    const imageItems = items.filter((i) => i.type.startsWith("image/"))

    addLog(`🖼️ Image files: ${imageFiles.length}`)
    addLog(`🖼️ Image items: ${imageItems.length}`)

    // Try to process first image item
    if (imageItems.length > 0) {
      addLog("🔄 Attempting to process first image item...")
      const item = imageItems[0]
      const file = item.getAsFile()

      if (file) {
        addLog(`✅ Got file from item: ${file.name}, ${file.type}, ${file.size} bytes`)

        // Try to read it
        try {
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result as string
            if (result) {
              addLog(`✅ Successfully read file: ${result.length} characters`)
              addLog(`📄 Data URL starts with: ${result.substring(0, 50)}...`)
            } else {
              addLog("❌ FileReader result is empty")
            }
          }
          reader.onerror = (error) => {
            addLog(`❌ FileReader error: ${error}`)
          }
          reader.readAsDataURL(file)
        } catch (error) {
          addLog(`❌ Error reading file: ${error}`)
        }
      } else {
        addLog("❌ Could not get file from image item")
      }
    }

    // Try to get text data too (sometimes images come as text)
    try {
      const textData = clipboardData.getData("text/plain")
      if (textData) {
        addLog(`📄 Text data length: ${textData.length}`)
        if (textData.startsWith("data:image/")) {
          addLog("🖼️ Text data appears to be a data URL!")
        }
      }
    } catch (error) {
      addLog(`❌ Error getting text data: ${error}`)
    }

    // Try HTML data
    try {
      const htmlData = clipboardData.getData("text/html")
      if (htmlData) {
        addLog(`📄 HTML data length: ${htmlData.length}`)
        if (htmlData.includes("&lt;img")) {
          addLog("🖼️ HTML data contains img tags!")
        }
      }
    } catch (error) {
      addLog(`❌ Error getting HTML data: ${error}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Paste Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h3 className="font-medium mb-2">📋 How to test:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                <strong>Screenshot:</strong> Press Print Screen or Cmd+Shift+4 (Mac)
              </li>
              <li>
                <strong>Copy image from web:</strong> Right-click any image → "Copy image"
              </li>
              <li>
                <strong>Copy from image editor:</strong> Copy from Paint, Photoshop, etc.
              </li>
              <li>Click in the textarea below and press Ctrl+V</li>
            </ol>
          </div>

          <div>
            <h3 className="font-medium mb-2">Test Area:</h3>
            <textarea
              onPaste={handlePaste}
              placeholder="Click here and paste an image (Ctrl+V)..."
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              rows={4}
            />
          </div>

          <button
            onClick={() => {
              setLogs([])
              console.clear()
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Logs
          </button>

          <div>
            <h3 className="font-medium mb-2">Debug Output:</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">
                  Waiting for paste event...
                  <br />
                  <br />
                  Try copying an image and pasting it above.
                </div>
              ) : (
                logs.map((log, index) => <div key={index}>{log}</div>)
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <strong>What we're looking for:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Files count &gt; 0 OR Items with image/ type</li>
              <li>Successful file reading with data URL output</li>
              <li>If you see "0 files" and "0 image items", the image isn't in the clipboard as expected</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
