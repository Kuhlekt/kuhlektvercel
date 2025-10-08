"use client"

import { useState } from "react"
import { X } from "lucide-react"

export function ChatbotWidget() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [chatWindow, setChatWindow] = useState<Window | null>(null)

  const openChat = () => {
    const width = 400
    const height = 600
    const left = window.screen.width - width - 50
    const top = (window.screen.height - height) / 2

    const newWindow = window.open(
      "https://v0-website-chatbot-dlyj8h1nu-uhlekt.vercel.app/embed-test",
      "KaliChat",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    )

    setChatWindow(newWindow)
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center bg-white border border-gray-200"
        aria-label="Open chat"
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
          alt="Kuhlekt"
          className="w-12 h-auto"
        />
      </button>
    )
  }

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-[9999] w-[400px] rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          opacity: 0.95,
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
              alt="Kuhlekt"
              className="h-8 w-auto"
            />
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="Minimize chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat content */}
        <div className="p-6 space-y-4" style={{ height: "500px" }}>
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20200%20Pxls%20-%20Copy-60iaM5ygzmdd6ULAwb5yMc9bzHJ8J6.png"
                alt="Kuhlekt"
                className="w-20 h-auto"
              />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Hi there! 👋</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs">
                How can we help you today? Our AI assistant is ready to answer your questions.
              </p>
            </div>

            <button
              onClick={openChat}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Start Chatting
            </button>

            <p className="text-xs text-gray-500 text-center max-w-xs">
              Click to open our AI assistant in a new window for the best chat experience
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
