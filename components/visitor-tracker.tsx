"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

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
            affiliate,
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
          if (affiliate) visitor.affiliate = affiliate
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

        // Legacy visitor data for backward compatibility
        const legacyVisitorData = {
          visitorId,
          sessionId,
          timestamp: now,
          page: currentPage,
          referrer,
          userAgent,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          affiliate,
        }
        localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(legacyVisitorData))

        console.log("Visitor tracked:", {
          visitorId: visitorId.slice(0, 16) + "...",
          sessionId: sessionId.slice(0, 16) + "...",
          page: currentPage,
          totalVisitors: existingVisitors.length,
          totalPageViews: pageHistory.length,
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
