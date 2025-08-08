'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ImagePasteTest() {
  const [pastedImage, setPastedImage] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Ready to paste image')

  const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault()
    setStatus('Processing paste...')

    const items = e.clipboardData?.items
    if (!items) {
      setStatus('No clipboard data found')
      return
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result as string
            setPastedImage(result)
            setStatus('Image pasted successfully!')
          }
          reader.readAsDataURL(file)
          return
        }
      }
    }
    setStatus('No image found in clipboard')
  }

  const clearImage = () => {
    setPastedImage(null)
    setStatus('Ready to paste image')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Image Paste Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          onPaste={handlePaste}
          tabIndex={0}
        >
          <p className="text-gray-600 mb-2">Click here and paste an image (Ctrl+V)</p>
          <p className="text-sm text-gray-500">{status}</p>
        </div>

        {pastedImage && (
          <div className="space-y-4">
            <img
              src={pastedImage || "/placeholder.svg"}
              alt="Pasted content"
              className="max-w-full h-auto rounded-lg border"
            />
            <Button onClick={clearImage} variant="outline">
              Clear Image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
