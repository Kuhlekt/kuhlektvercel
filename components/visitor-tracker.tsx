"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export function VisitorTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      // Get current page info
      const currentPage = window.location.pathname
      const currentUrl = window.location.href
      const referrer = document.referrer || "direct"
      const userAgent = navigator.userAgent
      const timestamp = new Date().toISOString()

      // Extract UTM parameters
      const utmSource = searchParams.get("utm_source") || ""
      const utmMedium = searchParams.get("utm_medium") || ""
      const utmCampaign = searchParams.get("utm_campaign") || ""
      const utmTerm = searchParams.get("utm_term") || ""
      const utmContent = searchParams.get("utm_content") || ""

      // Extract affiliate parameters
      const affiliate = searchParams.get("affiliate") || searchParams.get("ref") || ""

      // Generate or get visitor ID
      let visitorId = localStorage.getItem("kuhlekt_visitor_id")
      if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem("kuhlekt_visitor_id", visitorId)
        console.log("🆕 New visitor created:", visitorId)
      }

      // Get or create session ID
      let sessionId = sessionStorage.getItem("kuhlekt_session_id")
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem("kuhlekt_session_id", sessionId)
        console.log("🔄 New session created:", sessionId)
      }

      // Create page key to prevent duplicate tracking
      const pageKey = `${currentPage}_${sessionId}`
      const trackedPages = JSON.parse(sessionStorage.getItem("kuhlekt_tracked_pages") || "[]")

      if (trackedPages.includes(pageKey)) {
        console.log("📄 Page already tracked in this session:", currentPage)
        return
      }

      // Mark page as tracked
      trackedPages.push(pageKey)
      sessionStorage.setItem("kuhlekt_tracked_pages", JSON.stringify(trackedPages))

      // Get existing visitor data
      const existingVisitorData = JSON.parse(localStorage.getItem("kuhlekt_visitor_data") || "{}")

      // Update visitor data
      const visitorData = {
        ...existingVisitorData,
        visitorId,
        sessionId,
        firstVisit: existingVisitorData.firstVisit || timestamp,
        lastVisit: timestamp,
        pageViews: (existingVisitorData.pageViews || 0) + 1,
        currentPage,
        referrer: existingVisitorData.referrer || referrer,
        userAgent,
        utmSource: utmSource || existingVisitorData.utmSource || "",
        utmMedium: utmMedium || existingVisitorData.utmMedium || "",
        utmCampaign: utmCampaign || existingVisitorData.utmCampaign || "",
        utmTerm: utmTerm || existingVisitorData.utmTerm || "",
        utmContent: utmContent || existingVisitorData.utmContent || "",
        affiliate: affiliate || existingVisitorData.affiliate || "",
      }

      // Save visitor data
      localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

      // Track page history
      const pageHistory = JSON.parse(localStorage.getItem("kuhlekt_page_history") || "[]")
      const pageVisit = {
        page: currentPage,
        url: currentUrl,
        timestamp,
        sessionId,
        visitorId,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        affiliate,
      }

      pageHistory.push(pageVisit)

      // Keep only last 1000 page visits to prevent storage bloat
      if (pageHistory.length > 1000) {
        pageHistory.splice(0, pageHistory.length - 1000)
      }

      localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))

      // Track all visitors for admin
      const allVisitors = JSON.parse(localStorage.getItem("kuhlekt_all_visitors") || "[]")
      const existingVisitorIndex = allVisitors.findIndex((v: any) => v.visitorId === visitorId)

      if (existingVisitorIndex >= 0) {
        allVisitors[existingVisitorIndex] = visitorData
      } else {
        allVisitors.push(visitorData)
      }

      localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))

      // Dispatch custom event for admin dashboard updates
      const storageEvent = new CustomEvent("kuhlektStorageUpdate", {
        detail: { type: "visitor_update", data: visitorData },
      })
      window.dispatchEvent(storageEvent)

      // Store metadata for change detection
      const metadata = {
        lastUpdate: timestamp,
        totalVisitors: allVisitors.length,
        totalPageViews: pageHistory.length,
        hash: btoa(JSON.stringify({ visitors: allVisitors.length, pages: pageHistory.length })),
      }
      localStorage.setItem("kuhlekt_metadata", JSON.stringify(metadata))

      console.log("👤 Visitor tracked:", {
        visitorId,
        sessionId,
        page: currentPage,
        pageViews: visitorData.pageViews,
        affiliate,
        utmSource,
      })
    } catch (error) {
      console.error("❌ Error tracking visitor:", error)
    }
  }, [searchParams])

  // Track visibility changes (returning visitors)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const timestamp = new Date().toISOString()
        const existingData = JSON.parse(localStorage.getItem("kuhlekt_visitor_data") || "{}")
        if (existingData.visitorId) {
          existingData.lastVisit = timestamp
          localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(existingData))
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

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
