import { type NextRequest, NextResponse } from "next/server"

// Simple authentication endpoint for site visits page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Check password against environment variable
    const validPassword = process.env.SITE_VISITS_PASSWORD || "kuhlekt2024"

    if (password === validPassword) {
      const response = NextResponse.json({ success: true })

      // Set authentication cookie
      const token = process.env.SITE_VISITS_API_KEY || "kuhlekt-analytics-2024"
      response.cookies.set("site-visits-auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      return response
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("site-visits-auth")
  return response
}
