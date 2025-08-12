import { NextResponse } from "next/server"
import { generateNewAdminTwoFactorSecret } from "@/lib/auth/admin-auth"

export async function GET() {
  try {
    const { secret, qrCode } = await generateNewAdminTwoFactorSecret()

    return NextResponse.json({
      secret,
      qrCode,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate 2FA secret" }, { status: 500 })
  }
}
