"use server"

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      return { success: false, error: "reCAPTCHA not configured" }
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()

    if (data.success) {
      return { success: true }
    } else {
      return { success: false, error: "reCAPTCHA verification failed" }
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, error: "Verification failed" }
  }
}
