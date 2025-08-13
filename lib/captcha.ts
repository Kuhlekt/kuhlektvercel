export async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    // Skip verification for development/fallback tokens
    const fallbackTokens = [
      "development-mode-token",
      "recaptcha-error-fallback-token",
      "recaptcha-disabled-fallback-token",
      "recaptcha-load-error-fallback-token",
    ]

    if (fallbackTokens.includes(token)) {
      console.log("Using fallback token, skipping reCAPTCHA verification")
      return true
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.warn("RECAPTCHA_SECRET_KEY not found, skipping verification")
      return true
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
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
