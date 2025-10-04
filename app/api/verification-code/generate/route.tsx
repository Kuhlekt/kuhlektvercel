import { type NextRequest, NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in database
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ success: false, error: "Failed to generate verification code" }, { status: 500 })
    }

    // Send email
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
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 40px 0; text-align: center;">
                        <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="padding: 40px 30px; text-align: center;">
                              <h1 style="color: #0891b2; margin: 0 0 20px 0; font-size: 28px;">Verification Code</h1>
                              <p style="color: #666; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                                Use the code below to verify your email and view your ROI calculation results:
                              </p>
                              <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 20px; border-radius: 8px; margin: 0 0 30px 0;">
                                <p style="color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                                  ${code}
                                </p>
                              </div>
                              <p style="color: #666; font-size: 14px; line-height: 20px; margin: 0 0 20px 0;">
                                This code will expire in 10 minutes.
                              </p>
                              <p style="color: #999; font-size: 12px; line-height: 18px; margin: 0;">
                                If you didn't request this code, please ignore this email.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                              <p style="color: #999; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
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

    try {
      await sesClient.send(new SendEmailCommand(emailParams))
    } catch (emailError) {
      console.error("Email error:", emailError)
      return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error generating code:", error)
    return NextResponse.json({ success: false, error: "Failed to generate verification code" }, { status: 500 })
  }
}
