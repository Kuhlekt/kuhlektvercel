"use server"

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export async function submitROICalculator(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const annualRevenue = formData.get("annualRevenue") as string
    const dso = formData.get("dso") as string

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Your ROI Calculator Results",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: `Thank you for using our ROI Calculator.\n\nCompany: ${company}\nAnnual Revenue: ${annualRevenue}\nDSO: ${dso}`,
            Charset: "UTF-8",
          },
          Html: {
            Data: `<h1>Thank you for using our ROI Calculator</h1><p>Company: ${company}</p><p>Annual Revenue: ${annualRevenue}</p><p>DSO: ${dso}</p>`,
            Charset: "UTF-8",
          },
        },
      },
    })

    await sesClient.send(command)

    return { success: true, message: "ROI report sent successfully" }
  } catch (error) {
    console.error("Error in submitROICalculator:", error)
    return { success: false, message: "Failed to send ROI report" }
  }
}
