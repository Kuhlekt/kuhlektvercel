"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Only track in browser environment
        if (typeof window === "undefined") return

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
            referrer: document.referrer || "",
            userAgent: navigator.userAgent || "",
          }),
        }).catch(() => {
          // Silently handle fetch errors
          console.log("Visitor tracking unavailable")
        })
      } catch (error) {
        // Silently handle any tracking errors
        console.log("Visitor tracking error:", error)
      }
    }

    // Add a small delay to ensure page is loaded
    const timer = setTimeout(trackVisit, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
