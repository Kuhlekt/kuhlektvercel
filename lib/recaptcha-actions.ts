"use server"

export async function getRecaptchaSiteKey() {
  return process.env.RECAPTCHA_SITE_KEY || ""
}

export async function verifyRecaptcha(token: string) {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY is not configured")
      return {
        success: false,
        error: "reCAPTCHA is not properly configured",
      }
    }

    if (!token) {
      return {
        success: false,
        error: "No reCAPTCHA token provided",
      }
    }

    // For development/testing, allow bypass if secret key is 'test'
    if (secretKey === "test") {
      console.log("Using test reCAPTCHA - bypassing verification")
      return {
        success: true,
        score: 0.9,
        action: "submit",
      }
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        score: data.score || 1.0,
        action: data.action || "submit",
      }
    } else {
      console.error("reCAPTCHA verification failed:", data["error-codes"])
      return {
        success: false,
        error: "reCAPTCHA verification failed",
        errorCodes: data["error-codes"],
      }
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error)
    return {
      success: false,
      error: "Failed to verify reCAPTCHA",
    }
  }
}
