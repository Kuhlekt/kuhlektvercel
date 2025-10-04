import { NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { createClient } from "@/lib/supabase/server"

const ses = new SESClient({
  region: process.env.AWS_SES_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const supabase = await createClient()

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return NextResponse.json({ success: false, error: "Failed to generate verification code" }, { status: 500 })
    }

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
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Kuhlekt</h1>
                              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">ROI Calculator</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px 30px;">
                              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Your Verification Code</h2>
                              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                                Thank you for using the Kuhlekt ROI Calculator. Please use the verification code below to complete your request:
                              </p>
                              <div style="background-color: #f0f9ff; border: 2px dashed #0891b2; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                                <div style="font-size: 48px; font-weight: bold; color: #0891b2; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                  ${code}
                                </div>
                              </div>
                              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                              <p style="margin: 0; color: #6b7280; font-size: 14px;">
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

    const command = new SendEmailCommand(emailParams)
    await ses.send(command)

    console.log("Verification code sent successfully to:", email)

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    })
  } catch (error) {
    console.error("Error generating verification code:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
}
