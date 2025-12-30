"use client"

import { useEffect } from "react"

export function ChatbotWidget() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).KALI_CONFIG = {
        apiUrl: "https://preview-hc-chatbot-5-2-kzmh4hio39aaeuizae7o.vusercontent.net",
        tenantSlug: "kuhlekt",
      }

      console.log("[v0] Chatbot config set:", (window as any).KALI_CONFIG)

      // The URL https://preview-hc-chatbot-5-2-kzmh4hio39aaeuizae7o.vusercontent.net/embed-floating.js
      // returns no content. Please provide a valid, working chatbot script URL.
      // const script = document.createElement("script")
      // script.src = "https://preview-hc-chatbot-5-2-kzmh4hio39aaeuizae7o.vusercontent.net/embed-floating.js"
      // script.async = false
      // script.onload = () => console.log("[v0] Chatbot widget script loaded")
      // script.onerror = (e) => console.error("[v0] Failed to load chatbot script:", e)
      // document.body.appendChild(script)

      // return () => {
      //   if (document.body.contains(script)) {
      //     document.body.removeChild(script)
      //   }
      // }
    }
  }, [])

  return null
}
