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
