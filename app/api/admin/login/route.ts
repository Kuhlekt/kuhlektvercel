import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] Admin login API called")

  try {
    const formData = await request.formData()
    const password = formData.get("password") as string

    console.log("[v0] Password received, length:", password?.length || 0)

    if (!password) {
      console.log("[v0] No password provided")
      return NextResponse.json(
        {
          success: false,
          error: "Password is required",
        },
        { status: 400 },
      )
    }

    // Validate password length to prevent timing attacks
    if (password.length < 8 || password.length > 128) {
      console.log("[v0] Password length invalid")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Checking password against ADMIN_PASSWORD env var")
    console.log("[v0] ADMIN_PASSWORD exists:", !!process.env.ADMIN_PASSWORD)

    // Check password against environment variable
    if (password !== process.env.ADMIN_PASSWORD) {
      console.log("[v0] Password does not match")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 401 },
      )
    }

    console.log("[v0] Password matches, setting cookie")

    // Set authentication cookie with enhanced security
    const cookieStore = await cookies()
    cookieStore.set("admin-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    })

    console.log("[v0] Cookie set, returning success response")

    return NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo: "/admin",
    })
  } catch (error) {
    console.error("[v0] Admin login API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login. Please try again.",
      },
      { status: 500 },
    )
  }
}
