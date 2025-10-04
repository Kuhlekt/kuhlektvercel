import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Find the verification code
    const { data: verificationData, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single()

    if (fetchError || !verificationData) {
      console.error("Verification code not found:", fetchError)
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }

    // Check if code is expired
    const expiresAt = new Date(verificationData.expires_at)
    if (expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "Verification code has expired" }, { status: 400 })
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verificationData.id)

    if (updateError) {
      console.error("Error updating verification code:", updateError)
      return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Code verified successfully" })
  } catch (error) {
    console.error("Error in verify code:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
