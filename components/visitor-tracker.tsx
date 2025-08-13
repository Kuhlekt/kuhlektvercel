"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export function VisitorTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get URL parameters
        const utmSource = searchParams.get("utm_source")
        const utmMedium = searchParams.get("utm_medium")
        const utmCampaign = searchParams.get("utm_campaign")
        const affiliateId = searchParams.get("affiliate_id")
        const referrer = document.referrer
        const currentPage = window.location.pathname

        // Create visitor data
        const visitorData = {
          page: currentPage,
          referrer: referrer || null,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          affiliate_id: affiliateId,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }

        // Store in localStorage for client-side tracking
        const existingData = localStorage.getItem("visitor_tracking") || "[]"
        const trackingData = JSON.parse(existingData)
        trackingData.push(visitorData)

        // Keep only last 10 entries to avoid storage bloat
        if (trackingData.length > 10) {
          trackingData.splice(0, trackingData.length - 10)
        }

        localStorage.setItem("visitor_tracking", JSON.stringify(trackingData))

        // Try to send to API (optional - will fail gracefully if table doesn't exist)
        try {
          await fetch("/api/track-visitor", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(visitorData),
          })
        } catch (apiError) {
          // Silently fail - localStorage tracking still works
          console.log("API tracking unavailable, using localStorage only")
        }
      } catch (error) {
        // Silently fail to avoid breaking the page
        console.log("Visitor tracking error:", error)
      }
    }

    // Track after a short delay to ensure page is loaded
    const timer = setTimeout(trackVisitor, 1000)
    return () => clearTimeout(timer)
  }, [searchParams])

  return null
}

export default VisitorTracker
