import { type NextRequest, NextResponse } from "next/server"

async function sendClickSendEmail(to: string, subject: string, body: string) {
  console.log("=== sendClickSendEmail START ===")
  console.log("To:", to)
  console.log("Subject:", subject)

  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY
  const fromEmail = process.env.CLICKSEND_FROM_EMAIL

  if (!username || !apiKey || !fromEmail) {
    console.error("✗ ClickSend credentials missing")
    throw new Error("ClickSend credentials not configured")
  }

  console.log("✓ ClickSend credentials present")

  const auth = Buffer.from(`${username}:${apiKey}`).toString("base64")

  // Fetch verified email addresses
  console.log("Fetching verified email addresses...")
  const addressesResponse = await fetch("https://rest.clicksend.com/v3/email/addresses", {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  })

  if (!addressesResponse.ok) {
    const errorText = await addressesResponse.text()
    console.error("✗ Failed to fetch email addresses:", errorText)
    throw new Error(`Failed to fetch email addresses: ${addressesResponse.status}`)
  }

  const addressesData = await addressesResponse.json()
  const emailAddress = addressesData.data?.data?.find(
    (addr: any) => addr.email_address === fromEmail && addr.verified === 1,
  )

  if (!emailAddress) {
    console.error("✗ Email address not found or not verified")
    throw new Error(`Email address ${fromEmail} not found or not verified in ClickSend`)
  }

  const emailAddressId = emailAddress.email_address_id
  console.log("✓ Using email_address_id:", emailAddressId)

  const payload = {
    to: [{ email: to, name: to.split("@")[0] }],
    from: {
      email_address_id: emailAddressId,
      name: "Kuhlekt ROI Calculator",
    },
    subject,
    body,
  }

  console.log("Sending email...")

  const response = await fetch("https://rest.clicksend.com/v3/email/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("✗ ClickSend send error:", errorBody)
    throw new Error(`Failed to send email: ${response.status}`)
  }

  const result = await response.json()
  console.log("✓ Email sent successfully")
  return result
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== ROI Calculator Admin Notification START ===")

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("✗ Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { name, email, company, phone, calculatorType, inputs, results } = body

    if (!name || !email || !calculatorType || !results) {
      console.error("✗ Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("✓ All required fields present")
    console.log("Calculator type:", calculatorType)
    console.log("User email:", email)

    // Build email body for admin
    let emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0891b2;">New ROI Calculator Submission</h2>
            
            <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Contact Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
              <p><strong>Calculator Type:</strong> ${calculatorType === "simple" ? "Simple" : "Detailed"}</p>
            </div>
    `

    if (calculatorType === "simple") {
      emailBody += `
            <h3>Simple Calculator Results</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Current DSO</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${results.currentDSO?.toFixed(0)} days</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">New DSO</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${results.newDSO?.toFixed(0)} days</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Cash Released</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Annual Savings</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #0891b2;">$${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
            </table>

            <h3>Input Values</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Average Invoice Value</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">$${inputs.averageInvoiceValue}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Monthly Invoices</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${inputs.monthlyInvoices}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">DSO Improvement</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${inputs.simpleDSOImprovement}%</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Cost of Capital</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${inputs.simpleCostOfCapital}%</td>
              </tr>
            </table>
      `
    } else {
      emailBody += `
            <h3>Detailed Calculator Results</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">ROI</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #0891b2;">${results.roi?.toFixed(1)}%</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Payback Period</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${results.paybackMonths?.toFixed(1)} months</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Total Annual Benefit</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #10b981;">$${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Working Capital Released</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">$${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">DSO Reduction</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${results.dsoReductionDays?.toFixed(0)} days</td>
              </tr>
            </table>

            <h3>Benefit Breakdown</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Interest Savings</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">$${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Labour Cost Savings</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">$${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Bad Debt Reduction</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">$${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              </tr>
            </table>

            <h3>Key Input Values</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Current DSO Days</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${inputs.currentDSODays}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Debtors Balance</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">$${inputs.debtorsBalance}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Number of Debtors</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${inputs.numberOfDebtors}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">Number of Collectors</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${inputs.numberOfCollectors}</td>
              </tr>
            </table>
      `
    }

    emailBody += `
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              Submitted at: ${new Date().toLocaleString()}
            </p>
          </div>
        </body>
      </html>
    `

    await sendClickSendEmail(
      "enquiries@kuhlekt.com",
      `New ROI Calculator Submission - ${name} (${calculatorType})`,
      emailBody,
    )

    console.log("✓ Admin notification sent successfully")
    console.log("=== ROI Calculator Admin Notification SUCCESS ===")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("=== FATAL: ROI Calculator Admin Notification Error ===")
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
