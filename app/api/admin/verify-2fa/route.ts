import { type NextRequest, NextResponse } from "next/server"
import { verifyTwoFactorCode } from "@/lib/auth/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const isValid = verifyTwoFactorCode(code)

    return NextResponse.json({
      valid: isValid,
      message: isValid ? "2FA code is valid" : "2FA code is invalid or expired",
    })
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
