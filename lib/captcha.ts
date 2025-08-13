"use server"

// Server-side CAPTCHA verification
export async function verifyCaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  // Access secret key directly here instead of importing from config
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.log("reCAPTCHA not configured - skipping verification")
    return { success: true } // Allow form submission if CAPTCHA not configured
  }

  if (!token) {
    return { success: false, error: "CAPTCHA verification required" }
  }

  // Skip verification for fallback tokens
  const fallbackTokens = [
    "development-mode-token",
    "recaptcha-error-fallback-token",
    "recaptcha-expired-fallback-token",
    "recaptcha-render-error-token",
    "recaptcha-script-error-token",
    "recaptcha-disabled-token",
  ]

  if (fallbackTokens.includes(token)) {
    console.log("Using fallback token - skipping reCAPTCHA verification")
    return { success: true }
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()

    if (data.success) {
      console.log("reCAPTCHA verification successful")
      return { success: true }
    } else {
      console.error("reCAPTCHA verification failed:", data["error-codes"])
      return { success: false, error: "CAPTCHA verification failed" }
    }
  } catch (error) {
    console.error("CAPTCHA verification error:", error)
    return { success: false, error: "CAPTCHA verification error" }
  }
}
