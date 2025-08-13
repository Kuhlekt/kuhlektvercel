"use server"

interface RecaptchaResponse {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  "error-codes"?: string[]
}

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification in development")
    return { success: true, score: 0.9 }
  }

  if (!token) {
    return { success: false, error: "No reCAPTCHA token provided" }
  }

  try {
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

    const data: RecaptchaResponse = await response.json()

    if (data.success) {
      // For reCAPTCHA v3, check the score (0.0 to 1.0, higher is better)
      const score = data.score || 0
      const threshold = 0.5 // Adjust this threshold as needed

      if (score >= threshold) {
        return { success: true, score }
      } else {
        return { success: false, error: `Low reCAPTCHA score: ${score}`, score }
      }
    } else {
      const errorCodes = data["error-codes"] || []
      return { success: false, error: `reCAPTCHA verification failed: ${errorCodes.join(", ")}` }
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, error: "reCAPTCHA verification failed due to network error" }
  }
}

export async function getRecaptchaSiteKey(): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || process.env.RECAPTCHA_SITE_KEY

  if (!siteKey) {
    console.warn("RECAPTCHA_SITE_KEY not configured")
    return ""
  }

  return siteKey
}
