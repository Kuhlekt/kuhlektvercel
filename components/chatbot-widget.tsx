"use client"

import { useEffect } from "react"

export function ChatbotWidget() {
  useEffect(() => {
    // Set the chatbot configuration
    ;(window as any).chatbotConfig = {
      tenantSlug: "kuhlekt",
      apiUrl: "https://chatbot.hindleconsultants.com",
    }

    // Load the chatbot script
    const script = document.createElement("script")
    script.src = "https://chatbot.hindleconsultants.com/embed-inline.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Return the container element that the inline embed expects
  return (
    <div
      id="kali-chat-container"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "400px",
        height: "600px",
        zIndex: 9999,
      }}
    />
  )
}
