"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function validateAffiliateCode(affiliateCode: string) {
  const supabase = createServerClient()
  if (!supabase) {
    console.warn("Supabase not configured, using fallback validation")
    // Fallback to hardcoded list if database not available
    const fallbackCodes = [
      "PARTNER001",
      "PARTNER002",
      "RESELLER01",
      "CHANNEL01",
      "AFFILIATE01",
      "PROMO2024",
      "SPECIAL01",
    ]
    return {
      success: true,
      isValid: fallbackCodes.includes(affiliateCode.toUpperCase()),
      affiliate: fallbackCodes.includes(affiliateCode.toUpperCase())
        ? { affiliate_code: affiliateCode.toUpperCase() }
        : null,
    }
  }

  try {
    const { data, error } = await supabase
      .from("affiliates")
      .select("id, affiliate_code, affiliate_name, status")
      .eq("affiliate_code", affiliateCode.toUpperCase())
      .eq("status", "active")
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error validating affiliate:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      isValid: !!data,
      affiliate: data,
    }
  } catch (error) {
    console.error("Unexpected error in validateAffiliateCode:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function getAllActiveAffiliates() {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase.from("affiliates").select("*").eq("status", "active").order("affiliate_name")

    if (error) {
      console.error("Error getting affiliates:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error in getAllActiveAffiliates:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}
