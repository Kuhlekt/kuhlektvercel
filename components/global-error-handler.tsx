"use client"

import { useEffect } from "react"

export function GlobalErrorHandler() {
  useEffect(() => {
    // Add global unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if this is a null rejection (likely from reCAPTCHA)
      if (event.reason === null || event.reason === undefined) {
        console.log("[v0] Suppressing null promise rejection from reCAPTCHA")
        event.preventDefault() // Prevent default browser logging
        return
      }

      // Log other rejections for debugging
      console.warn("[v0] Unhandled promise rejection:", event.reason)
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null // This component doesn't render anything
}
