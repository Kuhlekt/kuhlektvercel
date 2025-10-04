"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/aws-ses"

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  const supabase = await createClient()

  const { error } = await supabase.from("verification_codes").insert({
    email,
    code,
    expires_at: expiresAt.toISOString(),
    attempts: 0,
  })

  if (error) {
    console.error("Error storing verification code:", error)
    return { success: false, message: "Failed to generate verification code" }
  }

  return { success: true, code }
}

export async function verifyCode(email: string, code: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .single()

  if (error || !data) {
    return { success: false, message: "Invalid verification code" }
  }

  if (new Date(data.expires_at) < new Date()) {
    return { success: false, message: "Verification code has expired" }
  }

  if (data.attempts >= 3) {
    return { success: false, message: "Too many attempts" }
  }

  await supabase.from("verification_codes").delete().eq("email", email).eq("code", code)

  return { success: true }
}

export async function sendROIReport(
  email: string,
  reportData: {
    currentAR: number
    invoiceVolume: number
    avgDSO: number
    collectionRate: number
    potentialSavings: number
    timeReduction: number
    dsoReduction: number
    collectionImprovement: number
  },
) {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Your ROI Calculator Results</h2>
        <h3>Current Metrics</h3>
        <ul>
          <li>Annual Receivables: $${reportData.currentAR.toLocaleString()}</li>
          <li>Invoice Volume: ${reportData.invoiceVolume.toLocaleString()}</li>
          <li>Average DSO: ${reportData.avgDSO} days</li>
          <li>Collection Rate: ${reportData.collectionRate}%</li>
        </ul>
        <h3>Projected Improvements with Kuhlekt</h3>
        <ul>
          <li>Potential Annual Savings: $${reportData.potentialSavings.toLocaleString()}</li>
          <li>Time Reduction: ${reportData.timeReduction}%</li>
          <li>DSO Reduction: ${reportData.dsoReduction} days</li>
          <li>Collection Rate Improvement: ${reportData.collectionImprovement}%</li>
        </ul>
        <p>Ready to transform your accounts receivable process? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo">Schedule a demo</a> today!</p>
      </body>
    </html>
  `

  const textContent = `
Your ROI Calculator Results

Current Metrics:
- Annual Receivables: $${reportData.currentAR.toLocaleString()}
- Invoice Volume: ${reportData.invoiceVolume.toLocaleString()}
- Average DSO: ${reportData.avgDSO} days
- Collection Rate: ${reportData.collectionRate}%

Projected Improvements with Kuhlekt:
- Potential Annual Savings: $${reportData.potentialSavings.toLocaleString()}
- Time Reduction: ${reportData.timeReduction}%
- DSO Reduction: ${reportData.dsoReduction} days
- Collection Rate Improvement: ${reportData.collectionImprovement}%

Ready to transform your accounts receivable process? Schedule a demo today!
Visit: ${process.env.NEXT_PUBLIC_SITE_URL}/demo
  `

  return await sendEmail({
    to: email,
    subject: "Your Kuhlekt ROI Calculator Results",
    text: textContent,
    html: htmlContent,
  })
}
