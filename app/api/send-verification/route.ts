import { type NextRequest, NextResponse } from "next/server"
import { sendVerificationCode } from "@/lib/roi-verification"

export async function POST(request: NextRequest) {
  console.log("[v0] API: Sending verification code")

  try {
    const body = await request.json()
    const { email } = body

    console.log("[v0] Email received:", email)

    if (!email || typeof email !== "string") {
      console.log("[v0] Invalid email provided")
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Send verification code
    await sendVerificationCode(email)
    console.log("[v0] Verification code sent successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error sending verification code:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}
