"use client"

import { useEffect } from "react"

export function KaliWidgetLoader() {
  useEffect(() => {
    const apiUrl = window.location.origin
    window.KALI_API_URL = apiUrl

    console.log("[v0] Configuring Kali Widget with API URL:", apiUrl)

    const timestamp = Date.now()
    const script = document.createElement("script")
    script.src = `https://kali.kuhlekt-info.com/widget.js?t=${timestamp}`
    script.async = true

    script.onload = () => {
      console.log("[v0] Kali widget script loaded successfully at", new Date().toISOString())
    }

    script.onerror = (e) => {
      console.error("[v0] Failed to load Kali widget script:", e)
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
