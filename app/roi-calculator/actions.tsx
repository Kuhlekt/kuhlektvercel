"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const name = formData.get("name") as string
    const reportData = formData.get("reportData") as string

    const result = await sendEmail({
      to: email,
      subject: `ROI Report for ${company}`,
      text: `Hello ${name},\n\nThank you for calculating your ROI with Kuhlekt.\n\nYour report data:\n${reportData}`,
      html: `<h1>Hello ${name},</h1><p>Thank you for calculating your ROI with Kuhlekt.</p><p>Your report data:</p><pre>${reportData}</pre>`,
    })

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
