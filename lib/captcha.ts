export async function verifyCaptcha(token: string): Promise<boolean> {
  // Skip verification for development/fallback tokens
  const fallbackTokens = [
    "development-mode-token",
    "recaptcha-error-fallback-token",
    "recaptcha-disabled-fallback-token",
    "recaptcha-config-error-fallback-token",
  ]

  if (fallbackTokens.includes(token)) {
    console.log("Using fallback token, skipping reCAPTCHA verification")
    return true
  }

  // Only verify actual reCAPTCHA tokens
  if (!token || token.length < 20) {
    console.log("Invalid token format, verification failed")
    return false
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.log("reCAPTCHA secret key not configured, allowing submission")
      return true
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
      console.log("reCAPTCHA verification failed:", data["error-codes"])
      return false
    }

    return true
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    // In case of API errors, allow submission to prevent blocking users
    return true
  }
}
