"use client"

import { useEffect } from "react"
import { useSearchParams, usePathname } from "next/navigation"

interface VisitorData {
  id: string
  sessionId: string
  firstVisit: string
  lastVisit: string
  pageViews: number
  pages: string[]
  referrer: string
  userAgent: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  affiliate?: string
}

interface PageVisit {
  id: string
  visitorId: string
  sessionId: string
  page: string
  timestamp: string
  referrer: string
  userAgent: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
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

  useEffect(() => {
    // Skip tracking on admin pages
    if (pathname.startsWith("/admin")) {
      return
    }

    const trackVisitor = () => {
      try {
        const now = new Date().toISOString()
        const currentPage = pathname
        const referrer = document.referrer || "direct"
        const userAgent = navigator.userAgent

        // Generate or get visitor ID
        let visitorId = localStorage.getItem("kuhlekt_visitor_id")
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem("kuhlekt_visitor_id", visitorId)
          console.log("🆕 New visitor created:", visitorId)
        }

        // Generate or get session ID
        let sessionId = sessionStorage.getItem("kuhlekt_session_id")
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          sessionStorage.setItem("kuhlekt_session_id", sessionId)
          console.log("🔄 New session created:", sessionId)
        }

        // Extract UTM parameters
        const utmParams = {
          utm_source: searchParams.get("utm_source") || undefined,
          utm_medium: searchParams.get("utm_medium") || undefined,
          utm_campaign: searchParams.get("utm_campaign") || undefined,
          utm_term: searchParams.get("utm_term") || undefined,
          utm_content: searchParams.get("utm_content") || undefined,
        }

        // Extract affiliate code (support both 'affiliate' and 'ref' parameters)
        const affiliate = searchParams.get("affiliate") || searchParams.get("ref") || undefined

        // Get existing visitor data
        const existingDataStr = localStorage.getItem("kuhlekt_visitor_data")
        let visitorData: VisitorData

        if (existingDataStr) {
          visitorData = JSON.parse(existingDataStr)
          // Update existing visitor
          visitorData.lastVisit = now
          visitorData.pageViews += 1
          if (!visitorData.pages.includes(currentPage)) {
            visitorData.pages.push(currentPage)
          }
          // Update UTM and affiliate if new ones are provided
          if (utmParams.utm_source) visitorData.utm_source = utmParams.utm_source
          if (utmParams.utm_medium) visitorData.utm_medium = utmParams.utm_medium
          if (utmParams.utm_campaign) visitorData.utm_campaign = utmParams.utm_campaign
          if (utmParams.utm_term) visitorData.utm_term = utmParams.utm_term
          if (utmParams.utm_content) visitorData.utm_content = utmParams.utm_content
          if (affiliate) visitorData.affiliate = affiliate
        } else {
          // Create new visitor data
          visitorData = {
            id: visitorId,
            sessionId,
            firstVisit: now,
            lastVisit: now,
            pageViews: 1,
            pages: [currentPage],
            referrer,
            userAgent,
            ...utmParams,
            affiliate,
          }
          console.log("👤 New visitor data created:", visitorData)
        }

        // Save updated visitor data
        localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

        // Track page visit
        const pageVisit: PageVisit = {
          id: `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          visitorId,
          sessionId,
          page: currentPage,
          timestamp: now,
          referrer,
          userAgent,
          ...utmParams,
          affiliate,
        }

        // Add to page history
        const existingHistoryStr = localStorage.getItem("kuhlekt_page_history")
        let pageHistory: PageVisit[] = existingHistoryStr ? JSON.parse(existingHistoryStr) : []
        pageHistory.push(pageVisit)

        // Keep only last 1000 page visits to prevent storage bloat
        if (pageHistory.length > 1000) {
          pageHistory = pageHistory.slice(-1000)
        }

        localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))

        // Update all visitors list
        const existingAllVisitorsStr = localStorage.getItem("kuhlekt_all_visitors")
        const allVisitors: VisitorData[] = existingAllVisitorsStr ? JSON.parse(existingAllVisitorsStr) : []

        // Find and update existing visitor or add new one
        const existingVisitorIndex = allVisitors.findIndex((v) => v.id === visitorId)
        if (existingVisitorIndex >= 0) {
          allVisitors[existingVisitorIndex] = visitorData
        } else {
          allVisitors.push(visitorData)
        }

        localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))

        // Dispatch custom event for admin dashboard updates
        window.dispatchEvent(new CustomEvent("visitorDataUpdated", { detail: visitorData }))

        console.log("📊 Visitor tracking updated:", {
          visitorId,
          sessionId,
          page: currentPage,
          pageViews: visitorData.pageViews,
          affiliate,
          utmParams,
        })
      } catch (error) {
        console.error("❌ Error tracking visitor:", error)
      }
    }

    // Track immediately
    trackVisitor()

    // Track on visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trackVisitor()
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
export function getVisitorData(): VisitorData | null {
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
export function getPageHistory(): PageVisit[] {
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
export function getAllVisitors(): VisitorData[] {
  if (typeof window === "undefined") return []

  try {
    const allVisitorsStr = localStorage.getItem("kuhlekt_all_visitors")
    return allVisitorsStr ? JSON.parse(allVisitorsStr) : []
  } catch (error) {
    console.error("Error getting all visitors:", error)
    return []
  }
}
