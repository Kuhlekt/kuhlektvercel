"use client"

import { useEffect } from "react"

export function ChatbotWidget() {
  useEffect(() => {
    // Set configuration before loading the script
    if (typeof window !== "undefined") {
      ;(window as any).chatbotConfig = {
        tenantSlug: "kuhlekt",
        apiUrl: "https://chatbot.hindleconsultants.com",
      }

      console.log("[v0] Chatbot config set:", (window as any).chatbotConfig)

      // Dynamically load the widget script after config is set
      const script = document.createElement("script")
      script.src = "https://chatbot.hindleconsultants.com/embed-floating.js"
      script.async = true
      script.onload = () => {
        console.log("[v0] Chatbot widget script loaded")
      }
      script.onerror = () => {
        console.error("[v0] Failed to load chatbot widget script")
      }
      document.body.appendChild(script)

      return () => {
        // Cleanup
        document.body.removeChild(script)
      }
    }
  }, [])

  return null
}
