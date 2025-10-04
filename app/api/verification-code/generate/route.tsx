import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

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
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Generate verification code
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in Supabase
    const supabase = await createClient()

    // Delete any existing codes for this email
    await supabase.from("verification_codes").delete().eq("email", email)

    // Insert new code
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
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .code-box { background: white; border: 2px solid #06b6d4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                    .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #06b6d4; font-family: monospace; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Verification Code</h1>
                    </div>
                    <div class="content">
                      <p>Thank you for using the Kuhlekt ROI Calculator!</p>
                      <p>Your verification code is:</p>
                      <div class="code-box">
                        <div class="code">${code}</div>
                      </div>
                      <p>This code will expire in 10 minutes.</p>
                      <p>If you didn't request this code, please ignore this email.</p>
                    </div>
                    <div class="footer">
                      <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
            Charset: "UTF-8",
          },
          Text: {
            Data: `Your Kuhlekt ROI Calculator verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
            Charset: "UTF-8",
          },
        },
      },
    }

    try {
      await sesClient.send(new SendEmailCommand(emailParams))
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      return NextResponse.json({ success: false, error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Verification code sent successfully" })
  } catch (error) {
    console.error("Error in generate verification code:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
