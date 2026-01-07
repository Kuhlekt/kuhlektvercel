import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// GET - Fetch all pricing data
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[Pricing API] Supabase not configured")
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Fetch pricing tiers
    const { data: tiers, error: tiersError } = await supabase
      .from("pricing_tiers")
      .select("*")
      .eq("is_active", true)
      .order("display_order")

    if (tiersError) {
      console.error("[Pricing API] Error fetching tiers:", tiersError)
      return NextResponse.json({ error: "Failed to fetch pricing tiers" }, { status: 500 })
    }

    // Fetch features
    const { data: features, error: featuresError } = await supabase
      .from("pricing_features")
      .select("*")
      .eq("is_active", true)
      .order("display_order")

    if (featuresError) {
      console.error("[Pricing API] Error fetching features:", featuresError)
      return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 })
    }

    // Fetch feature values
    const { data: featureValues, error: valuesError } = await supabase.from("pricing_feature_values").select("*")

    if (valuesError) {
      console.error("[Pricing API] Error fetching feature values:", valuesError)
      return NextResponse.json({ error: "Failed to fetch feature values" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      tiers: tiers || [],
      features: features || [],
      featureValues: featureValues || [],
    })
  } catch (error) {
    console.error("[Pricing API] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Save pricing data (admin only)
export async function POST(request: Request) {
  try {
    console.log("[v0] Pricing API: Received save request")
    const { pricingData, features } = await request.json()
    console.log("[v0] Pricing API: Parsed request body")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("[v0] Pricing API: Database not configured")
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log("[v0] Pricing API: Supabase client created")

    const { data: tablesCheck, error: tablesError } = await supabase.from("pricing_tiers").select("id").limit(1)

    if (tablesError) {
      console.error("[v0] Pricing API: Tables don't exist or error:", tablesError)
      return NextResponse.json(
        {
          error: "Database tables not set up. Please run the SQL script first.",
          details: tablesError.message,
        },
        { status: 500 },
      )
    }
    console.log("[v0] Pricing API: Tables exist, proceeding with save")

    // Update pricing tiers
    for (const [tierName, tierData] of Object.entries(pricingData)) {
      console.log(`[v0] Pricing API: Updating tier ${tierName}`)
      const tierInfo = tierData as any
      const { error: updateError } = await supabase
        .from("pricing_tiers")
        .update({
          usd_price: tierInfo.usd || tierInfo.price,
          aud_price: tierInfo.aud || tierInfo.price,
          usd_setup_fee: tierInfo.setupFeeUsd || tierInfo.setupFee,
          aud_setup_fee: tierInfo.setupFeeAud || tierInfo.setupFee,
          billing_term: tierInfo.billing,
          updated_at: new Date().toISOString(),
        })
        .eq("tier_name", tierName)

      if (updateError) {
        console.error(`[v0] Pricing API: Error updating tier ${tierName}:`, updateError)
      }
    }

    console.log("[v0] Pricing API: All tiers updated successfully")

    // Update features - first clear existing features and recreate
    const { error: deleteError } = await supabase
      .from("pricing_features")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (deleteError) {
      console.error("[v0] Pricing API: Error deleting old features:", deleteError)
    }

    // Insert new features
    const featureInserts = features.map((feature: any, index: number) => ({
      feature_name: feature.name,
      display_order: index,
      is_active: true,
    }))

    const { data: insertedFeatures, error: insertError } = await supabase
      .from("pricing_features")
      .insert(featureInserts)
      .select()

    if (insertError) {
      console.error("[v0] Pricing API: Error inserting features:", insertError)
      return NextResponse.json({ error: "Failed to save features", details: insertError.message }, { status: 500 })
    }

    console.log(`[v0] Pricing API: Inserted ${insertedFeatures?.length} features`)

    // Get tier IDs
    const { data: tiers } = await supabase.from("pricing_tiers").select("id, tier_name")

    // Clear existing feature values
    await supabase.from("pricing_feature_values").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    // Insert feature values
    const featureValueInserts: any[] = []
    insertedFeatures?.forEach((dbFeature: any, index: number) => {
      const feature = features[index]
      tiers?.forEach((tier: any) => {
        const value = feature[tier.tier_name]
        featureValueInserts.push({
          pricing_feature_id: dbFeature.id,
          pricing_tier_id: tier.id,
          value: String(value),
        })
      })
    })

    const { error: valuesError } = await supabase.from("pricing_feature_values").insert(featureValueInserts)

    if (valuesError) {
      console.error("[v0] Pricing API: Error inserting feature values:", valuesError)
      return NextResponse.json(
        { error: "Failed to save feature values", details: valuesError.message },
        { status: 500 },
      )
    }

    console.log("[v0] Pricing API: Save completed successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Pricing API: Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
