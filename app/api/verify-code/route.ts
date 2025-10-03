import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    console.log("[v0] API: Verifying code for:", email)

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Find the verification code
    const { data: stored, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !stored) {
      console.log("[v0] No code found for email:", email)
      return NextResponse.json({
        success: false,
        error: "No verification code found. Please request a new code.",
      })
    }

    // Check if expired
    if (new Date(stored.expires_at) < new Date()) {
      console.log("[v0] Code expired for email:", email)
      await supabase.from("verification_codes").delete().eq("id", stored.id)
      return NextResponse.json({
        success: false,
        error: "Verification code has expired. Please request a new code.",
      })
    }

    // Check if code matches
    if (stored.code !== code) {
      console.log("[v0] Invalid code for email:", email)
      return NextResponse.json({
        success: false,
        error: "Invalid verification code. Please try again.",
      })
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", stored.id)

    console.log("[v0] Code verified successfully for:", email)

    return NextResponse.json({ success: true })
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
