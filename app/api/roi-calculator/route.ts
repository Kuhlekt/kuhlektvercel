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

    const emailContent = `
      ROI Calculator Results
      
      Company: ${data.companyName}
      Contact: ${data.contactName}
      Email: ${data.email}
      Phone: ${data.phone || "Not provided"}
      
      Current Metrics:
      - Annual Revenue: $${data.annualRevenue?.toLocaleString()}
      - Outstanding AR: $${data.outstandingAR?.toLocaleString()}
      - DSO: ${data.dso} days
      - Collection Rate: ${data.collectionRate}%
      - Staff Hours/Month: ${data.staffHours}
      
      Projected Savings:
      - Annual Savings: $${data.projectedSavings?.toLocaleString()}
      - Time Saved: ${data.timeSaved} hours/month
      - DSO Reduction: ${data.dsoReduction} days
    `

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL || "",
      Destination: {
        ToAddresses: [process.env.AWS_SES_FROM_EMAIL || ""],
      },
      Message: {
        Subject: {
          Data: `ROI Calculator Submission - ${data.companyName}`,
        },
        Body: {
          Text: {
            Data: emailContent,
          },
        },
      },
    })

    await sesClient.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
