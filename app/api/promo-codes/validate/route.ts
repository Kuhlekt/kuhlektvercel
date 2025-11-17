import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Promo code is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if promo code exists and is valid
    const { data: codeData, error: codeError } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .lte("valid_from", new Date().toISOString())
      .gte("valid_until", new Date().toISOString())
      .single()

    if (codeError || !codeData) {
      return NextResponse.json({
        valid: false,
        error: "Invalid or expired promo code",
      })
    }

    // Check if max uses reached
    if (codeData.max_uses && codeData.current_uses >= codeData.max_uses) {
      return NextResponse.json({
        valid: false,
        error: "This promo code has already been used",
      })
    }

    return NextResponse.json({
      valid: true,
      code: codeData.code,
      discount: codeData.discount_percent,
      freeSetup: codeData.free_setup,
      expiresAt: codeData.valid_until,
    })
  } catch (error) {
    console.error("Promo code validation error:", error)
    return NextResponse.json(
      { valid: false, error: "Failed to validate promo code" },
      { status: 500 }
    )
  }
}
