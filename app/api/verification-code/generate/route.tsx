import { NextResponse } from "next/server"
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

    // Store code in database
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (dbError) {
      console.error("Error storing verification code:", dbError)
      return NextResponse.json({ success: false, error: "Failed to generate code" }, { status: 500 })
    }

    // Send email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Verification Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Verification Code</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">
                        Your verification code for the ROI Calculator is:
                      </p>
                      <div style="background-color: #f0f9ff; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                        <p style="margin: 0; font-size: 36px; font-weight: bold; color: #0891b2; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${code}
                        </p>
                      </div>
                      <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.5; color: #666666;">
                        This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0; font-size: 12px; color: #999999;">
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

    const sendEmailCommand = new SendEmailCommand({
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
        },
      },
    })

    await sesClient.send(sendEmailCommand)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error generating verification code:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
}
