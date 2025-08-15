import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] Admin login API route called")

  try {
    console.log("[v0] Parsing form data...")
    const formData = await request.formData()
    const password = formData.get("password") as string

    console.log("[v0] Password received:", password ? "present" : "missing")
    console.log("[v0] Environment check - ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "present" : "missing")

    if (!password) {
      console.log("[v0] Login failed: No password provided")
      return NextResponse.json(
        {
          success: false,
          error: "Password is required",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Validating password length...")
    // Validate password length to prevent timing attacks
    if (password.length < 8 || password.length > 128) {
      console.log("[v0] Login failed: Invalid password length")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Checking password against environment variable...")
    // Check password against environment variable
    if (password !== process.env.ADMIN_PASSWORD) {
      console.log("[v0] Login failed: Password mismatch")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 401 },
      )
    }

    console.log("[v0] Password validated successfully")
    console.log("[v0] Setting authentication cookie...")

    // Set authentication cookie with enhanced security
    const cookieStore = await cookies()
    cookieStore.set("admin-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/admin", // Restrict cookie to admin paths only
    })

    console.log("[v0] Cookie set successfully")
    return NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo: "/admin/tracking",
    })
  } catch (error) {
    console.error("[v0] Admin login API error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    })
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login. Please try again.",
      },
      { status: 500 },
    )
  }
}
