import { type NextRequest, NextResponse } from "next/server"
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

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Database error:", insertError)
      return NextResponse.json({ success: false, error: "Failed to generate code" }, { status: 500 })
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Verification Code</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                        Your verification code for the ROI Calculator is:
                      </p>
                      <div style="background-color: #f0f9ff; border: 2px dashed #0891b2; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                        <span style="font-size: 48px; font-weight: bold; color: #0891b2; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${code}
                        </span>
                      </div>
                      <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 20px 0 0 0;">
                        This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
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
    `

    const command = new SendEmailCommand({
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Your ROI Calculator Verification Code",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: emailHtml,
            Charset: "UTF-8",
          },
          Text: {
            Data: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
            Charset: "UTF-8",
          },
        },
      },
    })

    await sesClient.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error generating verification code:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
}
