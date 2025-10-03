/**
 * ROI Calculator Verification Module
 * Provides functions to send and verify email verification codes
 */

export async function sendVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/send-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to send verification code" }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending verification code:", error)
    return { success: false, error: "Network error occurred" }
  }
}

export async function verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || "Invalid verification code" }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error verifying code:", error)
    return { success: false, error: "Network error occurred" }
  }
}
