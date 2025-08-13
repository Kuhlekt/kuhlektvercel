"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

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
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    // Skip tracking on admin pages
    if (pathname.startsWith("/admin")) {
      return
    }

    // Only track once per page load
    if (hasTrackedRef.current) {
      return
    }

    hasTrackedRef.current = true

    const trackVisitor = () => {
      try {
        // Generate or get visitor ID
        let visitorId = localStorage.getItem("kuhlekt_visitor_id")
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem("kuhlekt_visitor_id", visitorId)
        }

        // Generate or get session ID
        let sessionId = sessionStorage.getItem("kuhlekt_session_id")
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          sessionStorage.setItem("kuhlekt_session_id", sessionId)
        }

        const now = new Date().toISOString()
        const currentPage = pathname
        const referrer = document.referrer || "direct"
        const userAgent = navigator.userAgent

        // Extract UTM parameters
        const urlParams = new URLSearchParams(window.location.search)
        const utmSource = urlParams.get("utm_source") || undefined
        const utmMedium = urlParams.get("utm_medium") || undefined
        const utmCampaign = urlParams.get("utm_campaign") || undefined
        const utmTerm = urlParams.get("utm_term") || undefined
        const utmContent = urlParams.get("utm_content") || undefined
        const affiliate = urlParams.get("affiliate") || urlParams.get("ref") || undefined

        // Validate affiliate against predefined table
        const validAffiliate =
          affiliate && affiliateTable.includes(affiliate.toUpperCase()) ? affiliate.toUpperCase() : undefined

        // Get existing visitors data
        const existingVisitors = JSON.parse(localStorage.getItem("kuhlekt_all_visitors") || "[]")

        // Find existing visitor or create new one
        const visitorIndex = existingVisitors.findIndex((v: VisitorData) => v.visitorId === visitorId)

        if (visitorIndex === -1) {
          // New visitor
          const newVisitor: VisitorData = {
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
          existingVisitors.push(newVisitor)
        } else {
          // Update existing visitor
          const visitor = existingVisitors[visitorIndex]
          visitor.lastVisit = now
          visitor.pageViews += 1
          visitor.currentPage = currentPage
          visitor.sessionId = sessionId // Update session if new session

          // Update UTM parameters if present
          if (utmSource) visitor.utmSource = utmSource
          if (utmMedium) visitor.utmMedium = utmMedium
          if (utmCampaign) visitor.utmCampaign = utmCampaign
          if (utmTerm) visitor.utmTerm = utmTerm
          if (utmContent) visitor.utmContent = utmContent
          if (validAffiliate) visitor.affiliate = validAffiliate
        }

        // Save updated visitors data
        localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(existingVisitors))

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
          firstVisit: now,
          lastVisit: now,
          pageViews: existingVisitors[visitorIndex]?.pageViews || 1,
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

        console.log("Visitor tracked:", {
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
        console.error("Error tracking visitor:", error)
      }
    }

    // Track immediately
    trackVisitor()

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trackVisitor()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pathname])

  // Reset tracking flag when pathname changes
  useEffect(() => {
    hasTrackedRef.current = false
  }, [pathname])

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
