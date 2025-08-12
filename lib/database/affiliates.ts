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

export async function getAllAffiliates() {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting all affiliates:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error in getAllAffiliates:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function getAffiliateById(id: string) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase.from("affiliates").select("*").eq("id", id).single()

    if (error) {
      console.error("Error getting affiliate:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error in getAffiliateById:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function createAffiliate(affiliateData: {
  affiliate_code: string
  affiliate_name: string
  email?: string
  company?: string
  description?: string
  commission_rate?: number
  status?: string
}) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase
      .from("affiliates")
      .insert([
        {
          ...affiliateData,
          affiliate_code: affiliateData.affiliate_code.toUpperCase(),
          status: affiliateData.status || "active",
          commission_rate: affiliateData.commission_rate || 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating affiliate:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error in createAffiliate:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function updateAffiliate(
  id: string,
  affiliateData: {
    affiliate_code?: string
    affiliate_name?: string
    email?: string
    company?: string
    description?: string
    commission_rate?: number
    status?: string
  },
) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const updateData = { ...affiliateData }
    if (updateData.affiliate_code) {
      updateData.affiliate_code = updateData.affiliate_code.toUpperCase()
    }

    const { data, error } = await supabase.from("affiliates").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating affiliate:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error in updateAffiliate:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function deleteAffiliate(id: string) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { error } = await supabase.from("affiliates").delete().eq("id", id)

    if (error) {
      console.error("Error deleting affiliate:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error in deleteAffiliate:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}

export async function getAffiliateStats(affiliateId: string) {
  const supabase = createServerClient()
  if (!supabase) {
    return { success: false, error: "Database not configured" }
  }

  try {
    // Get submission count for this affiliate
    const { data: submissions, error: submissionError } = await supabase
      .from("form_submitters")
      .select("id, created_at")
      .eq("affiliate_code", affiliateId)

    if (submissionError) {
      console.error("Error getting affiliate stats:", submissionError)
      return { success: false, error: submissionError.message }
    }

    const totalSubmissions = submissions?.length || 0
    const thisMonth =
      submissions?.filter(
        (s) =>
          new Date(s.created_at).getMonth() === new Date().getMonth() &&
          new Date(s.created_at).getFullYear() === new Date().getFullYear(),
      ).length || 0

    return {
      success: true,
      data: {
        totalSubmissions,
        thisMonth,
        lastActivity: submissions?.[0]?.created_at || null,
      },
    }
  } catch (error) {
    console.error("Unexpected error in getAffiliateStats:", error)
    return { success: false, error: "Unexpected error occurred" }
  }
}
