import { type NextRequest, NextResponse } from "next/server"
import { verifyTwoFactorCode, verifyTwoFactorToken } from "@/lib/auth/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, token, secret } = body

    // Use either 'code' or 'token' for the 6-digit value
    const verificationCode = code || token

    if (!verificationCode) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 })
    }

    let isValid = false

    // If a custom secret is provided (during setup), verify against that secret
    if (secret) {
      isValid = verifyTwoFactorToken(verificationCode, secret)
    } else {
      // Otherwise, verify against the environment variable secret
      isValid = verifyTwoFactorCode(verificationCode)
    }

    return NextResponse.json({
      valid: isValid,
      message: isValid ? "2FA code is valid" : "2FA code is invalid or expired",
    })
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
