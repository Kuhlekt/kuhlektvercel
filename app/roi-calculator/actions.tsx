"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  const email = formData.get("email") as string
  const companyName = formData.get("companyName") as string
  const annualRevenue = formData.get("annualRevenue") as string
  const currentDSO = formData.get("currentDSO") as string
  const targetDSO = formData.get("targetDSO") as string
  const savings = formData.get("savings") as string
  const roiPercentage = formData.get("roiPercentage") as string

  const subject = `Your Kuhlekt ROI Report - ${companyName}`
  const text = `ROI Calculator Results for ${companyName}\n\nAnnual Revenue: ${annualRevenue}\nCurrent DSO: ${currentDSO}\nTarget DSO: ${targetDSO}\nEstimated Annual Savings: ${savings}\nROI: ${roiPercentage}%`
  const html = `
    <h1>ROI Calculator Results for ${companyName}</h1>
    <p><strong>Annual Revenue:</strong> ${annualRevenue}</p>
    <p><strong>Current DSO:</strong> ${currentDSO}</p>
    <p><strong>Target DSO:</strong> ${targetDSO}</p>
    <p><strong>Estimated Annual Savings:</strong> ${savings}</p>
    <p><strong>ROI:</strong> ${roiPercentage}%</p>
  `

  const result = await sendEmail({ to: email, subject, text, html })
  return result
}
