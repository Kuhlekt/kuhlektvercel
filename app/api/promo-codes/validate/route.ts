import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ valid: false, error: "Promo code is required" }, { status: 400 })
    }

    const codeData = await sql`
      SELECT * FROM promo_codes 
      WHERE code = ${code.toUpperCase()} AND is_active = true 
      AND valid_from <= ${new Date().toISOString()} AND valid_until >= ${new Date().toISOString()}
      LIMIT 1
    `

    if (!codeData || codeData.length === 0) {
      // Validate fallback code
      const upperCode = code.toUpperCase()
      if (upperCode === "BLACKFRIDAY2024" || upperCode.startsWith("BF25-")) {
        return NextResponse.json({
          valid: true,
          code: upperCode,
          discount: 50,
          freeSetup: true,
          expiresAt: "2025-12-02T00:00:00",
        })
      }
      return NextResponse.json({
        valid: false,
        error: "Invalid or expired promo code",
      })
    }

    const code_record = codeData[0]

    // Check if max uses reached
    if (code_record.max_uses && code_record.current_uses >= code_record.max_uses) {
      return NextResponse.json({
        valid: false,
        error: "This promo code has already been used",
      })
    }

    return NextResponse.json({
      valid: true,
      code: code_record.code,
      discount: code_record.discount_percent,
      freeSetup: code_record.free_setup,
      expiresAt: code_record.valid_until,
    })
  } catch (error) {
    console.error("Promo code validation error:", error)
    return NextResponse.json({ valid: false, error: "Failed to validate promo code" }, { status: 500 })
  }
}
