"use client"

import { useEffect } from "react"
import { useSearchParams, usePathname } from "next/navigation"

// Helper function to generate visitor ID
function generateVisitorId(): string {
  return "visitor_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
}

// Helper function to generate session ID
function generateSessionId(): string {
  return "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
}

// Helper function to extract UTM parameters
function extractUTMParams(searchParams: URLSearchParams) {
  return {
    utmSource: searchParams.get("utm_source") || undefined,
    utmMedium: searchParams.get("utm_medium") || undefined,
    utmCampaign: searchParams.get("utm_campaign") || undefined,
    utmTerm: searchParams.get("utm_term") || undefined,
    utmContent: searchParams.get("utm_content") || undefined,
    affiliate: searchParams.get("affiliate") || searchParams.get("aff") || undefined,
  }
}

// Helper function to validate affiliate codes
function validateAffiliate(affiliate: string | undefined): string | undefined {
  if (!affiliate) return undefined

  const validAffiliates = ["PARTNER001", "PARTNER002", "RESELLER001", "AGENCY001"]
  return validAffiliates.includes(affiliate.toUpperCase()) ? affiliate.toUpperCase() : undefined
}

// Component that uses useSearchParams
function VisitorTrackerComponent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    try {
      // Get or create visitor ID
      let visitorId = localStorage.getItem("kuhlekt_visitor_id")
      if (!visitorId) {
        visitorId = generateVisitorId()
        localStorage.setItem("kuhlekt_visitor_id", visitorId)
      }

      // Get or create session ID
      let sessionId = sessionStorage.getItem("kuhlekt_session_id")
      if (!sessionId) {
        sessionId = generateSessionId()
        sessionStorage.setItem("kuhlekt_session_id", sessionId)
      }

      // Extract UTM parameters and affiliate
      const utmParams = extractUTMParams(searchParams)
      const validatedAffiliate = validateAffiliate(utmParams.affiliate)

      // Get referrer
      const referrer = document.referrer || "direct"

      // Get or update visitor data
      const existingData = localStorage.getItem("kuhlekt_visitor_data")
      let visitorData = existingData ? JSON.parse(existingData) : null

      const now = new Date().toISOString()

      if (!visitorData) {
        // New visitor
        visitorData = {
          visitorId,
          sessionId,
          firstVisit: now,
          lastVisit: now,
          pageViews: 1,
          referrer,
          userAgent: navigator.userAgent,
          currentPage: pathname,
          ...utmParams,
          affiliate: validatedAffiliate,
        }
      } else {
        // Existing visitor
        visitorData = {
          ...visitorData,
          sessionId, // Update session ID
          lastVisit: now,
          pageViews: (visitorData.pageViews || 0) + 1,
          currentPage: pathname,
          // Update UTM params if they exist in current visit
          ...(utmParams.utmSource && { utmSource: utmParams.utmSource }),
          ...(utmParams.utmMedium && { utmMedium: utmParams.utmMedium }),
          ...(utmParams.utmCampaign && { utmCampaign: utmParams.utmCampaign }),
          ...(utmParams.utmTerm && { utmTerm: utmParams.utmTerm }),
          ...(utmParams.utmContent && { utmContent: utmParams.utmContent }),
          ...(validatedAffiliate && { affiliate: validatedAffiliate }),
        }
      }

      // Save visitor data
      localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

      // Update all visitors list for admin
      const allVisitors = JSON.parse(localStorage.getItem("kuhlekt_all_visitors") || "[]")
      const existingIndex = allVisitors.findIndex((v: any) => v.visitorId === visitorId)

      if (existingIndex >= 0) {
        allVisitors[existingIndex] = visitorData
      } else {
        allVisitors.push(visitorData)
      }

      localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))

      // Track page history
      const pageHistory = JSON.parse(localStorage.getItem("kuhlekt_page_history") || "[]")
      pageHistory.push({
        page: pathname,
        timestamp: now,
        sessionId,
      })

      // Keep only last 1000 page views
      if (pageHistory.length > 1000) {
        pageHistory.splice(0, pageHistory.length - 1000)
      }

      localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))

      // Dispatch storage event for real-time admin updates
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "kuhlekt_visitor_data",
          newValue: JSON.stringify(visitorData),
        }),
      )

      console.log("Visitor tracked:", {
        visitorId,
        sessionId,
        page: pathname,
        utmParams,
        affiliate: validatedAffiliate,
      })
    } catch (error) {
      console.error("Error tracking visitor:", error)
    }
  }, [searchParams, pathname])

  return null
}

// Wrapper component with error boundary
export function VisitorTracker() {
  try {
    return <VisitorTrackerComponent />
  } catch (error) {
    console.error("VisitorTracker error:", error)
    return null
  }
}

export default VisitorTracker

// Helper functions for admin use
export function getVisitorData() {
  if (typeof window === "undefined") return null
  try {
    const data = localStorage.getItem("kuhlekt_visitor_data")
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function getPageHistory() {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem("kuhlekt_page_history")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getAllVisitors() {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem("kuhlekt_all_visitors")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}
