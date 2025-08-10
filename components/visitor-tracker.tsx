"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get or create session ID
        let sessionId = sessionStorage.getItem("kuhlekt_session_id")
        if (!sessionId) {
          sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
          sessionStorage.setItem("kuhlekt_session_id", sessionId)
        }

        // Track the visit
        await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            page: pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          }),
        })
      } catch (error) {
        console.error("Error tracking visitor:", error)
      }
    }

    trackVisit()
  }, [pathname])

  return null
}
