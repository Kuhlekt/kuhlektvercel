import { type NextRequest, NextResponse } from "next/server"
import { getVisitors, getPageViews, getVisitorStats, getFormSubmissions } from "@/lib/visitor-tracking"
import { validateAdminPassword } from "@/lib/admin-config"

export async function GET(request: NextRequest) {
  try {
    // Enhanced admin authentication
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !validateAdminPassword(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    switch (type) {
      case "stats":
        return NextResponse.json(getVisitorStats())
      case "pageviews":
        return NextResponse.json(getPageViews())
      case "forms":
        return NextResponse.json(getFormSubmissions())
      default:
        return NextResponse.json(getVisitors())
    }
  } catch (error) {
    console.error("Error fetching visitor data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
