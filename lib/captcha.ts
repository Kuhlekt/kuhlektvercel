"use server"

export async function verifyCaptcha(token: string): Promise<{ success: boolean; error?: string }> {
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
    return { success: false, error: "CAPTCHA verification required" }
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
