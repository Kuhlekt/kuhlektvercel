import { NextResponse } from "next/server"
import { getVisitorStats } from "@/lib/visitor-tracking"

export async function GET() {
  try {
    const stats = await getVisitorStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error getting visitor stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
