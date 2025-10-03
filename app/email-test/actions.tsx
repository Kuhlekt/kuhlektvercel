"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  const to = formData.get("to") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  const result = await sendEmail({
    to,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  })

  return result
}
