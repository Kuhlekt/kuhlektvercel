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
      console.error("[verifyCode] No valid code found:", error)
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    console.log("[verifyCode] Valid code found:", data)

    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

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
