"use client"

import { useEffect, useState } from "react"
import { X, MessageCircle } from "lucide-react"

export function ChatbotWidget() {
  const [isMinimized, setIsMinimized] = useState(false)

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
      const container = document.getElementById("kali-chat-container")
      if (container) {
        container.style.display = "block"
        container.style.visibility = "visible"
        container.style.opacity = "1"
        console.log("[v0] Container forced visible")

        setTimeout(() => {
          console.log("[v0] Container has children:", container.children.length)
          console.log("[v0] Container innerHTML length:", container.innerHTML.length)
        }, 2000)
      }
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

  return (
    <>
      {!isMinimized && (
        <>
          <div
            id="kali-chat-container"
            style={{
              width: "350px",
              height: "637px", // Increased height by 8% from 590px to 637px
              position: "fixed",
              bottom: 0,
              right: 0,
              zIndex: 9999,
              display: "block",
              visibility: "visible",
              opacity: 1,
              backgroundColor: "#f5f5f5",
            }}
          />
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              position: "fixed",
              bottom: "597px", // Adjusted close button position for new height (637px - 40px = 597px)
              right: "8px",
              zIndex: 10000,
            }}
            className="rounded-full bg-white/90 p-1 text-gray-700 shadow-md transition-all duration-200 hover:bg-white hover:text-gray-900 hover:shadow-lg"
            aria-label="Minimize chatbot"
            title="Minimize chatbot"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      )}

      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 10000,
          }}
          className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
          aria-label="Open chatbot"
          title="Open chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </>
  )
}
