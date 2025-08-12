import { type NextRequest, NextResponse } from "next/server"
import { generateTwoFactorSecret, verifyAdminPassword, generateQRCode } from "@/lib/auth/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Verify admin password first
    const isValidPassword = await verifyAdminPassword(password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Generate new 2FA secret
    const newSecret = generateTwoFactorSecret()
    const qrCodeUrl = await generateQRCode(newSecret)

    return NextResponse.json({
      success: true,
      secret: newSecret,
      qrCode: qrCodeUrl,
      message: "New 2FA secret generated. Update your ADMIN_2FA_SECRET environment variable with this new secret.",
    })
  } catch (error) {
    console.error("2FA reset error:", error)
    return NextResponse.json({ error: "Failed to reset 2FA" }, { status: 500 })
  }
}
