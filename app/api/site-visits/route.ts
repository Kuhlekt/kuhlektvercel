import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(key)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + 60 * 1000 }) // 1 minute window
    return false
  }

  if (limit.count >= 10) {
    // Max 10 requests per minute
    return true
  }

  limit.count++
  return false
}

const neonDb = neon(process.env.NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request)
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 })
    }

    const authHeader = request.headers.get("authorization")
    const sessionCookie = request.cookies.get("site-visits-auth")
    const validToken = process.env.SITE_VISITS_API_KEY || "kuhlekt-analytics-2024"
    const isAuthenticated = authHeader === `Bearer ${validToken}` || sessionCookie?.value === validToken

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const visitsQuery = `
      SELECT id, visitor_id, session_id, page, referrer, utm_source, utm_medium,
             utm_campaign, utm_term, utm_content, affiliate, device_type, browser,
             os, page_views, session_duration, is_new_user, first_visit, last_visit,
             created_at
      FROM visitor_tracking
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `
    const visits = await neonDb(visitsQuery, [limit, offset])

    const totalResult = await neonDb(`SELECT COUNT(*) as count FROM visitor_tracking`)
    const totalVisits = totalResult[0]?.count || 0

    const newUsersResult = await neonDb(`SELECT COUNT(*) as count FROM visitor_tracking WHERE is_new_user = true`)
    const newUsers = newUsersResult[0]?.count || 0

    const uniqueVisitorsResult = await neonDb(`SELECT COUNT(DISTINCT visitor_id) as count FROM visitor_tracking`)
    const uniqueVisitors = uniqueVisitorsResult[0]?.count || 0

    const sessionDurationResult = await neonDb(
      `SELECT AVG(session_duration) as avg_duration FROM visitor_tracking WHERE session_duration IS NOT NULL`,
    )
    const avgSessionDuration = Math.round(sessionDurationResult[0]?.avg_duration || 0)

    const pageViewsResult = await neonDb(
      `SELECT AVG(page_views) as avg_views FROM visitor_tracking WHERE page_views IS NOT NULL`,
    )
    const avgPageViews = Math.round((pageViewsResult[0]?.avg_views || 0) * 10) / 10

    const pageHistoryQuery = `
      SELECT session_id, page, timestamp FROM page_history
      ORDER BY timestamp DESC LIMIT 500
    `
    const pageHistory = await neonDb(pageHistoryQuery)

    const stats = {
      totalVisits: Number(totalVisits),
      uniqueVisitors: Number(uniqueVisitors),
      newUsers: Number(newUsers),
      returningUsers: Number(totalVisits) - Number(newUsers),
      avgSessionDuration,
      avgPageViews,
    }

    return NextResponse.json({
      success: true,
      visits: visits || [],
      stats,
      pageHistory: pageHistory || [],
      total: Number(totalVisits),
    })
  } catch (error) {
    console.error("Site visits API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
