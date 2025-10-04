import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
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

    // Store in database with 10-minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ success: false, error: "Failed to store verification code" }, { status: 500 })
    }

    // Send email via AWS SES
    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Your Kuhlekt ROI Calculator Verification Code",
        },
        Body: {
          Html: {
            Data: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Verification Code</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px; text-align: center;">
                              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Kuhlekt</h1>
                              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">ROI Calculator</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px;">
                              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Your Verification Code</h2>
                              <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                                Please use the following code to verify your email address and view your ROI calculation results:
                              </p>
                              <div style="background-color: #f0f9ff; border: 2px solid #0891b2; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                                <div style="font-size: 48px; font-weight: bold; color: #0891b2; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                  ${code}
                                </div>
                              </div>
                              <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 30px 0 0 0;">
                                This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                              <p style="color: #6b7280; font-size: 14px; margin: 0;">
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
          },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error generating verification code:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
}
