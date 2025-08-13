"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

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

interface PageVisit {
  page: string
  timestamp: string
  sessionId: string
}

export function VisitorTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasTrackedRef = useRef<string>("")

  useEffect(() => {
    // Skip tracking on admin pages
    if (pathname.startsWith("/admin")) {
      return
    }

    // Create a unique key for this page visit
    const currentPageKey = `${pathname}${searchParams.toString()}`

    // Only track if this is a new page or parameters changed
    if (hasTrackedRef.current === currentPageKey) {
      return
    }

    hasTrackedRef.current = currentPageKey

    const trackVisitor = () => {
      try {
        // Generate or get visitor ID (persistent across browser sessions)
        let visitorId = localStorage.getItem("kuhlekt_visitor_id")
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem("kuhlekt_visitor_id", visitorId)
          console.log("🆕 New visitor ID created:", visitorId)
        }

        // Generate or get session ID (new for each browser session)
        let sessionId = sessionStorage.getItem("kuhlekt_session_id")
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          sessionStorage.setItem("kuhlekt_session_id", sessionId)
          console.log("🔄 New session ID created:", sessionId)
        }

        const now = new Date().toISOString()
        const currentPage = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
        const referrer = document.referrer || "direct"
        const userAgent = navigator.userAgent

        // Extract UTM parameters from current URL
        const utmSource = searchParams.get("utm_source") || undefined
        const utmMedium = searchParams.get("utm_medium") || undefined
        const utmCampaign = searchParams.get("utm_campaign") || undefined
        const utmTerm = searchParams.get("utm_term") || undefined
        const utmContent = searchParams.get("utm_content") || undefined
        const affiliate = searchParams.get("affiliate") || searchParams.get("ref") || undefined

        // Validate affiliate against predefined table
        const validAffiliate =
          affiliate && affiliateTable.includes(affiliate.toUpperCase()) ? affiliate.toUpperCase() : undefined

        // Get existing visitors data
        const existingVisitors = JSON.parse(localStorage.getItem("kuhlekt_all_visitors") || "[]")

        // Find existing visitor or create new one
        const visitorIndex = existingVisitors.findIndex((v: VisitorData) => v.visitorId === visitorId)

        let currentVisitor: VisitorData

        if (visitorIndex === -1) {
          // New visitor
          currentVisitor = {
            visitorId,
            sessionId,
            firstVisit: now,
            lastVisit: now,
            pageViews: 1,
            referrer,
            userAgent,
            currentPage,
            utmSource,
            utmMedium,
            utmCampaign,
            utmTerm,
            utmContent,
            affiliate: validAffiliate,
          }
          existingVisitors.push(currentVisitor)
          console.log("👤 New visitor added to tracking:", {
            visitorId: visitorId.slice(0, 16) + "...",
            page: currentPage,
            totalVisitors: existingVisitors.length,
          })
        } else {
          // Update existing visitor
          currentVisitor = existingVisitors[visitorIndex]
          currentVisitor.lastVisit = now
          currentVisitor.pageViews += 1
          currentVisitor.currentPage = currentPage
          currentVisitor.sessionId = sessionId // Update session if new session

          // Update UTM parameters if present
          if (utmSource) currentVisitor.utmSource = utmSource
          if (utmMedium) currentVisitor.utmMedium = utmMedium
          if (utmCampaign) currentVisitor.utmCampaign = utmCampaign
          if (utmTerm) currentVisitor.utmTerm = utmTerm
          if (utmContent) currentVisitor.utmContent = utmContent
          if (validAffiliate) currentVisitor.affiliate = validAffiliate

          console.log("🔄 Visitor updated:", {
            visitorId: visitorId.slice(0, 16) + "...",
            pageViews: currentVisitor.pageViews,
            page: currentPage,
          })
        }

        // Save updated visitors data with timestamp for change detection
        const visitorsData = {
          visitors: existingVisitors,
          lastUpdated: now,
          totalCount: existingVisitors.length,
        }
        localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(existingVisitors))
        localStorage.setItem("kuhlekt_visitors_meta", JSON.stringify(visitorsData))

        // Track page history
        const pageHistory = JSON.parse(localStorage.getItem("kuhlekt_page_history") || "[]")
        const pageVisit: PageVisit = {
          page: currentPage,
          timestamp: now,
          sessionId,
        }
        pageHistory.push(pageVisit)

        // Keep only last 1000 page visits to prevent storage bloat
        if (pageHistory.length > 1000) {
          pageHistory.splice(0, pageHistory.length - 1000)
        }

        localStorage.setItem("kuhlekt_page_history", JSON.stringify(pageHistory))

        // Legacy visitor data for backward compatibility (used by forms)
        const legacyVisitorData = {
          visitorId,
          sessionId,
          firstVisit: currentVisitor.firstVisit,
          lastVisit: now,
          pageViews: currentVisitor.pageViews,
          referrer,
          userAgent,
          currentPage,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          affiliate: validAffiliate,
        }
        localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(legacyVisitorData))

        // Trigger storage event for real-time updates across tabs/components
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "kuhlekt_all_visitors",
            newValue: JSON.stringify(existingVisitors),
            storageArea: localStorage,
          }),
        )

        console.log("📊 Visitor tracking complete:", {
          visitorId: visitorId.slice(0, 16) + "...",
          sessionId: sessionId.slice(0, 16) + "...",
          page: currentPage,
          totalVisitors: existingVisitors.length,
          totalPageViews: pageHistory.length,
          affiliate: validAffiliate,
          utm: {
            source: utmSource,
            medium: utmMedium,
            campaign: utmCampaign,
          },
        })
      } catch (error) {
        console.error("❌ Error tracking visitor:", error)
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(trackVisitor, 100)

    return () => {
      clearTimeout(timeoutId)
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
