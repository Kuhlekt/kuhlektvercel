"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { validateAffiliate } from "@/lib/affiliate-validation"

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
  pageViews?: number
  firstVisit?: string
  lastVisit?: string
}

// Helper function to get visitor data (can be used by forms)
export function getVisitorData() {
  if (typeof window === "undefined") return null

  try {
    const visitorDataStr = localStorage.getItem("kuhlekt_visitor_data")
    return visitorDataStr ? JSON.parse(visitorDataStr) : null
  } catch (error) {
    console.error("Error getting visitor data:", error)
    return null
  }
}

// Helper function to get page history
export function getPageHistory() {
  if (typeof window === "undefined") return []

  try {
    const historyStr = localStorage.getItem("kuhlekt_page_history")
    return historyStr ? JSON.parse(historyStr) : []
  } catch (error) {
    console.error("Error getting page history:", error)
    return []
  }
}

// Helper function to get all visitors (for admin)
export function getAllVisitors() {
  if (typeof window === "undefined") return []

  try {
    const allVisitorsStr = localStorage.getItem("kuhlekt_all_visitors")
    return allVisitorsStr ? JSON.parse(allVisitorsStr) : []
  } catch (error) {
    console.error("Error getting all visitors:", error)
    return []
  }
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
          const isValid = validateAffiliate(affiliate)
          if (isValid) {
            validatedAffiliate = affiliate.toUpperCase()
            // Store validated affiliate in localStorage for future reference
            localStorage.setItem("kuhlekt_affiliate", validatedAffiliate)
          }
        } else {
          // Check if we have a stored affiliate
          const storedAffiliate = localStorage.getItem("kuhlekt_affiliate")
          if (storedAffiliate) {
            validatedAffiliate = storedAffiliate
          }
        }

        // Get existing visitor data
        const existingVisitorData = getVisitorData()
        const isFirstVisit = !existingVisitorData

        const visitorData: VisitorData = {
          sessionId,
          visitorId,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
          pageViews: (existingVisitorData?.pageViews || 0) + 1,
          firstVisit: existingVisitorData?.firstVisit || new Date().toISOString(),
          lastVisit: new Date().toISOString(),
          ...(utmSource && { utmSource }),
          ...(utmMedium && { utmMedium }),
          ...(utmCampaign && { utmCampaign }),
          ...(utmTerm && { utmTerm }),
          ...(utmContent && { utmContent }),
          ...(validatedAffiliate && { affiliate: validatedAffiliate }),
        }

        // Save visitor data to localStorage
        localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

        // Track page visit
        const pageKey = `${sessionId}_${window.location.pathname}`
        const lastPageKey = sessionStorage.getItem("kuhlekt_last_page_key")

        if (lastPageKey !== pageKey) {
          sessionStorage.setItem("kuhlekt_last_page_key", pageKey)

          // Add to page history
          const pageHistory = getPageHistory()
          pageHistory.push({
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            sessionId,
          })

          // Keep only last 1000 page views to prevent storage bloat
          if (pageHistory.length > 1000) {
            pageHistory.splice(0, pageHistory.length - 1000)
          }

          localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))
        }

        // Update all visitors list (for admin tracking)
        const allVisitors = getAllVisitors()
        const existingVisitorIndex = allVisitors.findIndex((v) => v.visitorId === visitorId)

        if (existingVisitorIndex >= 0) {
          allVisitors[existingVisitorIndex] = visitorData
        } else {
          allVisitors.push(visitorData)
        }

        localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))

        // Dispatch storage event for real-time admin updates
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "kuhlekt_all_visitors",
            newValue: JSON.stringify(allVisitors),
          }),
        )

        // Try to store visitor data in database (optional - won't break if it fails)
        try {
          const response = await fetch("/api/track-visitor", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(visitorData),
          })

          if (!response.ok) {
            console.warn("Failed to track visitor in database:", response.statusText)
          }
        } catch (dbError) {
          console.warn("Database tracking failed (continuing with localStorage):", dbError)
        }

        console.log("🔍 Visitor tracked:", {
          visitorId: visitorId.slice(0, 16) + "...",
          sessionId: sessionId.slice(0, 16) + "...",
          page: window.location.pathname,
          isFirstVisit,
          pageViews: visitorData.pageViews,
          utmSource,
          utmCampaign,
          affiliate: validatedAffiliate,
        })
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
