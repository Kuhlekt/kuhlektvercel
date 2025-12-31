"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

export function ChatbotWidget() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    ;(window as any).chatbotConfig = {
      tenantSlug: "",
      apiUrl: "https://chatbot.hindleconsultants.com",
    }

    console.log("[v0] Chatbot config set:", (window as any).chatbotConfig)

    const script = document.createElement("script")
    script.src = "https://chatbot.hindleconsultants.com/embed-inline.js"
    script.async = true

    script.onload = () => {
      console.log("[v0] Chatbot widget script loaded successfully")
    }

    script.onerror = (error) => {
      console.error("[v0] Failed to load chatbot script:", error)
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <>
      <div
        id="kali-chat-container"
        style={{
          width: "400px",
          height: "600px",
          position: "fixed",
          bottom: 0,
          right: 0,
          zIndex: 9999,
        }}
      />
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: "fixed",
          bottom: "560px",
          right: "360px",
          zIndex: 10000,
        }}
        className="bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-1.5 shadow-md transition-all duration-200 hover:shadow-lg"
        aria-label="Close chatbot"
        title="Close chatbot"
      >
        <X className="h-5 w-5" />
      </button>
    </>
  )
}
