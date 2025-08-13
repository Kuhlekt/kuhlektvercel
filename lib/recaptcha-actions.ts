"use server"

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.log("reCAPTCHA not configured - allowing submission")
      return { success: true }
    }

    // Handle bypass tokens
    if (token.startsWith("recaptcha-")) {
      console.log("reCAPTCHA bypass token received:", token)
      return { success: true }
    }

    if (!token) {
      return { success: false, error: "reCAPTCHA verification required" }
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
