import { type NextRequest, NextResponse } from "next/server"
import { validateAffiliateCode, trackAffiliateActivity } from "@/lib/affiliate-management"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ valid: false, message: "Invalid affiliate code format" })
    }

    const affiliate = validateAffiliateCode(code.trim())

    if (!affiliate) {
      return NextResponse.json({ valid: false, message: "Invalid or inactive affiliate code" })
    }

    // Track affiliate activity
    trackAffiliateActivity(affiliate.code, "visitor")

    return NextResponse.json({
      valid: true,
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        code: affiliate.code,
        commissionRate: affiliate.commissionRate,
      },
      message: "Valid affiliate code",
    })
  } catch (error) {
    console.error("Error validating affiliate code:", error)
    return NextResponse.json({ error: "Failed to validate affiliate code" }, { status: 500 })
  }
}
