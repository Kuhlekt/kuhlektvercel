import { NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limiter"
import { comparePassword } from "@/lib/server-only-utils"

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

    const passwordHash = process.env.ADMIN_PASSWORD_HASH

    if (!passwordHash) {
      console.error("[v0] Admin password hash not configured")
      throw new Error("Admin password hash not configured")
    }

    console.log("[v0] Attempting password verification")
    console.log("[v0] Hash format:", passwordHash.substring(0, 10))
    console.log("[v0] Password length:", password.length)

    const isValid = await comparePassword(password, passwordHash)

    console.log("[v0] Password verification result:", isValid)

    if (isValid) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
