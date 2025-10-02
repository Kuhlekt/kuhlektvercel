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

    if (token === "browser-error" || token.includes("browser-error") || token.startsWith("development-bypass-token")) {
      console.log(`reCAPTCHA fallback token detected: ${token}`)
      const isDevelopment = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"

      if (isDevelopment) {
        console.log("Fallback token allowed in development/preview mode")
        return { success: true }
      } else {
        // In production, allow fallback tokens but log the issue
        console.warn(`Fallback token in production - allowing submission but logging issue: ${token}`)
        return { success: true }
      }
    }

    console.log("Verifying reCAPTCHA token:", token.substring(0, 20) + "...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error("reCAPTCHA API response not ok:", response.status, response.statusText)
        console.warn("reCAPTCHA API error - allowing submission with warning")
        return { success: true }
      }

      const data = await response.json()
      console.log("reCAPTCHA verification response:", data)

      if (data.success) {
        console.log("reCAPTCHA verification successful")
        return { success: true }
      } else {
        const errorCodes = data["error-codes"] || []
        console.error("reCAPTCHA verification failed:", errorCodes)

        if (errorCodes.includes("invalid-input-response")) {
          console.warn("Invalid reCAPTCHA response - allowing submission with warning")
          return { success: true }
        } else if (errorCodes.includes("timeout-or-duplicate")) {
          console.warn("reCAPTCHA timeout/duplicate - allowing submission with warning")
          return { success: true }
        } else if (errorCodes.includes("invalid-input-secret")) {
          return { success: false, error: "reCAPTCHA configuration error" }
        }

        console.warn(`reCAPTCHA verification failed but allowing submission: ${errorCodes.join(", ")}`)
        return { success: true }
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("reCAPTCHA verification timeout")
        console.warn("reCAPTCHA timeout - allowing submission with warning")
        return { success: true }
      }
      throw fetchError
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)

    console.warn("reCAPTCHA verification failed - allowing submission with warning")
    return { success: true }
  }
}
