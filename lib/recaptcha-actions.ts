"use server"

import { verifyCaptcha } from "@/lib/captcha"

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!token) {
      return { success: false, error: "No reCAPTCHA token provided" }
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY not configured")
      return { success: false, error: "reCAPTCHA not configured" }
    }

    const verificationResult = await verifyCaptcha(token)

    if (!verificationResult.success) {
      return { success: false, error: verificationResult.error || "reCAPTCHA verification failed" }
    }

    return { success: true }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, error: "Verification failed" }
  }
}
