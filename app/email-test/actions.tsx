"use server"

import { sendEmail, testAWSSESConnection, validateSESConfiguration } from "@/lib/aws-ses"

export async function testEmail(email: string) {
  return await sendEmail({
    to: email,
    subject: "Test Email from Kuhlekt",
    text: "This is a test email from the Kuhlekt website.",
    html: "<p>This is a test email from the <strong>Kuhlekt</strong> website.</p>",
  })
}

export async function testEmailSystem() {
  const validation = await validateSESConfiguration()
  const connection = await testAWSSESConnection()

  return {
    validation,
    connection,
  }
}

export async function getEmailConfigStatus() {
  return await validateSESConfiguration()
}
