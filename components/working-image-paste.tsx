"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PastedImage {
  id: string
  dataUrl: string
  name: string
  placeholder: string
}

export function WorkingImagePaste() {
  const [content, setContent] = useState("")
  const [images, setImages] = useState<PastedImage[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [image, setImage] = useState<string | null>(null)
  const [status, setStatus] = useState('Ready')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  const addLog = (message: string) => {
    console.log(message)
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + text + content.substring(end)
    setContent(newContent)

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + text.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    setStatus('Processing...')
    addLog("🎯 Paste event triggered")

    const clipboardData = e.clipboardData
    if (!clipboardData) {
      addLog("❌ No clipboard data")
      setStatus('No image found')
      return
    }

    // Check for image files first
    const files = Array.from(clipboardData.files)
    const imageFiles = files.filter((f) => f.type.startsWith("image/"))

    if (imageFiles.length > 0) {
      addLog(`📁 Found ${imageFiles.length} image files`)
      e.preventDefault()

      for (const file of imageFiles) {
        addLog(`🔄 Processing file: ${file.name} (${file.type})`)

        try {
          const reader = new FileReader()
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string
            if (dataUrl) {
              const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
              const placeholder = `[IMAGE:${id}:${file.name || "pasted-image"}]`

              const newImage: PastedImage = {
                id,
                dataUrl,
                name: file.name || "pasted-image",
                placeholder,
              }

              setImages((prev) => [...prev, newImage])
              insertAtCursor(`\n\n${placeholder}\n\n`)
              addLog(`✅ Image added: ${placeholder}`)
              setStatus('Image pasted!')
            }
          }
          reader.onerror = () => {
            addLog(`❌ Failed to read file: ${file.name}`)
            setStatus('No image found')
          }
          reader.readAsDataURL(file)
        } catch (error) {
          addLog(`❌ Error processing file: ${error}`)
          setStatus('No image found')
        }
      }
      return
    }

    // Check for image items if no files
    const items = Array.from(clipboardData.items)
    const imageItems = items.filter((i) => i.type.startsWith("image/"))

    if (imageItems.length > 0) {
      addLog(`📝 Found ${imageItems.length} image items`)
      e.preventDefault()

      for (const item of imageItems) {
        const file = item.getAsFile()
        if (file) {
          addLog(`🔄 Processing item: ${file.type}`)

          try {
            const reader = new FileReader()
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string
              if (dataUrl) {
                const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
                const placeholder = `[IMAGE:${id}:clipboard-image]`

                const newImage: PastedImage = {
                  id,
                  dataUrl,
                  name: "clipboard-image",
                  placeholder,
                }

                setImages((prev) => [...prev, newImage])
                insertAtCursor(`\n\n${placeholder}\n\n`)
                addLog(`✅ Image added: ${placeholder}`)
                setStatus('Image pasted!')
              }
            }
            reader.onerror = () => {
              addLog(`❌ Failed to read clipboard item`)
              setStatus('No image found')
            }
            reader.readAsDataURL(file)
          } catch (error) {
            addLog(`❌ Error processing clipboard item: ${error}`)
            setStatus('No image found')
          }
        }
      }
    } else {
      addLog("ℹ️ No images detected in paste")
      setStatus('No image found')
    }
  }

  const getPreviewContent = () => {
    let processedContent = content

    // Replace each placeholder with actual image
    images.forEach((image) => {
      processedContent = processedContent.replace(
        image.placeholder,
        `<img src="${image.dataUrl}" alt="${image.name}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />`,
      )
    })

    // Convert newlines to breaks
    return processedContent.replace(/\n/g, "<br />")
  }

  const removeImage = (imageId: string) => {
    const imageToRemove = images.find((img) => img.id === imageId)
    if (imageToRemove) {
      // Remove from images array
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      // Remove placeholder from content
      setContent((prev) => prev.replace(imageToRemove.placeholder, ""))
      addLog(`🗑️ Removed image: ${imageToRemove.placeholder}`)
    }
  }

  const handleClick = () => {
    divRef.current?.focus()
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Working Image Paste Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor Section */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Content Editor:</h3>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Type your content here...

Try pasting an image with Ctrl+V!"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={12}
                />
              </div>

              {images.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Attached Images ({images.length}):</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((image) => (
                      <div key={image.id} className="relative group border rounded p-2">
                        <img
                          src={image.dataUrl || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="text-xs text-gray-500 mt-1 truncate">{image.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              {showPreview && (
                <div>
                  <h3 className="font-medium mb-2">Live Preview:</h3>
                  <div className="border rounded-lg p-4 bg-gray-50 min-h-[300px]">
                    {content ? (
                      <div dangerouslySetInnerHTML={{ __html: getPreviewContent() }} style={{ lineHeight: "1.6" }} />
                    ) : (
                      <div className="text-gray-500 italic">Preview will appear here...</div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Debug Logs:</h3>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs max-h-48 overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-gray-500">No activity yet...</div>
                  ) : (
                    logs.map((log, index) => <div key={index}>{log}</div>)
                  )}
                </div>
                <Button onClick={() => setLogs([])} variant="outline" size="sm" className="mt-2">
                  Clear Logs
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        ref={divRef}
        className="border-2 border-dashed border-green-400 p-8 text-center mb-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
        onPaste={handlePaste}
        onClick={handleClick}
        tabIndex={0}
      >
        <p>Click here, then paste image (Ctrl+V)</p>
        <p className="text-sm text-gray-600 mt-2">Status: {status}</p>
      </div>

      {image && (
        <div>
          <h2 className="font-bold mb-2">Pasted Image:</h2>
          <img src={image || "/placeholder.svg"} alt="Pasted" className="max-w-full border rounded" />
          <button
            onClick={() => {
              setImage(null)
              setStatus('Ready')
            }}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
