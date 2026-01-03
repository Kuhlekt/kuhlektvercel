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
    window.KALI_API_URL = "https://chatbot.hindleconsultants.com"
    window.TENANT_SLUG = "kuhlekt"

    const script = document.createElement("script")
    script.src = "https://chatbot.hindleconsultants.com/widget.js?v=2.7"
    script.async = true

    console.log("[v0] Loading chatbot widget from:", script.src)
    console.log("[v0] KALI_API_URL set to:", window.KALI_API_URL)

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
