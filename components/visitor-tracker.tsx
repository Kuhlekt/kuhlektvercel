"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export function VisitorTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get UTM parameters and referrer
        const utmSource = searchParams.get("utm_source") || ""
        const utmMedium = searchParams.get("utm_medium") || ""
        const utmCampaign = searchParams.get("utm_campaign") || ""
        const utmTerm = searchParams.get("utm_term") || ""
        const utmContent = searchParams.get("utm_content") || ""
        const affiliate = searchParams.get("affiliate") || ""
        const referrer = document.referrer || ""
        const userAgent = navigator.userAgent || ""
        const currentPage = window.location.pathname + window.location.search

        // Create visitor data
        const visitorData = {
          timestamp: new Date().toISOString(),
          page: currentPage,
          referrer,
          userAgent,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          affiliate,
          sessionId: getOrCreateSessionId(),
          visitorId: getOrCreateVisitorId(),
        }

        // Send to tracking endpoint (you'll need to create this)
        await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitorData),
        })
      } catch (error) {
        // Silently fail - don't break the page if tracking fails
        console.error("Visitor tracking failed:", error)
      }
    }

    trackVisitor()
  }, [searchParams])

  return null // This component doesn't render anything
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem("kuhlekt_session_id")
  if (!sessionId) {
    sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem("kuhlekt_session_id", sessionId)
  }
  return sessionId
}

function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem("kuhlekt_visitor_id")
  if (!visitorId) {
    visitorId = "vis_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    localStorage.setItem("kuhlekt_visitor_id", visitorId)
  }
  return visitorId
}
