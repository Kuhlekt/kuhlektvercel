import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Find the code
    const { data: verificationData, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single()

    if (fetchError || !verificationData) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Check if expired
    if (new Date(verificationData.expires_at) < new Date()) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 })
    }

    // Mark as used
    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verificationData.id)

    if (updateError) {
      console.error("Error updating verification code:", updateError)
      return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in verify code:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify code" },
      { status: 500 },
    )
  }
}
