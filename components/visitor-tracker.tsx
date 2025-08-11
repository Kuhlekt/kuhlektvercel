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
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  affiliate?: string
  ipAddress?: string
}

export function VisitorTracker() {
  useEffect(() => {
    try {
      // Generate unique IDs
      const generateId = () => Math.random().toString(36).substr(2, 9)

      // Get or create visitor ID (persistent across sessions)
      let visitorId = localStorage.getItem("kuhlekt_visitor_id")
      if (!visitorId) {
        visitorId = generateId()
        localStorage.setItem("kuhlekt_visitor_id", visitorId)
      }

      // Generate session ID (new for each session)
      const sessionId = generateId()
      sessionStorage.setItem("kuhlekt_session_id", sessionId)

      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const affiliate = urlParams.get("affiliate") || urlParams.get("aff") || urlParams.get("ref")

      // Validate affiliate against predefined table
      const validAffiliate =
        affiliate && affiliateTable.includes(affiliate.toUpperCase()) ? affiliate.toUpperCase() : undefined

      // Get existing visitor data or create new
      const existingData = localStorage.getItem("kuhlekt_visitor_data")
      let visitorData: VisitorData

      if (existingData) {
        visitorData = JSON.parse(existingData)
        visitorData.lastVisit = new Date().toISOString()
        visitorData.pageViews += 1
        visitorData.sessionId = sessionId
      } else {
        visitorData = {
          visitorId,
          sessionId,
          firstVisit: new Date().toISOString(),
          lastVisit: new Date().toISOString(),
          pageViews: 1,
          referrer: document.referrer || "direct",
          userAgent: navigator.userAgent,
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
      }

      // Store updated visitor data
      localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

      // Log for debugging (remove in production)
      console.log("Visitor tracking data:", visitorData)

      // Clean up old session data (optional)
      const cleanupOldSessions = () => {
        const keys = Object.keys(localStorage)
        keys.forEach((key) => {
          if (key.startsWith("kuhlekt_session_") && key !== `kuhlekt_session_${sessionId}`) {
            localStorage.removeItem(key)
          }
        })
      }
      cleanupOldSessions()
    } catch (error) {
      console.error("Error in visitor tracking:", error)
    }
  }, [])

  // This component doesn't render anything
  return null
}
