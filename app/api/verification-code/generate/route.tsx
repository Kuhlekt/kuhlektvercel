import { NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { createClient } from "@supabase/supabase-js"

const ses = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in database with 10-minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ success: false, error: "Failed to generate code" }, { status: 500 })
    }

    // Send email
    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Your Kuhlekt ROI Calculator Verification Code" },
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
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="padding: 40px;">
                              <h1 style="color: #0891b2; margin: 0 0 20px 0; font-size: 24px;">Verification Code</h1>
                              <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                Your verification code for the Kuhlekt ROI Calculator is:
                              </p>
                              <div style="background-color: #f0f9ff; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                                <span style="font-size: 36px; font-weight: bold; color: #0891b2; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                  ${code}
                                </span>
                              </div>
                              <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                              <p style="color: #999999; font-size: 12px; margin: 0;">
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

    await ses.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error generating verification code:", error)
    return NextResponse.json({ success: false, error: "Failed to generate code" }, { status: 500 })
  }
}
