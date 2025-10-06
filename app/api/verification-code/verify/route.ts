import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Verification Code Verify Route ===")
    console.log("Request received at:", new Date().toISOString())

    const body = await request.json()
    console.log("Request body:", JSON.stringify(body, null, 2))

    const { email, code } = body

    if (!email || !code) {
      console.error("Missing email or code")
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    console.log("Verifying code for email:", email)
    console.log("Code to verify:", code)

    const supabase = await createClient()

    // Query for the verification code
    console.log("Querying verification_codes table...")
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)

    console.log("Query result - data:", data)
    console.log("Query result - error:", error)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error occurred" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      console.error("No valid verification code found")
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    const verificationRecord = data[0]
    console.log("Found verification record:", verificationRecord)

    // Mark the code as used
    console.log("Marking code as used...")
    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("id", verificationRecord.id)

    if (updateError) {
      console.error("Error updating verification code:", updateError)
      return NextResponse.json({ error: "Failed to mark code as used" }, { status: 500 })
    }

    console.log("✓ Verification successful")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("=== Verification Route Error ===")
    console.error("Error:", error)
    console.error("Stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
