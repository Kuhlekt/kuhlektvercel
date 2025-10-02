import { type NextRequest, NextResponse } from "next/server"
import { verifyCode } from "@/lib/roi-verification"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    console.log("[v0] API: Verifying code for:", email)

    const result = await verifyCode(email, code)

    console.log("[v0] API: Verification result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] API: Error in verify-code:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify code",
      },
      { status: 500 },
    )
  }
}
