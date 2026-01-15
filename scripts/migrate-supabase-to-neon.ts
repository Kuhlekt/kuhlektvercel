// Migration script to move data from Supabase to Neon
// Run with: npx ts-node scripts/migrate-supabase-to-neon.ts

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { neon } from "@neondatabase/serverless"

const BATCH_SIZE = 100
const TABLES = [
  "admin_2fa_codes",
  "admin_audit_log",
  "admin_sessions",
  "admin_users",
  "advertising_banners",
  "affiliates",
  "audit_logs",
  "billing_plans",
  "contact_inquiries",
  "email_log",
  "form_submitters",
  "kb_active_sessions",
  "kb_articles",
  "kb_audit_log",
  "kb_categories",
  "kb_default_article_template",
  "kb_dictionary",
  "kb_dictionary_usage",
  "kb_grammar_checks",
  "kb_grammar_rules",
  "kb_help_notes",
  "kb_organization_settings",
  "kb_organizations",
  "kb_permissions",
  "kb_role_permissions",
  "kb_roles",
  "kb_security_audit_log",
  "kb_subcategories",
  "kb_subscription_history",
  "kb_super_admins",
  "kb_terms_versions",
  "kb_tertiary_categories",
  "kb_user_permissions",
  "kb_user_two_factor",
  "kb_users",
  "page_history",
  "page_views",
  "password_reset_tokens",
  "payment_methods",
  "pricing_feature_values",
  "pricing_features",
  "pricing_tiers",
  "promo_code_redemptions",
  "promo_codes",
  "rate_limits",
  "real_time_analytics",
  "registration_temp_data",
  "stripe_customers",
  "stripe_invoices",
  "stripe_subscriptions",
  "stripe_webhook_events",
  "stripe_webhook_log",
  "tenant_invitations",
  "tenant_usage",
  "tenants",
  "user_tenants",
  "verification_codes",
  "visitor_tracking",
  "visitors",
]

async function migrateTable(
  supabase: ReturnType<typeof createSupabaseClient>,
  neonSql: ReturnType<typeof neon>,
  tableName: string,
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    console.log(`[${tableName}] Starting migration...`)

    // Fetch all data from Supabase
    const { data, error: fetchError } = await supabase.from(tableName).select("*")

    if (fetchError) {
      console.error(`[${tableName}] Fetch error:`, fetchError)
      return { success: false, count: 0, error: fetchError.message }
    }

    if (!data || data.length === 0) {
      console.log(`[${tableName}] No data to migrate`)
      return { success: true, count: 0 }
    }

    console.log(`[${tableName}] Found ${data.length} records to migrate`)

    // Insert data into Neon in batches
    let totalInserted = 0
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE)

      try {
        // Build insert query
        const columns = Object.keys(batch[0]).join(", ")
        const values = batch
          .map((row, idx) => {
            const offset = idx * Object.keys(batch[0]).length + 1
            return `(${Object.keys(batch[0])
              .map((_, col) => `$${offset + col}`)
              .join(", ")})`
          })
          .join(", ")

        const flatValues = batch.flatMap((row) => Object.values(row))

        const query = `INSERT INTO ${tableName} (${columns}) VALUES ${values} ON CONFLICT DO NOTHING`

        await neonSql(query, flatValues)
        totalInserted += batch.length
        console.log(`[${tableName}] Inserted ${totalInserted}/${data.length} records`)
      } catch (batchError) {
        console.error(`[${tableName}] Batch error:`, batchError)
        return { success: false, count: totalInserted, error: String(batchError) }
      }
    }

    console.log(`[${tableName}] Migration complete: ${totalInserted} records`)
    return { success: true, count: totalInserted }
  } catch (error) {
    console.error(`[${tableName}] Fatal error:`, error)
    return { success: false, count: 0, error: String(error) }
  }
}

async function main() {
  console.log("Starting Supabase to Neon migration...\n")

  // Initialize clients
  const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const neonSql = neon(process.env.NEON_DATABASE_URL!)

  const results: Record<string, { success: boolean; count: number; error?: string }> = {}
  let totalRecords = 0
  let totalErrors = 0

  // Migrate each table
  for (const table of TABLES) {
    try {
      const result = await migrateTable(supabase, neonSql, table)
      results[table] = result
      totalRecords += result.count
      if (!result.success) totalErrors++
    } catch (error) {
      console.error(`Error migrating ${table}:`, error)
      results[table] = { success: false, count: 0, error: String(error) }
      totalErrors++
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60))
  console.log("MIGRATION SUMMARY")
  console.log("=".repeat(60))
  console.log(`Total tables processed: ${TABLES.length}`)
  console.log(`Successful migrations: ${TABLES.length - totalErrors}`)
  console.log(`Failed migrations: ${totalErrors}`)
  console.log(`Total records migrated: ${totalRecords}`)
  console.log("=".repeat(60) + "\n")

  if (totalErrors > 0) {
    console.log("Failed tables:")
    Object.entries(results).forEach(([table, result]) => {
      if (!result.success) {
        console.log(`  - ${table}: ${result.error}`)
      }
    })
  }

  process.exit(totalErrors > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})
