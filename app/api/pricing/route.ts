import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET - Fetch pricing data from database
export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch pricing tiers
    const { data: tiers, error: tiersError } = await supabase
      .from("pricing_tiers")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (tiersError) {
      console.error("[Pricing API] Error fetching tiers:", tiersError)
      return NextResponse.json({ success: false, error: tiersError.message }, { status: 500 })
    }

    // Fetch pricing features
    const { data: features, error: featuresError } = await supabase
      .from("pricing_features")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (featuresError) {
      console.error("[Pricing API] Error fetching features:", featuresError)
      return NextResponse.json({ success: false, error: featuresError.message }, { status: 500 })
    }

    // Fetch feature values
    const { data: featureValues, error: valuesError } = await supabase
      .from("pricing_feature_values")
      .select("*")

    if (valuesError) {
      console.error("[Pricing API] Error fetching feature values:", valuesError)
      return NextResponse.json({ success: false, error: valuesError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        tiers,
        features,
        featureValues,
      },
    })
  } catch (error) {
    console.error("[Pricing API] Unexpected error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch pricing data" }, { status: 500 })
  }
}

// POST - Save pricing data to database (requires admin auth)
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { tiers, features, featureValues } = body

    // Update tiers
    if (tiers && Array.isArray(tiers)) {
      for (const tier of tiers) {
        const { error } = await supabase.from("pricing_tiers").upsert(
          {
            id: tier.id,
            tier_name: tier.tier_name,
            display_name: tier.display_name,
            usd_price: tier.usd_price,
            aud_price: tier.aud_price,
            usd_setup_fee: tier.usd_setup_fee,
            aud_setup_fee: tier.aud_setup_fee,
            billing_term: tier.billing_term,
            display_order: tier.display_order,
            is_active: tier.is_active ?? true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        )

        if (error) {
          console.error("[Pricing API] Error updating tier:", error)
          return NextResponse.json(
            { success: false, error: `Failed to update tier: ${error.message}` },
            { status: 500 },
          )
        }
      }
    }

    // Update features
    if (features && Array.isArray(features)) {
      for (const feature of features) {
        const { error } = await supabase.from("pricing_features").upsert(
          {
            id: feature.id,
            feature_name: feature.feature_name,
            display_order: feature.display_order,
            is_active: feature.is_active ?? true,
          },
          { onConflict: "id" },
        )

        if (error) {
          console.error("[Pricing API] Error updating feature:", error)
          return NextResponse.json(
            { success: false, error: `Failed to update feature: ${error.message}` },
            { status: 500 },
          )
        }
      }
    }

    // Update feature values
    if (featureValues && Array.isArray(featureValues)) {
      for (const value of featureValues) {
        const { error } = await supabase.from("pricing_feature_values").upsert(
          {
            id: value.id,
            pricing_feature_id: value.pricing_feature_id,
            pricing_tier_id: value.pricing_tier_id,
            value: value.value,
          },
          { onConflict: "id" },
        )

        if (error) {
          console.error("[Pricing API] Error updating feature value:", error)
          return NextResponse.json(
            { success: false, error: `Failed to update feature value: ${error.message}` },
            { status: 500 },
          )
        }
      }
    }

    return NextResponse.json({ success: true, message: "Pricing data saved successfully" })
  } catch (error) {
    console.error("[Pricing API] Unexpected error:", error)
    return NextResponse.json({ success: false, error: "Failed to save pricing data" }, { status: 500 })
  }
}
