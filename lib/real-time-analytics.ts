"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "x-application-name": "kuhlekt-analytics",
    },
  },
})

async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("visitor_tracking").select("id").limit(1)
    return !error
  } catch {
    return false
  }
}

export async function getRealTimeAnalytics() {
  try {
    const isConnected = await checkSupabaseConnection()
    if (!isConnected) {
      console.error("Supabase connection failed")
      return { success: false, error: "Database connection unavailable" }
    }

    const { data, error } = await supabase
      .from("real_time_analytics")
      .select("*")
      .order("hour", { ascending: false })
      .limit(24)

    if (error) {
      console.error("Real-time analytics error:", {
        code: error.code,
        message: error.message,
        details: error.details,
      })
      return { success: false, error: error.message }
    }

    const sanitizedData = data?.filter((row) => row.hour && row.total_visitors !== null) || []

    return { success: true, data: sanitizedData }
  } catch (error) {
    console.error("Real-time analytics error:", error)
    return { success: false, error: "Failed to fetch real-time analytics" }
  }
}

export async function getNewUserSignOns() {
  try {
    const isConnected = await checkSupabaseConnection()
    if (!isConnected) {
      return { success: false, error: "Database connection unavailable" }
    }

    const { data, error } = await supabase
      .from("visitor_tracking")
      .select("visitor_id, session_id, first_visit, page, referrer, utm_source, utm_campaign, is_new_user")
      .eq("is_new_user", true)
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("New user sign-ons error:", {
        code: error.code,
        message: error.message,
      })
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("New user sign-ons error:", error)
    return { success: false, error: "Failed to fetch new user sign-ons" }
  }
}

export async function getActiveUsers() {
  try {
    const isConnected = await checkSupabaseConnection()
    if (!isConnected) {
      return { success: false, error: "Database connection unavailable" }
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from("visitor_tracking")
      .select("visitor_id, session_id, last_activity, page, session_duration, is_new_user")
      .gte("last_activity", thirtyMinutesAgo)
      .not("session_id", "is", null)
      .order("last_activity", { ascending: false })
      .limit(100)

    if (error) {
      console.error("Active users error:", {
        code: error.code,
        message: error.message,
      })
      return { success: false, error: error.message }
    }

    const uniqueActiveSessions = new Map()
    const validData =
      data?.filter((user) => {
        if (!user.session_id || !user.last_activity) return false

        if (uniqueActiveSessions.has(user.session_id)) {
          // Keep the most recent activity for each session
          const existing = uniqueActiveSessions.get(user.session_id)
          if (new Date(user.last_activity) > new Date(existing.last_activity)) {
            uniqueActiveSessions.set(user.session_id, user)
          }
          return false
        }

        uniqueActiveSessions.set(user.session_id, user)
        return true
      }) || []

    return { success: true, data: Array.from(uniqueActiveSessions.values()) }
  } catch (error) {
    console.error("Active users error:", error)
    return { success: false, error: "Failed to fetch active users" }
  }
}
