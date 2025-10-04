"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitROICalculator(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const annualRevenue = formData.get("annualRevenue") as string
  const dso = formData.get("dso") as string

  const subject = `ROI Calculator Results - ${companyName}`
  const text = `ROI Calculator submission from ${email} for ${companyName}`
  const html = `
    <h1>ROI Calculator Results</h1>
    <p><strong>Company:</strong> ${companyName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Annual Revenue:</strong> ${annualRevenue}</p>
    <p><strong>DSO:</strong> ${dso}</p>
  `

  const result = await sendEmail({
    to: email,
    subject,
    text,
    html,
  })

  return result
}
