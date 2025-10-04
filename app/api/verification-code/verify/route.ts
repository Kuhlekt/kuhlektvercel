import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    // Find the most recent unused code for this email
    const { data: verificationData, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !verificationData) {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }

    // Check if code has expired
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
  }
}
