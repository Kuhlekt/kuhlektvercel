import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Invalid or expired code" }, { status: 400 })
    }

    await supabase.from("verification_codes").delete().eq("id", data.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
  }
}
