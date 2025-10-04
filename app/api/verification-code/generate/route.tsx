import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in database
    const supabase = await createClient()

    // Set expiration to 10 minutes from now
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("Error storing verification code:", insertError)
      return NextResponse.json({ success: false, error: "Failed to generate code" }, { status: 500 })
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
                  <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; border-radius: 10px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Verification Code</h1>
                  </div>
                  <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                      Thank you for using the Kuhlekt ROI Calculator. Here is your verification code:
                    </p>
                    <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #0891b2;">
                      <p style="font-size: 36px; font-weight: bold; color: #0891b2; margin: 0; letter-spacing: 8px;">
                        ${code}
                      </p>
                    </div>
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                      This code will expire in 10 minutes.
                    </p>
                  </div>
                  <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
                  </div>
                </body>
              </html>
            `,
            Charset: "UTF-8",
          },
        },
      },
    }

    await sesClient.send(new SendEmailCommand(emailParams))

    return NextResponse.json({ success: true, message: "Verification code sent" })
  } catch (error) {
    console.error("Error in generate verification code:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
}
