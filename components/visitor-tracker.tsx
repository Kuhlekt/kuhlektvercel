"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

interface VisitorData {
  visitorId: string
  sessionId: string
  pageViews: number
  currentPage: string
  referrer: string
  userAgent: string
  timestamp: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  affiliate?: string
}

export function VisitorTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    try {
      // Generate or get visitor ID
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

      // Get existing visitor data
      const existingDataStr = localStorage.getItem("kuhlekt_visitor_data")
      let existingData: VisitorData | null = null
      try {
        existingData = existingDataStr ? JSON.parse(existingDataStr) : null
      } catch (e) {
        console.error("Error parsing visitor data:", e)
      }

      const utmSource = searchParams?.get("utm_source") || undefined
      const utmMedium = searchParams?.get("utm_medium") || undefined
      const utmCampaign = searchParams?.get("utm_campaign") || undefined
      const utmTerm = searchParams?.get("utm_term") || undefined
      const utmContent = searchParams?.get("utm_content") || undefined

      const affiliate = searchParams?.get("affiliate") || searchParams?.get("ref") || undefined

      // Create visitor data
      const visitorData: VisitorData = {
        visitorId,
        sessionId,
        pageViews: (existingData?.pageViews || 0) + 1,
        currentPage: pathname,
        referrer: document.referrer || "direct",
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ...(utmSource && { utmSource }),
        ...(utmMedium && { utmMedium }),
        ...(utmCampaign && { utmCampaign }),
        ...(utmTerm && { utmTerm }),
        ...(utmContent && { utmContent }),
        ...(affiliate && { affiliate }),
      }

      // Store visitor data
      localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

      // Track page history
      const pageHistoryStr = localStorage.getItem("kuhlekt_page_history")
      let pageHistory: any[] = []
      try {
        pageHistory = pageHistoryStr ? JSON.parse(pageHistoryStr) : []
      } catch (e) {
        console.error("Error parsing page history:", e)
      }

      const pageEntry = {
        page: pathname,
        timestamp: new Date().toISOString(),
        sessionId,
        visitorId,
        referrer: document.referrer || "direct",
        ...(utmSource && { utmSource }),
        ...(affiliate && { affiliate }),
      }

      pageHistory.push(pageEntry)

      // Keep only last 1000 entries
      if (pageHistory.length > 1000) {
        pageHistory = pageHistory.slice(-1000)
      }

      localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))

      // Track all visitors for admin
      const allVisitorsStr = localStorage.getItem("kuhlekt_all_visitors")
      let allVisitors: any[] = []
      try {
        allVisitors = allVisitorsStr ? JSON.parse(allVisitorsStr) : []
      } catch (e) {
        console.error("Error parsing all visitors:", e)
      }

      // Check if visitor already exists
      const existingVisitorIndex = allVisitors.findIndex((v) => v.visitorId === visitorId)
      if (existingVisitorIndex >= 0) {
        // Update existing visitor
        allVisitors[existingVisitorIndex] = {
          ...allVisitors[existingVisitorIndex],
          ...visitorData,
          lastSeen: new Date().toISOString(),
        }
      } else {
        // Add new visitor
        allVisitors.push({
          ...visitorData,
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
        })
      }

      localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent("kuhlektDataUpdate", { detail: visitorData }))

      console.log("🔍 Visitor tracked:", {
        visitorId,
        sessionId,
        page: pathname,
        pageViews: visitorData.pageViews,
        utmSource,
        affiliate,
      })
    } catch (error) {
      console.error("Error tracking visitor:", error)
    }
  }, [pathname, searchParams, mounted])

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
