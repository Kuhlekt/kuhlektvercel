import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

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

    console.log("Querying verification_codes table...")
    console.log("Query parameters:")
    console.log("  - email:", email)
    console.log("  - code:", code)
    console.log("  - expires_at > current time")

    let queryResult
    try {
      queryResult = await sql`
        SELECT * FROM verification_codes 
        WHERE email = ${email} AND code = ${code} AND expires_at > ${new Date().toISOString()}
        ORDER BY created_at DESC
        LIMIT 1
      `

      console.log("✓ Query executed")
    } catch (queryError) {
      console.error("✗ Query execution failed:", queryError)
      return NextResponse.json({ error: "Database query failed" }, { status: 500 })
    }

    console.log("Query completed")
    console.log("Data length:", queryResult?.length)

    if (!queryResult || queryResult.length === 0) {
      console.error("✗ No valid verification code found")

      try {
        const allCodes = await sql`
          SELECT code, expires_at, created_at FROM verification_codes 
          WHERE email = ${email}
          ORDER BY created_at DESC
          LIMIT 5
        `

        if (allCodes && allCodes.length > 0) {
          console.log(
            "All recent codes for this email:",
            allCodes.map((c) => ({
              code: c.code,
              expires_at: c.expires_at,
              created_at: c.created_at,
              expired: new Date(c.expires_at) < new Date(),
            })),
          )
        }
      } catch (diagError) {
        console.error("Diagnostic query failed:", diagError)
      }

      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    const verificationRecord = queryResult[0]
    console.log("✓ Found verification record")
    console.log("Record details:", {
      id: verificationRecord.id,
      email: verificationRecord.email,
      code: verificationRecord.code,
      expires_at: verificationRecord.expires_at,
      created_at: verificationRecord.created_at,
    })

    console.log("Deleting verification code to prevent reuse...")
    try {
      await sql`DELETE FROM verification_codes WHERE id = ${verificationRecord.id}`

      console.log("✓ Code deleted successfully")
    } catch (deleteError) {
      console.error("✗ Error deleting verification code:", deleteError)
      console.log("Continuing despite delete error...")
    }

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
