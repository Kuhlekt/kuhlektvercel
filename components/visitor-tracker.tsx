"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function VisitorTrackerComponent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get UTM parameters and other tracking data
        const utmSource = searchParams.get("utm_source") || ""
        const utmMedium = searchParams.get("utm_medium") || ""
        const utmCampaign = searchParams.get("utm_campaign") || ""
        const utmTerm = searchParams.get("utm_term") || ""
        const utmContent = searchParams.get("utm_content") || ""
        const affiliate = searchParams.get("affiliate") || searchParams.get("aff") || ""
        const referrer = document.referrer || ""
        const userAgent = navigator.userAgent || ""
        const currentUrl = window.location.href
        const timestamp = new Date().toISOString()

        // Get visitor's IP and location (this would typically be done server-side)
        const visitorData = {
          url: currentUrl,
          referrer,
          userAgent,
          timestamp,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          affiliate,
          sessionId: sessionStorage.getItem("sessionId") || generateSessionId(),
        }

        // Store session ID if not exists
        if (!sessionStorage.getItem("sessionId")) {
          sessionStorage.setItem("sessionId", visitorData.sessionId)
        }

        // Send tracking data to your analytics endpoint
        await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitorData),
        }).catch((error) => {
          console.warn("Visitor tracking failed:", error)
        })
      } catch (error) {
        console.warn("Visitor tracking error:", error)
      }
    }

    // Track visitor on component mount
    trackVisitor()
  }, [searchParams])

  return null
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <VisitorTrackerComponent />
    </Suspense>
  )
}

export default VisitorTracker
