import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    console.log("[Verification] Verifying code for:", email)

    // Find valid, unused code that hasn't expired
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      console.error("[Verification] No valid code found:", error)
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    console.log("[Verification] Valid code found, marking as used")

    // Mark code as used
    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      console.error("[Verification] Error marking code as used:", updateError)
      return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
    }

    console.log("[Verification] Code verified successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Verification] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
