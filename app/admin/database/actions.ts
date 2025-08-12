"use server"

import { getFormSubmissions } from "@/lib/database/form-submissions"
import { getAllActiveAffiliates } from "@/lib/database/affiliates"
import { createServerClient } from "@/lib/supabase/server"

export async function getVisitorsData(limit = 50, offset = 0) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase
      .from("visitors")
      .select("*")
      .order("first_visit", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error getting visitors:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error in getVisitorsData:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function getPageViewsData(visitorId?: string, limit = 100) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    let query = supabase
      .from("page_views")
      .select(`
        *,
        visitors (session_id, first_visit)
      `)
      .order("viewed_at", { ascending: false })
      .limit(limit)

    if (visitorId) {
      query = query.eq("visitor_id", visitorId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error getting page views:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error in getPageViewsData:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function getDashboardStats() {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    // Get total visitors
    const { count: visitorsCount } = await supabase.from("visitors").select("*", { count: "exact", head: true })

    // Get total form submissions
    const { count: submissionsCount } = await supabase
      .from("form_submitters")
      .select("*", { count: "exact", head: true })

    // Get total page views
    const { count: pageViewsCount } = await supabase.from("page_views").select("*", { count: "exact", head: true })

    // Get active affiliates
    const { count: affiliatesCount } = await supabase
      .from("affiliates")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Get recent activity (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { count: recentVisitors } = await supabase
      .from("visitors")
      .select("*", { count: "exact", head: true })
      .gte("first_visit", yesterday.toISOString())

    const { count: recentSubmissions } = await supabase
      .from("form_submitters")
      .select("*", { count: "exact", head: true })
      .gte("submitted_at", yesterday.toISOString())

    return {
      success: true,
      data: {
        totalVisitors: visitorsCount || 0,
        totalSubmissions: submissionsCount || 0,
        totalPageViews: pageViewsCount || 0,
        activeAffiliates: affiliatesCount || 0,
        recentVisitors: recentVisitors || 0,
        recentSubmissions: recentSubmissions || 0,
      },
    }
  } catch (error) {
    console.error("Unexpected error in getDashboardStats:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export { getFormSubmissions, getAllActiveAffiliates }
