"use server"

import { sendEmail } from "@/lib/aws-ses"

export async function sendTestEmail(formData: FormData) {
  const to = formData.get("to") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  const html = `
    <html>
      <body>
        <h1>${subject}</h1>
        <p>${message}</p>
      </body>
    </html>
  `

  const result = await sendEmail({
    to,
    subject,
    text: message,
    html,
  })

  return result
}
