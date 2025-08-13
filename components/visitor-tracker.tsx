"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

interface VisitorData {
  sessionId: string
  visitorId: string
  timestamp: string
  page: string
  userAgent: string
  referrer: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  affiliate?: string
  ipAddress?: string
}

function VisitorTrackerComponent() {
  const searchParams = useSearchParams()
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    const trackVisitor = async () => {
      try {
        // Generate or get existing visitor ID
        let visitorId = localStorage.getItem("kuhlekt_visitor_id")
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem("kuhlekt_visitor_id", visitorId)
        }

        // Generate session ID
        let sessionId = sessionStorage.getItem("kuhlekt_session_id")
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          sessionStorage.setItem("kuhlekt_session_id", sessionId)
        }

        // Extract UTM parameters
        const utmSource = searchParams.get("utm_source")
        const utmMedium = searchParams.get("utm_medium")
        const utmCampaign = searchParams.get("utm_campaign")
        const utmTerm = searchParams.get("utm_term")
        const utmContent = searchParams.get("utm_content")
        const affiliate = searchParams.get("affiliate") || searchParams.get("ref")

        // Validate affiliate code if present
        let validatedAffiliate: string | undefined
        if (affiliate) {
          try {
            const { validateAffiliate } = await import("@/lib/affiliate-validation")
            const isValid = validateAffiliate(affiliate)
            if (isValid) {
              validatedAffiliate = affiliate.toUpperCase()
              // Store validated affiliate in localStorage for future reference
              localStorage.setItem("kuhlekt_affiliate", validatedAffiliate)
            }
          } catch (error) {
            console.warn("Failed to validate affiliate code:", error)
          }
        } else {
          // Check if we have a stored affiliate
          const storedAffiliate = localStorage.getItem("kuhlekt_affiliate")
          if (storedAffiliate) {
            validatedAffiliate = storedAffiliate
          }
        }

        const visitorData: VisitorData = {
          sessionId,
          visitorId,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
          ...(utmSource && { utmSource }),
          ...(utmMedium && { utmMedium }),
          ...(utmCampaign && { utmCampaign }),
          ...(utmTerm && { utmTerm }),
          ...(utmContent && { utmContent }),
          ...(validatedAffiliate && { affiliate: validatedAffiliate }),
        }

        // Store visitor data in Supabase
        const response = await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitorData),
        })

        if (!response.ok) {
          console.warn("Failed to track visitor:", response.statusText)
        }
      } catch (error) {
        console.warn("Error tracking visitor:", error)
      }
    }

    // Track after a short delay to ensure page is loaded
    const timeoutId = setTimeout(trackVisitor, 100)

    return () => clearTimeout(timeoutId)
  }, [searchParams])

  return null
}

export function VisitorTracker() {
  return (
    <div className="visitor-tracker">
      <VisitorTrackerComponent />
    </div>
  )
}

export default VisitorTracker
