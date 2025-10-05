import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    console.log("=== ROI Calculator Email Route ===")
    console.log("Request received at:", new Date().toISOString())

    const body = await request.json()
    console.log("Request body:", JSON.stringify(body, null, 2))

    const { name, email, company, phone, calculatorType, inputs, results } = body

    console.log("Calculator Type:", calculatorType)
    console.log("Email Address:", email)
    console.log("Results:", JSON.stringify(results, null, 2))

    if (!name || !email || !calculatorType || !inputs || !results) {
      console.error("Missing required fields:", { name, email, calculatorType, inputs, results })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format results based on calculator type
    let emailBody = ""

    if (calculatorType === "simple") {
      console.log("Processing SIMPLE calculator email")
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

    console.log("Attempting to send email via ClickSend...")
    console.log("Email details:", {
      to: email,
      subject: `Your ${calculatorType === "simple" ? "ROI" : "Detailed ROI"} Calculator Results`,
      bodyLength: emailBody.length,
    })

    // Send email using ClickSend
    const result = await sendEmail({
      to: email,
      subject: `Your ${calculatorType === "simple" ? "ROI" : "Detailed ROI"} Calculator Results - Kuhlekt`,
      html: emailBody,
      text: `Your ${calculatorType === "simple" ? "ROI" : "Detailed ROI"} Calculator Results from Kuhlekt. Please view this email in an HTML-compatible email client.`,
    })

    console.log("Email send result:", result)

    if (result.success) {
      console.log("✓ Email sent successfully to:", email)
      return NextResponse.json({ success: true, message: "Report sent successfully" })
    } else {
      console.error("✗ Failed to send email:", result.error)
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("=== ROI Calculator Email Error ===")
    console.error("Error details:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json({ error: "Failed to send report" }, { status: 500 })
  }
}
