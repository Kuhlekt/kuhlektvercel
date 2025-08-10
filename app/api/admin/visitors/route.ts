import { type NextRequest, NextResponse } from "next/server"
import { getVisitors, getPageViews, getVisitorStats, getFormSubmissions } from "@/lib/visitor-tracking"

export async function GET(request: NextRequest) {
  try {
    // Simple admin authentication (in production, use proper auth)
    const authHeader = request.headers.get("authorization")
    if (authHeader !== "Bearer admin123") {
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
