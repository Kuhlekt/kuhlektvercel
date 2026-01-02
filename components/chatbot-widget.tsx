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
    script.src = "https://chatbot.hindleconsultants.com/widget.js?v=2.7"
    script.async = true
    script.setAttribute("data-tenant", "kuhlekt")
    script.setAttribute("data-api-url", "https://chatbot.hindleconsultants.com")

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return null
}
