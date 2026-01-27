"use client"

import { useEffect, useState } from "react"

export function ChatbotDebug() {
  const [status, setStatus] = useState({
    windowHcExists: false,
    widgetScriptLoaded: false,
    initCalled: false,
    error: null as string | null,
  })

  useEffect(() => {
    const checkStatus = () => {
      try {
        // Check if window.hc exists
        const hcExists = typeof (window as any).hc === "function"

        // Check if widget script loaded
        const scripts = Array.from(document.scripts)
        const widgetLoaded = scripts.some((s) => s.src?.includes("chatbot.hindleconsultants.com"))

        // Check if init was called by looking for HC iframe or div
        const hasWidget =
          document.querySelector("iframe[id*='hc']") ||
          document.querySelector("div[id*='hc']") ||
          document.querySelector('[class*="hindleconsultants"]')

        setStatus({
          windowHcExists: hcExists,
          widgetScriptLoaded: widgetLoaded,
          initCalled: hasWidget || hcExists,
          error: null,
        })

        console.log("[Chatbot Debug]", {
          windowHcExists: hcExists,
          widgetScriptLoaded: widgetLoaded,
          hasWidget,
          scripts: scripts.length,
        })
      } catch (err) {
        setStatus((prev) => ({
          ...prev,
          error: String(err),
        }))
      }
    }

    // Check immediately
    checkStatus()

    // Check again after 2s
    const timer = setTimeout(checkStatus, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (process.env.NODE_ENV !== "development") return null

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        background: "#1a1a1a",
        color: "#0f0",
        padding: "12px",
        borderRadius: "4px",
        fontSize: "11px",
        fontFamily: "monospace",
        maxWidth: "300px",
        zIndex: 9999,
        border: "1px solid #0f0",
      }}
    >
      <div>
        <strong>Chatbot Status:</strong>
      </div>
      <div>window.hc: {status.windowHcExists ? "✓" : "✗"}</div>
      <div>widget.js: {status.widgetScriptLoaded ? "✓" : "✗"}</div>
      <div>init called: {status.initCalled ? "✓" : "✗"}</div>
      {status.error && <div style={{ color: "#f00" }}>Error: {status.error}</div>}
    </div>
  )
}
