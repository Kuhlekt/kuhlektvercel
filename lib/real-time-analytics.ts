"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function getRealTimeAnalytics() {
  try {
    const { data, error } = await supabase.from("real_time_analytics").select("*").limit(24)

    if (error) {
      console.error("Real-time analytics error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Real-time analytics error:", error)
    return { success: false, error: "Failed to fetch real-time analytics" }
  }
}

export async function getNewUserSignOns() {
  try {
    const { data, error } = await supabase.rpc("detect_new_user_signons")

    if (error) {
      console.error("New user sign-ons error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("New user sign-ons error:", error)
    return { success: false, error: "Failed to fetch new user sign-ons" }
  }
}

export async function getActiveUsers() {
  try {
    const { data, error } = await supabase
      .from("visitor_tracking")
      .select("visitor_id, session_id, last_activity, page, session_duration")
      .gte("last_activity", new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Active in last 30 minutes
      .order("last_activity", { ascending: false })

    if (error) {
      console.error("Active users error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Active users error:", error)
    return { success: false, error: "Failed to fetch active users" }
  }
}
