"use server"

import { sendEmail } from "@/lib/aws-ses"

interface SimpleROIInputs {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}

interface DetailedROIInputs {
  implementationCost: string
  monthlyCost: string
  currentDSODays: string
  debtorsBalance: string
  interestType: "loan" | "deposit"
  interestRate: string
  perAnnumDirectLabourCosts: string
  currentBadDebts: string
  averageBadDebt: string
  dsoImprovement: string
  labourSavings: string
  numberOfDebtors: string
  numberOfCollectors: string
  projectedCustomerGrowth: string
  averagePaymentTerms: "net30" | "net60" | "net90"
}

interface SimpleROIResults {
  currentCashTied: number
  newDSO: number
  cashReleased: number
  annualSavings: number
  dsoImprovementPercent: number
}

interface DetailedROIResults {
  currentDSO: number
  newDSO: number
  dsoReductionDays: number
  workingCapitalReleased: number
  labourCostSavings: number
  badDebtReduction: number
  interestSavings: number
  totalAnnualBenefit: number
  totalImplementationAndAnnualCost: number
  roi: number
  paybackMonths: number
}

// In-memory storage for verification codes
const verificationCodes = new Map<string, { code: string; timestamp: number; attempts: number }>()

// Clean up old codes (older than 15 minutes)
function cleanupOldCodes() {
  const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000
  for (const [email, data] of verificationCodes.entries()) {
    if (data.timestamp < fifteenMinutesAgo) {
      verificationCodes.delete(email)
    }
  }
}

