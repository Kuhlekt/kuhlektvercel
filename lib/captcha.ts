export async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    // Skip verification for development/fallback tokens
    const fallbackTokens = [
      "development-mode-token",
      "recaptcha-error-fallback-token",
      "recaptcha-not-loaded-token",
      "recaptcha-timeout-token",
    ]

    if (fallbackTokens.includes(token)) {
      console.log("Using fallback token, skipping reCAPTCHA verification")
      return true
    }

    // Only verify actual reCAPTCHA tokens
    if (!token || token.length < 10) {
      console.error("Invalid reCAPTCHA token")
      return false
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY not configured")
      return true // Allow in development if not configured
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"])
      return false
    }

    return true
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error)
    return false
  }
}
