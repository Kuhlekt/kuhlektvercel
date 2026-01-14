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
      throw new Error("Admin password hash not configured")
    }

    const isValid = await comparePassword(password, passwordHash)

    if (isValid) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
