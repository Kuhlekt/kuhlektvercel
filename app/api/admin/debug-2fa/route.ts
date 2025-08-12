import { type NextRequest, NextResponse } from "next/server"
import { verifyTwoFactorToken } from "@/lib/auth/admin-auth"
import * as speakeasy from "speakeasy"

export async function POST(request: NextRequest) {
  try {
    const { token, testSecret } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Get current environment secret
    const envSecret = process.env.ADMIN_2FA_SECRET || "JBSWY3DPEHPK3PXP"

    // Test with environment secret
    const envResult = await verifyTwoFactorToken(token)

    // Test with provided secret if given
    let testResult = null
    if (testSecret) {
      testResult = speakeasy.totp.verify({
        secret: testSecret,
        token,
        window: 2,
      })
    }

    // Generate current expected tokens for debugging
    const currentTokenEnv = speakeasy.totp({
      secret: envSecret,
      window: 0,
    })

    const currentTokenTest = testSecret
      ? speakeasy.totp({
          secret: testSecret,
          window: 0,
        })
      : null

    return NextResponse.json({
      success: envResult || testResult,
      envSecret: envSecret.substring(0, 4) + "...", // Only show first 4 chars for security
      envResult,
      testResult,
      currentTokenEnv,
      currentTokenTest,
      providedToken: token,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("2FA debug error:", error)
    return NextResponse.json({ error: "Debug failed" }, { status: 500 })
  }
}
