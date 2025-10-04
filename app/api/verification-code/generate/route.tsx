import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

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

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store in Supabase
    const supabase = await createClient()
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

    // Send email via SES
    const emailParams = {
      Source: process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Your Verification Code - Kuhlekt ROI Calculator",
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
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Kuhlekt</h1>
                    <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">ROI Calculator Verification</p>
                  </div>
                  <div style="background: #f9fafb; padding: 40px 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #0891b2; margin-top: 0;">Your Verification Code</h2>
                    <p style="font-size: 16px; color: #555;">Please use the following code to verify your email and view your ROI calculation results:</p>
                    <div style="background: white; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                      <div style="font-size: 36px; font-weight: bold; color: #0891b2; letter-spacing: 8px; font-family: monospace;">${code}</div>
                    </div>
                    <p style="font-size: 14px; color: #666;">This code will expire in <strong>10 minutes</strong>.</p>
                    <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
                  </div>
                  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} Kuhlekt. All rights reserved.</p>
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
      const command = new SendEmailCommand(emailParams)
      await sesClient.send(command)

      return NextResponse.json({
        success: true,
        message: "Verification code sent successfully",
      })
    } catch (emailError) {
      console.error("SES error:", emailError)
      return NextResponse.json({ success: false, error: "Failed to send verification email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in generate verification code:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
