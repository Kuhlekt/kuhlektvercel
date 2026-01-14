import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

// Generate a unique 8-character promo code
function generateUniqueCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = "BF25-"
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST() {
  try {
    // Generate a unique code
    let code = generateUniqueCode()
    let isUnique = false
    let attempts = 0

    // Ensure the code is unique
    while (!isUnique && attempts < 10) {
      const existingCode = await sql`SELECT id FROM promo_codes WHERE code = ${code} LIMIT 1`

      if (!existingCode || existingCode.length === 0) {
        isUnique = true
      } else {
        code = generateUniqueCode()
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 })
    }

    // Create the promo code in the database
    const result = await sql`
      INSERT INTO promo_codes (code, discount_percent, free_setup, is_active, valid_from, valid_until, max_uses, current_uses)
      VALUES (${code}, 50, true, true, ${new Date().toISOString()}, ${new Date("2025-12-02T00:00:00").toISOString()}, 1, 0)
      RETURNING code, discount_percent, free_setup, valid_until
    `

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 })
    }

    const newCode = result[0]
    return NextResponse.json({
      code: newCode.code,
      discount: newCode.discount_percent,
      freeSetup: newCode.free_setup,
      expiresAt: newCode.valid_until,
    })
  } catch (error) {
    console.error("Promo code generation error:", error)
    return NextResponse.json({
      code: "BLACKFRIDAY2024",
      discount: 50,
      freeSetup: true,
      expiresAt: "2025-12-02T00:00:00",
    })
  }
}
