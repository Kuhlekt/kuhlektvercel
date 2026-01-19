import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: tiers, error: tiersError } = await supabase
      .from("pricing_tiers")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (tiersError) throw tiersError

    const { data: features, error: featuresError } = await supabase
      .from("pricing_features")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (featuresError) throw featuresError

    const { data: featureValues, error: valuesError } = await supabase
      .from("pricing_feature_values")
      .select("*")

    if (valuesError) throw valuesError

    return NextResponse.json({
      success: true,
      data: { tiers, features, featureValues },
    })
  } catch (error) {
    console.error("[Pricing API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch pricing data" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { tiers, features, featureValues } = await request.json()

    if (tiers && Array.isArray(tiers)) {
      for (const tier of tiers) {
        await supabase.from("pricing_tiers").upsert({
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
        })
      }
    }

    if (features && Array.isArray(features)) {
      for (const feature of features) {
        await supabase.from("pricing_features").upsert({
          id: feature.id,
          feature_name: feature.feature_name,
          display_order: feature.display_order,
          is_active: feature.is_active ?? true,
        })
      }
    }

    if (featureValues && Array.isArray(featureValues)) {
      for (const value of featureValues) {
        await supabase.from("pricing_feature_values").upsert({
          id: value.id,
          pricing_feature_id: value.pricing_feature_id,
          pricing_tier_id: value.pricing_tier_id,
          value: value.value,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pricing data saved successfully",
    })
  } catch (error) {
    console.error("[Pricing API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save pricing data" },
      { status: 500 },
    )
  }
}
