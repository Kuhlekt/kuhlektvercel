import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { type NextRequest, NextResponse } from "next/server"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Contact form API called")
    const data = await request.json()
    console.log("[v0] Request data:", {
      name: data.name,
      email: data.email,
      hasPhone: !!data.phone,
      hasCompany: !!data.company,
      hasMessage: !!data.message,
    })

    const emailContent = `
      Contact Form Submission
      
      Name: ${data.name}
      Email: ${data.email}
      Phone: ${data.phone || "Not provided"}
      Company: ${data.company || "Not provided"}
      
      Message:
      ${data.message}
    `

    console.log("[v0] Preparing to send email via AWS SES")
    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL || "",
      Destination: {
        ToAddresses: [process.env.AWS_SES_FROM_EMAIL || ""],
      },
      Message: {
        Subject: {
          Data: `Contact Form - ${data.name}`,
        },
        Body: {
          Text: {
            Data: emailContent,
          },
        },
      },
    })

    console.log("[v0] Sending email command to AWS SES")
    await sesClient.send(command)
    console.log("[v0] Email sent successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error sending contact email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
