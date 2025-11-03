import { NextResponse } from "next/server"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST() {
  try {
    console.log("[v0] Clear sessions endpoint called")

    // Call the DELETE endpoint on the chat route to clear sessions
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/chat`, {
      method: "DELETE",
    })

    const data = await response.json()
    console.log("[v0] Sessions cleared:", data)

    return NextResponse.json({ success: true, message: "All chat sessions cleared" }, { headers: corsHeaders })
  } catch (error) {
    console.error("[v0] Error clearing sessions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to clear sessions" },
      { status: 500, headers: corsHeaders },
    )
  }
}
