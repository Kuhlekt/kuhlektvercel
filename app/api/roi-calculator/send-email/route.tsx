import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    console.log("=== ROI Calculator Email Route ===")
    console.log("Request received at:", new Date().toISOString())

    const body = await request.json()
    console.log("Request body received")
    console.log("Calculator Type:", body.calculatorType)
    console.log("Email Address:", body.email)

    const { name, email, company, phone, calculatorType, inputs, results } = body

    if (!name || !email || !calculatorType || !inputs || !results) {
      console.error("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format results based on calculator type
    let emailBody = ""
    let textBody = ""

    if (calculatorType === "simple") {
      console.log("Processing SIMPLE calculator email")

      textBody = `
Your ROI Calculator Results

Dear ${name},

Thank you for using the Kuhlekt ROI Calculator. Based on your inputs, here are your estimated savings:

KEY RESULTS:
- Estimated Annual Savings: $${results.annualSavings?.toLocaleString() || "0"}
- Current DSO: ${results.currentDSO?.toFixed(0) || "0"} days
- Projected DSO: ${results.newDSO?.toFixed(0) || "0"} days
- DSO Improvement: ${results.dsoImprovement?.toFixed(0) || "0"}%
- Cash Released: $${results.cashReleased?.toLocaleString() || "0"}

YOUR INPUTS:
- Current DSO: ${inputs.currentDSO} days
- Average Invoice Value: $${Number.parseFloat(inputs.averageInvoiceValue).toLocaleString()}
- Monthly Invoices: ${inputs.monthlyInvoices}
- Expected DSO Improvement: ${inputs.simpleDSOImprovement}%
- Cost of Capital: ${inputs.simpleCostOfCapital}%

What's Next?
- Schedule a personalized demo to see Kuhlekt in action
- Speak with our team about your specific needs
- Review detailed case studies from similar organizations

Our team will be in touch shortly to discuss how Kuhlekt can help transform your invoice-to-cash process.

Best regards,
The Kuhlekt Team

---
Kuhlekt - Transforming Invoice-to-Cash
Visit us at kuhlekt.com | Email: enquiries@kuhlekt.com
      `

      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">Your ROI Calculator Results</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for using the Kuhlekt ROI Calculator. Based on your inputs, here are your estimated savings:</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0891b2; margin-top: 0;">Key Results</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 10px 0;"><strong>Estimated Annual Savings:</strong> $${results.annualSavings?.toLocaleString() || "0"}</li>
              <li style="margin: 10px 0;"><strong>Current DSO:</strong> ${results.currentDSO?.toFixed(0) || "0"} days</li>
              <li style="margin: 10px 0;"><strong>Projected DSO:</strong> ${results.newDSO?.toFixed(0) || "0"} days</li>
              <li style="margin: 10px 0;"><strong>DSO Improvement:</strong> ${results.dsoImprovement?.toFixed(0) || "0"}%</li>
              <li style="margin: 10px 0;"><strong>Cash Released:</strong> $${results.cashReleased?.toLocaleString() || "0"}</li>
            </ul>
          </div>
          
          <div style="background: #ecfeff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0891b2; margin-top: 0;">Your Inputs</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;">Current DSO: ${inputs.currentDSO} days</li>
              <li style="margin: 8px 0;">Average Invoice Value: $${Number.parseFloat(inputs.averageInvoiceValue).toLocaleString()}</li>
              <li style="margin: 8px 0;">Monthly Invoices: ${inputs.monthlyInvoices}</li>
              <li style="margin: 8px 0;">Expected DSO Improvement: ${inputs.simpleDSOImprovement}%</li>
              <li style="margin: 8px 0;">Cost of Capital: ${inputs.simpleCostOfCapital}%</li>
            </ul>
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Schedule a personalized demo to see Kuhlekt in action</li>
            <li>Speak with our team about your specific needs</li>
            <li>Review detailed case studies from similar organizations</li>
          </ul>
          
          <p>Our team will be in touch shortly to discuss how Kuhlekt can help transform your invoice-to-cash process.</p>
          
          <p>Best regards,<br>The Kuhlekt Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>Kuhlekt - Transforming Invoice-to-Cash</p>
            <p>Visit us at kuhlekt.com | Email: enquiries@kuhlekt.com</p>
          </div>
        </div>
      `
    } else {
      console.log("Processing DETAILED calculator email")

      textBody = `
Your Detailed ROI Analysis

Dear ${name},

Thank you for using the Kuhlekt Detailed ROI Calculator. Based on your comprehensive inputs, here is your projected return on investment:

EXECUTIVE SUMMARY:
- ROI: ${results.roi?.toFixed(1) || "0"}%
- Payback Period: ${results.paybackMonths?.toFixed(1) || "0"} months
- Total Annual Benefit: $${results.totalAnnualBenefit?.toLocaleString() || "0"}
- Working Capital Released: $${results.workingCapitalReleased?.toLocaleString() || "0"}

DETAILED BREAKDOWN:

Annual Savings:
- Interest Savings: $${results.interestSavings?.toLocaleString() || "0"}
- Labour Cost Savings: $${results.labourCostSavings?.toLocaleString() || "0"}
- Bad Debt Reduction: $${results.badDebtReduction?.toLocaleString() || "0"}

DSO Improvement:
- Current DSO: ${results.currentDSO?.toFixed(0) || "0"} days
- Improved DSO: ${results.newDSO?.toFixed(0) || "0"} days
- Reduction: ${results.dsoReductionDays?.toFixed(0) || "0"} days

Capacity Improvement:
- Current Capacity: ${results.currentCapacity?.toFixed(0) || "0"} customers per collector
- Additional Capacity: +${results.additionalCapacity?.toFixed(0) || "0"} customers

INVESTMENT REQUIRED:
- Implementation Cost: $${results.implementationCost?.toLocaleString() || "0"}
- Annual Subscription: $${results.annualCost?.toLocaleString() || "0"}
- Total First Year: $${results.totalFirstYearCost?.toLocaleString() || "0"}

3-YEAR VALUE: $${results.threeYearValue?.toLocaleString() || "0"}
(Cumulative net benefit over 3 years)

What's Next?
- Schedule a personalized demo with our team
- Discuss implementation timelines and pricing
- Review case studies from similar organizations
- Get answers to your specific questions

Our team will reach out shortly to schedule a detailed consultation and demonstrate how Kuhlekt can deliver these results for your organization.

Best regards,
The Kuhlekt Team

---
Kuhlekt - Transforming Invoice-to-Cash
Visit us at kuhlekt.com | Email: enquiries@kuhlekt.com
${company ? `This report was generated for ${company}` : ""}
      `

      emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">Your Detailed ROI Analysis</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for using the Kuhlekt Detailed ROI Calculator. Based on your comprehensive inputs, here is your projected return on investment:</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0891b2; margin-top: 0;">Executive Summary</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 10px 0;"><strong>ROI:</strong> ${results.roi?.toFixed(1) || "0"}%</li>
              <li style="margin: 10px 0;"><strong>Payback Period:</strong> ${results.paybackMonths?.toFixed(1) || "0"} months</li>
              <li style="margin: 10px 0;"><strong>Total Annual Benefit:</strong> $${results.totalAnnualBenefit?.toLocaleString() || "0"}</li>
              <li style="margin: 10px 0;"><strong>Working Capital Released:</strong> $${results.workingCapitalReleased?.toLocaleString() || "0"}</li>
            </ul>
          </div>
          
          <div style="background: #ecfeff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0891b2; margin-top: 0;">Detailed Breakdown</h3>
            <h4 style="margin-bottom: 10px;">Annual Savings:</h4>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;">Interest Savings: $${results.interestSavings?.toLocaleString() || "0"}</li>
              <li style="margin: 8px 0;">Labour Cost Savings: $${results.labourCostSavings?.toLocaleString() || "0"}</li>
              <li style="margin: 8px 0;">Bad Debt Reduction: $${results.badDebtReduction?.toLocaleString() || "0"}</li>
            </ul>
            
            <h4 style="margin-top: 20px; margin-bottom: 10px;">DSO Improvement:</h4>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;">Current DSO: ${results.currentDSO?.toFixed(0) || "0"} days</li>
              <li style="margin: 8px 0;">Improved DSO: ${results.newDSO?.toFixed(0) || "0"} days</li>
              <li style="margin: 8px 0;">Reduction: ${results.dsoReductionDays?.toFixed(0) || "0"} days</li>
            </ul>
            
            <h4 style="margin-top: 20px; margin-bottom: 10px;">Capacity Improvement:</h4>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;">Current Capacity: ${results.currentCapacity?.toFixed(0) || "0"} customers per collector</li>
              <li style="margin: 8px 0;">Additional Capacity: +${results.additionalCapacity?.toFixed(0) || "0"} customers</li>
            </ul>
          </div>
          
          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #ea580c; margin-top: 0;">Investment Required</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;">Implementation Cost: $${results.implementationCost?.toLocaleString() || "0"}</li>
              <li style="margin: 8px 0;">Annual Subscription: $${results.annualCost?.toLocaleString() || "0"}</li>
              <li style="margin: 8px 0;"><strong>Total First Year:</strong> $${results.totalFirstYearCost?.toLocaleString() || "0"}</li>
            </ul>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">3-Year Value</h3>
            <p style="font-size: 24px; font-weight: bold; color: #16a34a; margin: 10px 0;">
              $${results.threeYearValue?.toLocaleString() || "0"}
            </p>
            <p style="margin: 0; color: #6b7280;">Cumulative net benefit over 3 years</p>
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Schedule a personalized demo with our team</li>
            <li>Discuss implementation timelines and pricing</li>
            <li>Review case studies from similar organizations</li>
            <li>Get answers to your specific questions</li>
          </ul>
          
          <p>Our team will reach out shortly to schedule a detailed consultation and demonstrate how Kuhlekt can deliver these results for your organization.</p>
          
          <p>Best regards,<br>The Kuhlekt Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>Kuhlekt - Transforming Invoice-to-Cash</p>
            <p>Visit us at kuhlekt.com | Email: enquiries@kuhlekt.com</p>
            ${company ? `<p>This report was generated for ${company}</p>` : ""}
          </div>
        </div>
      `
    }

    console.log("Email content prepared")
    console.log("Text body length:", textBody.length)
    console.log("HTML body length:", emailBody.length)

    const emailSubject = `Your ${calculatorType === "simple" ? "ROI" : "Detailed ROI"} Calculator Results - Kuhlekt`

    console.log("Calling sendEmail function...")
    const result = await sendEmail({
      to: email,
      subject: emailSubject,
      html: emailBody,
      text: textBody,
    })

    console.log("Email function returned:", result)

    if (result.success) {
      console.log("✓ Email sent successfully")
      return NextResponse.json({ success: true, message: "Report sent successfully" })
    } else {
      console.error("✗ Email sending failed:", result.error)
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("=== ROI Calculator Email Route Error ===")
    console.error("Error:", error)
    console.error("Stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
