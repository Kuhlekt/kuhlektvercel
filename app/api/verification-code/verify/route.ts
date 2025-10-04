import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    console.log("[Verify Code] Verifying code for email:", email)

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .eq("used", false)
      .single()

    if (error || !data) {
      console.error("[Verify Code] Code not found or already used:", error)
      return NextResponse.json({ success: false, error: "Invalid or expired verification code" }, { status: 400 })
    }

    const now = new Date()
    const expiresAt = new Date(data.expires_at)

    if (now > expiresAt) {
      console.log("[Verify Code] Code expired")
      return NextResponse.json({ success: false, error: "Verification code has expired" }, { status: 400 })
    }

    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      console.error("[Verify Code] Error marking code as used:", updateError)
      return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
    }

    console.log("[Verify Code] Code verified successfully")

    return NextResponse.json({
      success: true,
      message: "Code verified successfully",
    })
  } catch (error) {
    console.error("[Verify Code] Unexpected error:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
  }
}
