import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the most recent unused code for this email
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Invalid or expired verification code" }, { status: 400 })
    }

    // Mark code as used
    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    if (updateError) {
      console.error("Error marking code as used:", updateError)
      return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Code verified successfully",
    })
  } catch (error) {
    console.error("Error in verify code:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
