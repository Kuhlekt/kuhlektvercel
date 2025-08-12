"use server"

export async function getRecaptchaSiteKey() {
  return {
    siteKey: process.env.RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    isEnabled: !!process.env.RECAPTCHA_SITE_KEY,
  }
}

export async function verifyRecaptcha(token: string) {
  try {
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.warn("RECAPTCHA_SECRET_KEY not configured, skipping verification")
      return { success: true } // Allow in development/testing
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("reCAPTCHA API error:", data)
      return { success: false, error: "reCAPTCHA verification failed" }
    }

    return {
      success: data.success,
      score: data.score,
      action: data.action,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      error: data["error-codes"]?.[0] || null,
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, error: "reCAPTCHA verification failed" }
  }
}
