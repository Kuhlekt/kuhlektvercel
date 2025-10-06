import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Query for valid verification codes
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
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    // Mark the code as used
    const { error: updateError } = await supabase.from("verification_codes").update({ used: true }).eq("id", data[0].id)

    if (updateError) {
      console.error("Error marking code as used:", updateError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
