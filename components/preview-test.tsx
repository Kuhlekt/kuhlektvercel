'use client'

import { useState } from 'react'

export function PreviewTest() {
  const [content, setContent] = useState('<h1>Hello World</h1><p>This is a test with <strong>bold</strong> text.</p>')

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">HTML Preview Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold mb-2">HTML Content:</h2>
          <textarea
            className="w-full h-64 p-2 border rounded font-mono text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <div>
          <h2 className="font-bold mb-2">Preview:</h2>
          <div
            className="w-full h-64 p-2 border rounded overflow-auto bg-white"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  )
}
