"use client"

import { useEffect } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Helper function to generate visitor ID
function generateVisitorId(): string {
  return "visitor_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
}

// Helper function to generate session ID
function generateSessionId(): string {
  return "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
}

// Helper function to extract UTM parameters
function extractUTMParams(searchParams: URLSearchParams) {
  return {
    utmSource: searchParams.get("utm_source") || undefined,
    utmMedium: searchParams.get("utm_medium") || undefined,
    utmCampaign: searchParams.get("utm_campaign") || undefined,
    utmTerm: searchParams.get("utm_term") || undefined,
    utmContent: searchParams.get("utm_content") || undefined,
    affiliate: searchParams.get("affiliate") || searchParams.get("aff") || undefined,
  }
}

// Helper function to validate affiliate codes
function validateAffiliate(affiliate: string | undefined): string | undefined {
  if (!affiliate) return undefined

  const validAffiliates = ["PARTNER001", "PARTNER002", "RESELLER001", "AGENCY001"]
  return validAffiliates.includes(affiliate.toUpperCase()) ? affiliate.toUpperCase() : undefined
}

// Component that uses useSearchParams
function VisitorTrackerComponent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get UTM parameters
        const utmSource = searchParams.get("utm_source") || null
        const utmMedium = searchParams.get("utm_medium") || null
        const utmCampaign = searchParams.get("utm_campaign") || null
        const utmTerm = searchParams.get("utm_term") || null
        const utmContent = searchParams.get("utm_content") || null

        // Get affiliate code and validate it
        const affiliateCode = searchParams.get("affiliate") || searchParams.get("ref") || null
        const validatedAffiliateCode = affiliateCode ? await validateAffiliateCode(affiliateCode) : null

        // Get visitor info
        const userAgent = navigator.userAgent
        const referrer = document.referrer || null
        const timestamp = new Date().toISOString()

        // Insert visitor data
        const { error } = await supabase.from("visitors").insert({
          page: pathname,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_term: utmTerm,
          utm_content: utmContent,
          affiliate_code: validatedAffiliateCode,
          user_agent: userAgent,
          referrer: referrer,
          visited_at: timestamp,
        })

        if (error) {
          console.error("Error tracking visitor:", error)
        }
      } catch (error) {
        console.error("Error in visitor tracking:", error)
      }
    }

    trackVisitor()
  }, [searchParams, pathname])

  return null
}

// Wrapper component with error boundary
export default function VisitorTracker() {
  return <VisitorTrackerComponent />
}

// Helper functions for admin use
export function getVisitorData() {
  if (typeof window === "undefined") return null
  try {
    const data = localStorage.getItem("kuhlekt_visitor_data")
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function getPageHistory() {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem("kuhlekt_page_history")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getAllVisitors() {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem("kuhlekt_all_visitors")
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}
