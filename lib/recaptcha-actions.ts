"use server"

import { verifyCaptcha } from "@/lib/captcha"

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!token) {
      return { success: false, error: "No reCAPTCHA token provided" }
    }

    const isValid = await verifyCaptcha(token)

    if (!isValid) {
      return { success: false, error: "reCAPTCHA verification failed" }
    }

    return { success: true }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, error: "reCAPTCHA verification failed" }
  }
}
