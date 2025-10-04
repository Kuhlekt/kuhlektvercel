"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

export async function sendROIReport(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const company = formData.get("company") as string
    const annualRevenue = formData.get("annualRevenue") as string
    const avgInvoiceValue = formData.get("avgInvoiceValue") as string
    const monthlyInvoices = formData.get("monthlyInvoices") as string
    const currentDSO = formData.get("currentDSO") as string

    if (!email || !name) {
      return { success: false, message: "Email and name are required" }
    }

    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Report",
      text: `Hi ${name},

Thank you for using the Kuhlekt ROI Calculator!

Your Company Details:
- Company: ${company}
- Annual Revenue: ${annualRevenue}
- Average Invoice Value: ${avgInvoiceValue}
- Monthly Invoices: ${monthlyInvoices}
- Current DSO: ${currentDSO}

We'll be in touch soon to discuss how Kuhlekt can help optimize your accounts receivable process.

Best regards,
The Kuhlekt Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Kuhlekt ROI Report</h2>
          <p>Hi ${name},</p>
          <p>Thank you for using the Kuhlekt ROI Calculator!</p>
          <h3>Your Company Details:</h3>
          <ul>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Annual Revenue:</strong> ${annualRevenue}</li>
            <li><strong>Average Invoice Value:</strong> ${avgInvoiceValue}</li>
            <li><strong>Monthly Invoices:</strong> ${monthlyInvoices}</li>
            <li><strong>Current DSO:</strong> ${currentDSO}</li>
          </ul>
          <p>We'll be in touch soon to discuss how Kuhlekt can help optimize your accounts receivable process.</p>
          <p>Best regards,<br>The Kuhlekt Team</p>
        </div>
      `,
    })

    if (result.success) {
      const supabase = await createClient()
      await supabase.from("roi_submissions").insert({
        email,
        name,
        company,
        annual_revenue: annualRevenue,
        avg_invoice_value: avgInvoiceValue,
        monthly_invoices: monthlyInvoices,
        current_dso: currentDSO,
      })
    }

    return result
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return {
      success: false,
      message: "Failed to send ROI report",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
