import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const ses = new SESClient({
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

    // Store in Supabase
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ success: false, error: "Failed to store verification code" }, { status: 500 })
    }

    // Send email via SES
    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
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
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
                              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Verification Code</h1>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px;">
                              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Thank you for using the Kuhlekt ROI Calculator. Your verification code is:
                              </p>
                              <div style="background-color: #f0f9ff; border: 2px solid #0891b2; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                                <p style="font-size: 48px; font-weight: bold; color: #0891b2; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                  ${code}
                                </p>
                              </div>
                              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                              <p style="color: #6b7280; font-size: 12px; margin: 0;">
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

    try {
      await ses.send(new SendEmailCommand(emailParams))
      return NextResponse.json({ success: true })
    } catch (emailError) {
      console.error("Email error:", emailError)
      return NextResponse.json({ success: false, error: "Failed to send verification email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in generate route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
