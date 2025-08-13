import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    // In a real implementation, you would verify the TOTP token here
    // For now, we'll just return success for any 6-digit code
    if (token && token.length === 6 && /^\d+$/.test(token)) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Invalid TOTP code" }, { status: 400 })
  } catch (error) {
    console.error("TOTP verification error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
