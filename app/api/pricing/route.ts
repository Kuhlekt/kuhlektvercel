import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

// GET - Fetch pricing data from database
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("[Pricing API] DATABASE_URL environment variable is not set")
      return NextResponse.json(
        { success: false, error: "Database connection not configured" },
        { status: 500 },
      )
    }

    const sql = neon(process.env.DATABASE_URL)

    // Fetch pricing tiers
    const tiers = await sql("SELECT * FROM pricing_tiers WHERE is_active = true ORDER BY display_order ASC")

    // Fetch pricing features
    const features = await sql("SELECT * FROM pricing_features WHERE is_active = true ORDER BY display_order ASC")

    // Fetch feature values
    const featureValues = await sql("SELECT * FROM pricing_feature_values")

    return NextResponse.json({
      success: true,
      data: {
        tiers,
        features,
        featureValues,
      },
    })
  } catch (error) {
    console.error("[Pricing API] Error fetching pricing data:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch pricing data" },
      { status: 500 },
    )
  }
}

// POST - Save pricing data to database (requires admin auth)
export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("[Pricing API] DATABASE_URL environment variable is not set")
      return NextResponse.json(
        { success: false, error: "Database connection not configured" },
        { status: 500 },
      )
    }

    const sql = neon(process.env.DATABASE_URL)
    const body = await request.json()
    const { tiers, features, featureValues } = body

    // Update tiers
    if (tiers && Array.isArray(tiers)) {
      for (const tier of tiers) {
        await sql(
          `INSERT INTO pricing_tiers (id, tier_name, display_name, usd_price, aud_price, usd_setup_fee, aud_setup_fee, billing_term, display_order, is_active, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO UPDATE SET
           tier_name = $2, display_name = $3, usd_price = $4, aud_price = $5, usd_setup_fee = $6, aud_setup_fee = $7, billing_term = $8, display_order = $9, is_active = $10, updated_at = $11`,
          [
            tier.id,
            tier.tier_name,
            tier.display_name,
            tier.usd_price,
            tier.aud_price,
            tier.usd_setup_fee,
            tier.aud_setup_fee,
            tier.billing_term,
            tier.display_order,
            tier.is_active ?? true,
            new Date().toISOString(),
          ],
        )
      }
    }

    // Update features
    if (features && Array.isArray(features)) {
      for (const feature of features) {
        await sql(
          `INSERT INTO pricing_features (id, feature_name, display_order, is_active)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE SET
           feature_name = $2, display_order = $3, is_active = $4`,
          [feature.id, feature.feature_name, feature.display_order, feature.is_active ?? true],
        )
      }
    }

    // Update feature values
    if (featureValues && Array.isArray(featureValues)) {
      for (const value of featureValues) {
        await sql(
          `INSERT INTO pricing_feature_values (id, pricing_feature_id, pricing_tier_id, value)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE SET
           pricing_feature_id = $2, pricing_tier_id = $3, value = $4`,
          [value.id, value.pricing_feature_id, value.pricing_tier_id, value.value],
        )
      }
    }

    return NextResponse.json({ success: true, message: "Pricing data saved successfully" })
  } catch (error) {
    console.error("[Pricing API] Error saving pricing data:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save pricing data" },
      { status: 500 },
    )
  }
}
