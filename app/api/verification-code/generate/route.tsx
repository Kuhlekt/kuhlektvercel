import { NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { createClient } from "@supabase/supabase-js"

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

    // Store in Supabase
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

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

    // Send email via AWS SES
    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Your Verification Code",
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
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="background-color: #1e40af; padding: 30px; text-align: center;">
                              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Verification Code</h1>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px 30px;">
                              <p style="font-size: 16px; color: #333333; margin: 0 0 20px;">Your verification code is:</p>
                              <div style="background-color: #f8f9fa; border: 2px solid #1e40af; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                                <span style="font-size: 36px; font-weight: bold; color: #1e40af; letter-spacing: 8px;">${code}</span>
                              </div>
                              <p style="font-size: 14px; color: #666666; margin: 20px 0 0;">This code will expire in 10 minutes.</p>
                              <p style="font-size: 14px; color: #666666; margin: 10px 0 0;">If you didn't request this code, please ignore this email.</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                              <p style="font-size: 12px; color: #999999; margin: 0;">© 2025 Kuhlekt. All rights reserved.</p>
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error generating verification code:", error)
    return NextResponse.json({ success: false, error: "Failed to generate verification code" }, { status: 500 })
  }
}
