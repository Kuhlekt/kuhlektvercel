"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, usePathname } from "next/navigation"

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

interface PageVisit {
  visitorId: string
  sessionId: string
  page: string
  timestamp: string
  referrer: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  affiliate?: string
}

// Predefined affiliate codes
const VALID_AFFILIATES = [
  "partner1",
  "partner2",
  "reseller1",
  "consultant1",
  "agency1",
  "referral",
  "linkedin",
  "google",
  "facebook",
  "twitter",
]

export function VisitorTracker() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const hasTracked = useRef(false)
  const currentPageKey = useRef("")

  useEffect(() => {
    // Create a unique key for this page visit
    const pageKey = `${pathname}-${Date.now()}`

    // Prevent duplicate tracking for the same page
    if (currentPageKey.current === pageKey || hasTracked.current) {
      return
    }

    currentPageKey.current = pageKey
    hasTracked.current = true

    console.log("🔍 VisitorTracker: Starting tracking for", pathname)

    try {
      // Generate or get visitor ID
      let visitorId = localStorage.getItem("kuhlekt_visitor_id")
      if (!visitorId) {
        visitorId = "visitor_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
        localStorage.setItem("kuhlekt_visitor_id", visitorId)
        console.log("👤 New visitor ID created:", visitorId)
      }

      // Generate or get session ID
      let sessionId = sessionStorage.getItem("kuhlekt_session_id")
      if (!sessionId) {
        sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
        sessionStorage.setItem("kuhlekt_session_id", sessionId)
        console.log("🔗 New session ID created:", sessionId)
      }

      // Extract UTM parameters
      const utmSource = searchParams.get("utm_source") || undefined
      const utmMedium = searchParams.get("utm_medium") || undefined
      const utmCampaign = searchParams.get("utm_campaign") || undefined
      const utmTerm = searchParams.get("utm_term") || undefined
      const utmContent = searchParams.get("utm_content") || undefined

      // Extract affiliate code (check both 'affiliate' and 'ref' parameters)
      let affiliate = searchParams.get("affiliate") || searchParams.get("ref") || undefined

      // Validate affiliate code
      if (affiliate && !VALID_AFFILIATES.includes(affiliate.toLowerCase())) {
        console.log("⚠️ Invalid affiliate code:", affiliate)
        affiliate = undefined
      }

      // Get existing visitor data
      const existingDataStr = localStorage.getItem("kuhlekt_visitor_data")
      let existingData: VisitorData | null = null

      try {
        existingData = existingDataStr ? JSON.parse(existingDataStr) : null
      } catch (e) {
        console.error("Error parsing existing visitor data:", e)
      }

      // Update page views
      const pageViews = existingData ? existingData.pageViews + 1 : 1

      // Create visitor data
      const visitorData: VisitorData = {
        visitorId,
        sessionId,
        pageViews,
        currentPage: pathname,
        referrer: document.referrer || "direct",
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        utmSource: utmSource || existingData?.utmSource,
        utmMedium: utmMedium || existingData?.utmMedium,
        utmCampaign: utmCampaign || existingData?.utmCampaign,
        utmTerm: utmTerm || existingData?.utmTerm,
        utmContent: utmContent || existingData?.utmContent,
        affiliate: affiliate || existingData?.affiliate,
      }

      // Store visitor data
      localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

      // Create page visit record
      const pageVisit: PageVisit = {
        visitorId,
        sessionId,
        page: pathname,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || "direct",
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        affiliate,
      }

      // Store page history
      const existingHistoryStr = localStorage.getItem("kuhlekt_page_history")
      let pageHistory: PageVisit[] = []

      try {
        pageHistory = existingHistoryStr ? JSON.parse(existingHistoryStr) : []
      } catch (e) {
        console.error("Error parsing page history:", e)
        pageHistory = []
      }

      pageHistory.push(pageVisit)

      // Keep only last 1000 page visits to prevent storage bloat
      if (pageHistory.length > 1000) {
        pageHistory = pageHistory.slice(-1000)
      }

      localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))

      // Store in all visitors list for admin
      const existingAllVisitorsStr = localStorage.getItem("kuhlekt_all_visitors")
      let allVisitors: VisitorData[] = []

      try {
        allVisitors = existingAllVisitorsStr ? JSON.parse(existingAllVisitorsStr) : []
      } catch (e) {
        console.error("Error parsing all visitors:", e)
        allVisitors = []
      }

      // Update or add visitor
      const existingVisitorIndex = allVisitors.findIndex((v) => v.visitorId === visitorId)
      if (existingVisitorIndex >= 0) {
        allVisitors[existingVisitorIndex] = visitorData
      } else {
        allVisitors.push(visitorData)
      }

      localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))

      // Store metadata for change detection
      const metadata = {
        lastUpdate: new Date().toISOString(),
        totalVisitors: allVisitors.length,
        totalPageViews: pageHistory.length,
        hash: btoa(JSON.stringify(allVisitors)).slice(0, 10),
      }
      localStorage.setItem("kuhlekt_tracking_metadata", JSON.stringify(metadata))

      // Dispatch custom event for real-time updates
      window.dispatchEvent(
        new CustomEvent("kuhlektDataUpdate", {
          detail: { visitorData, pageVisit, metadata },
        }),
      )

      console.log("📊 Visitor tracking updated:", {
        visitorId,
        sessionId,
        page: pathname,
        pageViews,
        utmSource,
        affiliate,
        totalVisitors: allVisitors.length,
      })
    } catch (error) {
      console.error("❌ Error in visitor tracking:", error)
    }

    // Reset tracking flag after a delay to allow for navigation
    const resetTimer = setTimeout(() => {
      hasTracked.current = false
      currentPageKey.current = ""
    }, 1000)

    return () => {
      clearTimeout(resetTimer)
    }
  }, [pathname, searchParams])

  // Handle visibility change to track returning visitors
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Reset tracking when page becomes visible again
        setTimeout(() => {
          hasTracked.current = false
          currentPageKey.current = ""
        }, 500)
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
