import { type NextRequest, NextResponse } from "next/server"
import { validateAffiliateFromTable } from "@/lib/visitor-tracking"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ valid: false, message: "Invalid affiliate code format" })
    }

    const result = validateAffiliateFromTable(code.trim())

    if (!result.valid) {
      return NextResponse.json({ valid: false, message: "Invalid or inactive affiliate code" })
    }

    return NextResponse.json({
      valid: true,
      affiliate: result.affiliate,
      message: "Valid affiliate code",
    })
  } catch (error) {
    console.error("Error validating affiliate code:", error)
    return NextResponse.json({ error: "Failed to validate affiliate code" }, { status: 500 })
  }
}
