import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 })
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    console.log("[Generate Code] Creating verification code for:", email)

    const { error: dbError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("[Generate Code] Database error:", dbError)
      return NextResponse.json({ success: false, error: "Failed to create verification code" }, { status: 500 })
    }

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
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px; text-align: center;">
                              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Kuhlekt</h1>
                              <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">ROI Calculator Verification</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px;">
                              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Your Verification Code</h2>
                              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                Please use the following code to verify your email address and view your ROI calculation results:
                              </p>
                              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 30px; text-align: center; margin: 0 0 30px 0;">
                                <div style="font-size: 48px; font-weight: bold; color: #0891b2; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                  ${code}
                                </div>
                              </div>
                              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">
                                This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                              <p style="color: #64748b; font-size: 14px; margin: 0;">
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

    console.log("[Generate Code] Sending email to:", email)

    try {
      await sesClient.send(new SendEmailCommand(emailParams))
      console.log("[Generate Code] Email sent successfully")

      return NextResponse.json({
        success: true,
        message: "Verification code sent to your email",
      })
    } catch (emailError) {
      console.error("[Generate Code] Email error:", emailError)
      return NextResponse.json({ success: false, error: "Failed to send verification email" }, { status: 500 })
    }
  } catch (error) {
    console.error("[Generate Code] Unexpected error:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
  }
}
