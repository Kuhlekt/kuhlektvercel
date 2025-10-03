"use server"

import { sendEmail, testAWSSESConnection, validateSESConfiguration } from "@/lib/aws-ses"

export async function testEmail(email: string) {
  try {
    await sendEmail({
      to: email,
      subject: "Test Email from Kuhlekt",
      text: "This is a test email to verify the email system is working correctly.",
      html: "<p>This is a test email to verify the email system is working correctly.</p>",
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function testEmailSystem() {
  return await testAWSSESConnection()
}

export async function getEmailConfigStatus() {
  return await validateSESConfiguration()
}
