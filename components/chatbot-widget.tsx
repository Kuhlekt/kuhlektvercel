"use client"

import { useState, useEffect } from "react"
import { X, MessageCircle } from "lucide-react"

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  const chatbotUrl = "https://kali.kuhlekt-info.com/embed-test"

  useEffect(() => {
    if (isOpen) {
      setIframeError(false)
    }
  }, [isOpen])

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Open chat"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
            alt="Kuhlekt"
            className="h-10 w-10 object-contain"
          />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">Kali Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 relative bg-white">
            {!iframeError ? (
              <iframe
                src={chatbotUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Kali AI Assistant"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center bg-gray-50">
                <div className="mb-4 rounded-full bg-gray-100 p-6">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
                    alt="Kuhlekt"
                    className="h-16 object-contain"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Unable to load chat</h3>
                <p className="mb-6 text-sm text-gray-600">
                  The chat widget couldn't be embedded. Please open it in a new window.
                </p>
                <a
                  href={chatbotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  Open in New Window
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
