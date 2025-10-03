"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function sendROIReport(email: string, reportData: any) {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    const supabase = await createClient()
    const { error: dbError } = await supabase.from("verification_codes").insert({
      email,
      code: verificationCode,
      report_data: reportData,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return { success: false, message: "Failed to store verification code" }
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
    })

    if (!emailResult.success) {
      return { success: false, message: emailResult.message }
    }

    return { success: true, message: "Verification code sent to your email" }
  } catch (error) {
    console.error("Error in sendROIReport:", error)
    return { success: false, message: "An error occurred" }
  }
}

export async function verifyCode(email: string, code: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return { success: false, message: "Invalid or expired verification code" }
    }

    const { error: updateError } = await supabase
      .from("verification_codes")
      .update({ verified: true })
      .eq("id", data.id)

    if (updateError) {
      return { success: false, message: "Failed to verify code" }
    }

    const reportData = data.report_data
    const emailResult = await sendEmail({
      to: email,
      subject: "Your ROI Calculator Report",
      text: "Please find your ROI report attached.",
      html: `<h1>Your ROI Report</h1><pre>${JSON.stringify(reportData, null, 2)}</pre>`,
    })

    if (!emailResult.success) {
      return { success: false, message: "Verification successful but failed to send report" }
    }

    return { success: true, message: "Report sent successfully", data: reportData }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return { success: false, message: "An error occurred during verification" }
  }
}
