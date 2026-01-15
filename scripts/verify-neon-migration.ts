import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

async function verifyMigration() {
  console.log("Starting Neon migration verification...")

  try {
    // Test basic connection
    console.log("\n1. Testing Neon database connection...")
    const connectionTest = await sql(`SELECT 1 as connected`)
    console.log("✓ Connection successful")

    // Verify all tables exist
    console.log("\n2. Verifying database tables...")
    const tables = await sql(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name`,
    )
    console.log(`✓ Found ${tables.length} tables`)

    // Verify critical tables
    const criticalTables = [
      "form_submitters",
      "visitor_tracking",
      "rate_limits",
      "real_time_analytics",
      "promo_codes",
      "verification_codes",
    ]

    const existingTables = tables.map((t) => t.table_name)
    const missingTables = criticalTables.filter((t) => !existingTables.includes(t))

    if (missingTables.length > 0) {
      console.warn(`⚠ Missing tables: ${missingTables.join(", ")}`)
    } else {
      console.log("✓ All critical tables present")
    }

    // Verify data integrity
    console.log("\n3. Verifying data integrity...")
    const dataCheck = await sql(
      `SELECT 
        (SELECT COUNT(*) FROM form_submitters) as form_count,
        (SELECT COUNT(*) FROM visitor_tracking) as visitor_count,
        (SELECT COUNT(*) FROM promo_codes) as promo_count`,
    )
    console.log(`✓ Data counts: ${JSON.stringify(dataCheck[0])}`)

    // Test rate limiting functionality
    console.log("\n4. Testing rate limiting...")
    const rateLimitTest = await sql(
      `INSERT INTO rate_limits (endpoint, identifier, window_start, request_count)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ["test", "test-identifier", new Date().toISOString(), 1],
    )
    console.log("✓ Rate limit insert successful")

    // Cleanup test record
    await sql(`DELETE FROM rate_limits WHERE identifier = 'test-identifier'`)

    console.log("\n✅ Neon migration verification complete!")
    console.log("\nNext steps:")
    console.log("1. Deploy the updated code")
    console.log("2. Monitor logs for any errors")
    console.log("3. Remove Supabase environment variables after verification")
    console.log("4. Delete Supabase database if no longer needed")
  } catch (error) {
    console.error("❌ Migration verification failed:", error)
    process.exit(1)
  }
}

verifyMigration()
