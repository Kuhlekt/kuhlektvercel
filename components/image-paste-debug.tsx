'use client'

import { useState } from 'react'

export function ImagePasteDebug() {
  const [image, setImage] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault()
    addLog('Paste event started')

    try {
      const items = e.clipboardData?.items
      if (!items) {
        addLog('No clipboard items found')
        return
      }

      addLog(`Found ${items.length} clipboard items`)

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        addLog(`Item ${i}: type=${item.type}, kind=${item.kind}`)

        if (item.type.startsWith('image/')) {
          addLog('Processing image item...')
          const file = item.getAsFile()
          
          if (file) {
            addLog(`File details: name=${file.name}, size=${file.size}, type=${file.type}`)
            
            const reader = new FileReader()
            reader.onload = (event) => {
              const result = event.target?.result as string
              setImage(result)
              addLog('Image loaded successfully!')
            }
            reader.onerror = () => {
              addLog('Error reading file')
            }
            reader.readAsDataURL(file)
          } else {
            addLog('Could not get file from item')
          }
        }
      }
    } catch (error) {
      addLog(`Error: ${error}`)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image Paste Debug</h1>
      
      <div
        className="border-2 border-dashed border-blue-300 p-8 text-center mb-4 bg-blue-50"
        onPaste={handlePaste}
        tabIndex={0}
      >
        <p className="text-lg">Click here and paste an image (Ctrl+V or Cmd+V)</p>
        <p className="text-sm text-gray-600 mt-2">Make sure to click in this area first</p>
      </div>

      {image && (
        <div className="mb-4">
          <h2 className="font-bold mb-2">Pasted Image:</h2>
          <img src={image || "/placeholder.svg"} alt="Pasted content" className="max-w-full h-auto border rounded" />
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">Debug Log:</h2>
          <button
            onClick={() => setLogs([])}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Clear
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">No logs yet...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
