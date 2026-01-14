import { NextResponse } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@/lib/rate-limiter"

function verifyPassword(password: string): boolean {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH

  if (!passwordHash) {
    throw new Error("Admin password hash not configured")
  }

  if (!passwordHash.includes(":")) {
    throw new Error("Invalid password hash format")
  }

  const [salt, hash] = passwordHash.split(":")
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
  return hash === verifyHash
}

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

    const isValid = verifyPassword(password)

    if (isValid) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
