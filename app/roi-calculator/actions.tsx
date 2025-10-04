"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

export async function sendROIReport(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const annualRevenue = formData.get("annualRevenue") as string
    const dso = formData.get("dso") as string
    const collectionCosts = formData.get("collectionCosts") as string

    const supabase = await createClient()

    const { error: dbError } = await supabase.from("roi_submissions").insert({
      name,
      email,
      company,
      annual_revenue: Number.parseFloat(annualRevenue),
      dso: Number.parseInt(dso),
      collection_costs: Number.parseFloat(collectionCosts),
      created_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Database error:", dbError)
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Analysis Report",
      text: `Hi ${name},\n\nThank you for using our ROI calculator. Your personalized report is attached.\n\nBest regards,\nKuhlekt Team`,
      html: `<h1>Hi ${name},</h1><p>Thank you for using our ROI calculator. Your personalized report is attached.</p><p>Best regards,<br/>Kuhlekt Team</p>`,
    })

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.message,
        error: emailResult.error,
      }
    }

    return {
      success: true,
      message: "ROI report sent successfully",
    }
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