export async function generateVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    cleanupOldCodes()

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store the code with timestamp
    verificationCodes.set(email.toLowerCase(), {
      code,
      timestamp: Date.now(),
      attempts: 0,
    })

    console.log(`Generated verification code for ${email}: ${code}`)

    // Send the code via email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #1f2937;
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .content { 
              padding: 40px 30px;
            }
            .code-box { 
              background: #f0f9ff;
              border: 3px dashed #0891b2; 
              padding: 30px; 
              text-align: center; 
              margin: 30px 0; 
              border-radius: 12px;
            }
            .code { 
              font-size: 42px; 
              font-weight: bold; 
              color: #0891b2; 
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .code-label {
              color: #64748b;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 15px;
            }
            .warning { 
              background: #fef3c7; 
              border-left: 4px solid #f59e0b; 
              padding: 20px; 
              margin: 25px 0; 
              border-radius: 6px;
            }
            .warning strong {
              color: #92400e;
              display: block;
              margin-bottom: 10px;
            }
            .warning ul {
              margin: 10px 0 0 0;
              padding-left: 20px;
              color: #78350f;
            }
            .warning li {
              margin: 8px 0;
            }
            .footer {
              background: #f9fafb;
              padding: 25px 30px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
            }
            .footer a {
              color: #0891b2;
              text-decoration: none;
            }
            .instructions {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .instructions h3 {
              color: #0891b2;
              margin-top: 0;
              font-size: 16px;
            }
            .instructions ol {
              margin: 10px 0;
              padding-left: 20px;
              color: #4b5563;
            }
            .instructions li {
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Verification Code</h1>
              <p>Kuhlekt ROI Calculator</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
                Thank you for using the Kuhlekt ROI Calculator! To view your personalized results, please use the verification code below:
              </p>
              
              <div class="code-box">
                <div class="code-label">Your Verification Code</div>
                <div class="code">${code}</div>
              </div>

              <div class="instructions">
                <h3>How to use this code:</h3>
                <ol>
                  <li>Return to the ROI Calculator window</li>
                  <li>Enter this 6-digit code in the verification field</li>
                  <li>Click "Verify" to view your results</li>
                </ol>
              </div>

              <div class="warning">
                <strong>⚠️ Security Information</strong>
                <ul>
                  <li>This code expires in 15 minutes</li>
                  <li>You have 5 attempts to enter the correct code</li>
                  <li>Never share this code with anyone</li>
                  <li>If you didn't request this code, please ignore this email</li>
                </ul>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                If you're having trouble accessing your results, please contact us at 
                <a href="mailto:enquiries@kuhlekt.com" style="color: #0891b2; text-decoration: none;">enquiries@kuhlekt.com</a>
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong>Kuhlekt</strong> - Transforming Invoice-to-Cash</p>
              <p style="margin: 0;">Visit us at <a href="https://kuhlekt.com">kuhlekt.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
Kuhlekt ROI Calculator - Verification Code

Your verification code is: ${code}

This code will expire in 15 minutes.

How to use:
1. Return to the ROI Calculator window
2. Enter this 6-digit code in the verification field
3. Click "Verify" to view your results

Security Information:
- This code expires in 15 minutes
- You have 5 attempts to enter the correct code
- Never share this code with anyone
- If you didn't request this code, please ignore this email

Need help? Contact us at enquiries@kuhlekt.com

Kuhlekt - Transforming Invoice-to-Cash
Visit us at kuhlekt.com
    `.trim()

    const result = await sendEmail({
      to: email,
      subject: "Your Kuhlekt ROI Calculator Verification Code",
      html: emailHtml,
      text: emailText,
    })

    console.log("Verification email send result:", result)

    if (!result.success) {
      console.error("Failed to send verification email:", result.message)
      return {
        success: false,
        error: "Failed to send verification code. Please try again or contact support.",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in generateVerificationCode:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    cleanupOldCodes()

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedCode = code.trim()

    const storedData = verificationCodes.get(normalizedEmail)

    if (!storedData) {
      return {
        success: false,
        error: "Verification code not found or expired. Please request a new code.",
      }
    }

    // Check if code has expired (15 minutes)
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000
    if (storedData.timestamp < fifteenMinutesAgo) {
      verificationCodes.delete(normalizedEmail)
      return {
        success: false,
        error: "Verification code has expired. Please request a new code.",
      }
    }

    // Check attempts (max 5 attempts)
    if (storedData.attempts >= 5) {
      verificationCodes.delete(normalizedEmail)
      return {
        success: false,
        error: "Too many failed attempts. Please request a new code.",
      }
    }

    // Verify the code
    if (storedData.code !== normalizedCode) {
      storedData.attempts++
      const remainingAttempts = 5 - storedData.attempts
      return {
        success: false,
        error: `Invalid verification code. ${remainingAttempts} ${remainingAttempts === 1 ? "attempt" : "attempts"} remaining.`,
      }
    }

    // Code is valid - remove it so it can't be reused
    verificationCodes.delete(normalizedEmail)

    return { success: true }
  } catch (error) {
    console.error("Error in verifyCode:", error)
    return {
      success: false,
      error: "Failed to verify code. Please try again.",
    }
  }
}

export async function calculateSimpleROI(inputs: SimpleROIInputs): Promise<SimpleROIResults> {
  const currentDSO = Number.parseFloat(inputs.currentDSO)
  const avgInvoiceValue = Number.parseFloat(inputs.averageInvoiceValue)
  const monthlyInvoices = Number.parseFloat(inputs.monthlyInvoices)
  const dsoImprovementPercent = Number.parseFloat(inputs.simpleDSOImprovement) / 100
  const costOfCapitalPercent = Number.parseFloat(inputs.simpleCostOfCapital) / 100

  const currentCashTied = (currentDSO / 30) * avgInvoiceValue * monthlyInvoices
  const newDSO = currentDSO * (1 - dsoImprovementPercent)
  const newCashTied = (newDSO / 30) * avgInvoiceValue * monthlyInvoices
  const cashReleased = currentCashTied - newCashTied
  const annualSavings = cashReleased * costOfCapitalPercent

  return {
    currentCashTied,
    newDSO,
    cashReleased,
    annualSavings,
    dsoImprovementPercent: Number.parseFloat(inputs.simpleDSOImprovement),
  }
}

export async function calculateDetailedROI(inputs: DetailedROIInputs): Promise<DetailedROIResults> {
  const implementationCost = Number.parseFloat(inputs.implementationCost)
  const monthlyCost = Number.parseFloat(inputs.monthlyCost)
  const annualCost = monthlyCost * 12
  const perAnnumDirectLabourCosts = Number.parseFloat(inputs.perAnnumDirectLabourCosts)
  const interestRate = Number.parseFloat(inputs.interestRate) / 100
  const averageBadDebtPercent = Number.parseFloat(inputs.averageBadDebt) / 100
  const currentBadDebts = Number.parseFloat(inputs.currentBadDebts)
  const labourSavingsPercent = Number.parseFloat(inputs.labourSavings) / 100
  const dsoImprovementPercent = Number.parseFloat(inputs.dsoImprovement) / 100
  const daysSales = 365
  const currentDSO = Number.parseFloat(inputs.currentDSODays)
  const debtorsBalance = Number.parseFloat(inputs.debtorsBalance)

  const annualRevenue = (debtorsBalance / currentDSO) * daysSales
  const dsoReductionDays = currentDSO * dsoImprovementPercent
  const newDSO = currentDSO - dsoReductionDays
  const dailyRevenue = annualRevenue / daysSales
  const workingCapitalReleased = dailyRevenue * dsoReductionDays
  const interestSavings = workingCapitalReleased * interestRate
  const labourCostSavings = perAnnumDirectLabourCosts * labourSavingsPercent
  const badDebtReduction = currentBadDebts * 0.4
  const totalAnnualBenefit = interestSavings + labourCostSavings + badDebtReduction
  const totalImplementationAndAnnualCost = implementationCost + annualCost
  const netBenefit = totalAnnualBenefit - annualCost
  const roi = totalImplementationAndAnnualCost > 0 ? (netBenefit / totalImplementationAndAnnualCost) * 100 : 0
  const paybackMonths = totalAnnualBenefit > 0 ? (totalImplementationAndAnnualCost / totalAnnualBenefit) * 12 : 0

  return {
    currentDSO,
    newDSO,
    dsoReductionDays,
    workingCapitalReleased,
    labourCostSavings,
    badDebtReduction,
    interestSavings,
    totalAnnualBenefit,
    totalImplementationAndAnnualCost,
    roi,
    paybackMonths,
  }
}

export async function sendROIEmail(data: {
  name: string
  email: string
  company: string
  calculatorType: "simple" | "detailed"
  results: any
  inputs: any
}): Promise<{ success: boolean; error?: string }> {
  try {
    const emailSubject = `Your ROI Analysis Results - ${data.company}`

    let emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #1f2937;
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
            }
            .container { 
              max-width: 700px; 
              margin: 40px auto; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.95;
              font-size: 18px;
            }
            .content { 
              padding: 40px 30px;
            }
            .section { 
              background: #f9fafb; 
              padding: 25px; 
              margin-bottom: 20px; 
              border-radius: 8px; 
              border-left: 4px solid #0891b2;
            }
            .section-title { 
              color: #0891b2; 
              font-size: 20px; 
              font-weight: 600; 
              margin-bottom: 20px;
            }
            .metric { 
              display: flex; 
              justify-content: space-between; 
              padding: 12px 0; 
              border-bottom: 1px solid #e5e7eb;
            }
            .metric:last-child { 
              border-bottom: none; 
            }
            .label { 
              font-weight: 500; 
              color: #4b5563;
            }
            .value { 
              color: #0891b2; 
              font-weight: 600;
              text-align: right;
            }
            .highlight { 
              background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); 
              padding: 30px; 
              border-radius: 12px; 
              margin: 30px 0; 
              text-align: center;
              border: 2px solid #0891b2;
            }
            .highlight-label {
              color: #0e7490;
              font-size: 16px;
              font-weight: 500;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .highlight-value { 
              font-size: 48px; 
              font-weight: bold; 
              color: #0891b2;
              margin: 10px 0;
            }
            .highlight-subtext {
              color: #0e7490;
              font-size: 16px;
              margin-top: 10px;
            }
            .cta-section {
              background: #f0f9ff;
              padding: 30px;
              border-radius: 8px;
              margin: 30px 0;
              text-align: center;
            }
            .cta-button {
              display: inline-block;
              background: #0891b2;
              color: white;
              padding: 15px 40px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              margin: 10px;
              transition: background 0.3s;
            }
            .cta-button:hover {
              background: #0e7490;
            }
            .footer {
              background: #f9fafb;
              padding: 25px 30px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
            }
            .footer a {
              color: #0891b2;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Your ROI Analysis</h1>
              <p>${data.calculatorType === "simple" ? "Simple ROI Calculator" : "Detailed ROI Calculator"}</p>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">📋 Analysis Details</div>
                <div class="metric">
                  <span class="label">Name</span>
                  <span class="value">${data.name}</span>
                </div>
                <div class="metric">
                  <span class="label">Company</span>
                  <span class="value">${data.company}</span>
                </div>
                <div class="metric">
                  <span class="label">Email</span>
                  <span class="value">${data.email}</span>
                </div>
                <div class="metric">
                  <span class="label">Date</span>
                  <span class="value">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>
    `

    if (data.calculatorType === "simple") {
      emailHtml += `
              <div class="highlight">
                <div class="highlight-label">💰 Annual Savings Potential</div>
                <div class="highlight-value">$${data.results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div class="highlight-subtext">Estimated first-year benefit</div>
              </div>

              <div class="section">
                <div class="section-title">📊 Key Results</div>
                <div class="metric">
                  <span class="label">Current Cash Tied Up</span>
                  <span class="value">$${data.results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Cash Released</span>
                  <span class="value">$${data.results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Current DSO</span>
                  <span class="value">${Number.parseFloat(data.inputs.currentDSO).toFixed(0)} days</span>
                </div>
                <div class="metric">
                  <span class="label">Improved DSO</span>
                  <span class="value">${data.results.newDSO?.toFixed(0)} days</span>
                </div>
                <div class="metric">
                  <span class="label">DSO Improvement</span>
                  <span class="value">${data.results.dsoImprovementPercent}%</span>
                </div>
              </div>
      `
    } else {
      emailHtml += `
              <div class="highlight">
                <div class="highlight-label">💰 Total Annual Benefit</div>
                <div class="highlight-value">$${data.results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div class="highlight-subtext">
                  ROI: <strong>${data.results.roi?.toFixed(0)}%</strong> | 
                  Payback: <strong>${data.results.paybackMonths?.toFixed(1)} months</strong>
                </div>
              </div>

              <div class="section">
                <div class="section-title">💵 Financial Benefits Breakdown</div>
                <div class="metric">
                  <span class="label">Working Capital Released</span>
                  <span class="value">$${data.results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Interest Savings</span>
                  <span class="value">$${data.results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Labour Cost Savings</span>
                  <span class="value">$${data.results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div class="metric">
                  <span class="label">Bad Debt Reduction</span>
                  <span class="value">$${data.results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">📈 DSO Improvement</div>
                <div class="metric">
                  <span class="label">Current DSO</span>
                  <span class="value">${data.results.currentDSO} days</span>
                </div>
                <div class="metric">
                  <span class="label">Projected DSO</span>
                  <span class="value">${data.results.newDSO?.toFixed(0)} days</span>
                </div>
                <div class="metric">
                  <span class="label">Days Reduced</span>
                  <span class="value">${data.results.dsoReductionDays?.toFixed(0)} days</span>
                </div>
              </div>
      `
    }

    emailHtml += `
              <div class="cta-section">
                <h3 style="color: #0891b2; margin-top: 0;">Ready to Transform Your AR Process?</h3>
                <p style="color: #4b5563; margin: 15px 0;">See how Kuhlekt can help you achieve these results</p>
                <a href="https://kuhlekt.com/demo" class="cta-button">Schedule a Demo</a>
                <a href="mailto:enquiries@kuhlekt.com" class="cta-button" style="background: #0e7490;">Contact Us</a>
              </div>

              <div class="section">
                <div class="section-title">🎯 Next Steps</div>
                <ol style="margin: 10px 0; padding-left: 20px; color: #4b5563;">
                  <li style="margin: 10px 0;">Review your personalized ROI analysis above</li>
                  <li style="margin: 10px 0;">Schedule a personalized demo to see Kuhlekt in action</li>
                  <li style="margin: 10px 0;">Discuss implementation timeline and pricing options</li>
                  <li style="margin: 10px 0;">Review case studies from companies in your industry</li>
                </ol>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0 0 10px 0;"><strong style="color: #0891b2;">Kuhlekt</strong> - Transforming Invoice-to-Cash</p>
              <p style="margin: 5px 0;">Email: <a href="mailto:enquiries@kuhlekt.com">enquiries@kuhlekt.com</a></p>
              <p style="margin: 5px 0;">Website: <a href="https://kuhlekt.com">kuhlekt.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send to user
    const userResult = await sendEmail({
      to: data.email,
      subject: emailSubject,
      html: emailHtml,
      text: `Your ROI Calculator Results from Kuhlekt - ${data.company}`,
    })

    if (!userResult.success) {
      console.error("Failed to send ROI email to user:", userResult.message)
      return {
        success: false,
        error: userResult.message || "Failed to send email",
      }
    }

    // Send notification to Kuhlekt team
    const notificationSubject = `🎯 New ROI Calculator Lead: ${data.company}`
    const notificationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="alert">
            <h2 style="margin-top: 0;">🎯 New ROI Calculator Submission</h2>
            <p><strong>Contact:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Company:</strong> ${data.company}</p>
            <p><strong>Calculator Type:</strong> ${data.calculatorType}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <hr>
          ${emailHtml}
        </body>
      </html>
    `

    await sendEmail({
      to: "enquiries@kuhlekt.com",
      subject: notificationSubject,
      html: notificationHtml,
      text: `New ROI Calculator submission from ${data.name} at ${data.company}`,
    })

    return { success: true }
  } catch (error) {
    console.error("Error in sendROIEmail:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
