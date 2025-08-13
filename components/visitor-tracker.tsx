"use client"

import { useEffect } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

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

        // Extract and validate affiliate code
        const affiliateCode = searchParams.get("affiliate") || searchParams.get("ref") || ""
        const isValidAffiliate = affiliateCode ? validateAffiliateCode(affiliateCode) : false

        // Get referrer
        const referrer = document.referrer || ""

        // Get user agent
        const userAgent = navigator.userAgent || ""

        // Get screen resolution
        const screenResolution = `${screen.width}x${screen.height}`

        // Get timestamp
        const timestamp = new Date().toISOString()

        // Create visitor data
        const visitorData = {
          page: pathname,
          timestamp,
          referrer,
          userAgent,
          screenResolution,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          affiliateCode,
          isValidAffiliate,
          sessionId: getOrCreateSessionId(),
          visitorId: getOrCreateVisitorId(),
        }

        // Send to tracking endpoint
        await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitorData),
        })

        // Store in localStorage for admin dashboard
        const existingData = JSON.parse(localStorage.getItem("visitorHistory") || "[]")
        existingData.push(visitorData)

        // Keep only last 100 entries
        if (existingData.length > 100) {
          existingData.splice(0, existingData.length - 100)
        }

        localStorage.setItem("visitorHistory", JSON.stringify(existingData))
      } catch (error) {
        console.error("Error tracking visitor:", error)
      }
    }

    trackVisitor()
  }, [searchParams, pathname])

  return null
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem("kuhlekt_session_id")
  if (!sessionId) {
    sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem("kuhlekt_session_id", sessionId)
  }
  return sessionId
}

function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem("kuhlekt_visitor_id")
  if (!visitorId) {
    visitorId = "visitor_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    localStorage.setItem("kuhlekt_visitor_id", visitorId)
  }
  return visitorId
}

// Error boundary wrapper
function VisitorTracker() {
  return (
    <div suppressHydrationWarning>
      <VisitorTrackerComponent />
    </div>
  )
}

export { VisitorTracker }
export default VisitorTracker
