"use client"

import { useEffect } from "react"

export function KaliWidgetLoader() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes("kali") || key.includes("session") || key.includes("chat"))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => {
        console.log("[v0] Clearing stored session data:", key)
        localStorage.removeItem(key)
      })
    }

    window.KALI_API_URL = "https://kali.kuhlekt-info.com"
    window.KALI_FALLBACK_API_URL = window.location.origin

    console.log("[v0] Configuring Kali Widget v2.4")
    console.log("[v0] Primary API URL:", window.KALI_API_URL)
    console.log("[v0] Fallback API URL:", window.KALI_FALLBACK_API_URL)

    const timestamp = Date.now()
    const script = document.createElement("script")
    script.src = `https://kali.kuhlekt-info.com/widget.js?v=2.4&t=${timestamp}`
    script.async = true

    script.onload = () => {
      console.log("[v0] Kali widget v2.4 loaded successfully at", new Date().toISOString())
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
