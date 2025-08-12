"use server"

import { createServerClient } from "@/lib/supabase/server"

export interface VisitorData {
  sessionId: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  landingPage?: string
  country?: string
  city?: string
  deviceType?: string
  browser?: string
  os?: string
  pageViews?: number
  sessionDuration?: number
}

export interface PageViewData {
  visitorId: string
  pageUrl: string
  pageTitle?: string
  referrer?: string
  timeOnPage?: number
  scrollDepth?: number
  exitPage?: boolean
}

export async function createOrUpdateVisitor(visitorData: VisitorData) {
  const supabase = createServerClient()
  if (!supabase) {
    console.warn("Supabase not configured")
    return { success: false, error: "Database not configured" }
  }

  try {
    // First, try to find existing visitor by session_id
    const { data: existingVisitor, error: findError } = await supabase
      .from("visitors")
      .select("id, page_views, session_duration")
      .eq("session_id", visitorData.sessionId)
      .single()

    if (findError && findError.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error finding visitor:", findError)
      return { success: false, error: findError.message }
    }

    if (existingVisitor) {
      // Update existing visitor
      const { data, error } = await supabase
        .from("visitors")
        .update({
          last_visit: new Date().toISOString(),
          page_views: (existingVisitor.page_views || 0) + (visitorData.pageViews || 1),
          session_duration: visitorData.sessionDuration || existingVisitor.session_duration,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", visitorData.sessionId)
        .select()
        .single()

      if (error) {
        console.error("Error updating visitor:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data, isNew: false }
    } else {
      // Create new visitor
      const { data, error } = await supabase
        .from("visitors")
        .insert({
          session_id: visitorData.sessionId,
          ip_address: visitorData.ipAddress,
          user_agent: visitorData.userAgent,
          referrer: visitorData.referrer,
          landing_page: visitorData.landingPage,
          country: visitorData.country,
          city: visitorData.city,
          device_type: visitorData.deviceType,
          browser: visitorData.browser,
          os: visitorData.os,
          page_views: visitorData.pageViews || 1,
          session_duration: visitorData.sessionDuration || 0,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating visitor:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data, isNew: true }
    }
  } catch (error) {
    console.error("Unexpected error in createOrUpdateVisitor:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function addPageView(pageViewData: PageViewData) {
  const supabase = createServerClient()
  if (!supabase) {
    console.warn("Supabase not configured")
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase
      .from("page_views")
      .insert({
        visitor_id: pageViewData.visitorId,
        page_url: pageViewData.pageUrl,
        page_title: pageViewData.pageTitle,
        referrer: pageViewData.referrer,
        time_on_page: pageViewData.timeOnPage || 0,
        scroll_depth: pageViewData.scrollDepth || 0,
        exit_page: pageViewData.exitPage || false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding page view:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error in addPageView:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function getVisitorBySessionId(sessionId: string) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase.from("visitors").select("*").eq("session_id", sessionId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error getting visitor:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || null }
  } catch (error) {
    console.error("Unexpected error in getVisitorBySessionId:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}
