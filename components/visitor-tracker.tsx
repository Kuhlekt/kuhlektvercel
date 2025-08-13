"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

// Helper function to get visitor data
export function getVisitorData() {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("kuhlekt_all_visitors")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Helper function to get page history
export function getPageHistory() {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("kuhlekt_page_history")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Helper function to get all visitors
export function getAllVisitors() {
  if (typeof window === "undefined") return []

  try {
    const visitors = localStorage.getItem("kuhlekt_all_visitors")
    return visitors ? JSON.parse(visitors) : []
  } catch {
    return []
  }
}

// Component that uses useSearchParams
function VisitorTrackerComponent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const now = new Date()
      const timestamp = now.toISOString()
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Get current page info
      const currentPage = {
        url: window.location.href,
        pathname: window.location.pathname,
        timestamp,
        sessionId,
        referrer: document.referrer || "direct",
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }

      // Extract UTM parameters and other query params
      const utmParams: Record<string, string> = {}
      const otherParams: Record<string, string> = {}

      searchParams.forEach((value, key) => {
        if (key.startsWith("utm_")) {
          utmParams[key] = value
        } else {
          otherParams[key] = value
        }
      })

      // Check for affiliate code
      const affiliateCode = searchParams.get("affiliate") || searchParams.get("aff") || searchParams.get("ref")

      // Create visitor entry
      const visitorEntry = {
        ...currentPage,
        utmParams,
        otherParams,
        affiliateCode,
        id: `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      // Store in page history
      try {
        const pageHistory = getPageHistory() || []
        pageHistory.push(currentPage)

        // Keep only last 100 entries
        if (pageHistory.length > 100) {
          pageHistory.splice(0, pageHistory.length - 100)
        }

        localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))
      } catch (error) {
        console.warn("Failed to store page history:", error)
      }

      // Store in all visitors
      try {
        const allVisitors = getAllVisitors()
        allVisitors.push(visitorEntry)

        // Keep only last 500 entries
        if (allVisitors.length > 500) {
          allVisitors.splice(0, allVisitors.length - 500)
        }

        localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))
      } catch (error) {
        console.warn("Failed to store visitor data:", error)
      }

      // Log for debugging
      console.log("Visitor tracked:", {
        page: currentPage.pathname,
        utm: Object.keys(utmParams).length > 0 ? utmParams : "none",
        affiliate: affiliateCode || "none",
        timestamp,
      })
    } catch (error) {
      console.warn("Visitor tracking error:", error)
    }
  }, [searchParams])

  return null
}

// Main component with error boundary
export function VisitorTracker() {
  try {
    return <VisitorTrackerComponent />
  } catch (error) {
    console.warn("VisitorTracker error:", error)
    return null
  }
}

// Also provide as default export for compatibility
export default VisitorTracker
