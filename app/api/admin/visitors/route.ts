import { type NextRequest, NextResponse } from "next/server"
import { getAllVisitors, getVisitorStats } from "@/lib/visitor-tracking"
import { validateAdminPassword } from "@/lib/admin-config"

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check - in production, use proper session management
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const password = authHeader.substring(7)
    if (!validateAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const visitors = getAllVisitors()
    const stats = getVisitorStats()

    return NextResponse.json({ visitors, stats })
  } catch (error) {
    console.error("Error fetching visitors:", error)
    return NextResponse.json({ error: "Failed to fetch visitors" }, { status: 500 })
  }
}
