"use server"

import { sendEmail } from "@/lib/aws-ses"
import { createClient } from "@/lib/supabase/server"

export async function submitROICalculator(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const annualRevenue = formData.get("annualRevenue") as string
    const averageInvoiceValue = formData.get("averageInvoiceValue") as string
    const currentDSO = formData.get("currentDSO") as string
    const collectionCosts = formData.get("collectionCosts") as string

    if (!name || !email || !company) {
      return {
        success: false,
        message: "Please provide name, email, and company",
      }
    }

    const supabase = await createClient()

    const { error: dbError } = await supabase.from("roi_submissions").insert({
      name,
      email,
      company,
      annual_revenue: annualRevenue ? Number.parseFloat(annualRevenue) : null,
      average_invoice_value: averageInvoiceValue ? Number.parseFloat(averageInvoiceValue) : null,
      current_dso: currentDSO ? Number.parseInt(currentDSO) : null,
      collection_costs: collectionCosts ? Number.parseFloat(collectionCosts) : null,
      submitted_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Database error:", dbError)
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Results - Kuhlekt",
      text: `Thank you for using the Kuhlekt ROI Calculator!\n\nYour submitted information:\nName: ${name}\nCompany: ${company}\n\nWe'll be in touch soon with your detailed ROI analysis.`,
      html: `
        <h2>Thank you for using the Kuhlekt ROI Calculator!</h2>
        <p><strong>Your submitted information:</strong></p>
        <ul>
          <li>Name: ${name}</li>
          <li>Company: ${company}</li>
          ${annualRevenue ? `<li>Annual Revenue: $${Number.parseFloat(annualRevenue).toLocaleString()}</li>` : ""}
          ${averageInvoiceValue ? `<li>Average Invoice Value: $${Number.parseFloat(averageInvoiceValue).toLocaleString()}</li>` : ""}
          ${currentDSO ? `<li>Current DSO: ${currentDSO} days</li>` : ""}
          ${collectionCosts ? `<li>Collection Costs: $${Number.parseFloat(collectionCosts).toLocaleString()}</li>` : ""}
        </ul>
        <p>We'll be in touch soon with your detailed ROI analysis.</p>
        <p>Best regards,<br>The Kuhlekt Team</p>
      `,
    })

    await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `New ROI Calculator Submission - ${company}`,
      text: `New ROI calculator submission:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nAnnual Revenue: ${annualRevenue}\nAverage Invoice Value: ${averageInvoiceValue}\nCurrent DSO: ${currentDSO}\nCollection Costs: ${collectionCosts}`,
      html: `
        <h2>New ROI Calculator Submission</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${company}</li>
          ${annualRevenue ? `<li><strong>Annual Revenue:</strong> $${Number.parseFloat(annualRevenue).toLocaleString()}</li>` : ""}
          ${averageInvoiceValue ? `<li><strong>Average Invoice Value:</strong> $${Number.parseFloat(averageInvoiceValue).toLocaleString()}</li>` : ""}
          ${currentDSO ? `<li><strong>Current DSO:</strong> ${currentDSO} days</li>` : ""}
          ${collectionCosts ? `<li><strong>Collection Costs:</strong> $${Number.parseFloat(collectionCosts).toLocaleString()}</li>` : ""}
        </ul>
      `,
    })

    return emailResult
  } catch (error) {
    console.error("Error submitting ROI calculator:", error)
    return {
      success: false,
      message: "Failed to submit ROI calculator",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
