"use client"

import { useEffect } from "react"
import { useSearchParams, usePathname } from "next/navigation"

interface VisitorData {
  visitorId: string
  sessionId: string
  firstVisit: string
  lastVisit: string
  pageViews: number
  currentPage: string
  referrer: string
  userAgent: string
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

// Generate a unique visitor ID
function generateVisitorId(): string {
  return "visitor_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

// Generate a session ID
function generateSessionId(): string {
  return "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window === "undefined") return generateSessionId()

  let sessionId = sessionStorage.getItem("kuhlekt_session_id")
  if (!sessionId) {
    sessionId = generateSessionId()
    sessionStorage.setItem("kuhlekt_session_id", sessionId)
  }
  return sessionId
}

// Validate affiliate code against predefined list
function validateAffiliateCode(code: string): boolean {
  const validAffiliates = [
    "PARTNER001",
    "PARTNER002",
    "PARTNER003",
    "RESELLER001",
    "RESELLER002",
    "CONSULTANT001",
    "CONSULTANT002",
    "REFERRAL001",
    "REFERRAL002",
    "AGENCY001",
  ]
  return validAffiliates.includes(code.toUpperCase())
}

// Dispatch custom storage event for real-time updates
function dispatchStorageEvent(key: string, newValue: any) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("kuhlekt-storage-change", {
        detail: { key, newValue },
      }),
    )
  }
}

export default function VisitorTracker() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return

    console.log("🔍 VisitorTracker: Initializing tracking for", pathname)

    // Get or create visitor ID
    let visitorId = localStorage.getItem("kuhlekt_visitor_id")
    if (!visitorId) {
      visitorId = generateVisitorId()
      localStorage.setItem("kuhlekt_visitor_id", visitorId)
      console.log("👤 VisitorTracker: New visitor created:", visitorId)
    }

    // Get session ID
    const sessionId = getSessionId()

    // Extract UTM parameters
    const utmSource = searchParams?.get("utm_source") || undefined
    const utmMedium = searchParams?.get("utm_medium") || undefined
    const utmCampaign = searchParams?.get("utm_campaign") || undefined
    const utmTerm = searchParams?.get("utm_term") || undefined
    const utmContent = searchParams?.get("utm_content") || undefined

    // Extract affiliate code (support both 'affiliate' and 'ref' parameters)
    let affiliate = searchParams?.get("affiliate") || searchParams?.get("ref") || undefined
    if (affiliate && !validateAffiliateCode(affiliate)) {
      console.warn("⚠️ VisitorTracker: Invalid affiliate code:", affiliate)
      affiliate = undefined
    }

    // Get existing visitor data
    const existingDataStr = localStorage.getItem("kuhlekt_visitor_data")
    let existingData: VisitorData | null = null

    try {
      existingData = existingDataStr ? JSON.parse(existingDataStr) : null
    } catch (error) {
      console.error("❌ VisitorTracker: Error parsing existing data:", error)
    }

    // Create page key to prevent duplicate tracking
    const pageKey = `${pathname}_${sessionId}`
    const lastPageKey = sessionStorage.getItem("kuhlekt_last_page_key")

    if (pageKey === lastPageKey) {
      console.log("🔄 VisitorTracker: Same page in session, skipping duplicate tracking")
      return
    }

    sessionStorage.setItem("kuhlekt_last_page_key", pageKey)

    // Update visitor data
    const now = new Date().toISOString()
    const visitorData: VisitorData = {
      visitorId,
      sessionId,
      firstVisit: existingData?.firstVisit || now,
      lastVisit: now,
      pageViews: (existingData?.pageViews || 0) + 1,
      currentPage: pathname,
      referrer: document.referrer || "direct",
      userAgent: navigator.userAgent,
      ...(utmSource && { utmSource }),
      ...(utmMedium && { utmMedium }),
      ...(utmCampaign && { utmCampaign }),
      ...(utmTerm && { utmTerm }),
      ...(utmContent && { utmContent }),
      ...(affiliate && { affiliate }),
    }

    // Store visitor data
    localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))
    console.log("💾 VisitorTracker: Updated visitor data:", visitorData)

    // Track page visit
    const pageVisit: PageVisit = {
      visitorId,
      sessionId,
      page: pathname,
      timestamp: now,
      referrer: document.referrer || "direct",
      ...(utmSource && { utmSource }),
      ...(utmMedium && { utmMedium }),
      ...(utmCampaign && { utmCampaign }),
      ...(utmTerm && { utmTerm }),
      ...(utmContent && { utmContent }),
      ...(affiliate && { affiliate }),
    }

    // Store page history
    const existingHistoryStr = localStorage.getItem("kuhlekt_page_history")
    let pageHistory: PageVisit[] = []

    try {
      pageHistory = existingHistoryStr ? JSON.parse(existingHistoryStr) : []
    } catch (error) {
      console.error("❌ VisitorTracker: Error parsing page history:", error)
      pageHistory = []
    }

    pageHistory.push(pageVisit)

    // Keep only last 1000 page visits to prevent storage bloat
    if (pageHistory.length > 1000) {
      pageHistory = pageHistory.slice(-1000)
    }

    localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))

    // Store all visitors data for admin
    const allVisitorsStr = localStorage.getItem("kuhlekt_all_visitors")
    let allVisitors: VisitorData[] = []

    try {
      allVisitors = allVisitorsStr ? JSON.parse(allVisitorsStr) : []
    } catch (error) {
      console.error("❌ VisitorTracker: Error parsing all visitors:", error)
      allVisitors = []
    }

    // Update or add visitor in all visitors list
    const existingVisitorIndex = allVisitors.findIndex((v) => v.visitorId === visitorId)
    if (existingVisitorIndex >= 0) {
      allVisitors[existingVisitorIndex] = visitorData
      console.log("🔄 VisitorTracker: Updated existing visitor in all visitors list")
    } else {
      allVisitors.push(visitorData)
      console.log("➕ VisitorTracker: Added new visitor to all visitors list")
    }

    localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))

    // Store metadata for change detection
    const metadata = {
      lastUpdate: now,
      totalVisitors: allVisitors.length,
      totalPageViews: pageHistory.length,
      hash: btoa(JSON.stringify({ visitors: allVisitors.length, pages: pageHistory.length, timestamp: now })),
    }
    localStorage.setItem("kuhlekt_tracking_metadata", JSON.stringify(metadata))

    // Dispatch custom event for real-time updates
    dispatchStorageEvent("kuhlekt_all_visitors", allVisitors)
    dispatchStorageEvent("kuhlekt_page_history", pageHistory)

    console.log("📊 VisitorTracker: Page tracking complete", {
      visitorId,
      sessionId,
      page: pathname,
      pageViews: visitorData.pageViews,
      totalVisitors: allVisitors.length,
      totalPageViews: pageHistory.length,
    })

    // Handle visibility change to track returning visitors
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("👁️ VisitorTracker: Page became visible, updating last visit")
        const updatedData = { ...visitorData, lastVisit: new Date().toISOString() }
        localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(updatedData))
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pathname, searchParams])

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
