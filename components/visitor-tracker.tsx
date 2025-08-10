"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// Client-side visitor tracking component
export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Generate or get session ID from sessionStorage
    let sessionId = sessionStorage.getItem("visitor-session-id")
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("visitor-session-id", sessionId)
    }

    // Track the page view
    const trackPageView = async () => {
      try {
        await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: pathname,
            sessionId,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error("Failed to track visitor:", error)
      }
    }

    // Track immediately
    trackPageView()

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trackPageView()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}
