import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limiter"

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await checkRateLimit("admin-login", clientIp)

    if (!rateLimitResult.allowed) {
      const resetMinutes = rateLimitResult.resetAt
        ? Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 60000)
        : 15

      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts. Please try again in ${resetMinutes} minutes.`,
        },
        { status: 429 },
      )
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ success: false, message: "Password is required" }, { status: 400 })
    }

    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
      console.error("[v0] Admin password not configured")
      throw new Error("Admin password not configured")
    }

    // Simple string comparison for the password
    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
