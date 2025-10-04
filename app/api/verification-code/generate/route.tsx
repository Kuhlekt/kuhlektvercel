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

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 })
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

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

    // Send email via SES
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
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Kuhlekt</h1>
                    <p style="color: #e0f2fe; margin: 10px 0 0 0;">ROI Calculator Verification</p>
                  </div>
                  
                  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #0891b2; margin-top: 0;">Your Verification Code</h2>
                    
                    <p style="font-size: 16px; color: #4b5563;">
                      Thank you for using the Kuhlekt ROI Calculator. To view your results, please enter this verification code:
                    </p>
                    
                    <div style="background: #f0f9ff; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                      <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0891b2; font-family: 'Courier New', monospace;">
                        ${code}
                      </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                      This code will expire in <strong>10 minutes</strong>.
                    </p>
                    
                    <p style="font-size: 14px; color: #6b7280;">
                      If you didn't request this code, please ignore this email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
                      © ${new Date().getFullYear()} Kuhlekt. All rights reserved.
                    </p>
                  </div>
                </body>
              </html>
            `,
          },
          Text: {
            Data: `Your Kuhlekt ROI Calculator verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
          },
        },
      },
    }

    try {
      await sesClient.send(new SendEmailCommand(emailParams))
      return NextResponse.json({ success: true })
    } catch (emailError) {
      console.error("SES error:", emailError)
      return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in generate verification code:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
