"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { validateAffiliate } from "@/lib/affiliate-validation"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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
  firstVisit?: string
  lastVisit?: string
}

// Helper function to generate visitor ID
function generateVisitorId(): string {
  return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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

// Main visitor tracker component
function VisitorTrackerComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    try {
      const currentPath = pathname
      const currentUrl = window.location.href
      const referrer = document.referrer || "direct"
      const userAgent = navigator.userAgent
      const timestamp = new Date().toISOString()

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

      // Extract UTM parameters
      const utmSource = searchParams.get("utm_source") || undefined
      const utmMedium = searchParams.get("utm_medium") || undefined
      const utmCampaign = searchParams.get("utm_campaign") || undefined
      const utmTerm = searchParams.get("utm_term") || undefined
      const utmContent = searchParams.get("utm_content") || undefined

      // Extract affiliate code (support both 'affiliate' and 'ref' parameters)
      let affiliate = searchParams.get("affiliate") || searchParams.get("ref") || undefined
      if (affiliate && !validateAffiliate(affiliate)) {
        console.warn(`Invalid affiliate code: ${affiliate}`)
        affiliate = undefined
      }

      // Get existing visitor data
      const existingVisitorData = getVisitorData()
      const isFirstVisit = !existingVisitorData

      // Create/update visitor data
      const visitorData: VisitorData = {
        visitorId,
        sessionId,
        firstVisit: existingVisitorData?.firstVisit || timestamp,
        lastVisit: timestamp,
        pageViews: (existingVisitorData?.pageViews || 0) + 1,
        referrer: existingVisitorData?.referrer || referrer,
        userAgent,
        currentPage: currentPath,
        timestamp,
        utmSource: utmSource || existingVisitorData?.utmSource,
        utmMedium: utmMedium || existingVisitorData?.utmMedium,
        utmCampaign: utmCampaign || existingVisitorData?.utmCampaign,
        utmTerm: utmTerm || existingVisitorData?.utmTerm,
        utmContent: utmContent || existingVisitorData?.utmContent,
        affiliate: affiliate || existingVisitorData?.affiliate,
      }

      // Save visitor data
      localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

      // Track page visit
      const pageKey = `${sessionId}_${currentPath}`
      const lastPageKey = sessionStorage.getItem("kuhlekt_last_page_key")

      if (lastPageKey !== pageKey) {
        sessionStorage.setItem("kuhlekt_last_page_key", pageKey)

        // Add to page history
        const pageHistory = getPageHistory()
        pageHistory.push({
          page: currentPath,
          timestamp,
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

      console.log("🔍 Visitor tracked:", {
        visitorId: visitorId.slice(0, 16) + "...",
        sessionId: sessionId.slice(0, 16) + "...",
        page: currentPath,
        isFirstVisit,
        pageViews: visitorData.pageViews,
        utmSource,
        utmCampaign,
        affiliate,
      })
    } catch (error) {
      console.error("Error tracking visitor:", error)
    }
  }, [pathname, searchParams])

  return null
}

// Export the main component wrapped in error boundary as named export
export function VisitorTracker() {
  try {
    return <VisitorTrackerComponent />
  } catch (error) {
    console.error("VisitorTracker error:", error)
    return null
  }
}

// Also export as default for compatibility
export default VisitorTracker
