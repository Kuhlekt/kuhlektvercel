import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    const { data: codes, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error("Database error:", fetchError)
      return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
    }

    if (!codes || codes.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }

    const verificationCode = codes[0]

    if (new Date(verificationCode.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: "Verification code has expired" }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verificationCode.id)

    if (updateError) {
      console.error("Database error:", updateError)
      return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
  }
}
