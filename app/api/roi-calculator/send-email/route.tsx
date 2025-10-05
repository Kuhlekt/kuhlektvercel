import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { sendEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    console.log("[ROI Email] Request received")
    const body = await request.json()
    console.log("[ROI Email] Request body:", JSON.stringify(body, null, 2))

    const { email, calculatorType, results, inputs } = body

    console.log("[ROI Email] Calculator type:", calculatorType)
    console.log("[ROI Email] Sending to email:", email)
    console.log("[ROI Email] Results:", JSON.stringify(results, null, 2))

    if (!email || !calculatorType || !results) {
      console.error("[ROI Email] Missing required fields:", { email, calculatorType, results: !!results })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format the email body based on calculator type
    let emailSubject = ""
    let emailBody = ""

    if (calculatorType === "simple") {
      console.log("[ROI Email] Processing simple calculator email")
      emailSubject = "Your ROI Calculator Results - Kuhlekt"
      emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your ROI Results</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
    <h1 style="margin: 0; font-size: 28px;">Your Projected ROI</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Analysis Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
    <h2 style="color: #0891b2; margin-top: 0;">Key Results</h2>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
      <div style="background: linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%); padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #84cc16;">
        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 10px;">ROI</div>
        <div style="font-size: 36px; font-weight: 700; color: #16a34a;">${results.roi?.toFixed(1) || "0.0"}%</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 5px;">Return on Investment</div>
      </div>
      
      <div style="background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%); padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #ef4444;">
        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 10px;">Payback Period</div>
        <div style="font-size: 36px; font-weight: 700; color: #dc2626;">${results.paybackMonths?.toFixed(1) || "0.0"}</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 5px;">Months</div>
      </div>
    </div>

    <div style="background: #f0f9ff; border-left: 4px solid #0891b2; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
      <h3 style="color: #0e7490; margin-top: 0; font-size: 14px;">Annual Savings</h3>
      <p style="font-size: 13px; color: #164e63; margin: 0;">
        Total annual benefit: <strong style="color: #0891b2;">$${(results.totalAnnualBenefit || 0).toLocaleString()}</strong>
      </p>
    </div>

    <div style="background: #f0f9ff; border-left: 4px solid #0891b2; padding: 15px; border-radius: 6px;">
      <h3 style="color: #0e7490; margin-top: 0; font-size: 14px;">Working Capital Released</h3>
      <p style="font-size: 13px; color: #164e63; margin: 0;">
        One-time cash flow improvement: <strong style="color: #0891b2;">$${(results.workingCapitalReleased || 0).toLocaleString()}</strong>
      </p>
    </div>
  </div>

  <div style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border: 2px solid #0891b2; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
    <h3 style="color: #0e7490; margin-top: 0;">What This Means for Your Business</h3>
    <p style="font-size: 13px; color: #164e63; line-height: 1.8;">
      By implementing the Kuhlekt invoice-to-cash platform, your organization can achieve a 
      <strong style="color: #0891b2;">${results.roi?.toFixed(0) || "0"}% ROI</strong> within 
      <strong style="color: #0891b2;">${results.paybackMonths?.toFixed(1) || "0"} months</strong>. 
      The total annual benefit of <strong style="color: #0891b2;">$${(results.totalAnnualBenefit || 0).toLocaleString()}</strong> 
      includes interest savings, labour cost reductions, and bad debt improvements.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 10px;">
    <h3 style="color: #0891b2; margin-top: 0;">Ready to Learn More?</h3>
    <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
      Schedule a personalized demo to see how Kuhlekt can transform your invoice-to-cash process.
    </p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" 
       style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
      Schedule a Demo
    </a>
  </div>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 11px; color: #6b7280;">
    <p><strong style="color: #0891b2;">Kuhlekt®</strong> - Transforming Invoice-to-Cash</p>
    <p>Visit us at <a href="https://kuhlekt.com" style="color: #0891b2;">kuhlekt.com</a> | Email: enquiries@kuhlekt.com</p>
    <p style="margin-top: 10px;">
      This report is generated based on the inputs provided and represents estimated outcomes. 
      Actual results may vary based on implementation and business-specific factors.
    </p>
  </div>
</body>
</html>
`
    } else if (calculatorType === "detailed") {
      console.log("[ROI Email] Processing detailed calculator email")
      emailSubject = "Your Detailed ROI Analysis - Kuhlekt"

      // Parse input values for detailed email
      const numberOfDebtors = Number.parseFloat(inputs?.numberOfDebtors) || 0
      const numberOfCollectors = Number.parseFloat(inputs?.numberOfCollectors) || 1
      const currentCapacity = numberOfDebtors / numberOfCollectors
      const labourSavings = Number.parseFloat(inputs?.labourSavings) || 30
      const additionalCapacity = Math.round(currentCapacity * (labourSavings / 100))

      emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your Detailed ROI Analysis</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
    <h1 style="margin: 0; font-size: 28px;">Your Detailed ROI Analysis</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Analysis Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
    <h2 style="color: #0891b2; margin-top: 0;">Key Results</h2>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
      <div style="background: linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%); padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #84cc16;">
        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 10px;">ROI</div>
        <div style="font-size: 36px; font-weight: 700; color: #16a34a;">${results.roi?.toFixed(1) || "0.0"}%</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 5px;">Return on Investment</div>
      </div>
      
      <div style="background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%); padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #ef4444;">
        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 10px;">Payback Period</div>
        <div style="font-size: 36px; font-weight: 700; color: #dc2626;">${results.paybackMonths?.toFixed(1) || "0.0"}</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 5px;">Months</div>
      </div>
    </div>

    <h3 style="color: #0891b2; font-size: 16px; margin-top: 25px; margin-bottom: 10px;">Financial Impact</h3>
    
    <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
      <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 5px;">Annual Recurring Savings</div>
      <div style="font-size: 24px; font-weight: 700; color: #16a34a;">$${(results.totalAnnualBenefit || 0).toLocaleString()}</div>
      <div style="font-size: 10px; color: #6b7280; margin-top: 4px;">Interest + Labour + Bad Debt</div>
    </div>

    <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
      <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 5px;">Working Capital Released</div>
      <div style="font-size: 24px; font-weight: 700; color: #16a34a;">$${(results.workingCapitalReleased || 0).toLocaleString()}</div>
      <div style="font-size: 10px; color: #6b7280; margin-top: 4px;">One-time cash flow improvement</div>
    </div>

    <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px;">
      <div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 5px;">DSO Improvement</div>
      <div style="font-size: 24px; font-weight: 700; color: #0891b2;">${results.dsoReductionDays?.toFixed(0) || "0"} days</div>
      <div style="font-size: 10px; color: #6b7280; margin-top: 4px;">From ${results.currentDSO?.toFixed(0) || "0"} to ${results.newDSO?.toFixed(0) || "0"} days</div>
    </div>
  </div>

  <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
    <h3 style="color: #0891b2; margin-top: 0;">Capacity Growth Without Hiring</h3>
    <p style="font-size: 13px; color: #6b7280; margin-bottom: 15px;">
      Your team can handle <strong style="color: #0891b2;">${additionalCapacity.toLocaleString()}</strong> more customers 
      without additional headcount.
    </p>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; text-align: center;">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 8px;">Current Capacity</div>
        <div style="font-size: 28px; font-weight: 700; color: #1f2937;">${Math.round(currentCapacity).toLocaleString()}</div>
        <div style="font-size: 11px; color: #78716c; margin-top: 5px;">customers per collector</div>
      </div>
      
      <div style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); border: 2px solid #8b5cf6; border-radius: 8px; padding: 15px; text-align: center;">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 8px;">With Implementation</div>
        <div style="font-size: 28px; font-weight: 700; color: #1f2937;">${Math.round(currentCapacity + additionalCapacity).toLocaleString()}</div>
        <div style="font-size: 11px; color: #78716c; margin-top: 5px;">customers per collector</div>
      </div>
    </div>
  </div>

  <div style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border: 2px solid #0891b2; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
    <h3 style="color: #0e7490; margin-top: 0;">Summary</h3>
    <p style="font-size: 13px; color: #164e63; line-height: 1.8;">
      By implementing the Kuhlekt invoice-to-cash platform with automated collection workflows 
      and customer self-service, your organization can achieve a 
      <strong style="color: #0891b2;">${results.roi?.toFixed(0) || "0"}% ROI</strong> within 
      <strong style="color: #0891b2;">${results.paybackMonths?.toFixed(1) || "0"} months</strong>. 
      You should expect to improve DSO by <strong style="color: #0891b2;">${results.dsoReductionDays?.toFixed(0) || "0"} days</strong>, 
      freeing up <strong style="color: #0891b2;">$${(results.workingCapitalReleased || 0).toLocaleString()}</strong> 
      in working capital without adding headcount.
    </p>
  </div>

  
      in working capital without adding headcount.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 10px;">
    <h3 style="color: #0891b2; margin-top: 0;">Ready to Learn More?</h3>
    <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
      Schedule a personalized demo to see how Kuhlekt can transform your invoice-to-cash process.
    </p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/demo" 
       style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
      Schedule a Demo
    </a>
  </div>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 11px; color: #6b7280;">
    <p><strong style="color: #0891b2;">Kuhlekt®</strong> - Transforming Invoice-to-Cash</p>
    <p>Visit us at <a href="https://kuhlekt.com" style="color: #0891b2;">kuhlekt.com</a> | Email: enquiries@kuhlekt.com</p>
    <p style="margin-top: 10px;">
      This report is generated based on the inputs provided and represents estimated outcomes. 
      Actual results may vary based on implementation and business-specific factors.
    </p>
  </div>
</body>
</html>
`
    } else {
      console.error("[ROI Email] Unknown calculator type:", calculatorType)
      return NextResponse.json({ error: "Invalid calculator type" }, { status: 400 })
    }

    console.log("[ROI Email] Calling sendEmail function")
    console.log("[ROI Email] Email subject:", emailSubject)

    // Send the email
    const emailResult = await sendEmail({
      to: email,
      subject: emailSubject,
      html: emailBody,
    })

    console.log("[ROI Email] Email send result:", JSON.stringify(emailResult, null, 2))

    if (!emailResult.success) {
      console.error("[ROI Email] Failed to send email:", emailResult.error)
      return NextResponse.json({ error: emailResult.error || "Failed to send email" }, { status: 500 })
    }

    console.log("[ROI Email] Email sent successfully")
    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("[ROI Email] Error in route handler:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
