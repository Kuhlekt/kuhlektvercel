"use client"

import { useEffect } from "react"

export function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const response = await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: window.location.pathname,
            referrer: document.referrer || null,
            userAgent: navigator.userAgent,
          }),
        })

        if (!response.ok) {
          console.error("Failed to track visitor")
        }
      } catch (error) {
        console.error("Error tracking visitor:", error)
      }
    }

    // Track visitor on component mount
    trackVisitor()
  }, [])

  return null
}
