"use server"

import { createServerClient } from "@/lib/supabase/server"

export interface AffiliateData {
  id: string
  affiliateCode: string
  affiliateName: string
  email?: string
  phone?: string
  company?: string
  commissionRate: number
  status: "active" | "inactive" | "suspended"
  notes?: string
}

export async function validateAffiliateCode(affiliateCode: string): Promise<{
  success: boolean
  affiliate?: AffiliateData
  error?: string
}> {
  const supabase = createServerClient()
  if (!supabase) {
    console.warn("Supabase not configured")
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase
      .from("affiliates")
      .select("*")
      .eq("affiliate_code", affiliateCode.toUpperCase())
      .eq("status", "active")
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return { success: false, error: "Invalid affiliate code" }
      }
      console.error("Error validating affiliate:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      affiliate: {
        id: data.id,
        affiliateCode: data.affiliate_code,
        affiliateName: data.affiliate_name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        commissionRate: data.commission_rate,
        status: data.status,
        notes: data.notes,
      },
    }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Database operation failed" }
  }
}

export async function getAllActiveAffiliates(): Promise<{
  success: boolean
  affiliates?: AffiliateData[]
  error?: string
}> {
  const supabase = createServerClient()
  if (!supabase) {
    console.warn("Supabase not configured")
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase.from("affiliates").select("*").eq("status", "active").order("affiliate_name")

    if (error) {
      console.error("Error fetching affiliates:", error)
      return { success: false, error: error.message }
    }

    const affiliates = data.map((item) => ({
      id: item.id,
      affiliateCode: item.affiliate_code,
      affiliateName: item.affiliate_name,
      email: item.email,
      phone: item.phone,
      company: item.company,
      commissionRate: item.commission_rate,
      status: item.status,
      notes: item.notes,
    }))

    return { success: true, affiliates }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Database operation failed" }
  }
}
