'use client'

import { useState } from 'react'

export function PasteDebug() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    addLog('Paste event triggered')
    
    const clipboardData = e.clipboardData
    addLog(`Clipboard data exists: ${!!clipboardData}`)
    
    if (clipboardData) {
      addLog(`Number of items: ${clipboardData.items.length}`)
      
      for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i]
        addLog(`Item ${i}: type=${item.type}, kind=${item.kind}`)
        
        if (item.type.indexOf('image') !== -1) {
          addLog('Found image item!')
          const file = item.getAsFile()
          if (file) {
            addLog(`File: name=${file.name}, size=${file.size}, type=${file.type}`)
          }
        }
      }
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Paste Debug</h1>
      <div
        className="border-2 border-dashed p-8 text-center mb-4"
        onPaste={handlePaste}
        tabIndex={0}
      >
        Paste anything here to debug
      </div>
      <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
        <h2 className="font-bold mb-2">Debug Log:</h2>
        {logs.map((log, index) => (
          <div key={index} className="text-sm font-mono">
            {log}
          </div>
        ))}
      </div>
      <button
        onClick={() => setLogs([])}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Clear Log
      </button>
    </div>
  )
}
