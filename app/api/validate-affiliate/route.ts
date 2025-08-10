import { type NextRequest, NextResponse } from "next/server"
import { validateAffiliateCode } from "@/lib/affiliate-management"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    const affiliate = validateAffiliateCode(code)

    if (!affiliate) {
      return NextResponse.json({ valid: false, message: "Invalid affiliate code" })
    }

    return NextResponse.json({
      valid: true,
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        code: affiliate.code,
        commissionRate: affiliate.commissionRate,
      },
    })
  } catch (error) {
    console.error("Error validating affiliate code:", error)
    return NextResponse.json({ error: "Failed to validate affiliate code" }, { status: 500 })
  }
}
