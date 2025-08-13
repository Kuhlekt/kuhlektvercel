"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

interface VisitorData {
  sessionId: string
  visitorId: string
  timestamp: string
  page: string
  userAgent: string
  referrer: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  affiliate?: string
}

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

function VisitorTrackerComponent() {
  const searchParams = useSearchParams()
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    const trackVisitor = async () => {
      try {
        // Generate or get existing visitor ID
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

        // Extract UTM parameters
        const utmSource = searchParams.get("utm_source")
        const utmMedium = searchParams.get("utm_medium")
        const utmCampaign = searchParams.get("utm_campaign")
        const utmTerm = searchParams.get("utm_term")
        const utmContent = searchParams.get("utm_content")
        const affiliate = searchParams.get("affiliate") || searchParams.get("ref")

        const visitorData: VisitorData = {
          sessionId,
          visitorId,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
          ...(utmSource && { utmSource }),
          ...(utmMedium && { utmMedium }),
          ...(utmCampaign && { utmCampaign }),
          ...(utmTerm && { utmTerm }),
          ...(utmContent && { utmContent }),
          ...(affiliate && { affiliate }),
        }

        // Save visitor data to localStorage
        localStorage.setItem("kuhlekt_visitor_data", JSON.stringify(visitorData))

        // Update all visitors list
        const allVisitors = getAllVisitors()
        const existingVisitorIndex = allVisitors.findIndex((v) => v.visitorId === visitorId)

        if (existingVisitorIndex >= 0) {
          allVisitors[existingVisitorIndex] = visitorData
        } else {
          allVisitors.push(visitorData)
        }

        localStorage.setItem("kuhlekt_all_visitors", JSON.stringify(allVisitors))

        console.log("Visitor tracked:", {
          visitorId: visitorId.slice(0, 16) + "...",
          page: window.location.pathname,
          utmSource,
          affiliate,
        })
      } catch (error) {
        console.warn("Error tracking visitor:", error)
      }
    }

    const timeoutId = setTimeout(trackVisitor, 100)
    return () => clearTimeout(timeoutId)
  }, [searchParams])

  return null
}

export function VisitorTracker() {
  return <VisitorTrackerComponent />
}

export default VisitorTracker
