import { type NextRequest, NextResponse } from "next/server"
import { getAllAffiliates, getAffiliateStats } from "@/lib/affiliate-management"
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

    const affiliates = getAllAffiliates()
    const stats = getAffiliateStats()

    return NextResponse.json({ affiliates, stats })
  } catch (error) {
    console.error("Error fetching affiliates:", error)
    return NextResponse.json({ error: "Failed to fetch affiliates" }, { status: 500 })
  }
}
