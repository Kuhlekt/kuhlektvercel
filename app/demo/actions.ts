"use server"

import { verifyRecaptcha } from "@/lib/recaptcha-actions"

export interface DemoFormState {
  success: boolean
  message: string
  shouldClearForm?: boolean
  errors: {
    firstName?: string
    lastName?: string
    email?: string
    company?: string
    phone?: string
    jobTitle?: string
    companySize?: string
    currentSolution?: string
    timeline?: string
    challenges?: string
    affiliateCode?: string
    recaptcha?: string
  }
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  try {
    console.log("Demo form - Server action started")

    // Ensure formData is valid
    if (!formData || typeof formData.get !== "function") {
      console.error("Demo form - Invalid FormData received")
      return {
        success: false,
        message: "Invalid form data received",
        shouldClearForm: false,
        errors: {},
      }
    }

    let recaptchaToken = null
    const possibleFields = [
      "recaptcha-token",
      "g-recaptcha-response",
      "recaptchaToken",
      "recaptcha_token",
      "recaptcha",
      "captcha",
      "token",
    ]

    for (const field of possibleFields) {
      const value = formData.get(field)?.toString()?.trim()
      if (value && value.length > 10) {
        recaptchaToken = value
        console.log(`Demo form: Found reCAPTCHA token in field '${field}'`)
        break
      }
    }

    console.log("Demo form - reCAPTCHA token received:", !!recaptchaToken)

    if (recaptchaToken) {
      console.log("Demo form: Verifying reCAPTCHA token...")
      const recaptchaResult = await verifyRecaptcha(recaptchaToken)
      console.log("Demo form: reCAPTCHA result:", recaptchaResult)

      if (!recaptchaResult.success) {
        console.error("Demo form: reCAPTCHA verification failed:", recaptchaResult.error)
        return {
          success: false,
          message: `reCAPTCHA verification failed: ${recaptchaResult.error}`,
          shouldClearForm: false,
          errors: { recaptcha: "Verification failed. Please try again." },
        }
      }
    } else {
      console.warn("Demo form: No reCAPTCHA token found - proceeding for debugging")
    }

    // Basic validation with null checks
    const firstName = formData.get("firstName")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""

    console.log("Demo form - Processing:", { firstName: firstName.length > 0, email: email.length > 0 })

    if (!firstName || !email) {
      console.log("Demo form - Validation failed")
      return {
        success: false,
        message: "Please fill in required fields",
        shouldClearForm: false,
        errors: {
          firstName: !firstName ? "First name is required" : undefined,
          email: !email ? "Email is required" : undefined,
        },
      }
    }

    console.log("Demo form - Validation passed, returning success")

    return {
      success: true,
      message: "Demo request received successfully!",
      shouldClearForm: true,
      errors: {},
    }
  } catch (error) {
    console.error("Demo form - Server action error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
      shouldClearForm: false,
      errors: {},
    }
  }
}
