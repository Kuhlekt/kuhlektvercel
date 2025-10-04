"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function submitROICalculator(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const annualRevenue = formData.get("annualRevenue") as string
    const currentDSO = formData.get("currentDSO") as string
    const invoiceVolume = formData.get("invoiceVolume") as string

    const emailText = `
ROI Calculator Submission

Name: ${name}
Email: ${email}
Company: ${company}
Annual Revenue: ${annualRevenue}
Current DSO: ${currentDSO}
Invoice Volume: ${invoiceVolume}
    `

    const emailHtml = `
      <h2>ROI Calculator Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Annual Revenue:</strong> ${annualRevenue}</p>
      <p><strong>Current DSO:</strong> ${currentDSO}</p>
      <p><strong>Invoice Volume:</strong> ${invoiceVolume}</p>
    `

    const result = await sendEmail({
      to: process.env.AWS_SES_FROM_EMAIL || "",
      subject: `ROI Calculator Submission from ${name}`,
      text: emailText,
      html: emailHtml,
    })

    if (result.success) {
      return { success: true, message: "ROI calculation submitted successfully!" }
    } else {
      return { success: false, message: result.message, error: result.error }
    }
  } catch (error) {
    console.error("Error submitting ROI calculator:", error)
    return {
      success: false,
      message: "Failed to submit ROI calculation",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
