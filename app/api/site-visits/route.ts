import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ success: false, error: "Database configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Fetch visitor data (anonymized - no IP addresses or PII)
    const { data: visits, error } = await supabase
      .from("visitor_tracking")
      .select(
        `
        id,
        visitor_id,
        session_id,
        page,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        affiliate,
        device_type,
        browser,
        os,
        page_views,
        session_duration,
        is_new_user,
        first_visit,
        last_visit,
        created_at
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching visitor data:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch visitor data" }, { status: 500 })
    }

    // Get total count
    const { count: totalVisits } = await supabase.from("visitor_tracking").select("*", { count: "exact", head: true })

    // Get new vs returning users
    const { count: newUsers } = await supabase
      .from("visitor_tracking")
      .select("*", { count: "exact", head: true })
      .eq("is_new_user", true)

    // Get unique visitors count
    const { data: uniqueVisitorsData } = await supabase.from("visitor_tracking").select("visitor_id")

    const uniqueVisitors = new Set(uniqueVisitorsData?.map((v) => v.visitor_id) || []).size

    // Calculate average session duration
    const { data: sessionData } = await supabase
      .from("visitor_tracking")
      .select("session_duration")
      .not("session_duration", "is", null)

    const avgSessionDuration =
      sessionData && sessionData.length > 0
        ? sessionData.reduce((sum, s) => sum + (s.session_duration || 0), 0) / sessionData.length
        : 0

    // Calculate average page views
    const { data: pageViewData } = await supabase
      .from("visitor_tracking")
      .select("page_views")
      .not("page_views", "is", null)

    const avgPageViews =
      pageViewData && pageViewData.length > 0
        ? pageViewData.reduce((sum, p) => sum + (p.page_views || 0), 0) / pageViewData.length
        : 0

    // Get top referrers
    const { data: referrerData } = await supabase
      .from("visitor_tracking")
      .select("referrer")
      .not("referrer", "is", null)
      .limit(1000)

    const referrerCounts = (referrerData || []).reduce(
      (acc, r) => {
        const ref = r.referrer || "Direct"
        acc[ref] = (acc[ref] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topReferrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }))

    // Get device/browser/OS stats
    const { data: deviceData } = await supabase.from("visitor_tracking").select("device_type, browser, os").limit(1000)

    const deviceCounts = (deviceData || []).reduce(
      (acc, d) => {
        if (d.device_type) acc.devices[d.device_type] = (acc.devices[d.device_type] || 0) + 1
        if (d.browser) acc.browsers[d.browser] = (acc.browsers[d.browser] || 0) + 1
        if (d.os) acc.os[d.os] = (acc.os[d.os] || 0) + 1
        return acc
      },
      {
        devices: {} as Record<string, number>,
        browsers: {} as Record<string, number>,
        os: {} as Record<string, number>,
      },
    )

    const stats = {
      totalVisits: totalVisits || 0,
      uniqueVisitors,
      newUsers: newUsers || 0,
      returningUsers: (totalVisits || 0) - (newUsers || 0),
      avgSessionDuration: Math.round(avgSessionDuration),
      avgPageViews: Math.round(avgPageViews * 10) / 10,
      topReferrers,
      devices: deviceCounts.devices,
      browsers: deviceCounts.browsers,
      os: deviceCounts.os,
    }

    // Get page history for recent sessions
    const { data: pageHistory } = await supabase
      .from("page_history")
      .select("session_id, page, timestamp")
      .order("timestamp", { ascending: false })
      .limit(500)

    return NextResponse.json({
      success: true,
      visits: visits || [],
      stats,
      pageHistory: pageHistory || [],
      total: totalVisits || 0,
    })
  } catch (error) {
    console.error("Site visits API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
