import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { verifyAdminPassword } from "@/lib/admin-auth"

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function POST(request: NextRequest) {
  console.log("[v0] Login route started")

  try {
    const body = await request.json()
    console.log("[v0] Request body parsed")

    const { password } = body

    if (!password) {
      console.log("[v0] No password provided")
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 })
    }

    console.log("[v0] Checking password against environment variables")
    console.log("[v0] ADMIN_PASSWORD_HASH exists:", !!process.env.ADMIN_PASSWORD_HASH)
    console.log("[v0] ADMIN_PASSWORD exists:", !!process.env.ADMIN_PASSWORD)

    const isValid = await verifyAdminPassword(password)

    if (!isValid) {
      console.log("[v0] Invalid password - credentials do not match")
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Password valid, creating session")

    const sessionToken = generateSessionToken()
    const isProduction = process.env.NODE_ENV === "production"

    console.log("[v0] Returning success response with cookie")

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo: "/admin",
    })

    // Set cookie using NextResponse cookie API
    response.cookies.set("admin-token", sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
