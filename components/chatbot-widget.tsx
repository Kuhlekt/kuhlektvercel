"use client"

import { useState } from "react"
import { X, ExternalLink } from "lucide-react"

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  const chatbotUrl = "https://v0-website-chatbot-eight.vercel.app"

  const openInNewWindow = () => {
    window.open(chatbotUrl, "KuhlektChat", "width=450,height=700,left=100,top=100")
  }

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
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
                alt="Kuhlekt"
                className="h-8 object-contain"
              />
              <span className="text-sm font-medium text-white">Kali Chat</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 relative bg-gray-50">
            {!iframeError ? (
              <iframe
                src={chatbotUrl}
                title="Kali Chat"
                className="h-full w-full border-none"
                onError={() => setIframeError(true)}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-6">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
                    alt="Kuhlekt"
                    className="h-20 object-contain"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Chat in New Window</h3>
                <p className="mb-6 text-sm text-gray-600">
                  For the best experience, open the chat in a separate window.
                </p>
                <button
                  onClick={openInNewWindow}
                  className="flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
