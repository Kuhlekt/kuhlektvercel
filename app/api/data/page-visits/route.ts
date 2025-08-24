import { NextResponse } from "next/server"
import { getDatabase, updateDatabase } from "@/lib/database"

export async function POST() {
  try {
    console.log("📡 API: POST /api/data/page-visits - Incrementing page visits...")

    const data = getDatabase()
    const newPageVisits = (data.pageVisits || 0) + 1

    updateDatabase({ pageVisits: newPageVisits })

    console.log("✅ API: Page visits incremented to:", newPageVisits)

    return NextResponse.json({
      success: true,
      pageVisits: newPageVisits,
    })
  } catch (error) {
    console.error("❌ API: Error incrementing page visits:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to increment page visits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
