"use client"
import { useEffect } from "react"

declare global {
  interface Window {
    chatbotConfig: {
      tenantSlug: string
      apiUrl: string
    }
  }
}

export function ChatbotWidget() {
  useEffect(() => {
    window.chatbotConfig = {
      tenantSlug: "kuhlekt",
      apiUrl: "https://chatbot.hindleconsultants.com",
    }

    const script = document.createElement("script")
    script.src = "https://chatbot.hindleconsultants.com/api/widget?v=048"
    script.async = true

    script.onerror = (error) => {
      console.error("[v0] Failed to load chatbot widget:", error)
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return null
}
