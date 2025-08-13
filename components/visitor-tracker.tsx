"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function VisitorTrackerComponent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get UTM parameters
        const utmSource = searchParams.get("utm_source") || ""
        const utmMedium = searchParams.get("utm_medium") || ""
        const utmCampaign = searchParams.get("utm_campaign") || ""
        const utmTerm = searchParams.get("utm_term") || ""
        const utmContent = searchParams.get("utm_content") || ""

        // Get affiliate code
        const affiliateCode = searchParams.get("ref") || searchParams.get("affiliate") || ""

        // Get referrer
        const referrer = document.referrer || ""

        // Get current page
        const currentPage = window.location.pathname

        // Get user agent
        const userAgent = navigator.userAgent

        // Get timestamp
        const timestamp = new Date().toISOString()

        // Get session ID (create if doesn't exist)
        let sessionId = sessionStorage.getItem("kuhlekt_session_id")
        if (!sessionId) {
          sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
          sessionStorage.setItem("kuhlekt_session_id", sessionId)
        }

        // Get visitor ID (create if doesn't exist)
        let visitorId = localStorage.getItem("kuhlekt_visitor_id")
        if (!visitorId) {
          visitorId = "visitor_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
          localStorage.setItem("kuhlekt_visitor_id", visitorId)
        }

        // Prepare tracking data
        const trackingData = {
          visitorId,
          sessionId,
          timestamp,
          currentPage,
          referrer,
          userAgent,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          affiliateCode,
          screenResolution: `${screen.width}x${screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
        }

        // Send tracking data to your analytics endpoint
        // For now, we'll just log it to console in development
        if (process.env.NODE_ENV === "development") {
          console.log("Visitor tracking data:", trackingData)
        }

        // In production, you would send this to your analytics service
        // await fetch('/api/track-visitor', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(trackingData)
        // })
      } catch (error) {
        console.error("Error tracking visitor:", error)
      }
    }

    // Track on component mount
    trackVisitor()

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trackVisitor()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [searchParams])

  return null
}

export function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <VisitorTrackerComponent />
    </Suspense>
  )
}

export default VisitorTracker
