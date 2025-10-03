import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendEmailWithSES } from "@/lib/aws-ses"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API: Sending verification code")

    const body = await request.json()
    const { email } = body

    console.log("[v0] Email received:", email)

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

    // Store in database
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt,
      used: false,
    })

    if (insertError) {
      console.error("[v0] Database error:", insertError)
      return NextResponse.json({ success: false, error: "Failed to store verification code" }, { status: 500 })
    }

    console.log("[v0] Verification code stored in database:", { email, expiresAt })

    // Send email
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e5e5e5;">
                    <h1 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Kuhlekt</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 20px; font-weight: 600;">Your Verification Code</h2>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Thank you for your interest in Kuhlekt's ROI Calculator. Please use the verification code below to complete your request:
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding: 30px; background-color: #f8f8f8; border-radius: 8px;">
                          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; font-family: 'Courier New', monospace;">
                            ${code}
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                      This code will expire in 15 minutes. If you didn't request this code, please ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
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

    const textContent = `
Your Kuhlekt Verification Code

Thank you for your interest in Kuhlekt's ROI Calculator.

Your verification code is: ${code}

This code will expire in 15 minutes.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} Kuhlekt. All rights reserved.
  `.trim()

    await sendEmailWithSES({
      to: email,
      subject: "Your Kuhlekt Verification Code",
      html: htmlContent,
      text: textContent,
    })

    console.log("[v0] Verification code sent successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API: Error in send-verification:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send verification code",
      },
      { status: 500 },
    )
  }
}
