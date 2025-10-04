"use server"

export async function submitROICalculator(data: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/roi-calculator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error submitting ROI calculator:", error)
    return { success: false, error: "Failed to submit form" }
  }
}
