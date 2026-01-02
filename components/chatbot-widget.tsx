"use client"

import { useEffect } from "react"

export function ChatbotWidget() {
  useEffect(() => {
    ;(window as any).chatbotConfig = {
      tenantSlug: "kuhlekt",
      apiUrl: "https://chatbot.hindleconsultants.com",
    }

    console.log("[v0] Chatbot config set:", (window as any).chatbotConfig)

    const script = document.createElement("script")
    script.src = "https://chatbot.hindleconsultants.com/embed-floating.js"
    script.async = true
    script.setAttribute("data-tenant", "kuhlekt")
    script.setAttribute("data-api-url", "https://chatbot.hindleconsultants.com")

    script.onload = () => {
      console.log("[v0] Chatbot script loaded successfully")
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

  return null
}
