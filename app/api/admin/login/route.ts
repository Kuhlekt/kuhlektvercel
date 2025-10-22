import { type NextRequest, NextResponse } from "next/server"
import { setAdminAuthenticated } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login route started")

    const body = await request.json()
    console.log("[v0] Request body parsed")

    const { password } = body

    if (!password) {
      console.log("[v0] No password provided")
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 })
    }

    console.log("[v0] Checking password")

    if (password !== process.env.ADMIN_PASSWORD) {
      console.log("[v0] Invalid password")
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
    }

    console.log("[v0] Password valid, setting auth")

    await setAdminAuthenticated()

    console.log("[v0] Auth set successfully")

    return NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo: "/admin",
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
