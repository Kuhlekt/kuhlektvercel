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
    window.KALI_API_URL = "https://preview-hc-chatbot-v200-3.vercel.app"
    window.TENANT_SLUG = "kuhlekt"

    const script = document.createElement("script")
    script.src = "https://preview-hc-chatbot-v200-3.vercel.app/api/widget?v=048"
    script.async = true

    script.onload = () => {
      console.log("[v0] Chatbot widget loaded successfully")
    }

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
