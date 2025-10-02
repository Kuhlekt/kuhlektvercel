import { type NextRequest, NextResponse } from "next/server"
import { sendVerificationCode } from "@/lib/roi-verification"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, calculatorType, inputs } = body

    console.log("[v0] API: Sending verification code to:", email)

    const result = await sendVerificationCode({
      name,
      email,
      company,
      phone,
      calculatorType,
      inputs,
    })

    console.log("[v0] API: Send verification result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] API: Error in send-verification:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send verification code",
      },
      { status: 500 },
    )
  }
}
