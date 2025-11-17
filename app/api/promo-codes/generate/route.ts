import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

// Generate a unique 8-character promo code
function generateUniqueCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'BF25-'
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST() {
  try {
    const supabase = await createClient()

    // Generate a unique code
    let code = generateUniqueCode()
    let isUnique = false
    let attempts = 0

    // Ensure the code is unique
    while (!isUnique && attempts < 10) {
      const { data: existingCode, error: checkError } = await supabase
        .from("promo_codes")
        .select("id")
        .eq("code", code)
        .maybeSingle()

      // If table doesn't exist, return fallback code
      if (checkError && checkError.code === '42P01') {
        console.log("Promo codes table not found, returning fallback code")
        return NextResponse.json({
          code: 'BLACKFRIDAY2024',
          discount: 50,
          freeSetup: true,
          expiresAt: '2025-12-02T00:00:00',
        })
      }

      if (!existingCode) {
        isUnique = true
      } else {
        code = generateUniqueCode()
        attempts++
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: "Failed to generate unique code" },
        { status: 500 }
      )
    }

    // Create the promo code in the database
    const { data: newCode, error } = await supabase
      .from("promo_codes")
      .insert({
        code,
        discount_percent: 50,
        free_setup: true,
        is_active: true,
        valid_from: new Date().toISOString(),
        valid_until: new Date('2025-12-02T00:00:00').toISOString(),
        max_uses: 1, // Each code can only be used once
        current_uses: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating promo code:", error)
      // If table doesn't exist, return fallback code
      if (error.code === '42P01') {
        return NextResponse.json({
          code: 'BLACKFRIDAY2024',
          discount: 50,
          freeSetup: true,
          expiresAt: '2025-12-02T00:00:00',
        })
      }
      return NextResponse.json(
        { error: "Failed to create promo code" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      code: newCode.code,
      discount: newCode.discount_percent,
      freeSetup: newCode.free_setup,
      expiresAt: newCode.valid_until,
    })
  } catch (error) {
    console.error("Promo code generation error:", error)
    return NextResponse.json({
      code: 'BLACKFRIDAY2024',
      discount: 50,
      freeSetup: true,
      expiresAt: '2025-12-02T00:00:00',
    })
  }
}
