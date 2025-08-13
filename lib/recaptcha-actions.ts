"use server"

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error("reCAPTCHA secret key not found in environment variables")
      return { success: false, error: "reCAPTCHA not configured" }
    }

    if (!token || token.trim() === "") {
      console.error("reCAPTCHA token is empty or invalid")
      return { success: false, error: "Invalid reCAPTCHA token" }
    }

    console.log("Verifying reCAPTCHA token:", token.substring(0, 20) + "...")

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    if (!response.ok) {
      console.error("reCAPTCHA API response not ok:", response.status, response.statusText)
      return { success: false, error: "reCAPTCHA API error" }
    }

    const data = await response.json()
    console.log("reCAPTCHA verification response:", data)

    if (data.success) {
      console.log("reCAPTCHA verification successful")
      return { success: true }
    } else {
      console.error("reCAPTCHA verification failed:", data["error-codes"])
      return {
        success: false,
        error: `reCAPTCHA verification failed: ${data["error-codes"]?.join(", ") || "Unknown error"}`,
      }
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, error: "Verification failed due to network error" }
  }
}
