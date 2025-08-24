import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/utils/database"

export async function POST(request: NextRequest) {
  try {
    console.log("📈 POST /api/data/page-visits - Incrementing page visits...")

    const pageVisits = await database.incrementPageVisits()

    return NextResponse.json({
      success: true,
      pageVisits,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ POST /api/data/page-visits error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to increment page visits",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
