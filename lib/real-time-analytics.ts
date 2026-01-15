"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

async function checkNeonConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1`
    return !!result
  } catch {
    return false
  }
}

export async function getRealTimeAnalytics() {
  try {
    const isConnected = await checkNeonConnection()
    if (!isConnected) {
      console.error("Neon connection failed")
      return { success: false, error: "Database connection unavailable" }
    }

    const data = await sql`
      SELECT * FROM real_time_analytics 
      ORDER BY hour DESC 
      LIMIT 24
    `

    const sanitizedData = data?.filter((row) => row.hour && row.total_visitors !== null) || []

    return { success: true, data: sanitizedData }
  } catch (error) {
    console.error("Real-time analytics error:", error)
    return { success: false, error: "Failed to fetch real-time analytics" }
  }
}

export async function getNewUserSignOns() {
  try {
    const isConnected = await checkNeonConnection()
    if (!isConnected) {
      return { success: false, error: "Database connection unavailable" }
    }

    const data = await sql`
      SELECT visitor_id, session_id, first_visit, page, referrer, utm_source, utm_campaign, is_new_user
      FROM visitor_tracking
      WHERE is_new_user = true AND created_at >= ${new Date(Date.now() - 60 * 60 * 1000).toISOString()}
      ORDER BY created_at DESC
      LIMIT 50
    `

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("New user sign-ons error:", error)
    return { success: false, error: "Failed to fetch new user sign-ons" }
  }
}

export async function getActiveUsers() {
  try {
    const isConnected = await checkNeonConnection()
    if (!isConnected) {
      return { success: false, error: "Database connection unavailable" }
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

    const data = await sql`
      SELECT visitor_id, session_id, last_activity, page, session_duration, is_new_user
      FROM visitor_tracking
      WHERE last_activity >= ${thirtyMinutesAgo} AND session_id IS NOT NULL
      ORDER BY last_activity DESC
      LIMIT 100
    `

    const uniqueActiveSessions = new Map()
    const validData =
      data?.filter((user) => {
        if (!user.session_id || !user.last_activity) return false

        if (uniqueActiveSessions.has(user.session_id)) {
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
