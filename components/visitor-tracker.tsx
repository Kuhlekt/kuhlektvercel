"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, usePathname } from "next/navigation"

function VisitorTrackerComponent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Extract UTM parameters
        const utmSource = searchParams.get("utm_source") || ""
        const utmMedium = searchParams.get("utm_medium") || ""
        const utmCampaign = searchParams.get("utm_campaign") || ""
        const utmTerm = searchParams.get("utm_term") || ""
        const utmContent = searchParams.get("utm_content") || ""

        // Extract affiliate code
        const affiliateCode = searchParams.get("affiliate") || searchParams.get("ref") || ""

        // Get visitor info
        const visitorData = {
          page: pathname,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          affiliateCode,
          sessionId: sessionStorage.getItem("sessionId") || Math.random().toString(36).substring(7),
        }

        // Store session ID
        if (!sessionStorage.getItem("sessionId")) {
          sessionStorage.setItem("sessionId", visitorData.sessionId)
        }

        // Track the visit
        await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitorData),
        })
      } catch (error) {
        console.error("Error tracking visitor:", error)
      }
    }

    trackVisitor()
  }, [searchParams, pathname])

  return null
}

function VisitorTrackerWrapper() {
  return (
    <Suspense fallback={null}>
      <VisitorTrackerComponent />
    </Suspense>
  )
}

export function VisitorTracker() {
  return <VisitorTrackerWrapper />
}

export default VisitorTracker
