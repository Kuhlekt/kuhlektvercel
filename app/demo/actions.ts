"use server"

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
    console.log("Demo form - Simple test action started")

    // Basic validation only
    const firstName = formData.get("firstName")?.toString()?.trim()
    const email = formData.get("email")?.toString()?.trim()

    if (!firstName || !email) {
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

    console.log("Demo form - Basic validation passed")

    // Return success without email sending for now
    return {
      success: true,
      message: "Demo request received! (Test mode - no email sent)",
      shouldClearForm: true,
      errors: {},
    }
  } catch (error) {
    console.error("Demo form - Error:", error)
    return {
      success: false,
      message: "System error occurred",
      shouldClearForm: false,
      errors: {},
    }
  }
}
