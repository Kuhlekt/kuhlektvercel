"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const currentDSO = formData.get("currentDSO") as string
  const annualRevenue = formData.get("annualRevenue") as string
  const avgInvoiceValue = formData.get("avgInvoiceValue") as string

  const result = await sendEmail({
    to: email,
    subject: `ROI Calculator Results - ${companyName}`,
    text: `Here are your ROI calculator results for ${companyName}...`,
    html: `<h1>ROI Calculator Results</h1><p>Company: ${companyName}</p><p>Current DSO: ${currentDSO}</p><p>Annual Revenue: ${annualRevenue}</p><p>Average Invoice Value: ${avgInvoiceValue}</p>`,
  })

  return result
}
