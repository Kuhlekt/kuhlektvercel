import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  },
})

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in Supabase
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return NextResponse.json({ success: false, error: "Failed to generate code" }, { status: 500 })
    }

    // Send email via SES
    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL || "",
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Your Kuhlekt ROI Calculator Verification Code",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 40px 0;">
                        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px 8px 0 0;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Kuhlekt</h1>
                              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">ROI Calculator</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px 30px;">
                              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">Your Verification Code</h2>
                              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                                Please use the following code to verify your email and view your ROI calculation results:
                              </p>
                              <div style="background-color: #f0f9ff; border: 2px solid #0891b2; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                                <p style="margin: 0; color: #0891b2; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</p>
                              </div>
                              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `,
            Charset: "UTF-8",
          },
        },
      },
    }

    const command = new SendEmailCommand(emailParams)
    await sesClient.send(command)

    return NextResponse.json({ success: true, message: "Verification code sent" })
  } catch (error) {
    console.error("Error generating verification code:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
}
