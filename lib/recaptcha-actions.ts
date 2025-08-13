export async function getRecaptchaSiteKey(): Promise<string> {
  return process.env.RECAPTCHA_SITE_KEY || "development-key"
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
      console.warn("RECAPTCHA_SECRET_KEY not found, skipping verification in development")
      return { success: true, score: 0.9, action: "submit" }
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

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return {
      success: data.success,
      score: data.score,
      action: data.action,
      error: data["error-codes"]?.join(", "),
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return {
      success: false,
      error: "Verification failed",
    }
  }
}
