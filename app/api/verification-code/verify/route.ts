import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get the verification code
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }

    // Check if expired
    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "Verification code has expired" }, { status: 400 })
    }

    // Mark as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
  }
}
