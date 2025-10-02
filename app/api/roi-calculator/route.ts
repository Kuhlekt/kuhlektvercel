import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/aws-ses"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { fullName, email, phone, currentDSO, averageInvoiceValue, monthlyInvoices, roiResults, timestamp } = data

    // Send email notification to admin
    const adminEmailContent = `
      New ROI Calculator Submission
      
      Contact Information:
      Name: ${fullName}
      Email: ${email}
      Phone: ${phone}
      
      ROI Calculator Inputs:
      Current DSO: ${currentDSO} days
      Average Invoice Value: $${averageInvoiceValue}
      Monthly Invoices: ${monthlyInvoices}
      
      Calculated Results:
      Annual Savings: $${roiResults.annualSavings.toLocaleString()}
      DSO Reduction: ${roiResults.dsoReduction} days
      Hours Saved Annually: ${roiResults.timesSaved.toLocaleString()}
      Cash Flow Improvement: $${roiResults.cashFlowImprovement.toLocaleString()}
      
      Submitted: ${timestamp}
    `

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@kuhlekt.com",
      subject: "New ROI Calculator Submission",
      body: adminEmailContent,
    })

    // Send confirmation email to user
    const userEmailContent = `
      Dear ${fullName},
      
      Thank you for using the Kuhlekt ROI Calculator!
      
      Based on your inputs, here's what Kuhlekt can help you achieve:
      
      📊 Your Potential ROI:
      • Annual Savings: $${roiResults.annualSavings.toLocaleString()}
      • DSO Reduction: ${roiResults.dsoReduction} days
      • Hours Saved Annually: ${roiResults.timesSaved.toLocaleString()} hours
      • Cash Flow Improvement: $${roiResults.cashFlowImprovement.toLocaleString()}
      
      Our team will reach out to you within 24 hours to discuss how we can help you achieve these results.
      
      In the meantime, feel free to schedule a demo at: https://kuhlekt.com/demo
      
      Best regards,
      The Kuhlekt Team
    `

    await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Report",
      body: userEmailContent,
    })

    return NextResponse.json({ success: true, message: "ROI calculation submitted successfully" })
  } catch (error) {
    console.error("ROI calculator API error:", error)
    return NextResponse.json({ success: false, message: "Failed to process request" }, { status: 500 })
  }
}
