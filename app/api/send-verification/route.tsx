import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendEmail } from "@/lib/aws-ses"

export async function POST(request: NextRequest) {
  console.log("[v0] ===== SEND-VERIFICATION API CALLED =====")
  console.log("[v0] Request URL:", request.url)
  console.log("[v0] Request method:", request.method)

  try {
    const body = await request.json()
    console.log("[v0] Request body received:", {
      hasEmail: !!body.email,
      hasName: !!body.name,
      calculatorType: body.calculatorType,
    })

    const { name, email, company, phone, calculatorType, inputs } = body

    console.log("[v0] API: Sending verification code to:", email)

    if (!email || !name) {
      console.log("[v0] Validation failed: missing email or name")
      return NextResponse.json({ success: false, error: "Email and name are required" }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    console.log("[v0] Generated verification code, expires at:", expiresAt.toISOString())

    // Create Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    console.log("[v0] Supabase client created, attempting to store code")

    // Store verification code in database
    const { error: insertError } = await supabase.from("verification_codes").insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (insertError) {
      console.error("[v0] Failed to store verification code:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate verification code",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Verification code stored in database successfully")

    // Prepare email content
    const emailSubject = "Your ROI Calculator Verification Code"
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0891b2;">ROI Calculator Verification</h2>
        <p>Hi ${name},</p>
        <p>Thank you for using our ROI Calculator! To view your personalized results, please verify your email address.</p>
        
        <div style="background-color: #f0f9ff; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">Your verification code is:</p>
          <p style="font-size: 36px; font-weight: bold; color: #0891b2; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
            ${code}
          </p>
        </div>
        
        <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes.</p>
        
        <p>If you didn't request this code, you can safely ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        
        <p style="color: #64748b; font-size: 12px;">
          This is an automated message from Kuhlekt ROI Calculator.<br />
          Calculator Type: ${calculatorType === "simple" ? "Simple" : "Detailed"}<br />
          ${company ? `Company: ${company}<br />` : ""}
          Phone: ${phone || "Not provided"}
        </p>
      </div>
    `

    const emailText = `
ROI Calculator Verification

Hi ${name},

Thank you for using our ROI Calculator! To view your personalized results, please verify your email address.

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.

---
This is an automated message from Kuhlekt ROI Calculator.
Calculator Type: ${calculatorType === "simple" ? "Simple" : "Detailed"}
${company ? `Company: ${company}` : ""}
Phone: ${phone || "Not provided"}
    `

    // Send email
    console.log("[v0] Attempting to send email via AWS SES")
    const emailResult = await sendEmail({
      to: email,
      subject: emailSubject,
      html: emailBody,
      text: emailText,
    })

    if (!emailResult.success) {
      console.error("[v0] Failed to send verification email:", emailResult.message)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send verification email. Please try again.",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Verification code sent successfully to:", email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API: Error in send-verification:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send verification code",
      },
      { status: 500 },
    )
  }
}
