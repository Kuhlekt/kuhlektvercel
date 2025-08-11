"use client"

import { useEffect } from "react"

// Predefined affiliate table for validation
const affiliateTable = ["PARTNER001", "PARTNER002", "RESELLER01", "CHANNEL01", "AFFILIATE01", "PROMO2024", "SPECIAL01"]

interface VisitorData {
  visitorId: string
  sessionId: string
  firstVisit: string
  lastVisit: string
  pageViews: number
  referrer: string
  userAgent: string
  currentPage: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  affiliate?: string
}

export function VisitorTracker() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      // Generate unique IDs
      const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Get or create visitor ID (persistent across sessions)
      let visitorId = localStorage.getItem("kuhlekt_visitor_id")
      if (!visitorId) {
        visitorId = generateId()
        localStorage.setItem("kuhlekt_visitor_id", visitorId)
        console.log("New visitor ID created:", visitorId)
      }

      // Generate session ID (new for each session)
      let sessionId = sessionStorage.getItem("kuhlekt_session_id")
      if (!sessionId) {
        sessionId = generateId()
        sessionStorage.setItem("kuhlekt_session_id", sessionId)
        console.log("New session ID created:", sessionId)
      }

      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const affiliate = urlParams.get("affiliate") || urlParams.get("aff") || urlParams.get("ref")

      // Validate affiliate against predefined table
      const validAffiliate =
        affiliate && affiliateTable.includes(affiliate.toUpperCase()) ? affiliate.toUpperCase() : undefined

      // Get existing visitor data or create new
      const existingDataStr = localStorage.getItem("kuhlekt_visitor_data")
      let visitorData: VisitorData

      const currentTime = new Date().toISOString()
      const currentPage = window.location.pathname + window.location.search

      if (existingDataStr) {
        try {
          visitorData = JSON.parse(existingDataStr)
          visitorData.lastVisit = currentTime
          visitorData.pageViews += 1
          visitorData.sessionId = sessionId
          visitorData.currentPage = currentPage
          console.log("Updated existing visitor data")
        } catch (parseError) {
          console.error("Error parsing existing visitor data:", parseError)
          // Create new data if parsing fails
          visitorData = createNewVisitorData()
        }
      } else {
        visitorData = createNewVisitorData()
        console.log("Created new visitor data")
      }

      function createNewVisitorData(): VisitorData {
        return {
          visitorId: visitorId!,
          sessionId: sessionId!,
          firstVisit: currentTime,
          lastVisit: currentTime,
          pageViews: 1,
          referrer: document.referrer || "direct",
          userAgent: navigator.userAgent,
          currentPage: currentPage,
          utmSource: urlParams.get("utm_source") || undefined,
          utmMedium: urlParams.get("utm_medium") || undefined,
          utmCampaign: urlParams.get("utm_campaign") || undefined,
          utmTerm: urlParams.get("utm_term") || undefined,
          utmContent: urlParams.get("utm_content") || undefined,
          affiliate: validAffiliate,
        }
      }

      // Update affiliate if new valid one is provided
      if (validAffiliate && (!visitorData.affiliate || visitorData.affiliate !== validAffiliate)) {
        visitorData.affiliate = validAffiliate
        console.log("Updated affiliate code:", validAffiliate)
      }

      // Store updated visitor data
      localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

      // Store in all visitors array for admin tracking
      try {
        const allVisitorsStr = localStorage.getItem("kuhlekt_all_visitors")
        let allVisitors: VisitorData[] = allVisitorsStr ? JSON.parse(allVisitorsStr) : []

        // Find existing visitor or add new one
        const existingIndex = allVisitors.findIndex((v) => v.visitorId === visitorData.visitorId)
        if (existingIndex >= 0) {
          allVisitors[existingIndex] = visitorData
        } else {
          allVisitors.push(visitorData)
        }

        // Keep only last 100 visitors to prevent storage bloat
        if (allVisitors.length > 100) {
          allVisitors = allVisitors.slice(-100)
        }

        localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))
      } catch (error) {
        console.error("Error updating all visitors data:", error)
      }

      // Log tracking data for debugging
      console.log("Visitor tracking active:", {
        visitorId: visitorData.visitorId,
        sessionId: visitorData.sessionId,
        pageViews: visitorData.pageViews,
        currentPage: visitorData.currentPage,
        affiliate: visitorData.affiliate,
        utm: {
          source: visitorData.utmSource,
          medium: visitorData.utmMedium,
          campaign: visitorData.utmCampaign,
        },
      })

      // Store page visit history
      const pageHistory = JSON.parse(localStorage.getItem("kuhlekt_page_history") || "[]")
      pageHistory.push({
        page: currentPage,
        timestamp: currentTime,
        sessionId: sessionId,
      })

      // Keep only last 50 page visits
      if (pageHistory.length > 50) {
        pageHistory.splice(0, pageHistory.length - 50)
      }

      localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))
    } catch (error) {
      console.error("Error in visitor tracking:", error)
    }
  }, []) // Empty dependency array - only run once on mount

  // This component doesn't render anything
  return null
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
