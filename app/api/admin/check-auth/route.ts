import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Check-auth route started")

    const cookieStore = await cookies()
    const token = cookieStore.get("admin-token")

    console.log("[v0] Token found:", !!token?.value)

    const authenticated = !!token?.value && token.value.length > 0

    if (!authenticated) {
      console.log("[v0] Not authenticated")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    console.log("[v0] Authenticated successfully")
    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
