"use client"

import { useEffect } from "react"

export function ChatbotWidget() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).chatbotConfig = {
        tenantSlug: "kuhlekt",
        apiUrl: "https://chatbot.hindleconsultants.com",
      }

      console.log("[v0] Chatbot config set:", (window as any).chatbotConfig)

      const script = document.createElement("script")
      script.src = "https://chatbot.hindleconsultants.com/embed-floating.js"
      script.async = true
      script.onload = () => console.log("[v0] Chatbot widget script loaded")
      script.onerror = (e) => console.error("[v0] Failed to load chatbot script:", e)
      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [])

  return null
}
