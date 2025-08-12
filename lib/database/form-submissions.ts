"use server"

import { createServerClient } from "@/lib/supabase/server"

export interface FormSubmissionData {
  visitorId?: string
  affiliateId?: string
  formType: "contact" | "demo" | "newsletter" | "support"
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  company?: string
  message?: string
  subject?: string
  preferredContactMethod?: string
  budgetRange?: string
  timeline?: string
  affiliateReference?: string
  sourcePage?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  ipAddress?: string
  userAgent?: string
  formData?: Record<string, any>
  status?: "new" | "contacted" | "qualified" | "converted" | "closed"
}

export async function createFormSubmission(submissionData: FormSubmissionData) {
  const supabase = createServerClient()
  if (!supabase) {
    console.warn("Supabase not configured")
    return { success: false, error: "Database not configured" }
  }

  try {
    const { data, error } = await supabase
      .from("form_submitters")
      .insert({
        visitor_id: submissionData.visitorId,
        affiliate_id: submissionData.affiliateId,
        form_type: submissionData.formType,
        first_name: submissionData.firstName,
        last_name: submissionData.lastName,
        email: submissionData.email,
        phone: submissionData.phone,
        company: submissionData.company,
        message: submissionData.message,
        subject: submissionData.subject,
        preferred_contact_method: submissionData.preferredContactMethod,
        budget_range: submissionData.budgetRange,
        timeline: submissionData.timeline,
        affiliate_reference: submissionData.affiliateReference,
        source_page: submissionData.sourcePage,
        utm_source: submissionData.utmSource,
        utm_medium: submissionData.utmMedium,
        utm_campaign: submissionData.utmCampaign,
        utm_term: submissionData.utmTerm,
        utm_content: submissionData.utmContent,
        ip_address: submissionData.ipAddress,
        user_agent: submissionData.userAgent,
        form_data: submissionData.formData,
        status: submissionData.status || "new",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating form submission:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Database operation failed" }
  }
}

export async function getFormSubmissions(filters?: {
  formType?: string
  status?: string
  affiliateId?: string
  limit?: number
  offset?: number
}) {
  const supabase = createServerClient()
  if (!supabase) {
    console.warn("Supabase not configured")
    return { success: false, error: "Database not configured" }
  }

  try {
    let query = supabase
      .from("form_submitters")
      .select(`
        *,
        visitors (session_id, referrer, landing_page, country, city),
        affiliates (affiliate_code, affiliate_name, company)
      `)
      .order("submitted_at", { ascending: false })

    if (filters?.formType) {
      query = query.eq("form_type", filters.formType)
    }
    if (filters?.status) {
      query = query.eq("status", filters.status)
    }
    if (filters?.affiliateId) {
      query = query.eq("affiliate_id", filters.affiliateId)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching form submissions:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Database operation failed" }
  }
}
