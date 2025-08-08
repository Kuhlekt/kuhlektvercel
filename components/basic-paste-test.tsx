"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BasicPasteTest() {
  const [logs, setLogs] = useState<string[]>([])
  const [content, setContent] = useState('')

  const addLog = (message: string) => {
    console.log(message)
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    addLog("✅ PASTE EVENT DETECTED!")
    addLog(`Event type: ${e.type}`)
    addLog(`Target: ${e.target}`)

    const clipboardData = e.clipboardData
    if (clipboardData) {
      addLog(`Clipboard types: ${clipboardData.types.join(", ")}`)
      const textData = clipboardData.getData("text/plain")
      if (textData) {
        addLog(`Text data: "${textData}"`)
      }
    }
    console.log('Paste event:', e)
    console.log('Clipboard data:', e.clipboardData)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    addLog(`Key pressed: ${e.key} (ctrl: ${e.ctrlKey}, meta: ${e.metaKey})`)
    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      addLog("🎯 PASTE SHORTCUT DETECTED!")
    }
  }

  const handleFocus = () => {
    addLog("📍 Input focused")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
    addLog(`Input changed: "${e.target.value}"`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Paste Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Test 1: Regular Input</h3>
            <input
              type="text"
              value={content}
              onChange={handleChange}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder="Type or paste text here..."
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Test 2: Textarea</h3>
            <textarea
              className="w-full h-32 p-2 border rounded"
              placeholder="Paste content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Test 3: Div with contentEditable</h3>
            <div
              contentEditable
              className="w-full h-32 p-2 border rounded min-h-[60px] bg-white"
              style={{ outline: "none" }}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
            >
              Click here and paste...
            </div>
          </div>

          <button
            onClick={() => {
              setLogs([])
              console.clear()
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Clear Logs
          </button>

          <div>
            <h3 className="font-medium mb-2">Debug Logs:</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">
                  No events yet...
                  <br />
                  Try:
                  <br />
                  1. Click in any input above
                  <br />
                  2. Type some text
                  <br />
                  3. Copy some text (Ctrl+C)
                  <br />
                  4. Paste it (Ctrl+V)
                </div>
              ) : (
                logs.map((log, index) => <div key={index}>{log}</div>)
              )}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-bold">Content:</h2>
            <pre className="bg-gray-100 p-2 rounded">{content}</pre>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Instructions:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>First, try typing in the inputs above - you should see key events</li>
              <li>Copy some text from anywhere (like this text)</li>
              <li>Click in an input and press Ctrl+V</li>
              <li>You should see "PASTE EVENT DETECTED!" in the logs</li>
            </ol>
            <p className="text-red-600">
              <strong>If you don't see ANY events:</strong> There might be a browser security restriction or the page
              isn't focused properly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
