import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Verification Code Verify Route START ===")
    console.log("Timestamp:", new Date().toISOString())

    let body
    try {
      body = await request.json()
      console.log("✓ Request body parsed successfully")
    } catch (parseError) {
      console.error("✗ Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    console.log("Request body keys:", Object.keys(body))

    const { email, code } = body

    if (!email || !code) {
      console.error("✗ Missing required fields")
      console.log("Email present:", !!email)
      console.log("Code present:", !!code)
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    console.log("✓ Required fields present")
    console.log("Email:", email)
    console.log("Code length:", code.length)

    let supabase
    try {
      supabase = await createClient()
      console.log("✓ Supabase client created")
    } catch (clientError) {
      console.error("✗ Failed to create Supabase client:", clientError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Query for the verification code
    console.log("Querying verification_codes table...")
    console.log("Query parameters:")
    console.log("  - email:", email)
    console.log("  - code:", code)
    console.log("  - used: false")
    console.log("  - expires_at > current time")

    let queryResult
    try {
      queryResult = await supabase
        .from("verification_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)

      console.log("✓ Query executed")
    } catch (queryError) {
      console.error("✗ Query execution failed:", queryError)
      return NextResponse.json({ error: "Database query failed" }, { status: 500 })
    }

    const { data, error } = queryResult

    console.log("Query completed")
    console.log("Error:", error)
    console.log("Data:", data)
    console.log("Data length:", data?.length)

    if (error) {
      console.error("✗ Database error:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Database error occurred" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      console.error("✗ No valid verification code found")

      // Let's do a diagnostic query to see what codes exist for this email
      console.log("Running diagnostic query...")
      const { data: allCodes, error: diagError } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(5)

      if (!diagError && allCodes) {
        console.log(
          "All recent codes for this email:",
          allCodes.map((c) => ({
            code: c.code,
            used: c.used,
            expires_at: c.expires_at,
            created_at: c.created_at,
            expired: new Date(c.expires_at) < new Date(),
          })),
        )
      }

      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    const verificationRecord = data[0]
    console.log("✓ Found verification record")
    console.log("Record details:", {
      id: verificationRecord.id,
      email: verificationRecord.email,
      code: verificationRecord.code,
      used: verificationRecord.used,
      expires_at: verificationRecord.expires_at,
      created_at: verificationRecord.created_at,
    })

    // Mark the code as used
    console.log("Marking code as used...")
    let updateResult
    try {
      updateResult = await supabase.from("verification_codes").update({ used: true }).eq("id", verificationRecord.id)

      console.log("✓ Update executed")
    } catch (updateError) {
      console.error("✗ Update execution failed:", updateError)
      return NextResponse.json({ error: "Failed to mark code as used" }, { status: 500 })
    }

    const { error: updateError } = updateResult

    if (updateError) {
      console.error("✗ Error updating verification code:", updateError)
      console.error("Update error details:", JSON.stringify(updateError, null, 2))
      return NextResponse.json({ error: "Failed to mark code as used" }, { status: 500 })
    }

    console.log("✓ Code marked as used successfully")
    console.log("=== Verification successful ===")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("=== FATAL: Verification Route Error ===")
    console.error("Error type:", typeof error)
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
