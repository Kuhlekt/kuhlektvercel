import { NextResponse } from "next/server"
import { getDatabase, updateDatabase } from "@/lib/database"

export async function POST() {
  try {
    console.log("📈 Incrementing page visits...")

    const currentData = getDatabase()
    const newPageVisits = (currentData.pageVisits || 0) + 1

    // Update page visits
    const updatedData = updateDatabase({
      pageVisits: newPageVisits,
    })

    console.log("✅ Page visits incremented to:", newPageVisits)

    return NextResponse.json({
      success: true,
      pageVisits: newPageVisits,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error incrementing page visits:", error)
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
