import { NextResponse } from "next/server"

export async function GET() {
  console.log("[v0] ===== HEALTH CHECK API CALLED =====")
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "API routes are working correctly",
  })
}

export async function POST() {
  console.log("[v0] ===== HEALTH CHECK POST API CALLED =====")
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "POST requests are working correctly",
  })
}
