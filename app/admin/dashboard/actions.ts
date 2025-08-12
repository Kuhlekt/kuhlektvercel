"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const today = new Date().toISOString().split("T")[0]

    // Get total counts
    const [visitorsCount, pageViewsCount, submissionsCount, affiliatesCount] = await Promise.all([
      supabase.from("visitors").select("*", { count: "exact", head: true }),
      supabase.from("page_views").select("*", { count: "exact", head: true }),
      supabase.from("form_submitters").select("*", { count: "exact", head: true }),
      supabase.from("affiliates").select("*", { count: "exact", head: true }),
    ])

    // Get today's counts
    const [todayVisitors, todaySubmissions] = await Promise.all([
      supabase.from("visitors").select("*", { count: "exact", head: true }).gte("first_visit", today),
      supabase.from("form_submitters").select("*", { count: "exact", head: true }).gte("submitted_at", today),
    ])

    return {
      success: true,
      data: {
        totalVisitors: visitorsCount.count || 0,
        totalPageViews: pageViewsCount.count || 0,
        totalFormSubmissions: submissionsCount.count || 0,
        totalAffiliates: affiliatesCount.count || 0,
        todayVisitors: todayVisitors.count || 0,
        todaySubmissions: todaySubmissions.count || 0,
      },
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return { success: false, error: "Failed to get stats" }
  }
}

export async function getVisitors(limit = 50) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase
      .from("visitors")
      .select("*")
      .order("first_visit", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error getting visitors:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error getting visitors:", error)
    return { success: false, error: "Failed to get visitors" }
  }
}

export async function getFormSubmissions(limit = 50) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase
      .from("form_submitters")
      .select(`
        *,
        affiliates (
          affiliate_code,
          affiliate_name
        ),
        visitors (
          session_id,
          ip_address,
          country
        )
      `)
      .order("submitted_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error getting form submissions:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error getting form submissions:", error)
    return { success: false, error: "Failed to get form submissions" }
  }
}

export async function getAffiliates() {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting affiliates:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error getting affiliates:", error)
    return { success: false, error: "Failed to get affiliates" }
  }
}

export async function getPageViews(limit = 100) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase
      .from("page_views")
      .select(`
        *,
        visitors (
          session_id,
          ip_address,
          country
        )
      `)
      .order("viewed_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error getting page views:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error getting page views:", error)
    return { success: false, error: "Failed to get page views" }
  }
}
