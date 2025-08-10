import { NextResponse } from "next/server"
import { getRealtimeVisitors } from "@/lib/visitor-tracking"

export async function GET() {
  try {
    const realtimeData = await getRealtimeVisitors()
    return NextResponse.json(realtimeData)
  } catch (error) {
    console.error("Error getting realtime visitors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
