"use client"
import { useEffect } from "react"

declare global {
  interface Window {
    KALI_API_URL: string
    TENANT_SLUG: string
  }
}

export function ChatbotWidget() {
  useEffect(() => {
    window.KALI_API_URL = "https://hc-chatbot-v4.vercel.app"
    window.TENANT_SLUG = "kuhlekt"

    const script = document.createElement("script")
    script.src = "https://hc-chatbot-v4.vercel.app/widget.js?v=2.7"
    script.async = true

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return null
}
