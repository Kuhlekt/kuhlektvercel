"use server"

export interface SimpleROIResult {
  currentAnnualRevenue: number
  estimatedDSOReduction: number
  averageDSO: number
  newDSO: number
  cashFlowImprovement: number
  annualSavings: number
}

export interface DetailedROIResult extends SimpleROIResult {
  staffCostSavings: number
  collectionRateImprovement: number
  totalAnnualBenefit: number
  implementationCost: number
  netFirstYearBenefit: number
  paybackPeriod: number
  threeYearROI: number
}

export async function calculateSimpleROI(formData: FormData): Promise<SimpleROIResult> {
  const currentAnnualRevenue = Number.parseFloat(formData.get("currentAnnualRevenue") as string) || 0
  const averageDSO = Number.parseFloat(formData.get("averageDSO") as string) || 0
  const estimatedDSOReduction = Number.parseFloat(formData.get("estimatedDSOReduction") as string) || 0

  const newDSO = averageDSO - estimatedDSOReduction
  const dailyRevenue = currentAnnualRevenue / 365
  const cashFlowImprovement = dailyRevenue * estimatedDSOReduction
  const annualSavings = cashFlowImprovement * 0.05

  return {
    currentAnnualRevenue,
    estimatedDSOReduction,
    averageDSO,
    newDSO,
    cashFlowImprovement,
    annualSavings,
  }
}

export async function calculateDetailedROI(formData: FormData): Promise<DetailedROIResult> {
  const simpleResult = await calculateSimpleROI(formData)

  const arStaffCount = Number.parseFloat(formData.get("arStaffCount") as string) || 0
  const avgStaffCost = Number.parseFloat(formData.get("avgStaffCost") as string) || 0
  const currentCollectionRate = Number.parseFloat(formData.get("currentCollectionRate") as string) || 0

  const staffCostSavings = arStaffCount * avgStaffCost * 0.3
  const collectionRateImprovement =
    (simpleResult.currentAnnualRevenue * (currentCollectionRate + 5)) / 100 -
    (simpleResult.currentAnnualRevenue * currentCollectionRate) / 100
  const totalAnnualBenefit = simpleResult.annualSavings + staffCostSavings + collectionRateImprovement
  const implementationCost = 50000
  const netFirstYearBenefit = totalAnnualBenefit - implementationCost
  const paybackPeriod = implementationCost / (totalAnnualBenefit / 12)
  const threeYearROI = ((totalAnnualBenefit * 3 - implementationCost) / implementationCost) * 100

  return {
    ...simpleResult,
    staffCostSavings,
    collectionRateImprovement,
    totalAnnualBenefit,
    implementationCost,
    netFirstYearBenefit,
    paybackPeriod,
    threeYearROI,
  }
}

export async function generateVerificationCode(
  email: string,
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/verification-code/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate verification code")
    }

    const data = await response.json()
    return { success: true, code: data.code }
  } catch (error) {
    console.error("Error generating verification code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate verification code",
    }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/verification-code/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Invalid verification code")
    }

    return { success: true }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify code",
    }
  }
}

export async function sendROIEmail(
  email: string,
  results: SimpleROIResult | DetailedROIResult,
  isDetailed: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/roi-calculator/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, results, isDetailed }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to send ROI email")
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending ROI email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
