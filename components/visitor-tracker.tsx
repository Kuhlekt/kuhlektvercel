"use client"

import { useEffect, useRef } from "react"

export function VisitorTracker() {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Prevent double tracking in development mode
    if (hasTracked.current) {
      return
    }

    const trackVisitor = async () => {
      try {
        // Wait a bit to ensure the page is fully loaded
        await new Promise((resolve) => setTimeout(resolve, 100))

        const trackingData = {
          page: window.location.pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }

        console.log("Attempting to track visitor:", trackingData)

        const response = await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trackingData),
        })

        if (response.ok) {
          const result = await response.json()
          console.log("Visitor tracking successful:", result)
          hasTracked.current = true
        } else {
          const errorText = await response.text()
          console.error("Failed to track visitor:", response.status, errorText)
        }
      } catch (error) {
        console.error("Error tracking visitor:", error)
      }
    }

    // Track visitor on component mount
    trackVisitor()

    // Also track on page visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && !hasTracked.current) {
        trackVisitor()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return null
}
