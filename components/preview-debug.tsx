'use client'

import { useState } from 'react'

export function PreviewDebug() {
  const [content, setContent] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testContent = `
    <h1>Test Article</h1>
    <p>This is a test paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwNzNlNiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+PC9zdmc+" alt="Test image" />
  `

  const handleTest = () => {
    addLog('Testing HTML content rendering')
    setContent(testContent)
    addLog('Content set successfully')
  }

  const handleClear = () => {
    setContent('')
    setLogs([])
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Preview Debug</h1>
      
      <div className="mb-4 space-x-2">
        <button
          onClick={handleTest}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test HTML Rendering
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold mb-2">HTML Source:</h2>
          <textarea
            className="w-full h-64 p-2 border rounded font-mono text-xs"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="HTML content will appear here..."
          />
        </div>
        
        <div>
          <h2 className="font-bold mb-2">Rendered Preview:</h2>
          <div className="w-full h-64 p-2 border rounded overflow-auto bg-white">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-gray-500 italic">No content to preview</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="font-bold mb-2">Debug Log:</h2>
        <div className="bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">No logs yet...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-sm font-mono">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
