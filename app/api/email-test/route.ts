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
    const data = await request.json()

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL || "",
      Destination: {
        ToAddresses: [data.email],
      },
      Message: {
        Subject: {
          Data: "Test Email from Kuhlekt",
        },
        Body: {
          Text: {
            Data: "This is a test email to verify AWS SES configuration.",
          },
        },
      },
    })

    await sesClient.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
