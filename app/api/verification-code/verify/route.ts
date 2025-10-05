import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    console.log("[verifyCode] Verifying code for email:", email)
    console.log("[verifyCode] Code to verify:", code)

    const supabase = await createClient()

    // Remove .single() and handle the array response
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("[verifyCode] Database error:", error)
      return NextResponse.json({ error: "Database error occurred" }, { status: 500 })
    }

    // Check if we got any results
    if (!data || data.length === 0) {
      console.error("[verifyCode] No valid code found")
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    const verificationRecord = data[0]
    console.log("[verifyCode] Valid code found:", verificationRecord)

    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verificationRecord.id)

    if (updateError) {
      console.error("[verifyCode] Error marking code as used:", updateError)
      return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
    }

    console.log("[verifyCode] Code marked as used")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[verifyCode] Error:", error)
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
  }
}
