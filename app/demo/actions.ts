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
