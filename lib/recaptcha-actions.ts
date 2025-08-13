"use server"

export async function getRecaptchaSiteKey(): Promise<string> {
  const siteKey = process.env.RECAPTCHA_SITE_KEY
  if (!siteKey) {
    console.warn("RECAPTCHA_SITE_KEY not configured")
    return ""
  }
  return siteKey
}

export async function verifyRecaptcha(token: string): Promise<{
  success: boolean
  score?: number
  action?: string
  error?: string
}> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification in development")
      return {
        success: true,
        score: 0.9,
        action: "submit",
      }
    }

    if (!token) {
      return {
        success: false,
        error: "No reCAPTCHA token provided",
      }
    }

    // Verify the token with Google's reCAPTCHA API
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
      throw new Error(`reCAPTCHA API request failed: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"])
      return {
        success: false,
        error: "reCAPTCHA verification failed",
      }
    }

    // For reCAPTCHA v3, check the score
    if (data.score !== undefined) {
      const score = Number.parseFloat(data.score)
      if (score < 0.5) {
        return {
          success: false,
          error: "Low reCAPTCHA score - possible bot activity",
        }
      }
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return {
      success: false,
      error: "reCAPTCHA verification failed",
    }
  }
}
